-- Tests de sécurité RH Pro (RLS). Tout est annulé à la fin (exception volontaire) : aucune donnée ne reste.
do $$
declare
  ao uuid:=gen_random_uuid(); ae1 uuid:=gen_random_uuid(); ae2 uuid:=gen_random_uuid();
  bo uuid:=gen_random_uuid(); be uuid:=gen_random_uuid(); co uuid:=gen_random_uuid();
  ea uuid; eb uuid; ec uuid; ma_o uuid; ma1 uuid; ma2 uuid; mb_o uuid; mb1 uuid; mc uuid;
  e1 uuid; e2 uuid; f1 uuid; x1 uuid; x2 uuid; n int; ok text:=''; ko text:=''; t text;
  procedure_dummy int;
begin
  insert into auth.users(id,email,aud,role,instance_id) values
   (ao,'t-ao@test.ilano','authenticated','authenticated','00000000-0000-0000-0000-000000000000'),
   (ae1,'t-ae1@test.ilano','authenticated','authenticated','00000000-0000-0000-0000-000000000000'),
   (ae2,'t-ae2@test.ilano','authenticated','authenticated','00000000-0000-0000-0000-000000000000'),
   (bo,'t-bo@test.ilano','authenticated','authenticated','00000000-0000-0000-0000-000000000000'),
   (be,'t-be@test.ilano','authenticated','authenticated','00000000-0000-0000-0000-000000000000'),
   (co,'t-co@test.ilano','authenticated','authenticated','00000000-0000-0000-0000-000000000000');
  insert into espaces(slug,nom) values ('test-rh-a','Test A') returning id into ea;
  insert into espaces(slug,nom) values ('test-rh-b','Test B') returning id into eb;
  insert into espaces(slug,nom) values ('test-sp-c','Test C') returning id into ec;
  insert into licences(espace_id,logiciel,formule,statut,date_fin) values (ea,'rhpro','essai','essai',current_date+14),(eb,'rhpro','essai','essai',current_date+14),(ec,'stockpro','essai','essai',current_date+14);
  insert into membres(espace_id,user_id,nom_complet,role) values (ea,ao,'Owner A','proprietaire') returning id into ma_o;
  insert into membres(espace_id,user_id,nom_complet,role) values (ea,ae1,'Emp A1','employe') returning id into ma1;
  insert into membres(espace_id,user_id,nom_complet,role) values (ea,ae2,'Emp A2','employe') returning id into ma2;
  insert into membres(espace_id,user_id,nom_complet,role) values (eb,bo,'Owner B','proprietaire') returning id into mb_o;
  insert into membres(espace_id,user_id,nom_complet,role) values (eb,be,'Emp B1','employe') returning id into mb1;
  insert into membres(espace_id,user_id,nom_complet,role) values (ec,co,'Owner C','proprietaire') returning id into mc;
  insert into rh_employes(espace_id,membre_id,prenom,nom,salaire_base) values (ea,ma1,'Awa','Un',100000) returning id into e1;
  insert into rh_employes(espace_id,membre_id,prenom,nom,salaire_base) values (ea,ma2,'Ali','Deux',200000) returning id into e2;
  insert into rh_employes(espace_id,membre_id,prenom,nom,salaire_base) values (eb,mb1,'Bea','Trois',300000) returning id into f1;
  insert into rh_conges(espace_id,employe_id,date_debut,date_fin) values (ea,e1,current_date,current_date+2),(ea,e2,current_date,current_date+2),(eb,f1,current_date,current_date);
  insert into rh_paies(espace_id,employe_id,periode,salaire_base,statut) values (ea,e1,'2026-10',100000,'valide'),(ea,e1,'2026-11',100000,'brouillon'),(ea,e2,'2026-10',200000,'valide');
  insert into rh_documents(espace_id,employe_id,type,numero,titre,contenu,visible_employe) values
   (ea,e1,'attestation','A1','Att','x',true),(ea,e1,'avertissement','A2','Avt','x',false),(ea,e2,'attestation','A3','Att','x',true),(ea,null,'note','N1','Note','x',true);
  insert into rh_explications(espace_id,employe_id,numero,faits) values (ea,e1,'D1','retard') returning id into x1;
  insert into rh_explications(espace_id,employe_id,numero,faits) values (ea,e2,'D2','retard') returning id into x2;
  insert into rh_candidatures(espace_id,nom,email) values (ea,'Cand','c@x.com');

  -- ===== Employé A1 =====
  perform set_config('request.jwt.claims',json_build_object('sub',ae1,'role','authenticated')::text,true); execute 'set local role authenticated';
  select count(*) into n from rh_employes; t:='emp1 voit 1 fiche (la sienne)'; if n=1 then ok:=ok||t||'; '; else ko:=ko||t||' ['||n||']; '; end if;
  select count(*) into n from rh_conges; t:='emp1 voit ses congés seulement'; if n=1 then ok:=ok||t||'; '; else ko:=ko||t||' ['||n||']; '; end if;
  select count(*) into n from rh_paies; t:='emp1 voit 1 fiche de paie validée (pas le brouillon, pas celle d''un collègue)'; if n=1 then ok:=ok||t||'; '; else ko:=ko||t||' ['||n||']; '; end if;
  select count(*) into n from rh_documents; t:='emp1 voit son doc visible + note de service'; if n=2 then ok:=ok||t||'; '; else ko:=ko||t||' ['||n||']; '; end if;
  select count(*) into n from rh_explications; t:='emp1 voit sa demande d''explication'; if n=1 then ok:=ok||t||'; '; else ko:=ko||t||' ['||n||']; '; end if;
  select count(*) into n from rh_candidatures; t:='emp1 ne voit pas les candidatures'; if n=0 then ok:=ok||t||'; '; else ko:=ko||t||'; '; end if;
  update rh_employes set salaire_base=999999 where id=e1; get diagnostics n=row_count; t:='emp1 ne peut pas modifier son salaire'; if n=0 then ok:=ok||t||'; '; else ko:=ko||t||'; '; end if;
  begin insert into rh_employes(espace_id,prenom,nom) values (ea,'X','Y'); ko:=ko||'emp1 a pu créer un employé; '; exception when others then ok:=ok||'emp1 ne peut pas créer d''employé; '; end;
  begin perform rh_repondre_explication(x2,'réponse à la place d''un collègue'); ko:=ko||'emp1 a répondu pour un collègue; '; exception when others then ok:=ok||'emp1 ne peut pas répondre pour un collègue; '; end;
  begin perform rh_repondre_explication(x1,'Je m''excuse pour ce retard.'); ok:=ok||'emp1 répond à sa demande; '; exception when others then ko:=ko||'emp1 ne peut pas répondre ['||sqlerrm||']; '; end;
  begin perform rh_pointer(ea,'arrivee'); ok:=ok||'emp1 pointe son arrivée; '; exception when others then ko:=ko||'pointage emp1 ['||sqlerrm||']; '; end;
  begin perform rh_pointer(ea,'arrivee',e2); ko:=ko||'emp1 a pointé pour un collègue; '; exception when others then ok:=ok||'emp1 ne peut pas pointer pour un collègue; '; end;
  begin perform rh_demander_conge(ea,'conge_paye',current_date+10,current_date+12,'Vacances'); ok:=ok||'emp1 demande un congé; '; exception when others then ko:=ko||'demande congé ['||sqlerrm||']; '; end;
  begin perform rh_signaler(ea,'autre','Test','Un message'); ok:=ok||'emp1 envoie un signalement; '; exception when others then ko:=ko||'signalement ['||sqlerrm||']; '; end;
  begin perform rh_demander_conge(eb,'conge_paye',current_date,current_date,'x'); ko:=ko||'emp1 a demandé un congé chez B; '; exception when others then ok:=ok||'emp1 ne peut rien faire chez B; '; end;
  select count(*) into n from rh_employes where espace_id=eb; t:='emp1 ne voit rien de B'; if n=0 then ok:=ok||t||'; '; else ko:=ko||t||'; '; end if;
  execute 'reset role';

  -- ===== Dirigeant B (autre entreprise) =====
  perform set_config('request.jwt.claims',json_build_object('sub',bo,'role','authenticated')::text,true); execute 'set local role authenticated';
  select count(*) into n from rh_employes; t:='dirigeant B voit uniquement ses employés'; if n=1 then ok:=ok||t||'; '; else ko:=ko||t||' ['||n||']; '; end if;
  select count(*) into n from rh_paies; t:='dirigeant B ne voit aucune paie de A'; if n=0 then ok:=ok||t||'; '; else ko:=ko||t||'; '; end if;
  select count(*) into n from rh_candidatures; t:='dirigeant B ne voit pas les candidatures de A'; if n=0 then ok:=ok||t||'; '; else ko:=ko||t||'; '; end if;
  update rh_employes set salaire_base=1 where espace_id=ea; get diagnostics n=row_count; t:='dirigeant B ne peut pas modifier A'; if n=0 then ok:=ok||t||'; '; else ko:=ko||t||'; '; end if;
  begin insert into rh_employes(espace_id,prenom,nom) values (ea,'Intrus','B'); ko:=ko||'B a créé un employé chez A; '; exception when others then ok:=ok||'B ne peut pas créer chez A; '; end;
  begin insert into rh_conges(espace_id,employe_id,date_debut,date_fin) values (eb,e1,current_date,current_date); ko:=ko||'B a lié un employé de A; '; exception when others then ok:=ok||'B ne peut pas lier un employé de A; '; end;
  t:='tableau de bord de A refusé à B'; if (select rh_resume(ea)) is null then ok:=ok||t||'; '; else ko:=ko||t||'; '; end if;
  execute 'reset role';

  -- ===== Dirigeant A =====
  perform set_config('request.jwt.claims',json_build_object('sub',ao,'role','authenticated')::text,true); execute 'set local role authenticated';
  select count(*) into n from rh_employes; t:='dirigeant A voit ses 2 employés'; if n=2 then ok:=ok||t||'; '; else ko:=ko||t||' ['||n||']; '; end if;
  select count(*) into n from rh_paies; t:='dirigeant A voit toutes ses paies'; if n=3 then ok:=ok||t||'; '; else ko:=ko||t||' ['||n||']; '; end if;
  begin update rh_employes set membre_id=mb1 where id=e1; ko:=ko||'A a lié un compte de B; '; exception when others then ok:=ok||'A ne peut pas lier un compte de B; '; end;
  begin insert into rh_employes(espace_id,prenom,nom) values (ea,'Nouveau','Trois'); ok:=ok||'A ajoute un employé; '; exception when others then ko:=ko||'A ajout ['||sqlerrm||']; '; end;
  if (select rh_resume(ea)->>'effectif')='3' then ok:=ok||'tableau de bord A; '; else ko:=ko||'tableau de bord A; '; end if;
  execute 'reset role';

  -- ===== Limite de formule =====
  update licences set employes_max=3 where espace_id=ea and logiciel='rhpro';
  perform set_config('request.jwt.claims',json_build_object('sub',ao,'role','authenticated')::text,true); execute 'set local role authenticated';
  begin insert into rh_employes(espace_id,prenom,nom) values (ea,'Quatre','Trop'); ko:=ko||'limite de formule ignorée; '; exception when others then ok:=ok||'limite de formule appliquée; '; end;
  execute 'reset role';

  -- ===== Licence achetée, maintenance expirée -> lecture seule =====
  update licences set type='achat', date_fin=null, maintenance_fin=current_date-1, statut='actif', employes_max=null where espace_id=ea and logiciel='rhpro';
  perform expirer_abonnements();
  if (select statut from licences where espace_id=ea and logiciel='rhpro')='lecture_seule' and (select statut from espaces where id=ea)<>'suspendu'
    then ok:=ok||'maintenance expirée => lecture seule (espace non suspendu); '; else ko:=ko||'passage en lecture seule; '; end if;
  perform set_config('request.jwt.claims',json_build_object('sub',ao,'role','authenticated')::text,true); execute 'set local role authenticated';
  select count(*) into n from rh_employes; t:='lecture seule : données visibles'; if n=3 then ok:=ok||t||'; '; else ko:=ko||t||' ['||n||']; '; end if;
  begin insert into rh_employes(espace_id,prenom,nom) values (ea,'Bloque','LS'); ko:=ko||'lecture seule : ajout possible; '; exception when others then ok:=ok||'lecture seule : ajout impossible; '; end;
  update rh_employes set poste='x' where espace_id=ea; get diagnostics n=row_count; t:='lecture seule : modification impossible'; if n=0 then ok:=ok||t||'; '; else ko:=ko||t||'; '; end if;
  if (select logiciels from (select jsonb_array_elements(mes_espaces())->'logiciels' logiciels) s limit 1) ? 'rhpro' then ok:=ok||'lecture seule : RH Pro reste dans le menu; '; else ko:=ko||'menu lecture seule; '; end if;
  execute 'reset role';
  perform set_config('request.jwt.claims',json_build_object('sub',ae1,'role','authenticated')::text,true); execute 'set local role authenticated';
  select count(*) into n from rh_paies; t:='lecture seule : l''employé voit encore ses fiches'; if n=1 then ok:=ok||t||'; '; else ko:=ko||t||' ['||n||']; '; end if;
  begin perform rh_pointer(ea,'depart'); ko:=ko||'lecture seule : pointage possible; '; exception when others then ok:=ok||'lecture seule : pointage bloqué; '; end;
  execute 'reset role';
  -- renouvellement de la maintenance -> réactivation
  perform activer_licence(ea,'rhpro',12,'maintenance',350000,'XOF','test','TEST-MAINT-1');
  if (select statut='actif' and maintenance_fin=current_date+interval '12 months' from licences where espace_id=ea and logiciel='rhpro') then ok:=ok||'renouvellement maintenance => réactivé +12 mois; '; else ko:=ko||'renouvellement maintenance; '; end if;
  update licences set maintenance_fin=current_date+20 where espace_id=ea and logiciel='rhpro';
  perform generer_rappels();
  if exists(select 1 from rappels where espace_id=ea and type='maintenance') then ok:=ok||'rappel 30 j avant échéance créé; '; else ko:=ko||'rappel maintenance; '; end if;

  -- ===== StockPro inchangé =====
  perform set_config('request.jwt.claims',json_build_object('sub',co,'role','authenticated')::text,true); execute 'set local role authenticated';
  if (select sp_resume(ec)) is not null then ok:=ok||'StockPro : tableau de bord OK; '; else ko:=ko||'StockPro sp_resume; '; end if;
  begin insert into sp_articles(espace_id,nom,prix_vente) values (ec,'Test',100); ok:=ok||'StockPro : ajout article OK; '; exception when others then ko:=ko||'StockPro ajout ['||sqlerrm||']; '; end;
  select count(*) into n from rh_employes; t:='client StockPro seul ne voit aucune donnée RH'; if n=0 then ok:=ok||t||'; '; else ko:=ko||t||'; '; end if;
  begin insert into rh_employes(espace_id,prenom,nom) values (ec,'X','Y'); ko:=ko||'client sans licence RH a créé un employé; '; exception when others then ok:=ok||'sans licence RH : création impossible; '; end;
  execute 'reset role';

  -- ===== Visiteur anonyme (candidature) =====
  perform set_config('request.jwt.claims',json_build_object('role','anon')::text,true); execute 'set local role anon';
  begin perform rh_postuler('test-rh-a','Jean Candidat','jean@x.com',null,'Comptable','Bonjour',null); ok:=ok||'candidature publique OK; '; exception when others then ko:=ko||'candidature ['||sqlerrm||']; '; end;
  begin perform rh_postuler('test-sp-c','Jean','j@x.com',null,null,null,null); ko:=ko||'candidature acceptée sans RH Pro; '; exception when others then ok:=ok||'candidature refusée sans RH Pro; '; end;
  begin select count(*) into n from rh_candidatures; ko:=ko||'anonyme lit les candidatures; '; exception when others then ok:=ok||'anonyme ne lit rien; '; end;
  begin perform rh_resume(ea); ko:=ko||'anonyme lit le tableau de bord; '; exception when others then ok:=ok||'anonyme sans tableau de bord; '; end;
  execute 'reset role';

  raise exception E'RESULTATS\nECHECS: %\nREUSSIS: %', coalesce(nullif(ko,''),'aucun'), ok;
end $$;
