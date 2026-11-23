-- Ilano — RH Pro (vraies données, tables rh_*), sécurisé par RLS.

-- ---------- Fonctions d'accès ----------
create or replace function public.rh_lecture(p_espace uuid) returns boolean
 language sql stable security definer set search_path to 'public' as $$ select est_gerant(p_espace) and a_acces(p_espace,'rhpro') $$;
create or replace function public.rh_ecriture(p_espace uuid) returns boolean
 language sql stable security definer set search_path to 'public' as $$ select est_gerant(p_espace) and a_logiciel(p_espace,'rhpro') $$;

-- ---------- Tables ----------
create table rh_employes (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  membre_id uuid references membres(id) on delete set null,
  matricule text,
  prenom text not null check (length(trim(prenom)) between 1 and 80),
  nom text not null check (length(trim(nom)) between 1 and 80),
  poste text, departement text,
  type_contrat text not null default 'CDI',
  date_embauche date, date_fin_contrat date,
  salaire_base numeric not null default 0 check (salaire_base >= 0),
  jours_conges_an numeric not null default 24 check (jours_conges_an >= 0),
  telephone text, email text, adresse text, date_naissance date,
  num_securite_sociale text, contact_urgence text,
  mode_paiement text, numero_paiement text,
  photo_url text,
  statut text not null default 'actif' check (statut in ('actif','sorti')),
  date_sortie date,
  created_at timestamptz not null default now(),
  unique (id, espace_id),
  unique (espace_id, matricule)
);
create unique index rh_employes_membre_uniq on rh_employes(membre_id) where membre_id is not null;
create index on rh_employes(espace_id);

create table rh_conges (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  employe_id uuid not null,
  type text not null default 'conge_paye' check (type in ('conge_paye','maladie','maternite','permission','sans_solde','absence','autre')),
  date_debut date not null, date_fin date not null,
  nb_jours numeric not null default 0,
  motif text,
  statut text not null default 'en_attente' check (statut in ('en_attente','approuve','refuse','annule')),
  reponse text,
  demande_par_employe boolean not null default false,
  decide_par uuid references membres(id) on delete set null, decide_le timestamptz,
  created_at timestamptz not null default now(),
  check (date_fin >= date_debut),
  foreign key (employe_id, espace_id) references rh_employes(id, espace_id) on delete cascade
);
create index on rh_conges(espace_id, date_debut);

create table rh_pointages (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  employe_id uuid not null,
  jour date not null default current_date,
  arrivee timestamptz, depart timestamptz,
  note text,
  saisi_par uuid references membres(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (employe_id, jour),
  foreign key (employe_id, espace_id) references rh_employes(id, espace_id) on delete cascade
);
create index on rh_pointages(espace_id, jour);

create table rh_signalements (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  employe_id uuid not null,
  categorie text not null default 'autre',
  sujet text not null check (length(sujet) <= 150),
  message text not null check (length(message) <= 4000),
  statut text not null default 'ouvert' check (statut in ('ouvert','traite')),
  reponse text, repondu_le timestamptz,
  created_at timestamptz not null default now(),
  foreign key (employe_id, espace_id) references rh_employes(id, espace_id) on delete cascade
);

create table rh_documents (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  employe_id uuid,
  type text not null check (type in ('attestation','certificat','contrat','avenant','avertissement','convocation','note','autre')),
  numero text not null,
  titre text not null,
  contenu text not null,
  visible_employe boolean not null default true,
  created_by uuid references membres(id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (employe_id, espace_id) references rh_employes(id, espace_id) on delete cascade
);

create table rh_explications (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  employe_id uuid not null,
  numero text not null,
  date_faits date not null default current_date,
  faits text not null check (length(faits) <= 4000),
  delai_heures int not null default 72 check (delai_heures between 24 and 240),
  statut text not null default 'a_repondre' check (statut in ('a_repondre','repondu','clos')),
  reponse text, repondu_le timestamptz,
  decision text,
  created_by uuid references membres(id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (employe_id, espace_id) references rh_employes(id, espace_id) on delete cascade
);

create table rh_paies (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  employe_id uuid not null,
  periode text not null check (periode ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  salaire_base numeric not null default 0 check (salaire_base >= 0),
  primes numeric not null default 0 check (primes >= 0),
  heures_sup numeric not null default 0 check (heures_sup >= 0),
  retenues numeric not null default 0 check (retenues >= 0),
  avances numeric not null default 0 check (avances >= 0),
  cotisations numeric not null default 0 check (cotisations >= 0),
  net numeric generated always as (salaire_base + primes + heures_sup - retenues - avances - cotisations) stored,
  statut text not null default 'brouillon' check (statut in ('brouillon','valide','paye')),
  mode_paiement text, paye_le date, note text,
  created_at timestamptz not null default now(),
  unique (employe_id, periode),
  foreign key (employe_id, espace_id) references rh_employes(id, espace_id) on delete cascade
);

create table rh_candidatures (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  nom text not null, email text, telephone text, poste_vise text, message text,
  cv_chemin text,
  statut text not null default 'nouvelle' check (statut in ('nouvelle','entretien','retenue','refusee')),
  note text,
  created_at timestamptz not null default now()
);

-- ---------- Employé connecté ----------
create or replace function public.mon_employe(p_espace uuid) returns uuid
 language sql stable security definer set search_path to 'public' as $$
  select e.id from rh_employes e where e.espace_id=p_espace and e.statut='actif'
    and e.membre_id is not null and e.membre_id = mon_membre(p_espace) and est_membre(p_espace) and a_acces(p_espace,'rhpro') limit 1 $$;

-- ---------- Déclencheurs ----------
create or replace function public.rh_avant_employe() returns trigger
 language plpgsql security definer set search_path to 'public' as $$
declare v_max int; v_nb int;
begin
  if tg_op='INSERT' and (new.matricule is null or trim(new.matricule)='') then
    select 'EMP-'||lpad((count(*)+1)::text,4,'0') into new.matricule from rh_employes where espace_id=new.espace_id;
    while exists(select 1 from rh_employes where espace_id=new.espace_id and matricule=new.matricule) loop
      new.matricule := 'EMP-'||lpad((floor(random()*9000)+1000)::int::text,4,'0');
    end loop;
  end if;
  if new.statut='actif' and (tg_op='INSERT' or old.statut<>'actif') then
    select employes_max into v_max from licences where espace_id=new.espace_id and logiciel='rhpro';
    if v_max is not null then
      select count(*) into v_nb from rh_employes where espace_id=new.espace_id and statut='actif' and id<>new.id;
      if v_nb >= v_max then raise exception 'Limite de votre formule atteinte (% employés). Passez à la formule supérieure.', v_max; end if;
    end if;
  end if;
  if tg_op='UPDATE' then new.espace_id := old.espace_id; end if;
  -- le compte employé lié doit appartenir au même espace
  if new.membre_id is not null and not exists(select 1 from membres where id=new.membre_id and espace_id=new.espace_id) then
    raise exception 'Compte employé invalide';
  end if;
  return new;
end $$;
create trigger rh_avant_employe before insert or update on rh_employes for each row execute function rh_avant_employe();

create or replace function public.rh_avant_conge() returns trigger
 language plpgsql security definer set search_path to 'public' as $$
begin
  -- jours décomptés : du début à la fin, dimanches exclus
  select count(*) into new.nb_jours from generate_series(new.date_debut, new.date_fin, interval '1 day') d where extract(isodow from d) <> 7;
  return new;
end $$;
create trigger rh_avant_conge before insert or update of date_debut, date_fin on rh_conges for each row execute function rh_avant_conge();

-- ---------- RLS ----------
alter table rh_employes enable row level security;
alter table rh_conges enable row level security;
alter table rh_pointages enable row level security;
alter table rh_signalements enable row level security;
alter table rh_documents enable row level security;
alter table rh_explications enable row level security;
alter table rh_paies enable row level security;
alter table rh_candidatures enable row level security;

create policy rh_employes_lecture on rh_employes for select using (rh_lecture(espace_id) or id = mon_employe(espace_id));
create policy rh_employes_ajout on rh_employes for insert with check (rh_ecriture(espace_id));
create policy rh_employes_maj on rh_employes for update using (rh_ecriture(espace_id)) with check (rh_ecriture(espace_id));
create policy rh_employes_sup on rh_employes for delete using (rh_ecriture(espace_id));

create policy rh_conges_lecture on rh_conges for select using (rh_lecture(espace_id) or employe_id = mon_employe(espace_id));
create policy rh_conges_ajout on rh_conges for insert with check (rh_ecriture(espace_id));
create policy rh_conges_maj on rh_conges for update using (rh_ecriture(espace_id)) with check (rh_ecriture(espace_id));
create policy rh_conges_sup on rh_conges for delete using (rh_ecriture(espace_id));

create policy rh_pointages_lecture on rh_pointages for select using (rh_lecture(espace_id) or employe_id = mon_employe(espace_id));
create policy rh_pointages_ajout on rh_pointages for insert with check (rh_ecriture(espace_id));
create policy rh_pointages_maj on rh_pointages for update using (rh_ecriture(espace_id)) with check (rh_ecriture(espace_id));
create policy rh_pointages_sup on rh_pointages for delete using (rh_ecriture(espace_id));

create policy rh_signalements_lecture on rh_signalements for select using (rh_lecture(espace_id) or employe_id = mon_employe(espace_id));
create policy rh_signalements_maj on rh_signalements for update using (rh_ecriture(espace_id)) with check (rh_ecriture(espace_id));
create policy rh_signalements_sup on rh_signalements for delete using (rh_ecriture(espace_id));

create policy rh_documents_lecture on rh_documents for select using (rh_lecture(espace_id)
  or (visible_employe and mon_employe(espace_id) is not null and (employe_id = mon_employe(espace_id) or (employe_id is null and type='note'))));
create policy rh_documents_ajout on rh_documents for insert with check (rh_ecriture(espace_id));
create policy rh_documents_maj on rh_documents for update using (rh_ecriture(espace_id)) with check (rh_ecriture(espace_id));
create policy rh_documents_sup on rh_documents for delete using (rh_ecriture(espace_id));

create policy rh_explications_lecture on rh_explications for select using (rh_lecture(espace_id) or employe_id = mon_employe(espace_id));
create policy rh_explications_ajout on rh_explications for insert with check (rh_ecriture(espace_id));
create policy rh_explications_maj on rh_explications for update using (rh_ecriture(espace_id)) with check (rh_ecriture(espace_id));
create policy rh_explications_sup on rh_explications for delete using (rh_ecriture(espace_id));

create policy rh_paies_lecture on rh_paies for select using (rh_lecture(espace_id) or (employe_id = mon_employe(espace_id) and statut in ('valide','paye')));
create policy rh_paies_ajout on rh_paies for insert with check (rh_ecriture(espace_id));
create policy rh_paies_maj on rh_paies for update using (rh_ecriture(espace_id)) with check (rh_ecriture(espace_id));
create policy rh_paies_sup on rh_paies for delete using (rh_ecriture(espace_id));

create policy rh_candidatures_lecture on rh_candidatures for select using (rh_lecture(espace_id));
create policy rh_candidatures_maj on rh_candidatures for update using (rh_ecriture(espace_id)) with check (rh_ecriture(espace_id));
create policy rh_candidatures_sup on rh_candidatures for delete using (rh_ecriture(espace_id));

revoke all on rh_employes, rh_conges, rh_pointages, rh_signalements, rh_documents, rh_explications, rh_paies, rh_candidatures from anon;

-- ---------- Actions de l'employé (contrôlées côté serveur) ----------
create or replace function public.rh_demander_conge(p_espace uuid, p_type text, p_debut date, p_fin date, p_motif text default null)
 returns uuid language plpgsql security definer set search_path to 'public' as $$
declare v_emp uuid := mon_employe(p_espace); v_id uuid;
begin
  if v_emp is null or not a_logiciel(p_espace,'rhpro') then raise exception 'Accès refusé'; end if;
  if p_fin < p_debut then raise exception 'La date de fin doit être après la date de début'; end if;
  if p_fin - p_debut > 366 then raise exception 'Période trop longue'; end if;
  insert into rh_conges(espace_id,employe_id,type,date_debut,date_fin,motif,statut,demande_par_employe)
    values (p_espace,v_emp,coalesce(p_type,'conge_paye'),p_debut,p_fin,left(p_motif,1000),'en_attente',true) returning id into v_id;
  return v_id;
end $$;

create or replace function public.rh_annuler_ma_demande(p_conge uuid)
 returns void language plpgsql security definer set search_path to 'public' as $$
declare c rh_conges;
begin
  select * into c from rh_conges where id=p_conge;
  if not found or c.employe_id is distinct from mon_employe(c.espace_id) or c.statut<>'en_attente' then raise exception 'Accès refusé'; end if;
  update rh_conges set statut='annule' where id=p_conge;
end $$;

-- Pointage : l'employé pointe pour lui-même ; le dirigeant/RH peut pointer pour un employé
create or replace function public.rh_pointer(p_espace uuid, p_sens text, p_employe uuid default null)
 returns jsonb language plpgsql security definer set search_path to 'public' as $$
declare v_emp uuid; p rh_pointages;
begin
  if p_sens not in ('arrivee','depart') then raise exception 'Sens invalide'; end if;
  if p_employe is null then
    v_emp := mon_employe(p_espace);
    if v_emp is null or not a_logiciel(p_espace,'rhpro') then raise exception 'Accès refusé'; end if;
  else
    if not rh_ecriture(p_espace) or not exists(select 1 from rh_employes where id=p_employe and espace_id=p_espace) then raise exception 'Accès refusé'; end if;
    v_emp := p_employe;
  end if;
  insert into rh_pointages(espace_id,employe_id,jour,saisi_par) values (p_espace,v_emp,current_date,mon_membre(p_espace))
    on conflict (employe_id,jour) do nothing;
  if p_sens='arrivee' then
    update rh_pointages set arrivee=coalesce(arrivee,now()) where employe_id=v_emp and jour=current_date returning * into p;
  else
    update rh_pointages set depart=now(), arrivee=coalesce(arrivee,now()) where employe_id=v_emp and jour=current_date returning * into p;
  end if;
  return to_jsonb(p);
end $$;

create or replace function public.rh_repondre_explication(p_id uuid, p_reponse text)
 returns void language plpgsql security definer set search_path to 'public' as $$
declare x rh_explications;
begin
  select * into x from rh_explications where id=p_id;
  if not found or x.employe_id is distinct from mon_employe(x.espace_id) or not a_logiciel(x.espace_id,'rhpro') then raise exception 'Accès refusé'; end if;
  if x.statut<>'a_repondre' then raise exception 'Cette demande a déjà reçu une réponse'; end if;
  if length(trim(coalesce(p_reponse,''))) < 5 then raise exception 'Votre réponse est trop courte'; end if;
  update rh_explications set reponse=left(p_reponse,4000), repondu_le=now(), statut='repondu' where id=p_id;
end $$;

create or replace function public.rh_signaler(p_espace uuid, p_categorie text, p_sujet text, p_message text)
 returns uuid language plpgsql security definer set search_path to 'public' as $$
declare v_emp uuid := mon_employe(p_espace); v_id uuid;
begin
  if v_emp is null or not a_logiciel(p_espace,'rhpro') then raise exception 'Accès refusé'; end if;
  if length(trim(coalesce(p_message,''))) < 3 then raise exception 'Message requis'; end if;
  insert into rh_signalements(espace_id,employe_id,categorie,sujet,message)
    values (p_espace,v_emp,left(coalesce(p_categorie,'autre'),40),left(coalesce(nullif(trim(p_sujet),''),'Signalement'),150),left(p_message,4000)) returning id into v_id;
  return v_id;
end $$;

-- Tableau de bord RH
create or replace function public.rh_resume(p_espace uuid)
 returns jsonb language sql stable security definer set search_path to 'public' as $$
  select case when not rh_lecture(p_espace) then null else jsonb_build_object(
    'effectif', (select count(*) from rh_employes where espace_id=p_espace and statut='actif'),
    'absents', (select count(distinct employe_id) from rh_conges where espace_id=p_espace and statut='approuve' and current_date between date_debut and date_fin),
    'presents', (select count(*) from rh_pointages where espace_id=p_espace and jour=current_date and arrivee is not null),
    'demandes', (select count(*) from rh_conges where espace_id=p_espace and statut='en_attente'),
    'signalements', (select count(*) from rh_signalements where espace_id=p_espace and statut='ouvert'),
    'explications', (select count(*) from rh_explications where espace_id=p_espace and statut='repondu'),
    'candidatures', (select count(*) from rh_candidatures where espace_id=p_espace and statut='nouvelle'),
    'masse_salariale', (select coalesce(sum(salaire_base),0) from rh_employes where espace_id=p_espace and statut='actif'),
    'fins_contrat', (select coalesce(jsonb_agg(jsonb_build_object('id',id,'nom',prenom||' '||nom,'date',date_fin_contrat) order by date_fin_contrat),'[]'::jsonb)
                     from rh_employes where espace_id=p_espace and statut='actif' and date_fin_contrat between current_date and current_date+45),
    'employes_max', (select employes_max from licences where espace_id=p_espace and logiciel='rhpro')
  ) end $$;

-- ---------- Candidature spontanée (lien public par entreprise) ----------
create or replace function public.rh_marque_candidature(p_slug text)
 returns jsonb language sql stable security definer set search_path to 'public' as $$
  select jsonb_build_object('nom',nom,'logo_url',logo_url,'couleur_principale',couleur_principale,'couleur_secondaire',couleur_secondaire,'langue',langue)
    from espaces where slug=p_slug and statut in ('essai','actif') and a_logiciel(id,'rhpro') $$;

create or replace function public.rh_postuler(p_slug text, p_nom text, p_email text, p_telephone text, p_poste text, p_message text, p_cv text default null)
 returns boolean language plpgsql security definer set search_path to 'public' as $$
declare v_esp uuid;
begin
  select id into v_esp from espaces where slug=p_slug and statut in ('essai','actif') and a_logiciel(id,'rhpro');
  if v_esp is null then raise exception 'Entreprise introuvable'; end if;
  if length(trim(coalesce(p_nom,''))) < 2 then raise exception 'Nom requis'; end if;
  if coalesce(p_email,'')='' and coalesce(p_telephone,'')='' then raise exception 'E-mail ou téléphone requis'; end if;
  if (select count(*) from rh_candidatures where espace_id=v_esp and created_at > now()-interval '1 hour') >= 30 then
    raise exception 'Trop de candidatures en ce moment, réessayez plus tard'; end if;
  if p_cv is not null and p_cv not like p_slug||'/%' then raise exception 'Fichier invalide'; end if;
  insert into rh_candidatures(espace_id,nom,email,telephone,poste_vise,message,cv_chemin)
    values (v_esp,left(trim(p_nom),120),left(p_email,160),left(p_telephone,40),left(p_poste,120),left(p_message,4000),p_cv);
  return true;
end $$;

-- ---------- Droits d'exécution ----------
revoke all on function public.rh_lecture(uuid), public.rh_ecriture(uuid), public.mon_employe(uuid),
  public.rh_demander_conge(uuid,text,date,date,text), public.rh_annuler_ma_demande(uuid), public.rh_pointer(uuid,text,uuid),
  public.rh_repondre_explication(uuid,text), public.rh_signaler(uuid,text,text,text), public.rh_resume(uuid),
  public.rh_avant_employe(), public.rh_avant_conge() from public, anon;
grant execute on function public.rh_lecture(uuid), public.rh_ecriture(uuid), public.mon_employe(uuid),
  public.rh_demander_conge(uuid,text,date,date,text), public.rh_annuler_ma_demande(uuid), public.rh_pointer(uuid,text,uuid),
  public.rh_repondre_explication(uuid,text), public.rh_signaler(uuid,text,text,text), public.rh_resume(uuid) to authenticated;
revoke all on function public.rh_marque_candidature(text), public.rh_postuler(text,text,text,text,text,text,text) from public;
grant execute on function public.rh_marque_candidature(text), public.rh_postuler(text,text,text,text,text,text,text) to anon, authenticated;

-- ---------- Stockage des CV (privé) ----------
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('rh-cv','rh-cv',false,5242880,array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','image/jpeg','image/png'])
on conflict (id) do nothing;
create policy rh_cv_depot on storage.objects for insert to anon, authenticated with check (
  bucket_id='rh-cv' and exists(select 1 from public.espaces e where e.slug=(storage.foldername(name))[1] and e.statut in ('essai','actif') and public.a_logiciel(e.id,'rhpro')));
create policy rh_cv_lecture on storage.objects for select to authenticated using (
  bucket_id='rh-cv' and exists(select 1 from public.espaces e where e.slug=(storage.foldername(name))[1] and public.rh_lecture(e.id)));

-- ---------- Tarifs RH Pro (location) + forfait annuel de maintenance (achat) ----------
insert into tarifs(logiciel,formule,mois,prix,devise,employes_max,ordre) values
 ('rhpro','starter',1,25000,'XOF',10,1),('rhpro','starter',3,67500,'XOF',10,2),('rhpro','starter',12,240000,'XOF',10,3),
 ('rhpro','business',1,55000,'XOF',50,4),('rhpro','business',3,148500,'XOF',50,5),('rhpro','business',12,528000,'XOF',50,6),
 ('rhpro','premium',1,95000,'XOF',null,7),('rhpro','premium',3,256500,'XOF',null,8),('rhpro','premium',12,912000,'XOF',null,9),
 ('rhpro','starter',1,39,'EUR',10,1),('rhpro','starter',3,105,'EUR',10,2),('rhpro','starter',12,374,'EUR',10,3),
 ('rhpro','business',1,85,'EUR',50,4),('rhpro','business',3,229,'EUR',50,5),('rhpro','business',12,816,'EUR',50,6),
 ('rhpro','premium',1,145,'EUR',null,7),('rhpro','premium',3,391,'EUR',null,8),('rhpro','premium',12,1392,'EUR',null,9),
 ('rhpro','starter',1,42,'USD',10,1),('rhpro','starter',3,113,'USD',10,2),('rhpro','starter',12,403,'USD',10,3),
 ('rhpro','business',1,92,'USD',50,4),('rhpro','business',3,248,'USD',50,5),('rhpro','business',12,883,'USD',50,6),
 ('rhpro','premium',1,159,'USD',null,7),('rhpro','premium',3,429,'USD',null,8),('rhpro','premium',12,1526,'USD',null,9)
on conflict (logiciel,formule,mois,devise) do nothing;
insert into tarifs(logiciel,formule,mois,prix,devise,ordre)
 select code,'maintenance',12,350000,'XOF',20 from logiciels on conflict (logiciel,formule,mois,devise) do nothing;
