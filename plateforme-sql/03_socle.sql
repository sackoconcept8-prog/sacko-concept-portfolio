-- =====================================================================
-- Ilano — SOCLE UNIVERSEL (moteur commun partagé par tous les secteurs)
-- Tables co_* : clients, ressources, prestations, rendez-vous/réservations,
-- échéanciers, factures/devis/reçus, dépenses, fournisseurs, budgets,
-- notifications, demandes de fonctionnalités. Sécurisé par RLS.
-- Code logiciel du socle : 'ilano'. StockPro et RH Pro restent des modules
-- (licences incluses dans le pack, champ licences.inclus_dans).
-- =====================================================================

-- ---------- Logiciel, espaces, licences, tarifs ----------
insert into logiciels(code,nom,description,actif,ordre)
values ('ilano','Ilano','Socle de gestion : clients, agenda, factures, dépenses',true,0)
on conflict (code) do update set nom=excluded.nom, description=excluded.description, actif=true;

alter table espaces add column if not exists modele text not null default 'generique';
alter table espaces add column if not exists modules jsonb not null default '{}'::jsonb;
alter table espaces add column if not exists libelles jsonb not null default '{}'::jsonb;
alter table espaces add column if not exists champs_perso jsonb not null default '{}'::jsonb;
alter table espaces add column if not exists reglages jsonb not null default '{}'::jsonb;
alter table espaces add column if not exists effectif text;
alter table espaces drop constraint if exists espaces_modele_check;
alter table espaces add constraint espaces_modele_check check (modele in
  ('generique','commerce','rh','hotel','ecole','clinique','immobilier','transport','beaute','nettoyage','securite','btp'));
alter table espaces drop constraint if exists espaces_effectif_check;
alter table espaces add constraint espaces_effectif_check check (effectif is null or effectif in ('1-10','11-50','51-500','500+'));

alter table licences add column if not exists inclus_dans text;
alter table licences drop constraint if exists licences_formule_check;
alter table licences add constraint licences_formule_check check (formule in
  ('essai','starter','business','premium','standard','serenite','demarrage','pme','croissance','entreprise'));

alter table tarifs add column if not exists gamme text not null default 'standard';
alter table tarifs drop constraint if exists tarifs_formule_check;
alter table tarifs add constraint tarifs_formule_check check (formule in
  ('starter','business','premium','standard','serenite','maintenance','demarrage','pme','croissance','entreprise'));

alter table tarifs drop constraint if exists tarifs_logiciel_formule_mois_devise_key;
alter table tarifs drop constraint if exists tarifs_gamme_uniq;
alter table tarifs add constraint tarifs_gamme_uniq unique (logiciel, formule, mois, devise, gamme);

-- Les licences incluses (modules Stock, RH, socle) suivent la licence principale
create or replace function public.co_sync_licences() returns trigger
 language plpgsql security definer set search_path to 'public' as $fn$
begin
  if new.inclus_dans is null then
    update licences set statut=new.statut, date_fin=new.date_fin, formule=new.formule, employes_max=new.employes_max
     where espace_id=new.espace_id and inclus_dans=new.logiciel
       and (statut is distinct from new.statut or date_fin is distinct from new.date_fin
            or formule is distinct from new.formule or employes_max is distinct from new.employes_max);
  end if;
  return new;
end $fn$;
drop trigger if exists co_sync_licences on licences;
create trigger co_sync_licences after insert or update of statut, date_fin, formule, employes_max on licences
  for each row execute function co_sync_licences();

-- ---------- Nouvelle grille : 4 packs selon la taille ----------
update tarifs set actif=false where logiciel='rhpro' and formule in ('starter','business','premium');
delete from tarifs where formule in ('demarrage','pme','croissance');
with packs(gamme,formule,emax,ordre,xof,eur,usd) as (values
  ('standard','demarrage',10,1,25000,38,42),
  ('standard','pme',50,4,49000,75,82),
  ('standard','croissance',500,7,120000,183,199),
  ('sante','demarrage',10,1,100000,152,167),
  ('sante','pme',50,4,100000,152,167),
  ('sante','croissance',500,7,200000,305,335)),
durees(mois,coef,dec) as (values (1,1.0,0),(3,2.7,1),(12,9.6,2)),
logs(logiciel,gamme) as (values ('ilano','standard'),('ilano','sante'),('stockpro','standard'),('rhpro','standard'))
insert into tarifs(logiciel,formule,mois,prix,devise,employes_max,actif,ordre,gamme)
select l.logiciel, p.formule, d.mois, round(v.prix*d.coef), v.devise, p.emax, true, p.ordre+d.dec, p.gamme
from packs p join logs l on l.gamme=p.gamme cross join durees d
cross join lateral (values ('XOF',p.xof),('EUR',p.eur),('USD',p.usd)) v(devise,prix);

-- ---------- Fonctions d'accès ----------
create or replace function public.mon_role(p_espace uuid) returns text
 language sql stable security definer set search_path to 'public' as $fn$
  select role from membres where espace_id=p_espace and user_id=auth.uid() and actif limit 1 $fn$;
-- lecture par l'équipe (hors simple employé RH)
create or replace function public.co_lecture(p_espace uuid) returns boolean
 language sql stable security definer set search_path to 'public' as $fn$
  select (est_super_admin() or (est_membre(p_espace) and coalesce(mon_role(p_espace),'') <> 'employe')) and a_acces(p_espace,'ilano') $fn$;
create or replace function public.co_ecriture(p_espace uuid) returns boolean
 language sql stable security definer set search_path to 'public' as $fn$
  select (est_super_admin() or (est_membre(p_espace) and coalesce(mon_role(p_espace),'') <> 'employe')) and a_logiciel(p_espace,'ilano') $fn$;
create or replace function public.co_gestion_lecture(p_espace uuid) returns boolean
 language sql stable security definer set search_path to 'public' as $fn$ select est_gerant(p_espace) and a_acces(p_espace,'ilano') $fn$;
create or replace function public.co_gestion(p_espace uuid) returns boolean
 language sql stable security definer set search_path to 'public' as $fn$ select est_gerant(p_espace) and a_logiciel(p_espace,'ilano') $fn$;

-- ---------- Tables ----------
create table if not exists co_clients (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  categorie text not null default 'client' check (categorie ~ '^[a-z_]{2,30}$'),
  nom text not null check (length(trim(nom)) between 1 and 120),
  telephone text check (length(telephone) <= 40),
  email text check (length(email) <= 160),
  adresse text check (length(adresse) <= 300),
  note text check (length(note) <= 4000),
  champs jsonb not null default '{}'::jsonb,
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, espace_id)
);
create index if not exists co_clients_espace on co_clients(espace_id, nom);

create table if not exists co_ressources (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  type text not null default 'ressource' check (type ~ '^[a-z_]{2,30}$'),
  nom text not null check (length(trim(nom)) between 1 and 120),
  categorie text check (length(categorie) <= 80),
  prix numeric not null default 0 check (prix >= 0),
  capacite int check (capacite is null or capacite >= 0),
  statut text not null default 'disponible' check (statut ~ '^[a-z_]{2,30}$'),
  client_id uuid,
  champs jsonb not null default '{}'::jsonb,
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, espace_id),
  foreign key (client_id, espace_id) references co_clients(id, espace_id) on delete set null (client_id)
);
create index if not exists co_ressources_espace on co_ressources(espace_id);

create table if not exists co_prestations (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  nom text not null check (length(trim(nom)) between 1 and 120),
  categorie text check (length(categorie) <= 80),
  prix numeric not null default 0 check (prix >= 0),
  duree_min int check (duree_min is null or duree_min between 0 and 100000),
  unite text check (length(unite) <= 30),
  description text check (length(description) <= 1000),
  publique boolean not null default true,
  actif boolean not null default true,
  created_at timestamptz not null default now(),
  unique (id, espace_id)
);
create index if not exists co_prestations_espace on co_prestations(espace_id);

create table if not exists co_rdv (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  client_id uuid, ressource_id uuid, prestation_id uuid,
  membre_id uuid references membres(id) on delete set null,
  titre text check (length(titre) <= 200),
  debut timestamptz not null,
  fin timestamptz not null,
  statut text not null default 'prevu' check (statut in ('demande','prevu','confirme','en_cours','termine','annule','absent')),
  montant numeric not null default 0 check (montant >= 0),
  lieu text check (length(lieu) <= 300),
  note text check (length(note) <= 4000),
  champs jsonb not null default '{}'::jsonb,
  source text not null default 'interne' check (source in ('interne','public')),
  facture_id uuid,
  created_by uuid references membres(id) on delete set null,
  created_at timestamptz not null default now(),
  check (fin >= debut),
  unique (id, espace_id),
  foreign key (client_id, espace_id) references co_clients(id, espace_id) on delete set null (client_id),
  foreign key (ressource_id, espace_id) references co_ressources(id, espace_id) on delete set null (ressource_id),
  foreign key (prestation_id, espace_id) references co_prestations(id, espace_id) on delete set null (prestation_id)
);
create index if not exists co_rdv_espace on co_rdv(espace_id, debut);
create index if not exists co_rdv_ressource on co_rdv(ressource_id, debut);

create table if not exists co_echeanciers (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  client_id uuid, ressource_id uuid,
  libelle text not null check (length(libelle) between 1 and 200),
  type text not null default 'tranches' check (type in ('tranches','mensuel')),
  montant_total numeric not null default 0,
  actif boolean not null default true,
  created_by uuid references membres(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (id, espace_id),
  foreign key (client_id, espace_id) references co_clients(id, espace_id) on delete cascade,
  foreign key (ressource_id, espace_id) references co_ressources(id, espace_id) on delete set null (ressource_id)
);

create table if not exists co_compteurs (
  espace_id uuid not null references espaces(id) on delete cascade,
  type text not null, annee int not null, n int not null default 0,
  primary key (espace_id, type, annee)
);

create table if not exists co_factures (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  type text not null default 'facture' check (type in ('devis','facture')),
  numero text,
  client_id uuid, ressource_id uuid, rdv_id uuid, echeancier_id uuid,
  objet text check (length(objet) <= 300),
  date_emission date not null default current_date,
  date_echeance date,
  lignes jsonb not null default '[]'::jsonb check (jsonb_typeof(lignes)='array' and jsonb_array_length(lignes) <= 200),
  sous_total numeric not null default 0,
  remise numeric not null default 0 check (remise >= 0),
  tva_taux numeric not null default 0 check (tva_taux between 0 and 100),
  tva numeric not null default 0,
  total numeric not null default 0,
  taux_assurance numeric not null default 0 check (taux_assurance between 0 and 100),
  part_assurance numeric not null default 0,
  total_client numeric not null default 0,
  paye numeric not null default 0 check (paye >= 0),
  statut text not null default 'emise' check (statut in ('brouillon','envoye','accepte','refuse','emise','partielle','payee','annulee')),
  converti_en uuid,
  note text check (length(note) <= 2000),
  derniere_relance timestamptz,
  nb_relances int not null default 0,
  created_by uuid references membres(id) on delete set null,
  created_at timestamptz not null default now(),
  unique (id, espace_id),
  unique (espace_id, type, numero),
  foreign key (client_id, espace_id) references co_clients(id, espace_id) on delete set null (client_id),
  foreign key (ressource_id, espace_id) references co_ressources(id, espace_id) on delete set null (ressource_id),
  foreign key (rdv_id, espace_id) references co_rdv(id, espace_id) on delete set null (rdv_id),
  foreign key (echeancier_id, espace_id) references co_echeanciers(id, espace_id) on delete cascade
);
create index if not exists co_factures_espace on co_factures(espace_id, date_emission);
create index if not exists co_factures_client on co_factures(client_id);

create table if not exists co_reglements (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  facture_id uuid not null,
  numero text not null,
  montant numeric not null check (montant > 0),
  mode text not null default 'especes' check (mode in ('especes','mobile_money','carte','virement','cheque','assurance','autre')),
  reference text check (length(reference) <= 120),
  date_reglement date not null default current_date,
  created_by uuid references membres(id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (facture_id, espace_id) references co_factures(id, espace_id) on delete cascade
);
create index if not exists co_reglements_espace on co_reglements(espace_id, date_reglement);

create table if not exists co_fournisseurs (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  nom text not null check (length(trim(nom)) between 1 and 120),
  categorie text check (length(categorie) <= 80),
  telephone text check (length(telephone) <= 40),
  email text check (length(email) <= 160),
  note text check (length(note) <= 2000),
  created_at timestamptz not null default now(),
  unique (id, espace_id)
);

create table if not exists co_depenses (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  date_depense date not null default current_date,
  categorie text not null default 'Autre' check (length(categorie) between 1 and 80),
  libelle text not null check (length(libelle) between 1 and 200),
  montant numeric not null check (montant >= 0),
  mode text check (length(mode) <= 40),
  fournisseur_id uuid, ressource_id uuid,
  note text check (length(note) <= 2000),
  created_by uuid references membres(id) on delete set null,
  created_at timestamptz not null default now(),
  foreign key (fournisseur_id, espace_id) references co_fournisseurs(id, espace_id) on delete set null (fournisseur_id),
  foreign key (ressource_id, espace_id) references co_ressources(id, espace_id) on delete set null (ressource_id)
);
create index if not exists co_depenses_espace on co_depenses(espace_id, date_depense);

create table if not exists co_budgets (
  espace_id uuid not null references espaces(id) on delete cascade,
  categorie text not null check (length(categorie) between 1 and 80),
  montant numeric not null default 0 check (montant >= 0),
  primary key (espace_id, categorie)
);

create table if not exists co_notifications (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  membre_id uuid references membres(id) on delete cascade,
  type text not null default 'info',
  titre text not null check (length(titre) <= 200),
  message text check (length(message) <= 2000),
  lien text check (length(lien) <= 200),
  cle text,
  lu boolean not null default false,
  created_at timestamptz not null default now()
);
create unique index if not exists co_notifications_cle on co_notifications(espace_id, cle) where cle is not null;
create index if not exists co_notifications_espace on co_notifications(espace_id, created_at desc);

create table if not exists co_demandes (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  membre_id uuid references membres(id) on delete set null,
  titre text not null check (length(trim(titre)) between 3 and 150),
  description text not null check (length(trim(description)) between 5 and 4000),
  urgence text not null default 'normale' check (urgence in ('normale','importante','urgente')),
  statut text not null default 'nouvelle' check (statut in ('nouvelle','en_etude','devis_envoye','acceptee','refusee','livree')),
  reponse text check (length(reponse) <= 4000),
  montant_devis numeric,
  created_at timestamptz not null default now(),
  maj_le timestamptz
);
create index if not exists co_demandes_espace on co_demandes(espace_id, created_at desc);

create table if not exists co_sms (
  espace_id uuid not null references espaces(id) on delete cascade,
  mois text not null, nb int not null default 0,
  primary key (espace_id, mois)
);

-- ---------- Numérotation et calculs ----------
create or replace function public.co_numero(p_espace uuid, p_type text) returns text
 language plpgsql security definer set search_path to 'public' as $fn$
declare v_an int := extract(year from current_date); v_n int;
  v_pref text := case p_type when 'devis' then 'DEV' when 'facture' then 'FAC' when 'recu' then 'REC' else 'DOC' end;
begin
  if not (est_membre(p_espace) or auth.uid() is null) then raise exception 'Accès refusé'; end if;
  insert into co_compteurs(espace_id,type,annee,n) values (p_espace,p_type,v_an,1)
   on conflict (espace_id,type,annee) do update set n=co_compteurs.n+1 returning n into v_n;
  return v_pref||'-'||v_an||'-'||lpad(v_n::text,4,'0');
end $fn$;

create or replace function public.co_avant_facture() returns trigger
 language plpgsql security definer set search_path to 'public' as $fn$
declare v_st numeric; v_base numeric;
begin
  if tg_op='UPDATE' then new.espace_id := old.espace_id; new.type := old.type; new.numero := old.numero; end if;
  if tg_op='INSERT' and (new.numero is null or trim(new.numero)='') then new.numero := co_numero(new.espace_id, new.type); end if;
  select coalesce(sum(round(coalesce((l->>'qte')::numeric,1) * coalesce((l->>'pu')::numeric,0))),0) into v_st from jsonb_array_elements(new.lignes) l;
  new.sous_total := v_st;
  v_base := greatest(0, v_st - coalesce(new.remise,0));
  new.tva := round(v_base * coalesce(new.tva_taux,0) / 100);
  new.total := v_base + new.tva;
  new.part_assurance := round(new.total * coalesce(new.taux_assurance,0) / 100);
  new.total_client := new.total - new.part_assurance;
  if new.type='facture' and new.statut not in ('annulee','brouillon') then
    new.statut := case when new.total_client > 0 and new.paye >= new.total_client then 'payee'
                       when new.total_client <= 0 then 'payee'
                       when new.paye > 0 then 'partielle' else 'emise' end;
  end if;
  return new;
end $fn$;
drop trigger if exists co_avant_facture on co_factures;
create trigger co_avant_facture before insert or update on co_factures for each row execute function co_avant_facture();

-- Pas de double réservation d'une même ressource (chambre, véhicule, salle…)
create or replace function public.co_avant_rdv() returns trigger
 language plpgsql security definer set search_path to 'public' as $fn$
begin
  if tg_op='UPDATE' then new.espace_id := old.espace_id; end if;
  if new.ressource_id is not null and new.statut not in ('annule','absent','termine','demande')
     and coalesce((select (champs->>'partage')::boolean from co_ressources where id=new.ressource_id),false) = false
     and exists(select 1 from co_rdv r where r.ressource_id=new.ressource_id and r.id<>new.id
       and r.statut not in ('annule','absent','termine','demande') and r.debut < new.fin and r.fin > new.debut) then
    raise exception 'Ce créneau est déjà réservé pour cette ressource';
  end if;
  return new;
end $fn$;
drop trigger if exists co_avant_rdv on co_rdv;
create trigger co_avant_rdv before insert or update on co_rdv for each row execute function co_avant_rdv();

create or replace function public.co_fige_espace() returns trigger
 language plpgsql as $fn$ begin new.espace_id := old.espace_id; return new; end $fn$;
do $do$ declare t text; begin
  foreach t in array array['co_clients','co_ressources','co_prestations','co_echeanciers','co_fournisseurs','co_depenses','co_reglements'] loop
    execute format('drop trigger if exists co_fige_espace on %I; create trigger co_fige_espace before update on %I for each row execute function co_fige_espace();', t, t);
  end loop; end $do$;

-- ---------- RLS ----------
alter table co_clients enable row level security;
alter table co_ressources enable row level security;
alter table co_prestations enable row level security;
alter table co_rdv enable row level security;
alter table co_echeanciers enable row level security;
alter table co_factures enable row level security;
alter table co_reglements enable row level security;
alter table co_fournisseurs enable row level security;
alter table co_depenses enable row level security;
alter table co_budgets enable row level security;
alter table co_notifications enable row level security;
alter table co_demandes enable row level security;
alter table co_compteurs enable row level security;
alter table co_sms enable row level security;

do $do$ declare t text; begin
  -- opérationnel : l'équipe lit et écrit, le dirigeant supprime
  foreach t in array array['co_clients','co_rdv','co_factures','co_echeanciers'] loop
    execute format('drop policy if exists %1$s_l on %1$I; drop policy if exists %1$s_a on %1$I; drop policy if exists %1$s_m on %1$I; drop policy if exists %1$s_s on %1$I;', t);
    execute format('create policy %1$s_a on %1$I for insert with check (co_ecriture(espace_id));', t);
    execute format('create policy %1$s_m on %1$I for update using (co_ecriture(espace_id)) with check (co_ecriture(espace_id));', t);
    execute format('create policy %1$s_s on %1$I for delete using (co_gestion(espace_id));', t);
  end loop;
  -- catalogue : l'équipe lit, le dirigeant gère
  foreach t in array array['co_ressources','co_prestations'] loop
    execute format('drop policy if exists %1$s_l on %1$I; drop policy if exists %1$s_a on %1$I; drop policy if exists %1$s_m on %1$I; drop policy if exists %1$s_s on %1$I;', t);
    execute format('create policy %1$s_l on %1$I for select using (co_lecture(espace_id) or (est_membre(espace_id) and a_acces(espace_id,''ilano'')));', t);
    execute format('create policy %1$s_a on %1$I for insert with check (co_gestion(espace_id));', t);
    execute format('create policy %1$s_m on %1$I for update using (co_gestion(espace_id)) with check (co_gestion(espace_id));', t);
    execute format('create policy %1$s_s on %1$I for delete using (co_gestion(espace_id));', t);
  end loop;
  -- finances internes : dirigeant uniquement
  foreach t in array array['co_fournisseurs','co_depenses','co_budgets'] loop
    execute format('drop policy if exists %1$s_l on %1$I; drop policy if exists %1$s_a on %1$I; drop policy if exists %1$s_m on %1$I; drop policy if exists %1$s_s on %1$I;', t);
    execute format('create policy %1$s_l on %1$I for select using (co_gestion_lecture(espace_id));', t);
    execute format('create policy %1$s_a on %1$I for insert with check (co_gestion(espace_id));', t);
    execute format('create policy %1$s_m on %1$I for update using (co_gestion(espace_id)) with check (co_gestion(espace_id));', t);
    execute format('create policy %1$s_s on %1$I for delete using (co_gestion(espace_id));', t);
  end loop;
end $do$;
create policy co_clients_l on co_clients for select using (co_lecture(espace_id));
create policy co_factures_l on co_factures for select using (co_lecture(espace_id));
create policy co_echeanciers_l on co_echeanciers for select using (co_lecture(espace_id));
-- un employé voit les rendez-vous / interventions qui lui sont confiés
create policy co_rdv_l on co_rdv for select using (co_lecture(espace_id) or (membre_id is not null and membre_id = mon_membre(espace_id) and a_acces(espace_id,'ilano')));
drop policy if exists co_reglements_l on co_reglements;
create policy co_reglements_l on co_reglements for select using (co_lecture(espace_id));
drop policy if exists co_reglements_s on co_reglements;
create policy co_reglements_s on co_reglements for delete using (co_gestion(espace_id));
-- (les encaissements passent par la fonction co_encaisser)

drop policy if exists co_notifications_l on co_notifications;
create policy co_notifications_l on co_notifications for select using (est_membre(espace_id)
  and ((membre_id is null and est_gerant(espace_id)) or membre_id = mon_membre(espace_id)));
drop policy if exists co_notifications_m on co_notifications;
create policy co_notifications_m on co_notifications for update using (est_membre(espace_id)
  and ((membre_id is null and est_gerant(espace_id)) or membre_id = mon_membre(espace_id))) with check (est_membre(espace_id));
drop policy if exists co_notifications_s on co_notifications;
create policy co_notifications_s on co_notifications for delete using (est_gerant(espace_id) or membre_id = mon_membre(espace_id));

drop policy if exists co_demandes_l on co_demandes;
create policy co_demandes_l on co_demandes for select using (est_gerant(espace_id) or membre_id = mon_membre(espace_id) or est_super_admin());
drop policy if exists co_demandes_m on co_demandes;
create policy co_demandes_m on co_demandes for update using (est_super_admin()) with check (est_super_admin());
-- co_compteurs, co_sms : aucun accès direct (fonctions uniquement)

-- ---------- Fonctions métier ----------
create or replace function public.co_notifier(p_espace uuid, p_titre text, p_message text default null, p_lien text default null,
  p_type text default 'info', p_membre uuid default null, p_cle text default null) returns void
 language sql security definer set search_path to 'public' as $fn$
  insert into co_notifications(espace_id,membre_id,type,titre,message,lien,cle)
  values (p_espace,p_membre,p_type,left(p_titre,200),left(p_message,2000),left(p_lien,200),p_cle)
  on conflict (espace_id,cle) where cle is not null do nothing $fn$;
revoke execute on function public.co_notifier(uuid,text,text,text,text,uuid,text) from public, anon, authenticated;

create or replace function public.co_encaisser(p_facture uuid, p_montant numeric, p_mode text default 'especes',
  p_reference text default null, p_date date default current_date) returns jsonb
 language plpgsql security definer set search_path to 'public' as $fn$
declare f co_factures; v_num text; v_id uuid;
begin
  select * into f from co_factures where id=p_facture for update;
  if f.id is null or not co_ecriture(f.espace_id) then raise exception 'Accès refusé'; end if;
  if f.type<>'facture' or f.statut in ('annulee','brouillon') then raise exception 'Cette facture ne peut pas être encaissée'; end if;
  if p_montant is null or p_montant <= 0 then raise exception 'Montant invalide'; end if;
  if p_mode <> 'assurance' and p_montant > f.total_client - f.paye + 0.5 then raise exception 'Le montant dépasse le reste à payer (%)', f.total_client - f.paye; end if;
  v_num := co_numero(f.espace_id,'recu');
  insert into co_reglements(espace_id,facture_id,numero,montant,mode,reference,date_reglement,created_by)
   values (f.espace_id,f.id,v_num,p_montant,coalesce(p_mode,'especes'),p_reference,coalesce(p_date,current_date),mon_membre(f.espace_id)) returning id into v_id;
  if p_mode <> 'assurance' then update co_factures set paye=paye+p_montant where id=f.id; end if;
  return jsonb_build_object('id',v_id,'numero',v_num);
end $fn$;

create or replace function public.co_convertir_devis(p_devis uuid) returns jsonb
 language plpgsql security definer set search_path to 'public' as $fn$
declare d co_factures; v_id uuid; v_num text;
begin
  select * into d from co_factures where id=p_devis;
  if d.id is null or not co_ecriture(d.espace_id) then raise exception 'Accès refusé'; end if;
  if d.type<>'devis' then raise exception 'Ce document n''est pas un devis'; end if;
  if d.converti_en is not null then raise exception 'Ce devis a déjà été transformé en facture'; end if;
  insert into co_factures(espace_id,type,client_id,ressource_id,rdv_id,objet,date_echeance,lignes,remise,tva_taux,taux_assurance,note,created_by)
   values (d.espace_id,'facture',d.client_id,d.ressource_id,d.rdv_id,d.objet,current_date+coalesce(((select reglages->>'delai_paiement' from espaces where id=d.espace_id))::int,15),
           d.lignes,d.remise,d.tva_taux,d.taux_assurance,d.note,mon_membre(d.espace_id))
   returning id, numero into v_id, v_num;
  update co_factures set statut='accepte', converti_en=v_id where id=d.id;
  return jsonb_build_object('id',v_id,'numero',v_num);
end $fn$;

-- Échéancier : crée une facture par échéance (tranches de scolarité, loyers mensuels…)
create or replace function public.co_creer_echeancier(p_espace uuid, p_client uuid, p_libelle text, p_type text,
  p_echeances jsonb, p_ressource uuid default null, p_tva numeric default 0) returns jsonb
 language plpgsql security definer set search_path to 'public' as $fn$
declare v_id uuid; e jsonb; v_tot numeric := 0; v_n int := 0;
begin
  if not co_ecriture(p_espace) then raise exception 'Accès refusé'; end if;
  if jsonb_typeof(p_echeances)<>'array' or jsonb_array_length(p_echeances) not between 1 and 60 then raise exception 'Entre 1 et 60 échéances'; end if;
  if not exists(select 1 from co_clients where id=p_client and espace_id=p_espace) then raise exception 'Client introuvable'; end if;
  insert into co_echeanciers(espace_id,client_id,ressource_id,libelle,type,created_by)
   values (p_espace,p_client,p_ressource,left(p_libelle,200),case when p_type='mensuel' then 'mensuel' else 'tranches' end,mon_membre(p_espace)) returning id into v_id;
  for e in select * from jsonb_array_elements(p_echeances) loop
    v_n := v_n + 1; v_tot := v_tot + coalesce((e->>'montant')::numeric,0);
    insert into co_factures(espace_id,type,client_id,ressource_id,echeancier_id,objet,date_emission,date_echeance,lignes,tva_taux,created_by)
     values (p_espace,'facture',p_client,p_ressource,v_id,left(coalesce(e->>'libelle',p_libelle),300),
       (e->>'date')::date,(e->>'date')::date,
       jsonb_build_array(jsonb_build_object('libelle',coalesce(e->>'libelle',p_libelle),'qte',1,'pu',coalesce((e->>'montant')::numeric,0))),
       coalesce(p_tva,0),mon_membre(p_espace));
  end loop;
  update co_echeanciers set montant_total=v_tot where id=v_id;
  return jsonb_build_object('id',v_id,'nb',v_n,'total',v_tot);
end $fn$;

-- Changer l'état d'une ressource (ex. chambre « propre » / « à nettoyer ») : toute l'équipe
create or replace function public.co_ressource_statut(p_id uuid, p_statut text) returns void
 language plpgsql security definer set search_path to 'public' as $fn$
declare v_e uuid;
begin
  select espace_id into v_e from co_ressources where id=p_id;
  if v_e is null or not (est_membre(v_e) and a_logiciel(v_e,'ilano')) then raise exception 'Accès refusé'; end if;
  if p_statut !~ '^[a-z_]{2,30}$' then raise exception 'État invalide'; end if;
  update co_ressources set statut=p_statut where id=p_id;
end $fn$;

-- Un employé met à jour l'état d'une intervention qui lui est confiée
create or replace function public.co_rdv_statut(p_id uuid, p_statut text, p_note text default null) returns void
 language plpgsql security definer set search_path to 'public' as $fn$
declare r co_rdv;
begin
  select * into r from co_rdv where id=p_id;
  if r.id is null or not (co_ecriture(r.espace_id) or (r.membre_id = mon_membre(r.espace_id) and a_logiciel(r.espace_id,'ilano'))) then raise exception 'Accès refusé'; end if;
  if p_statut not in ('prevu','confirme','en_cours','termine','annule','absent') then raise exception 'État invalide'; end if;
  update co_rdv set statut=p_statut, note=case when p_note is null then note else left(coalesce(note||E'\n','')||p_note,4000) end where id=p_id;
end $fn$;

-- Tableau de bord : indicateurs communes (chaque secteur choisit les siens)
create or replace function public.co_resume(p_espace uuid) returns jsonb
 language plpgsql stable security definer set search_path to 'public' as $fn$
declare d1 date := date_trunc('month',current_date)::date; d2 date := (date_trunc('month',current_date)+interval '1 month')::date; r jsonb;
begin
  if not co_lecture(p_espace) then raise exception 'Accès refusé'; end if;
  select jsonb_build_object(
    'ca_mois',(select coalesce(sum(total),0) from co_factures where espace_id=p_espace and type='facture' and statut not in ('annulee','brouillon') and date_emission>=d1 and date_emission<d2),
    'encaisse_mois',(select coalesce(sum(montant),0) from co_reglements where espace_id=p_espace and mode<>'assurance' and date_reglement>=d1 and date_reglement<d2),
    'encaisse_jour',(select coalesce(sum(montant),0) from co_reglements where espace_id=p_espace and mode<>'assurance' and date_reglement=current_date),
    'impayes',(select coalesce(sum(total_client-paye),0) from co_factures where espace_id=p_espace and type='facture' and statut in ('emise','partielle') and date_emission<=current_date),
    'nb_impayes',(select count(*) from co_factures where espace_id=p_espace and type='facture' and statut in ('emise','partielle') and date_emission<=current_date),
    'a_venir',(select coalesce(sum(total_client-paye),0) from co_factures where espace_id=p_espace and type='facture' and statut in ('emise','partielle') and date_emission>current_date),
    'en_retard',(select coalesce(sum(total_client-paye),0) from co_factures where espace_id=p_espace and type='facture' and statut in ('emise','partielle') and date_echeance<current_date),
    'nb_retard',(select count(*) from co_factures where espace_id=p_espace and type='facture' and statut in ('emise','partielle') and date_echeance<current_date),
    'depenses_mois',(select coalesce(sum(montant),0) from co_depenses where espace_id=p_espace and date_depense>=d1 and date_depense<d2),
    'nb_clients',(select count(*) from co_clients where espace_id=p_espace and actif),
    'clients_cat',(select coalesce(jsonb_object_agg(categorie,n),'{}'::jsonb) from (select categorie,count(*) n from co_clients where espace_id=p_espace and actif group by 1) x),
    'clients_a_jour',(select count(*) from co_clients c where c.espace_id=p_espace and c.actif and not exists(select 1 from co_factures f where f.client_id=c.id and f.type='facture' and f.statut in ('emise','partielle') and f.date_echeance<current_date)),
    'rdv_jour',(select count(*) from co_rdv where espace_id=p_espace and statut not in ('annule','absent') and debut::date<=current_date and fin::date>=current_date),
    'rdv_demandes',(select count(*) from co_rdv where espace_id=p_espace and statut='demande'),
    'rdv_semaine',(select count(*) from co_rdv where espace_id=p_espace and statut not in ('annule','absent') and debut>=now() and debut<now()+interval '7 days'),
    'nb_ressources',(select count(*) from co_ressources where espace_id=p_espace and actif),
    'ressources_statut',(select coalesce(jsonb_object_agg(statut,n),'{}'::jsonb) from (select statut,count(*) n from co_ressources where espace_id=p_espace and actif group by 1) x),
    'ressources_occupees',(select count(distinct ressource_id) from co_rdv where espace_id=p_espace and ressource_id is not null and statut in ('confirme','en_cours','prevu') and debut<=now() and fin>now()),
    'recette_ressource',(select coalesce(jsonb_agg(x order by (x->>'montant')::numeric desc),'[]'::jsonb) from (
        select jsonb_build_object('id',r.id,'nom',r.nom,'montant',coalesce(sum(f.total),0),
          'depenses',(select coalesce(sum(montant),0) from co_depenses d where d.ressource_id=r.id and d.date_depense>=d1 and d.date_depense<d2)) x
        from co_ressources r left join co_factures f on f.ressource_id=r.id and f.type='facture' and f.statut not in ('annulee','brouillon') and f.date_emission>=d1 and f.date_emission<d2
        where r.espace_id=p_espace and r.actif group by r.id limit 50) y),
    'alertes_echeances',(select coalesce(jsonb_agg(jsonb_build_object('id',id,'nom',nom,'cle',k,'date',v)),'[]'::jsonb) from (
        select r.id,r.nom,kv.key k,kv.value v from co_ressources r, jsonb_each_text(r.champs) kv
        where r.espace_id=p_espace and r.actif and right(kv.key,4)='_fin' and kv.value ~ '^\d{4}-\d{2}-\d{2}$' and kv.value::date <= current_date+30) z)
  ) into r;
  return r;
end $fn$;

-- Activer / désactiver un module (Stock et RH restent inclus dans le pack)
create or replace function public.co_activer_module(p_espace uuid, p_module text, p_actif boolean) returns jsonb
 language plpgsql security definer set search_path to 'public' as $fn$
declare v_code text; p licences;
begin
  if not est_gerant(p_espace) then raise exception 'Accès refusé'; end if;
  if p_module !~ '^[a-z_]{2,30}$' then raise exception 'Module invalide'; end if;
  update espaces set modules = modules || jsonb_build_object(p_module, p_actif) where id=p_espace;
  v_code := case p_module when 'stock' then 'stockpro' when 'rh' then 'rhpro' else 'ilano' end;
  select * into p from licences where espace_id=p_espace and inclus_dans is null order by created_at limit 1;
  if p.id is null then raise exception 'Aucune licence'; end if;
  if v_code = p.logiciel then return jsonb_build_object('ok',true); end if;
  if p_actif then
    insert into licences(espace_id,logiciel,formule,statut,date_fin,devise,employes_max,type,inclus_dans,maintenance_fin)
     values (p_espace,v_code,p.formule,p.statut,p.date_fin,p.devise,p.employes_max,p.type,p.logiciel,p.maintenance_fin)
     on conflict (espace_id,logiciel) do nothing;
  elsif v_code <> 'ilano' then
    delete from licences where espace_id=p_espace and logiciel=v_code and inclus_dans is not null;
  end if;
  return jsonb_build_object('ok',true);
end $fn$;

-- Demande de fonctionnalité sur mesure
create or replace function public.co_demander(p_espace uuid, p_titre text, p_description text, p_urgence text default 'normale') returns uuid
 language plpgsql security definer set search_path to 'public' as $fn$
declare v_id uuid;
begin
  if not est_membre(p_espace) then raise exception 'Accès refusé'; end if;
  if (select count(*) from co_demandes where espace_id=p_espace and created_at > now()-interval '1 day') >= 10 then raise exception 'Trop de demandes aujourd''hui. Réessayez demain.'; end if;
  insert into co_demandes(espace_id,membre_id,titre,description,urgence)
   values (p_espace,mon_membre(p_espace),trim(p_titre),trim(p_description),case when p_urgence in ('normale','importante','urgente') then p_urgence else 'normale' end)
   returning id into v_id;
  return v_id;
end $fn$;

create or replace function public.admin_demandes() returns jsonb
 language sql stable security definer set search_path to 'public' as $fn$
  select case when not est_super_admin() then null else coalesce(jsonb_agg(x order by (x->>'created_at') desc),'[]'::jsonb) end from (
   select to_jsonb(d) || jsonb_build_object('espace_nom',e.nom,'espace_slug',e.slug,'modele',e.modele,'devise',e.devise,
     'auteur',m.nom_complet,'telephone',coalesce(m.telephone,e.telephone),
     'email',(select u.email from membres mm join auth.users u on u.id=mm.user_id where mm.espace_id=e.id and mm.role='proprietaire' limit 1)) x
   from co_demandes d join espaces e on e.id=d.espace_id left join membres m on m.id=d.membre_id) s $fn$;

create or replace function public.admin_demande_maj(p_id uuid, p_statut text, p_reponse text default null, p_montant numeric default null) returns void
 language plpgsql security definer set search_path to 'public' as $fn$
declare d co_demandes;
begin
  if not est_super_admin() then raise exception 'Accès refusé'; end if;
  update co_demandes set statut=p_statut, reponse=coalesce(p_reponse,reponse), montant_devis=coalesce(p_montant,montant_devis), maj_le=now()
   where id=p_id returning * into d;
  if d.id is not null and p_reponse is not null then
    perform co_notifier(d.espace_id,'Réponse à votre demande : '||left(d.titre,120),p_reponse,'demandes','demande',d.membre_id,null);
  end if;
end $fn$;

-- ---------- Réservation publique (lien à partager) ----------
create or replace function public.co_public_infos(p_slug text) returns jsonb
 language sql stable security definer set search_path to 'public' as $fn$
  select jsonb_build_object('nom',e.nom,'logo_url',e.logo_url,'couleur',e.couleur_principale,'telephone',e.telephone,'adresse',e.adresse,
    'modele',e.modele,'langue',e.langue,'devise',e.devise,'reglages',jsonb_build_object('horaires',e.reglages->'horaires','pas_min',e.reglages->'pas_min'),
    'prestations',(select coalesce(jsonb_agg(jsonb_build_object('id',p.id,'nom',p.nom,'prix',p.prix,'duree_min',p.duree_min,'categorie',p.categorie,'description',p.description) order by p.categorie nulls first,p.nom),'[]'::jsonb)
       from co_prestations p where p.espace_id=e.id and p.actif and p.publique),
    'ressources',(select coalesce(jsonb_agg(jsonb_build_object('id',r.id,'nom',r.nom,'categorie',r.categorie,'prix',r.prix,'capacite',r.capacite) order by r.categorie,r.nom),'[]'::jsonb)
       from co_ressources r where r.espace_id=e.id and r.actif and coalesce((r.champs->>'reservable')::boolean,true) and e.modele in ('hotel')),
    'equipe',(select coalesce(jsonb_agg(jsonb_build_object('id',m.id,'nom',split_part(m.nom_complet,' ',1)) order by m.nom_complet),'[]'::jsonb)
       from membres m where m.espace_id=e.id and m.actif and m.role in ('vendeur','gerant','proprietaire') and e.modele in ('beaute','clinique')
       and coalesce((e.reglages->'equipe_publique'->>(m.id::text))::boolean,true)))
  from espaces e
  where e.slug=lower(p_slug) and e.statut in ('essai','actif') and a_logiciel(e.id,'ilano')
    and coalesce((e.modules->>'reservation')::boolean,true) $fn$;

create or replace function public.co_public_occupation(p_slug text, p_du timestamptz, p_au timestamptz) returns jsonb
 language sql stable security definer set search_path to 'public' as $fn$
  select coalesce(jsonb_agg(jsonb_build_object('r',r.ressource_id,'m',r.membre_id,'d',r.debut,'f',r.fin)),'[]'::jsonb)
  from co_rdv r join espaces e on e.id=r.espace_id
  where e.slug=lower(p_slug) and e.statut in ('essai','actif') and r.statut not in ('annule','absent')
    and r.debut < p_au and r.fin > p_du and p_au - p_du <= interval '62 days' $fn$;

create or replace function public.co_public_reserver(p_slug text, p_nom text, p_telephone text, p_email text,
  p_debut timestamptz, p_fin timestamptz, p_prestation uuid default null, p_ressource uuid default null,
  p_membre uuid default null, p_note text default null) returns jsonb
 language plpgsql security definer set search_path to 'public' as $fn$
declare e espaces; v_cli uuid; v_id uuid; v_tel text := regexp_replace(coalesce(p_telephone,''),'[^0-9+]','','g'); v_titre text; v_mt numeric := 0;
begin
  select * into e from espaces where slug=lower(p_slug) and statut in ('essai','actif');
  if e.id is null or not a_logiciel(e.id,'ilano') or not coalesce((e.modules->>'reservation')::boolean,true) then raise exception 'Réservation indisponible'; end if;
  if length(trim(coalesce(p_nom,''))) < 2 or length(p_nom) > 120 then raise exception 'Nom requis'; end if;
  if length(v_tel) < 8 or length(v_tel) > 20 then raise exception 'Téléphone requis'; end if;
  if p_debut < now() - interval '1 hour' or p_fin <= p_debut or p_fin - p_debut > interval '60 days' or p_debut > now() + interval '400 days' then raise exception 'Dates invalides'; end if;
  if (select count(*) from co_rdv r join co_clients c on c.id=r.client_id where r.espace_id=e.id and r.source='public' and c.telephone=v_tel and r.created_at > now()-interval '1 day') >= 3
     or (select count(*) from co_rdv where espace_id=e.id and source='public' and created_at > now()-interval '1 hour') >= 30 then
    raise exception 'Trop de demandes. Contactez-nous directement.'; end if;
  if p_prestation is not null then select nom, prix into v_titre, v_mt from co_prestations where id=p_prestation and espace_id=e.id and actif and publique;
    if v_titre is null then raise exception 'Prestation introuvable'; end if; end if;
  if p_ressource is not null then
    if not exists(select 1 from co_ressources where id=p_ressource and espace_id=e.id and actif) then raise exception 'Choix introuvable'; end if;
    if exists(select 1 from co_rdv where ressource_id=p_ressource and statut not in ('annule','absent','termine') and debut<p_fin and fin>p_debut) then raise exception 'Ce choix n''est plus disponible à ces dates'; end if;
    select coalesce(v_titre,nom) into v_titre from co_ressources where id=p_ressource;
  end if;
  if p_membre is not null then
    if not exists(select 1 from membres where id=p_membre and espace_id=e.id and actif) then raise exception 'Choix introuvable'; end if;
    if exists(select 1 from co_rdv where membre_id=p_membre and statut not in ('annule','absent','termine') and debut<p_fin and fin>p_debut) then raise exception 'Ce créneau vient d''être pris. Choisissez une autre heure.'; end if;
  end if;
  select id into v_cli from co_clients where espace_id=e.id and telephone=v_tel limit 1;
  if v_cli is null then
    insert into co_clients(espace_id,categorie,nom,telephone,email)
     values (e.id, case e.modele when 'clinique' then 'patient' else 'client' end, trim(p_nom), v_tel, nullif(left(trim(coalesce(p_email,'')),160),'')) returning id into v_cli;
  end if;
  insert into co_rdv(espace_id,client_id,ressource_id,prestation_id,membre_id,titre,debut,fin,statut,montant,note,source)
   values (e.id,v_cli,p_ressource,p_prestation,p_membre,left(coalesce(v_titre,'Réservation en ligne'),200),p_debut,p_fin,'demande',coalesce(v_mt,0),left(p_note,1000),'public')
   returning id into v_id;
  perform co_notifier(e.id,'Nouvelle demande en ligne : '||trim(p_nom),coalesce(v_titre,'')||' · '||to_char(p_debut at time zone 'Africa/Abidjan','DD/MM/YYYY HH24:MI')||' · '||v_tel,'agenda','reservation',null,null);
  return jsonb_build_object('ok',true,'id',v_id);
end $fn$;
grant execute on function public.co_public_infos(text) to anon, authenticated;
grant execute on function public.co_public_occupation(text,timestamptz,timestamptz) to anon, authenticated;
grant execute on function public.co_public_reserver(text,text,text,text,timestamptz,timestamptz,uuid,uuid,uuid,text) to anon, authenticated;

-- ---------- Alertes quotidiennes ----------
create or replace function public.co_generer_alertes() returns void
 language plpgsql security definer set search_path to 'public' as $fn$
begin
  -- factures en retard (une alerte par facture et par semaine)
  insert into co_notifications(espace_id,type,titre,message,lien,cle)
  select f.espace_id,'impaye','Facture en retard : '||f.numero,
     coalesce(c.nom,'')||' · reste '||(f.total_client-f.paye)::bigint||' · échéance '||to_char(f.date_echeance,'DD/MM/YYYY'),'factures',
     'retard-'||f.id||'-'||to_char(current_date,'IYYY-IW')
  from co_factures f left join co_clients c on c.id=f.client_id
  where f.type='facture' and f.statut in ('emise','partielle') and f.date_echeance < current_date
  on conflict (espace_id,cle) where cle is not null do nothing;
  -- échéances des ressources (assurance, visite technique, bail…) dans 15 jours
  insert into co_notifications(espace_id,type,titre,message,lien,cle)
  select r.espace_id,'echeance',r.nom||' : échéance le '||to_char(kv.value::date,'DD/MM/YYYY'),kv.key,'ressources','ech-'||r.id||'-'||kv.key||'-'||kv.value
  from co_ressources r, jsonb_each_text(r.champs) kv
  where r.actif and right(kv.key,4)='_fin' and kv.value ~ '^\d{4}-\d{2}-\d{2}$' and kv.value::date between current_date and current_date+15
  on conflict (espace_id,cle) where cle is not null do nothing;
  -- rendez-vous de demain
  insert into co_notifications(espace_id,membre_id,type,titre,message,lien,cle)
  select r.espace_id,r.membre_id,'rappel','Demain : '||coalesce(r.titre,'rendez-vous'),coalesce(c.nom,'')||' · '||to_char(r.debut at time zone 'Africa/Abidjan','HH24:MI'),'agenda','demain-'||r.id
  from co_rdv r left join co_clients c on c.id=r.client_id
  where r.statut in ('prevu','confirme') and r.debut::date = current_date+1
  on conflict (espace_id,cle) where cle is not null do nothing;
  delete from co_notifications where lu and created_at < now()-interval '90 days';
end $fn$;
revoke execute on function public.co_generer_alertes() from public, anon, authenticated;
select cron.schedule('co-alertes','30 0 * * *','select public.co_generer_alertes()')
 where not exists (select 1 from cron.job where jobname='co-alertes');

-- SMS : quota par pack (50 / 200 / 1 000), utilisé par la fonction « notifier »
create or replace function public.co_sms_quota(p_espace uuid) returns jsonb
 language sql stable security definer set search_path to 'public' as $fn$
  select jsonb_build_object('quota', case coalesce((select formule from licences where espace_id=p_espace and inclus_dans is null order by created_at limit 1),'essai')
      when 'essai' then 20 when 'demarrage' then 50 when 'starter' then 50 when 'pme' then 200 when 'business' then 200
      when 'croissance' then 1000 when 'premium' then 1000 when 'entreprise' then 5000 else 50 end
      + coalesce((select (reglages->>'sms_bonus')::int from espaces where id=p_espace),0),
    'utilises', coalesce((select nb from co_sms where espace_id=p_espace and mois=to_char(current_date,'YYYY-MM')),0)) $fn$; $fn$;

-- ---------- Droits d'exécution ----------
revoke execute on function public.co_numero(uuid,text) from public, anon;
grant execute on function public.co_numero(uuid,text) to authenticated;
revoke execute on function public.co_sms_quota(uuid) from public, anon, authenticated;
do $do$ declare f text; begin
  foreach f in array array['co_encaisser(uuid,numeric,text,text,date)','co_convertir_devis(uuid)','co_creer_echeancier(uuid,uuid,text,text,jsonb,uuid,numeric)',
    'co_ressource_statut(uuid,text)','co_rdv_statut(uuid,text,text)','co_activer_module(uuid,text,boolean)','co_demander(uuid,text,text,text)',
    'co_resume(uuid)','admin_demandes()','admin_demande_maj(uuid,text,text,numeric)','mon_role(uuid)'] loop
    execute format('revoke execute on function public.%s from public, anon; grant execute on function public.%s to authenticated;', f, f);
  end loop; end $do$;

-- ---------- mes_espaces : licences incluses + taille de l'équipe ----------
create or replace function public.mes_espaces()
 returns jsonb language sql stable security definer set search_path to 'public' as $fn$
  select coalesce(jsonb_agg(jsonb_build_object(
    'espace', to_jsonb(e), 'membre', to_jsonb(m),
    'logiciels', (select coalesce(jsonb_agg(l.logiciel order by l.logiciel),'[]'::jsonb) from licences l
                  where l.espace_id=e.id and ((l.statut in ('essai','actif') and (l.date_fin is null or l.date_fin>=current_date)) or l.statut='lecture_seule')),
    'lecture_seule', (select coalesce(jsonb_agg(l.logiciel),'[]'::jsonb) from licences l where l.espace_id=e.id and l.statut='lecture_seule'),
    'licences', (select coalesce(jsonb_agg(jsonb_build_object('logiciel',l.logiciel,'type',l.type,'formule',l.formule,'statut',l.statut,
                  'date_fin',l.date_fin,'maintenance_fin',l.maintenance_fin,'employes_max',l.employes_max,'inclus_dans',l.inclus_dans)),'[]'::jsonb) from licences l where l.espace_id=e.id),
    'taille', greatest((select count(*) from membres mm where mm.espace_id=e.id and mm.actif),
                       (select count(*) from rh_employes r where r.espace_id=e.id and r.statut='actif'))
  )),'[]'::jsonb)
  from membres m join espaces e on e.id=m.espace_id
  where m.user_id=auth.uid() and m.actif
$fn$;

-- ---------- Durcissement (conseils de sécurité Supabase) ----------
revoke execute on function public.co_avant_facture() from public, anon, authenticated;
revoke execute on function public.co_avant_rdv() from public, anon, authenticated;
revoke execute on function public.co_sync_licences() from public, anon, authenticated;
revoke execute on function public.co_lecture(uuid) from public, anon;
revoke execute on function public.co_ecriture(uuid) from public, anon;
revoke execute on function public.co_gestion(uuid) from public, anon;
revoke execute on function public.co_gestion_lecture(uuid) from public, anon;
grant execute on function public.co_lecture(uuid), public.co_ecriture(uuid), public.co_gestion(uuid), public.co_gestion_lecture(uuid) to authenticated;
alter function public.co_fige_espace() set search_path to 'public';
