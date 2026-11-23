-- Ilano — Licences achetées (maintenance annuelle) + mode lecture seule, pour tous les logiciels.
-- Additif : aucun comportement existant ne change pour les abonnements.

alter table licences add column if not exists type text not null default 'abonnement';
alter table licences add column if not exists maintenance_fin date;
alter table licences add column if not exists date_achat date;
alter table licences drop constraint if exists licences_type_check;
alter table licences add constraint licences_type_check check (type in ('abonnement','achat'));
alter table licences drop constraint licences_statut_check;
alter table licences add constraint licences_statut_check check (statut in ('essai','actif','suspendu','resilie','lecture_seule'));
alter table tarifs drop constraint tarifs_formule_check;
alter table tarifs add constraint tarifs_formule_check check (formule in ('starter','business','premium','standard','serenite','maintenance'));

-- Accès en LECTURE (inclut les licences achetées dont la maintenance a expiré)
create or replace function public.a_acces(p_espace uuid, p_logiciel text)
 returns boolean language sql stable security definer set search_path to 'public' as $$
  select exists(select 1 from licences l where l.espace_id=p_espace and l.logiciel=p_logiciel
    and ((l.statut in ('essai','actif') and (l.date_fin is null or l.date_fin >= current_date)) or l.statut='lecture_seule')) $$;
revoke all on function public.a_acces(uuid,text) from public, anon;
grant execute on function public.a_acces(uuid,text) to authenticated, service_role;

-- StockPro : la lecture reste possible en lecture seule (l'écriture reste protégée par a_logiciel)
alter policy sp_categories_lecture on sp_categories using (est_membre(espace_id) and a_acces(espace_id,'stockpro'));
alter policy sp_articles_lecture on sp_articles using (est_membre(espace_id) and a_acces(espace_id,'stockpro'));
alter policy sp_clients_lecture on sp_clients using (est_membre(espace_id) and a_acces(espace_id,'stockpro'));
alter policy sp_fournisseurs_lecture on sp_fournisseurs using (est_membre(espace_id) and a_acces(espace_id,'stockpro'));
alter policy sp_ventes_lecture on sp_ventes using (est_membre(espace_id) and a_acces(espace_id,'stockpro'));
alter policy sp_vente_lignes_lecture on sp_vente_lignes using (est_membre(espace_id) and a_acces(espace_id,'stockpro'));
alter policy sp_mouvements_lecture on sp_mouvements using (est_membre(espace_id) and a_acces(espace_id,'stockpro'));

create or replace function public.sp_resume(p_espace uuid)
 returns jsonb language sql stable security definer set search_path to 'public' as $function$
  select case when not (est_membre(p_espace) and a_acces(p_espace,'stockpro')) then null else jsonb_build_object(
    'ventes_jour', (select coalesce(sum(total),0) from sp_ventes where espace_id=p_espace and statut<>'annulee' and created_at>=date_trunc('day',now())),
    'nb_ventes_jour', (select count(*) from sp_ventes where espace_id=p_espace and statut<>'annulee' and created_at>=date_trunc('day',now())),
    'ventes_mois', (select coalesce(sum(total),0) from sp_ventes where espace_id=p_espace and statut<>'annulee' and created_at>=date_trunc('month',now())),
    'marge_mois', (select coalesce(sum(l.quantite*(l.prix_unitaire-l.prix_achat)),0) from sp_vente_lignes l join sp_ventes v on v.id=l.vente_id
                   where v.espace_id=p_espace and v.statut<>'annulee' and v.created_at>=date_trunc('month',now())),
    'valeur_stock', (select coalesce(sum(quantite*prix_achat),0) from sp_articles where espace_id=p_espace and actif),
    'nb_articles', (select count(*) from sp_articles where espace_id=p_espace and actif),
    'alertes', (select coalesce(jsonb_agg(jsonb_build_object('id',id,'nom',nom,'quantite',quantite,'seuil',seuil_alerte)),'[]'::jsonb)
                from sp_articles where espace_id=p_espace and actif and quantite<=seuil_alerte),
    'top', (select coalesce(jsonb_agg(t),'[]'::jsonb) from (select l.libelle, sum(l.quantite) qte, sum(l.quantite*l.prix_unitaire) ca
              from sp_vente_lignes l join sp_ventes v on v.id=l.vente_id where v.espace_id=p_espace and v.statut<>'annulee'
              and v.created_at>=date_trunc('month',now()) group by l.libelle order by ca desc limit 5) t),
    'credits', (select coalesce(sum(total),0) from sp_ventes where espace_id=p_espace and statut='credit')
  ) end
$function$;

-- Espaces de l'utilisateur : logiciels accessibles (y compris lecture seule) + détail des licences
create or replace function public.mes_espaces()
 returns jsonb language sql stable security definer set search_path to 'public' as $function$
  select coalesce(jsonb_agg(jsonb_build_object(
    'espace', to_jsonb(e), 'membre', to_jsonb(m),
    'logiciels', (select coalesce(jsonb_agg(l.logiciel order by l.logiciel),'[]'::jsonb) from licences l
                  where l.espace_id=e.id and ((l.statut in ('essai','actif') and (l.date_fin is null or l.date_fin>=current_date)) or l.statut='lecture_seule')),
    'lecture_seule', (select coalesce(jsonb_agg(l.logiciel),'[]'::jsonb) from licences l where l.espace_id=e.id and l.statut='lecture_seule'),
    'licences', (select coalesce(jsonb_agg(jsonb_build_object('logiciel',l.logiciel,'type',l.type,'formule',l.formule,'statut',l.statut,
                  'date_fin',l.date_fin,'maintenance_fin',l.maintenance_fin,'employes_max',l.employes_max)),'[]'::jsonb) from licences l where l.espace_id=e.id)
  )),'[]'::jsonb)
  from membres m join espaces e on e.id=m.espace_id
  where m.user_id=auth.uid() and m.actif
$function$;

-- Expiration automatique (tâche quotidienne existante)
create or replace function public.expirer_abonnements()
 returns void language sql security definer set search_path to 'public' as $$
  update licences set statut='suspendu' where statut in ('essai','actif') and date_fin is not null and date_fin < current_date;
  update licences set statut='lecture_seule' where type='achat' and statut='actif' and maintenance_fin is not null and maintenance_fin < current_date;
  update espaces e set statut='suspendu' where statut in ('essai','actif')
    and not exists(select 1 from licences l where l.espace_id=e.id and l.statut in ('essai','actif','lecture_seule'));
$$;

-- Activation (Chariow / admin) : gère aussi le renouvellement de la maintenance d'une licence achetée
create or replace function public.activer_licence(p_espace uuid, p_logiciel text, p_mois integer, p_formule text, p_montant numeric, p_devise text, p_moyen text, p_reference text, p_employes_max integer default null)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare v_fin date;
begin
  if p_reference is not null and exists(select 1 from paiements where moyen=p_moyen and reference=p_reference) then
    return jsonb_build_object('deja_traite',true);
  end if;
  if p_formule='maintenance' then
    update licences set maintenance_fin=greatest(coalesce(maintenance_fin,current_date),current_date)+make_interval(months=>p_mois), statut='actif'
      where espace_id=p_espace and logiciel=p_logiciel and type='achat' returning maintenance_fin into v_fin;
    if v_fin is null then raise exception 'Aucune licence achetée pour ce logiciel'; end if;
    update espaces set statut='actif' where id=p_espace and statut in ('essai','suspendu');
    insert into paiements(espace_id,logiciel,montant,devise,moyen,mois,reference,note) values (p_espace,p_logiciel,coalesce(p_montant,0),coalesce(p_devise,'XOF'),p_moyen,p_mois,p_reference,'Maintenance et hébergement');
    return jsonb_build_object('maintenance_fin',v_fin);
  end if;
  select greatest(coalesce(date_fin,current_date),current_date) + make_interval(months=>p_mois) into v_fin
    from licences where espace_id=p_espace and logiciel=p_logiciel;
  if v_fin is null then v_fin := current_date + make_interval(months=>p_mois); end if;
  insert into licences(espace_id,logiciel,formule,statut,date_fin,employes_max)
    values (p_espace,p_logiciel,p_formule,'actif',v_fin,p_employes_max)
    on conflict (espace_id,logiciel) do update set formule=excluded.formule, statut='actif', date_fin=excluded.date_fin, employes_max=excluded.employes_max;
  update espaces set statut='actif' where id=p_espace;
  insert into paiements(espace_id,logiciel,montant,devise,moyen,mois,reference) values (p_espace,p_logiciel,coalesce(p_montant,0),coalesce(p_devise,'XOF'),p_moyen,p_mois,p_reference);
  return jsonb_build_object('date_fin',v_fin);
end $function$;
revoke all on function public.activer_licence(uuid,text,integer,text,numeric,text,text,text,integer) from public, anon, authenticated;

-- Admin : créer une licence ACHETÉE (1re année de maintenance incluse)
create or replace function public.admin_licence_achat(p_espace uuid, p_logiciel text, p_formule text default 'premium', p_montant numeric default 0,
  p_moyen text default 'virement', p_reference text default null, p_date_achat date default current_date, p_maintenance_fin date default null, p_employes_max integer default null)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
declare v_fin date := coalesce(p_maintenance_fin, coalesce(p_date_achat,current_date) + interval '1 year');
begin
  if not est_super_admin() then raise exception 'Accès refusé'; end if;
  if p_formule not in ('starter','business','premium','standard','serenite') then raise exception 'Formule invalide'; end if;
  insert into licences(espace_id,logiciel,formule,statut,type,date_debut,date_achat,date_fin,maintenance_fin,employes_max,devise)
    values (p_espace,p_logiciel,p_formule,case when v_fin<current_date then 'lecture_seule' else 'actif' end,'achat',coalesce(p_date_achat,current_date),coalesce(p_date_achat,current_date),null,v_fin,p_employes_max,(select devise from espaces where id=p_espace))
    on conflict (espace_id,logiciel) do update set formule=excluded.formule, statut=excluded.statut, type='achat', date_achat=excluded.date_achat,
      date_fin=null, maintenance_fin=excluded.maintenance_fin, employes_max=excluded.employes_max;
  update espaces set statut='actif' where id=p_espace;
  insert into paiements(espace_id,logiciel,montant,devise,moyen,mois,reference,note)
    values (p_espace,p_logiciel,coalesce(p_montant,0),(select devise from espaces where id=p_espace),p_moyen,12,p_reference,'Achat de licence (1re année de maintenance incluse)');
  return jsonb_build_object('maintenance_fin',v_fin);
end $function$;

-- Admin : renouveler la maintenance (+12 mois, 350 000 F CFA par défaut)
create or replace function public.admin_renouveler_maintenance(p_espace uuid, p_logiciel text, p_montant numeric default 350000, p_moyen text default 'virement', p_reference text default null)
 returns jsonb language plpgsql security definer set search_path to 'public' as $function$
begin
  if not est_super_admin() then raise exception 'Accès refusé'; end if;
  return activer_licence(p_espace,p_logiciel,12,'maintenance',p_montant,'XOF',p_moyen,p_reference);
end $function$;

-- Rappels automatiques (30 j avant la fin de maintenance, 7 j avant la fin d'un abonnement)
create table if not exists rappels (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  logiciel text not null references logiciels(code),
  type text not null check (type in ('maintenance','abonnement')),
  echeance date not null,
  cree_le timestamptz not null default now(),
  traite boolean not null default false,
  unique (espace_id, logiciel, type, echeance)
);
alter table rappels enable row level security;
create policy rappels_admin on rappels for all using (est_super_admin()) with check (est_super_admin());
create policy rappels_lecture on rappels for select using (est_gerant(espace_id));

create or replace function public.generer_rappels()
 returns void language sql security definer set search_path to 'public' as $$
  insert into rappels(espace_id,logiciel,type,echeance)
    select espace_id,logiciel,'maintenance',maintenance_fin from licences
     where type='achat' and statut in ('actif','lecture_seule') and maintenance_fin between current_date and current_date+30
  on conflict do nothing;
  insert into rappels(espace_id,logiciel,type,echeance)
    select espace_id,logiciel,'abonnement',date_fin from licences
     where type='abonnement' and statut in ('actif','essai') and date_fin between current_date and current_date+7
  on conflict do nothing;
$$;
revoke all on function public.generer_rappels() from public, anon, authenticated;
revoke all on function public.expirer_abonnements() from public, anon, authenticated;

create or replace function public.admin_rappel_traite(p_id uuid)
 returns void language plpgsql security definer set search_path to 'public' as $$
begin
  if not est_super_admin() then raise exception 'Accès refusé'; end if;
  update rappels set traite=true where id=p_id;
end $$;

-- admin_espaces : ajoute les rappels en cours
create or replace function public.admin_espaces()
 returns jsonb language sql stable security definer set search_path to 'public' as $function$
  select case when not est_super_admin() then null else coalesce(jsonb_agg(x order by x->>'created_at' desc),'[]'::jsonb) end from (
    select to_jsonb(e) || jsonb_build_object(
      'proprietaire',(select jsonb_build_object('nom',m.nom_complet,'email',u.email,'telephone',m.telephone) from membres m join auth.users u on u.id=m.user_id where m.espace_id=e.id and m.role='proprietaire' limit 1),
      'nb_membres',(select count(*) from membres m where m.espace_id=e.id and m.actif),
      'licences',(select coalesce(jsonb_agg(to_jsonb(l)),'[]'::jsonb) from licences l where l.espace_id=e.id),
      'rappels',(select coalesce(jsonb_agg(to_jsonb(r) order by r.echeance),'[]'::jsonb) from rappels r where r.espace_id=e.id and not r.traite),
      'encaisse',(select coalesce(sum(montant),0) from paiements p where p.espace_id=e.id)) x
    from espaces e) s
$function$;

select cron.schedule('generer-rappels','15 0 * * *','select public.generer_rappels()');
