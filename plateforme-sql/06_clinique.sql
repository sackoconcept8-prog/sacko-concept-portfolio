-- Ilano · métier Clinique : équipe médicale, consultations (dossier patient, ordonnances),
-- hospitalisations (lits), gardes, honoraires des médecins.

create table if not exists cl_soignants (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  membre_id uuid references membres(id) on delete set null,
  nom text not null check (length(trim(nom)) between 1 and 120),
  fonction text not null default 'medecin' check (fonction in ('medecin','infirmier','sage_femme','laborantin','pharmacien','aide_soignant','administratif','autre')),
  specialite text check (length(specialite) <= 80),
  telephone text check (length(telephone) <= 40),
  mode_paie text not null default 'salaire' check (mode_paie in ('salaire','pourcentage','par_acte')),
  taux numeric not null default 0 check (taux >= 0),
  salaire numeric not null default 0 check (salaire >= 0),
  actif boolean not null default true,
  created_at timestamptz not null default now()
);
create index if not exists cl_soignants_e on cl_soignants(espace_id);

create table if not exists cl_consultations (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  patient_id uuid not null references co_clients(id) on delete cascade,
  soignant_id uuid references cl_soignants(id) on delete set null,
  rdv_id uuid references co_rdv(id) on delete set null,
  date timestamptz not null default now(),
  motif text check (length(motif) <= 500),
  constantes jsonb not null default '{}'::jsonb check (jsonb_typeof(constantes)='object'),
  examen text check (length(examen) <= 4000),
  diagnostic text check (length(diagnostic) <= 2000),
  examens text check (length(examens) <= 2000),
  ordonnance jsonb not null default '[]'::jsonb check (jsonb_typeof(ordonnance)='array' and jsonb_array_length(ordonnance) <= 40),
  prestation_id uuid references co_prestations(id) on delete set null,
  montant numeric not null default 0 check (montant >= 0),
  facture_id uuid references co_factures(id) on delete set null,
  statut text not null default 'terminee' check (statut in ('en_attente','en_cours','terminee')),
  note text check (length(note) <= 2000),
  created_by uuid,
  created_at timestamptz not null default now()
);
create index if not exists cl_consultations_e on cl_consultations(espace_id, date desc);
create index if not exists cl_consultations_p on cl_consultations(patient_id);

create table if not exists cl_hospitalisations (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  patient_id uuid not null references co_clients(id) on delete cascade,
  lit_id uuid references co_ressources(id) on delete set null,
  soignant_id uuid references cl_soignants(id) on delete set null,
  entree timestamptz not null default now(),
  sortie timestamptz,
  motif text check (length(motif) <= 500),
  prix_jour numeric not null default 0 check (prix_jour >= 0),
  statut text not null default 'en_cours' check (statut in ('en_cours','sortie')),
  facture_id uuid references co_factures(id) on delete set null,
  note text check (length(note) <= 2000),
  created_at timestamptz not null default now()
);
create index if not exists cl_hospit_e on cl_hospitalisations(espace_id, statut);

create table if not exists cl_gardes (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  soignant_id uuid not null references cl_soignants(id) on delete cascade,
  jour date not null,
  creneau text not null default 'jour' check (creneau in ('jour','nuit')),
  service text check (length(service) <= 60),
  unique (soignant_id, jour, creneau)
);
create index if not exists cl_gardes_e on cl_gardes(espace_id, jour);

create table if not exists cl_honoraires (
  id uuid primary key default gen_random_uuid(),
  espace_id uuid not null references espaces(id) on delete cascade,
  soignant_id uuid not null references cl_soignants(id) on delete cascade,
  mois text not null check (mois ~ '^\d{4}-\d{2}$'),
  montant numeric not null check (montant >= 0),
  depense_id uuid references co_depenses(id) on delete set null,
  paye_le timestamptz not null default now(),
  unique (soignant_id, mois)
);

-- Les éléments liés doivent appartenir au même espace.
create or replace function cl_verif() returns trigger language plpgsql security definer set search_path=public as $fn$
declare j jsonb := to_jsonb(new); e uuid := new.espace_id;
begin
  if j ? 'patient_id' and (j->>'patient_id') is not null and not exists(select 1 from co_clients where id=(j->>'patient_id')::uuid and espace_id=e) then raise exception 'Patient introuvable'; end if;
  if j ? 'soignant_id' and (j->>'soignant_id') is not null and not exists(select 1 from cl_soignants where id=(j->>'soignant_id')::uuid and espace_id=e) then raise exception 'Soignant introuvable'; end if;
  if j ? 'lit_id' and (j->>'lit_id') is not null and not exists(select 1 from co_ressources where id=(j->>'lit_id')::uuid and espace_id=e) then raise exception 'Lit introuvable'; end if;
  if j ? 'membre_id' and (j->>'membre_id') is not null and not exists(select 1 from membres where id=(j->>'membre_id')::uuid and espace_id=e) then raise exception 'Membre introuvable'; end if;
  if j ? 'prestation_id' and (j->>'prestation_id') is not null and not exists(select 1 from co_prestations where id=(j->>'prestation_id')::uuid and espace_id=e) then raise exception 'Acte introuvable'; end if;
  if j ? 'facture_id' and (j->>'facture_id') is not null and not exists(select 1 from co_factures where id=(j->>'facture_id')::uuid and espace_id=e) then raise exception 'Facture introuvable'; end if;
  if j ? 'depense_id' and (j->>'depense_id') is not null and not exists(select 1 from co_depenses where id=(j->>'depense_id')::uuid and espace_id=e) then raise exception 'Dépense introuvable'; end if;
  if tg_op='UPDATE' and new.espace_id <> old.espace_id then raise exception 'Espace non modifiable'; end if;
  return new;
end $fn$;
revoke execute on function cl_verif() from public, anon, authenticated;

do $do$ declare t text; begin
  foreach t in array array['cl_soignants','cl_consultations','cl_hospitalisations','cl_gardes','cl_honoraires'] loop
    execute format('drop trigger if exists %1$s_verif on %1$s; create trigger %1$s_verif before insert or update on %1$s for each row execute function cl_verif();', t);
    execute format('alter table %s enable row level security', t);
  end loop;
end $do$;

-- Lecture : équipe de l'espace (hors simples employés). Écriture : selon la table.
create policy cl_soignants_l on cl_soignants for select using (co_lecture(espace_id));
create policy cl_soignants_a on cl_soignants for insert with check (co_gestion(espace_id));
create policy cl_soignants_m on cl_soignants for update using (co_gestion(espace_id)) with check (co_gestion(espace_id));
create policy cl_soignants_s on cl_soignants for delete using (co_gestion(espace_id));

create policy cl_consult_l on cl_consultations for select using (co_lecture(espace_id));
create policy cl_consult_a on cl_consultations for insert with check (co_ecriture(espace_id));
create policy cl_consult_m on cl_consultations for update using (co_ecriture(espace_id)) with check (co_ecriture(espace_id));
create policy cl_consult_s on cl_consultations for delete using (co_gestion(espace_id));

create policy cl_hospit_l on cl_hospitalisations for select using (co_lecture(espace_id));
create policy cl_hospit_a on cl_hospitalisations for insert with check (co_ecriture(espace_id));
create policy cl_hospit_m on cl_hospitalisations for update using (co_ecriture(espace_id)) with check (co_ecriture(espace_id));
create policy cl_hospit_s on cl_hospitalisations for delete using (co_gestion(espace_id));

create policy cl_gardes_l on cl_gardes for select using (co_lecture(espace_id));
create policy cl_gardes_a on cl_gardes for insert with check (co_gestion(espace_id));
create policy cl_gardes_m on cl_gardes for update using (co_gestion(espace_id)) with check (co_gestion(espace_id));
create policy cl_gardes_s on cl_gardes for delete using (co_gestion(espace_id));

create policy cl_hono_l on cl_honoraires for select using (co_gestion_lecture(espace_id));
create policy cl_hono_a on cl_honoraires for insert with check (co_gestion(espace_id));
create policy cl_hono_m on cl_honoraires for update using (co_gestion(espace_id)) with check (co_gestion(espace_id));
create policy cl_hono_s on cl_honoraires for delete using (co_gestion(espace_id));

grant select, insert, update, delete on cl_soignants, cl_consultations, cl_hospitalisations, cl_gardes, cl_honoraires to authenticated;
revoke all on cl_soignants, cl_consultations, cl_hospitalisations, cl_gardes, cl_honoraires from anon;

-- Données de démonstration : fonction ilano_demo_clinique(espace) (migration ilano_clinique_2_demo),
-- appelée par ilano_reinitialiser_demos(). Réservée au super administrateur.
