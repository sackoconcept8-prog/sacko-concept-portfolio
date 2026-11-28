/* Ilano — métier École : classes, enseignants, matières et coefficients, notes par trimestre,
   bulletins (moyennes, rangs, conduite, appréciations), absences et retards, espace parents. Chargé après socle.js. */
(function () {
  const FONCTIONS = [['enseignant', 'Enseignant(e)', 'Teacher'], ['directeur', 'Directeur / directrice', 'Head teacher'], ['censeur', 'Censeur', 'Deputy head'], ['surveillant', 'Surveillant(e)', 'Supervisor'], ['administratif', 'Administratif', 'Admin staff'], ['autre', 'Autre', 'Other']];
  const NIVEAUX = [['maternelle', 'Maternelle', 'Nursery'], ['primaire', 'Primaire', 'Primary'], ['college', 'Collège', 'Middle school'], ['lycee', 'Lycée', 'High school'], ['superieur', 'Supérieur / formation', 'Higher education'], ['autre', 'Autre', 'Other']];
  const APPREC = [['Excellent trimestre, continuez ainsi.', 'Excellent term, keep it up.'], ['Très bon travail, élève sérieux.', 'Very good work, a serious student.'], ['Bon trimestre, des efforts réguliers.', 'Good term, steady effort.'],
    ['Résultats encourageants, peut mieux faire.', 'Encouraging results, can do better.'], ['Travail moyen, doit redoubler d’efforts.', 'Average work, must try harder.'], ['Trimestre insuffisant, travail à reprendre.', 'Insufficient term, work needs to improve.']];
  const lib = (T, k) => { const x = T.find(t => t[0] === k); return x ? (LANG === 'en' ? x[2] : x[1]) : k };
  const ro = () => coRO();
  const TRI = () => +(window._ecTri || coReg('trimestre') || 1);
  const TRI_L = t => LANG === 'en' ? ['', '1st term', '2nd term', '3rd term'][t] : ['', '1er trimestre', '2e trimestre', '3e trimestre'][t];
  const n2 = v => v == null || v === '' ? '—' : (+v).toLocaleString(LOC(), { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const couleurMoy = v => v == null ? 'var(--mut)' : v >= 14 ? 'var(--p)' : v >= 10 ? '#b54708' : 'var(--rouge)';
  let EC = null, EC_T = 0;
  async function ref(force) {
    if (!force && EC && EC.e === E() && Date.now() - EC_T < 20000) return EC;
    const [cl, ma, co, en] = await Promise.all([
      sb.from('ec_classes').select('*').eq('espace_id', E()).order('ordre').order('nom').then(verif),
      sb.from('ec_matieres').select('*').eq('espace_id', E()).order('ordre').order('nom').then(verif),
      sb.from('ec_cours').select('*').eq('espace_id', E()).then(verif),
      sb.from('ec_enseignants').select('*').eq('espace_id', E()).order('nom').then(verif), coRef(force)]);
    EC = { e: E(), classes: cl, matieres: ma, cours: co, ens: en }; EC_T = Date.now(); return EC;
  }
  const cla = id => EC?.classes.find(x => x.id === id);
  const mat = id => EC?.matieres.find(x => x.id === id);
  const ens = id => EC?.ens.find(x => x.id === id);
  const moi = () => EC?.ens.find(x => x.membre_id && x.membre_id === CTX.membre.id);
  const elevesDe = c => CO_REF.clients.filter(x => x.champs?.classe === c.nom).sort((a, b) => a.nom.localeCompare(b.nom));
  const matieresDe = cid => { const cs = EC.cours.filter(x => x.classe_id === cid); return cs.length ? cs.map(x => ({ ...mat(x.matiere_id), coef: x.coef || mat(x.matiere_id)?.coef, enseignant_id: x.enseignant_id, cours_id: x.id })).filter(x => x.id).sort((a, b) => a.ordre - b.ordre) : EC.matieres.map(m => ({ ...m })) };
  const mesClasses = () => { const m = moi(); if (!m || estGerant()) return EC.classes; const ids = new Set([...EC.classes.filter(c => c.titulaire_id === m.id).map(c => c.id), ...EC.cours.filter(x => x.enseignant_id === m.id).map(x => x.classe_id)]); return EC.classes.filter(c => ids.has(c.id)) };
  const optsClasses = (sel, liste) => (liste || EC.classes).map(c => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${esc(c.nom)}</option>`).join('');
  const triSel = id => `<select id="${id}" style="width:auto">${[1, 2, 3].map(t => `<option value="${t}" ${t === TRI() ? 'selected' : ''}>${esc(TRI_L(t))}</option>`).join('')}</select>`;
  const lierTri = (id, f) => { $('#' + id).onchange = e => { window._ecTri = +e.target.value; f() } };
  const telParent = c => c?.champs?.parent_tel || c?.telephone;
  const resultats = (cid, t) => sb.rpc('ec_resultats', { p_classe: cid, p_trimestre: t }).then(verif);
  const vide = (t, lien) => `<div class="carte vide">${esc(t)}${lien || ''}</div>`;

  /* ---------------- Classes ---------------- */
  async function ecClasses() {
    await ref(true); const g = estGerant() && !ro(), t = TRI();
    const liste = mesClasses();
    const res = await Promise.all(liste.map(c => resultats(c.id, t).catch(() => null)));
    const annee = coReg('annee_scolaire') || '';
    C().innerHTML = entete(esc(L('Classes', 'Classes')) + (annee ? ` <small style="color:var(--mut);font-weight:500">${esc(annee)}</small>` : ''), `${triSel('ek-t')} ${g ? `<button class="btn sec" id="ek-an">${esc(L('Année scolaire', 'School year'))}</button> <button class="btn" id="ek-new">+ ${esc(L('Classe', 'Class'))}</button>` : ''}`) + `
     <div class="kpis"><div class="kpi p"><small>${esc(L('Élèves', 'Students'))}</small><div>${CO_REF.clients.filter(x => liste.some(c => c.nom === x.champs?.classe)).length}</div><small>${liste.length} ${esc(L('classe(s)', 'class(es)'))}</small></div>
      <div class="kpi"><small>${esc(L('Moyenne générale', 'Overall average'))}</small><div>${n2(avg(res.map(r => r?.moyenne_classe)))}</div><small>${esc(TRI_L(t))}</small></div>
      <div class="kpi"><small>${esc(L('Enseignants', 'Teachers'))}</small><div>${EC.ens.filter(x => x.actif && x.fonction === 'enseignant').length}</div></div>
      <div class="kpi"><small>${esc(L('Matières', 'Subjects'))}</small><div>${EC.matieres.length}</div></div></div>
     ${liste.length ? `<div class="co-res">${liste.map((c, i) => { const r = res[i], n = elevesDe(c).length, ti = ens(c.titulaire_id);
       return `<div class="co-carte" data-k="${c.id}" style="cursor:pointer"><div style="display:flex;justify-content:space-between;gap:8px;align-items:flex-start"><h4>${esc(c.nom)}</h4>${rhTag(esc(lib(NIVEAUX, c.niveau)), 'gris')}</div>
        <small>👩‍🏫 ${esc(ti?.nom || L('Pas de titulaire', 'No form teacher'))}</small>
        <small>${n} ${esc(L('élève(s)', 'student(s)'))}${c.capacite ? ' / ' + c.capacite : ''}${c.salle ? ' · ' + esc(c.salle) : ''}</small>
        ${c.capacite ? `<div class="ec-barre"><i style="width:${Math.min(100, Math.round(100 * n / c.capacite))}%"></i></div>` : ''}
        <small>${esc(L('Moyenne de la classe : ', 'Class average: '))}<b style="color:${couleurMoy(r?.moyenne_classe)}">${n2(r?.moyenne_classe)}</b></small></div>` }).join('')}</div>`
       : vide(L('Aucune classe pour le moment.', 'No class yet.'), g ? ` <a href="#" id="ek-new2">+ ${esc(L('Créer une classe', 'Create a class'))}</a>` : '')}
     ${g || estGerant() ? `<h3 style="display:flex;justify-content:space-between;align-items:center">${esc(L('Matières et coefficients', 'Subjects & weights'))}${g ? `<button class="btn sec pt" id="ek-mat">+ ${esc(L('Matière', 'Subject'))}</button>` : ''}</h3>
      <div class="carte"><div class="ec-mats">${EC.matieres.map(m => `<span ${g ? `data-m="${m.id}" style="cursor:pointer"` : ''}>${esc(m.nom)} <b>coef ${m.coef}</b></span>`).join('') || `<small style="color:var(--mut)">${esc(L('Ajoutez vos matières (Français, Mathématiques…) avec leur coefficient.', 'Add your subjects (English, Maths…) with their weight.'))}</small>`}</div>
      <small style="color:var(--mut)">${esc(L('Un coefficient peut aussi être différent pour une classe : ouvrez la classe, puis « Matières et enseignants ».', 'A weight can differ for one class: open the class, then “Subjects & teachers”.'))}</small></div>` : ''}`;
    lierTri('ek-t', ecClasses);
    document.querySelectorAll('[data-k]').forEach(b => b.onclick = () => ecClasse(b.dataset.k));
    ['ek-new', 'ek-new2'].forEach(i => { if ($('#' + i)) $('#' + i).onclick = e => { e.preventDefault(); ecFormClasse() } });
    if ($('#ek-mat')) $('#ek-mat').onclick = () => ecFormMatiere();
    if ($('#ek-an')) $('#ek-an').onclick = ecAnnee;
    document.querySelectorAll('[data-m]').forEach(b => b.onclick = () => ecFormMatiere(mat(b.dataset.m)));
  }
  const avg = a => { const v = a.filter(x => x != null).map(Number); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null };

  function ecAnnee() {
    modale(`<h3>${esc(L('Année scolaire', 'School year'))}</h3>
      <label>${esc(L('Année', 'Year'))}<input name="a" value="${esc(coReg('annee_scolaire') || '')}" placeholder="2026-2027" maxlength="20"></label>
      <label>${esc(L('Trimestre en cours', 'Current term'))}<select name="t">${[1, 2, 3].map(t => `<option value="${t}" ${t === +(coReg('trimestre') || 1) ? 'selected' : ''}>${esc(TRI_L(t))}</option>`).join('')}</select></label>
      <p style="color:var(--mut);font-size:13px">${esc(L('Le trimestre en cours est celui que voient les parents et qui s’ouvre par défaut.', 'The current term is the one parents see and that opens by default.'))}</p>`,
      async f => { const v = Object.fromEntries(new FormData(f)); const r = { ...(CTX.espace.reglages || {}), annee_scolaire: v.a.trim(), trimestre: +v.t };
        CTX.espace = verif(await sb.from('espaces').update({ reglages: r }).eq('id', E()).select().single()); window._ecTri = null; toast(L('Enregistré ✓', 'Saved ✓')); ecClasses() });
  }
  function ecFormClasse(c = { niveau: 'primaire' }) {
    modale(`<h3>${esc(c.id ? c.nom : L('Nouvelle classe', 'New class'))}</h3>
      <div class="deux"><label>${esc(L('Nom de la classe', 'Class name'))} *<input name="nom" required maxlength="40" value="${esc(c.nom || '')}" placeholder="CM2, 6e A…"></label>
       <label>${esc(L('Niveau', 'Level'))}<select name="niveau">${NIVEAUX.map(n => `<option value="${n[0]}" ${n[0] === c.niveau ? 'selected' : ''}>${esc(LANG === 'en' ? n[2] : n[1])}</option>`).join('')}</select></label></div>
      <label>${esc(L('Enseignant titulaire', 'Form teacher'))}<select name="titulaire_id"><option value="">—</option>${EC.ens.filter(x => x.actif).map(x => `<option value="${x.id}" ${x.id === c.titulaire_id ? 'selected' : ''}>${esc(x.nom)}</option>`).join('')}</select></label>
      <div class="deux"><label>${esc(L('Capacité (élèves)', 'Capacity (students)'))}<input type="number" min="0" max="500" name="capacite" value="${c.capacite ?? ''}"></label>
       <label>${esc(L('Salle', 'Room'))}<input name="salle" maxlength="40" value="${esc(c.salle || '')}"></label></div>
      <label>${esc(L('Ordre d’affichage', 'Display order'))}<input type="number" name="ordre" value="${c.ordre ?? EC.classes.length + 1}"></label>
      ${c.id ? `<p style="color:var(--mut);font-size:13px">${esc(L('Si vous renommez la classe, la classe des élèves est mise à jour aussi.', 'Renaming the class also updates its students.'))}</p>` : ''}`,
      async f => { const v = Object.fromEntries(new FormData(f));
        const row = { nom: v.nom.trim(), niveau: v.niveau, titulaire_id: v.titulaire_id || null, capacite: v.capacite ? +v.capacite : null, salle: v.salle || null, ordre: +v.ordre || 0 };
        if (c.id) { verif(await sb.from('ec_classes').update(row).eq('id', c.id));
          if (row.nom !== c.nom) for (const x of elevesDe(c)) await sb.from('co_clients').update({ champs: { ...x.champs, classe: row.nom } }).eq('id', x.id);
        } else verif(await sb.from('ec_classes').insert({ ...row, espace_id: E() }));
        toast(L('Classe enregistrée ✓', 'Class saved ✓')); await ref(true); coRefVider(); c.id ? ecClasse(c.id) : ecClasses() });
  }
  function ecFormMatiere(m = { coef: 1 }) {
    modale(`<h3>${esc(m.id ? m.nom : L('Nouvelle matière', 'New subject'))}</h3>
      <div class="deux"><label>${esc(L('Matière', 'Subject'))} *<input name="nom" required maxlength="60" value="${esc(m.nom || '')}"></label>
       <label>${esc(L('Coefficient', 'Weight'))}<input type="number" step="0.5" min="0.5" max="20" name="coef" value="${m.coef}"></label></div>
      <label>${esc(L('Ordre sur le bulletin', 'Order on report card'))}<input type="number" name="ordre" value="${m.ordre ?? EC.matieres.length + 1}"></label>`,
      async f => { const v = Object.fromEntries(new FormData(f)); const row = { nom: v.nom.trim(), coef: +v.coef || 1, ordre: +v.ordre || 0 };
        if (m.id) verif(await sb.from('ec_matieres').update(row).eq('id', m.id)); else verif(await sb.from('ec_matieres').insert({ ...row, espace_id: E() }));
        toast(L('Enregistré ✓', 'Saved ✓')); await ref(true); ecClasses() });
  }

  async function ecClasse(id) {
    await ref(); const c = cla(id); if (!c) return ecClasses(); const t = TRI(), g = estGerant() && !ro();
    const r = await resultats(id, t), ti = ens(c.titulaire_id), ms = matieresDe(id);
    C().innerHTML = entete(`<a href="#" id="ec-ret" style="color:var(--mut);text-decoration:none">← ${esc(L('Classes', 'Classes'))}</a> / ${esc(c.nom)}`, `${triSel('ec-t')} ${g ? `<button class="btn sec" id="ec-mod">${esc(L('Modifier', 'Edit'))}</button>` : ''}`) + `
     <div class="kpis"><div class="kpi p"><small>${esc(L('Effectif', 'Students'))}</small><div>${r.effectif}${c.capacite ? ' / ' + c.capacite : ''}</div><small>👩‍🏫 ${esc(ti?.nom || '—')}</small></div>
      <div class="kpi"><small>${esc(L('Moyenne de la classe', 'Class average'))}</small><div style="color:${couleurMoy(r.moyenne_classe)}">${n2(r.moyenne_classe)}</div><small>${esc(TRI_L(t))}</small></div>
      <div class="kpi"><small>${esc(L('Admis (≥ 10)', 'Passing (≥ 10)'))}</small><div>${r.eleves.filter(x => x.moyenne >= 10).length} / ${r.eleves.filter(x => x.moyenne != null).length}</div></div>
      <div class="kpi"><small>${esc(L('Absences (année)', 'Absences (year)'))}</small><div>${r.eleves.reduce((a, x) => a + (+x.absences || 0), 0)}</div></div></div>
     <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px">${ro() ? '' : `<button class="btn" id="ec-n">✏️ ${esc(L('Saisir des notes', 'Enter marks'))}</button><button class="btn sec" id="ec-a">🙋 ${esc(L('Faire l’appel', 'Take attendance'))}</button>`}<button class="btn sec" id="ec-b">📄 ${esc(L('Bulletins', 'Report cards'))}</button></div>
     <div class="deux"><div class="carte"><h3 style="margin-top:0">${esc(L('Classement', 'Ranking'))} · ${esc(TRI_L(t))}</h3>
       ${r.eleves.length ? `<div class="rh-liste">${r.eleves.map(x => `<div data-el="${x.id}" style="cursor:pointer"><span>${x.rang ? `<b class="ec-rang">${x.rang}</b>` : '<b class="ec-rang">–</b>'} ${esc(x.nom)}</span><b style="color:${couleurMoy(x.moyenne)}">${n2(x.moyenne)}</b></div>`).join('')}</div>`
         : `<div class="vide">${esc(L('Aucun élève dans cette classe. Inscrivez les élèves dans « Élèves » avec la classe ', 'No student in this class yet. Add students in “Students” with the class '))}${esc(c.nom)}.</div>`}</div>
      <div class="carte"><h3 style="margin-top:0;display:flex;justify-content:space-between;align-items:center">${esc(L('Matières et enseignants', 'Subjects & teachers'))}${g ? `<button class="btn lien pt" id="ec-cours">${esc(L('Modifier', 'Edit'))}</button>` : ''}</h3>
       <div class="rh-liste">${ms.map(m => { const mc = r.matieres.find(z => z.id === m.id); return `<div><span><b>${esc(m.nom)}</b> <small>coef ${m.coef}</small><br><small>${esc(ens(m.enseignant_id)?.nom || '—')}</small></span><small>${esc(L('Moy. ', 'Avg '))}<b style="color:${couleurMoy(mc?.moyenne_classe)}">${n2(mc?.moyenne_classe)}</b></small></div>` }).join('') || `<div class="vide">—</div>`}</div></div></div>`;
    $('#ec-ret').onclick = e => { e.preventDefault(); ecClasses() };
    lierTri('ec-t', () => ecClasse(id));
    if ($('#ec-mod')) $('#ec-mod').onclick = () => ecFormClasse(c);
    if ($('#ec-n')) $('#ec-n').onclick = () => { window._ecNC = id; aller('ec_notes') };
    if ($('#ec-a')) $('#ec-a').onclick = () => { window._ecAC = id; aller('ec_absences') };
    $('#ec-b').onclick = () => { window._ecBC = id; aller('ec_bulletins') };
    if ($('#ec-cours')) $('#ec-cours').onclick = () => ecFormCours(c);
    document.querySelectorAll('[data-el]').forEach(b => b.onclick = () => coFicheClient(b.dataset.el));
  }
  function ecFormCours(c) {
    const cs = EC.cours.filter(x => x.classe_id === c.id);
    modale(`<h3>${esc(L('Matières et enseignants', 'Subjects & teachers'))} · ${esc(c.nom)}</h3>
      <p style="color:var(--mut);font-size:13px;margin-top:-6px">${esc(L('Cochez les matières enseignées dans cette classe, choisissez l’enseignant et, si besoin, un coefficient propre à la classe.', 'Tick the subjects taught in this class, pick the teacher and, if needed, a class-specific weight.'))}</p>
      <div class="ec-cours">${EC.matieres.map(m => { const x = cs.find(z => z.matiere_id === m.id);
        return `<div><label style="flex:1"><input type="checkbox" name="m_${m.id}" ${x || !cs.length ? 'checked' : ''}> ${esc(m.nom)}</label>
         <select name="e_${m.id}" style="max-width:190px"><option value="">${esc(L('Enseignant', 'Teacher'))}</option>${EC.ens.filter(z => z.actif).map(z => `<option value="${z.id}" ${z.id === (x?.enseignant_id || (!cs.length ? c.titulaire_id : '')) ? 'selected' : ''}>${esc(z.nom)}</option>`).join('')}</select>
         <input type="number" step="0.5" min="0.5" max="20" name="c_${m.id}" value="${x?.coef ?? ''}" placeholder="${m.coef}" style="width:70px" title="coef"></div>` }).join('') || `<div class="vide">${esc(L('Ajoutez d’abord des matières.', 'Add subjects first.'))}</div>`}</div>`,
      async f => { const v = Object.fromEntries(new FormData(f));
        const garder = EC.matieres.filter(m => v['m_' + m.id]).map(m => ({ espace_id: E(), classe_id: c.id, matiere_id: m.id, enseignant_id: v['e_' + m.id] || null, coef: v['c_' + m.id] ? +v['c_' + m.id] : null }));
        const ret = cs.filter(x => !v['m_' + x.matiere_id]).map(x => x.id);
        if (ret.length) verif(await sb.from('ec_cours').delete().in('id', ret));
        if (garder.length) verif(await sb.from('ec_cours').upsert(garder, { onConflict: 'classe_id,matiere_id' }));
        toast(L('Enregistré ✓', 'Saved ✓')); await ref(true); ecClasse(c.id) });
    rhModaleLarge();
  }

  /* ---------------- Notes ---------------- */
  async function ecNotes() {
    await ref(true); const liste = mesClasses();
    if (!liste.length) { C().innerHTML = entete(esc(L('Notes', 'Marks'))) + vide(L('Créez d’abord vos classes.', 'Create your classes first.'), estGerant() ? ` <a href="#" onclick="aller('ec_classes');return false">${esc(L('Classes', 'Classes'))} →</a>` : ''); return }
    const cid = liste.some(c => c.id === window._ecNC) ? window._ecNC : liste[0].id; window._ecNC = cid;
    const c = cla(cid), t = TRI(), m = moi();
    let ms = matieresDe(cid); if (m && !estGerant() && c.titulaire_id !== m.id) ms = ms.filter(x => x.enseignant_id === m.id);
    const mid = ms.some(x => x.id === window._ecNM) ? window._ecNM : ms[0]?.id; window._ecNM = mid;
    const el = elevesDe(c);
    const notes = mid ? verif(await sb.from('ec_notes').select('*').eq('classe_id', cid).eq('matiere_id', mid).eq('trimestre', t).order('date')) : [];
    const evals = [...new Map(notes.map(n => [n.libelle + '|' + n.date + '|' + n.sur, { libelle: n.libelle, date: n.date, sur: n.sur }])).values()];
    const cle = v => v.libelle + '|' + v.date + '|' + v.sur;
    const moyEl = id => { const a = notes.filter(n => n.eleve_id === id); return a.length ? a.reduce((s, n) => s + n.note * 20 / n.sur, 0) / a.length : null };
    C().innerHTML = entete(esc(L('Notes', 'Marks')), ro() || !mid ? '' : `<button class="btn" id="en-new">+ ${esc(L('Nouvelle évaluation', 'New assessment'))}</button>`) + `
     <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px"><select id="en-c" style="width:auto">${optsClasses(cid, liste)}</select>
      <select id="en-m" style="width:auto">${ms.map(x => `<option value="${x.id}" ${x.id === mid ? 'selected' : ''}>${esc(x.nom)} (coef ${x.coef})</option>`).join('')}</select>${triSel('en-t')}</div>
     ${!mid ? vide(L('Aucune matière pour cette classe.', 'No subject for this class.')) : !el.length ? vide(L('Aucun élève dans cette classe.', 'No student in this class.')) : `
     <div class="carte" style="overflow-x:auto"><table class="rh-compact ec-grille"><tr><th>${esc(L('Élève', 'Student'))}</th>${evals.map(v => `<th ${ro() ? '' : `data-ev="${esc(cle(v))}" style="cursor:pointer" title="${esc(L('Modifier', 'Edit'))}"`}>${esc(v.libelle)}<br><small>${coDateL(v.date).slice(0, 6)} · /${v.sur}</small></th>`).join('')}<th>${esc(L('Moyenne /20', 'Average /20'))}</th></tr>
      ${el.map(x => `<tr><td>${esc(x.nom)}</td>${evals.map(v => { const n = notes.find(z => z.eleve_id === x.id && cle(z) === cle(v)); return `<td>${n ? (+n.note).toLocaleString(LOC()) : '<small style="color:#98a2b3">—</small>'}</td>` }).join('')}<td><b style="color:${couleurMoy(moyEl(x.id))}">${n2(moyEl(x.id))}</b></td></tr>`).join('')}
      <tr class="ec-moy"><td>${esc(L('Moyenne de la classe', 'Class average'))}</td>${evals.map(v => `<td>${n2(avg(notes.filter(z => cle(z) === cle(v)).map(z => z.note * 20 / z.sur)))}</td>`).join('')}<td><b>${n2(avg(el.map(x => moyEl(x.id))))}</b></td></tr></table>
      ${evals.length ? '' : `<div class="vide">${esc(L('Aucune note ce trimestre. Ajoutez une évaluation (devoir, interrogation, composition).', 'No marks this term. Add an assessment (test, quiz, exam).'))}</div>`}</div>`}`;
    $('#en-c').onchange = e => { window._ecNC = e.target.value; window._ecNM = null; ecNotes() };
    if ($('#en-m')) $('#en-m').onchange = e => { window._ecNM = e.target.value; ecNotes() };
    lierTri('en-t', ecNotes);
    if ($('#en-new')) $('#en-new').onclick = () => ecSaisie(c, mat(mid), el, t, null, []);
    document.querySelectorAll('[data-ev]').forEach(b => b.onclick = () => { const v = evals.find(z => cle(z) === b.dataset.ev); ecSaisie(c, mat(mid), el, t, v, notes.filter(z => cle(z) === b.dataset.ev)) });
  }
  function ecSaisie(c, m, el, t, ev, existantes) {
    modale(`<h3>${esc(ev ? L('Modifier l’évaluation', 'Edit assessment') : L('Nouvelle évaluation', 'New assessment'))} · ${esc(c.nom)} · ${esc(m.nom)}</h3>
      <div class="deux"><label>${esc(L('Intitulé', 'Title'))}<input name="libelle" required maxlength="60" value="${esc(ev?.libelle || '')}" placeholder="${esc(L('Devoir 1, Composition…', 'Test 1, Exam…'))}" list="ev-l"></label>
       <label>${esc(L('Date', 'Date'))}<input type="date" name="date" value="${ev?.date || coAuj()}"></label></div>
      <datalist id="ev-l">${['Interrogation', 'Devoir 1', 'Devoir 2', 'Devoir 3', 'Composition'].map(x => `<option value="${x}">`).join('')}</datalist>
      <label>${esc(L('Noté sur', 'Out of'))}<select name="sur" style="width:auto">${[10, 20, 40, 100].map(s => `<option value="${s}" ${s === +(ev?.sur || 20) ? 'selected' : ''}>${s}</option>`).join('')}</select></label>
      <p style="color:var(--mut);font-size:13px">${esc(L('Laissez vide pour un élève absent. Touche Entrée pour passer à l’élève suivant.', 'Leave blank for an absent student. Press Enter to go to the next student.'))} ${esc(TRI_L(t))}</p>
      <div class="ec-saisie">${el.map(x => { const n = existantes.find(z => z.eleve_id === x.id); return `<label><span>${esc(x.nom)}</span><input type="number" step="0.25" min="0" name="n_${x.id}" value="${n ? n.note : ''}" inputmode="decimal"></label>` }).join('')}</div>
      ${ev ? `<button type="button" class="btn lien pt" id="ev-del" style="color:var(--rouge)">${esc(L('Supprimer cette évaluation', 'Delete this assessment'))}</button>` : ''}`,
      async f => { const v = Object.fromEntries(new FormData(f)), sur = +v.sur;
        const lignes = el.filter(x => v['n_' + x.id] !== '').map(x => ({ espace_id: E(), eleve_id: x.id, classe_id: c.id, matiere_id: m.id, trimestre: t, libelle: v.libelle.trim(), date: v.date, sur, note: +v['n_' + x.id], created_by: CTX.membre.id }));
        if (lignes.some(l => l.note > sur || l.note < 0)) throw new Error(L(`Une note dépasse ${sur}.`, `A mark is above ${sur}.`));
        if (existantes.length) verif(await sb.from('ec_notes').delete().in('id', existantes.map(z => z.id)));
        if (lignes.length) verif(await sb.from('ec_notes').insert(lignes));
        toast(L(`${lignes.length} note(s) enregistrée(s) ✓`, `${lignes.length} mark(s) saved ✓`)); ecNotes() });
    rhModaleLarge();
    const ins = [...document.querySelectorAll('.ec-saisie input')];
    ins.forEach((i, k) => i.onkeydown = e => { if (e.key === 'Enter') { e.preventDefault(); (ins[k + 1] || $('#m-ok')).focus() } });
    if ($('#ev-del')) $('#ev-del').onclick = async () => { if (!confirm(L('Supprimer toutes les notes de cette évaluation ?', 'Delete every mark of this assessment?'))) return;
      try { verif(await sb.from('ec_notes').delete().in('id', existantes.map(z => z.id))); fermer(); toast(L('Évaluation supprimée', 'Assessment deleted')); ecNotes() } catch (e) { toast(erreurMsg(e)) } };
  }

  /* ---------------- Bulletins ---------------- */
  async function ecBulletins() {
    await ref(true); const liste = mesClasses();
    if (!liste.length) { C().innerHTML = entete(esc(L('Bulletins', 'Report cards'))) + vide(L('Créez d’abord vos classes.', 'Create your classes first.')); return }
    const cid = liste.some(c => c.id === window._ecBC) ? window._ecBC : liste[0].id; window._ecBC = cid;
    const c = cla(cid), t = TRI(), r = await resultats(cid, t);
    C().innerHTML = entete(esc(L('Bulletins', 'Report cards')), `<button class="btn" id="eb-all">🖨️ ${esc(L('Imprimer tous les bulletins', 'Print all report cards'))}</button>`) + `
     <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px"><select id="eb-c" style="width:auto">${optsClasses(cid, liste)}</select>${triSel('eb-t')}</div>
     <div class="kpis"><div class="kpi p"><small>${esc(L('Moyenne de la classe', 'Class average'))}</small><div>${n2(r.moyenne_classe)}</div></div>
      <div class="kpi"><small>${esc(L('Meilleure moyenne', 'Top average'))}</small><div>${n2(r.eleves[0]?.moyenne)}</div><small>${esc(r.eleves[0]?.nom || '')}</small></div>
      <div class="kpi"><small>${esc(L('Moyenne ≥ 10', 'Average ≥ 10'))}</small><div>${r.eleves.filter(x => x.moyenne >= 10).length} / ${r.effectif}</div></div>
      <div class="kpi"><small>${esc(L('Appréciations saisies', 'Comments written'))}</small><div>${r.eleves.filter(x => x.appreciation).length} / ${r.effectif}</div></div></div>
     <div class="carte" style="overflow-x:auto"><table class="rh-compact" style="width:100%"><tr><th>${esc(L('Rang', 'Rank'))}</th><th>${esc(L('Élève', 'Student'))}</th><th style="text-align:right">${esc(L('Moyenne', 'Average'))}</th><th style="text-align:right">${esc(L('Conduite', 'Conduct'))}</th><th>${esc(L('Appréciation', 'Comment'))}</th><th></th></tr>
      ${r.eleves.map(x => `<tr><td><b class="ec-rang">${x.rang || '–'}</b></td><td>${esc(x.nom)}<br><small style="color:var(--mut)">${x.absences ? x.absences + ' ' + esc(L('abs.', 'abs.')) : ''}${x.retards ? ' · ' + x.retards + ' ' + esc(L('ret.', 'late')) : ''}</small></td>
        <td style="text-align:right"><b style="color:${couleurMoy(x.moyenne)}">${n2(x.moyenne)}</b></td><td style="text-align:right">${x.conduite ?? '—'}</td><td><small>${esc(x.appreciation || '')}${x.decision ? ' <b>' + esc(x.decision) + '</b>' : ''}</small></td>
        <td style="white-space:nowrap;text-align:right">${ro() ? '' : `<button class="btn lien pt" data-ap="${x.id}">✏️</button>`}<button class="btn lien pt" data-pr="${x.id}">🖨️</button></td></tr>`).join('') || `<tr><td colspan="6" class="vide">—</td></tr>`}</table></div>`;
    $('#eb-c').onchange = e => { window._ecBC = e.target.value; ecBulletins() };
    lierTri('eb-t', ecBulletins);
    $('#eb-all').onclick = () => imprimer(c, r, r.eleves);
    document.querySelectorAll('[data-pr]').forEach(b => b.onclick = () => imprimer(c, r, r.eleves.filter(x => x.id === b.dataset.pr)));
    document.querySelectorAll('[data-ap]').forEach(b => b.onclick = () => ecApprec(r.eleves.find(x => x.id === b.dataset.ap), t, ecBulletins));
  }
  function ecApprec(x, t, apres) {
    modale(`<h3>${esc(x.nom)} · ${esc(TRI_L(t))}</h3>
      <p style="margin-top:-6px">${esc(L('Moyenne : ', 'Average: '))}<b style="color:${couleurMoy(x.moyenne)}">${n2(x.moyenne)}</b>${x.rang ? ' · ' + esc(L('Rang ', 'Rank ')) + x.rang : ''}</p>
      <label>${esc(L('Note de conduite /20', 'Conduct mark /20'))}<input type="number" step="0.5" min="0" max="20" name="conduite" value="${x.conduite ?? ''}"></label>
      <label>${esc(L('Appréciation du conseil de classe', 'Class council comment'))}<textarea name="appreciation" id="ap-t" rows="2" maxlength="500">${esc(x.appreciation || '')}</textarea></label>
      <div class="ec-sugg">${APPREC.map(a => `<button type="button" class="btn sec pt" data-s="${esc(LANG === 'en' ? a[1] : a[0])}">${esc(LANG === 'en' ? a[1] : a[0])}</button>`).join('')}</div>
      <label>${esc(L('Mention / décision', 'Distinction / decision'))}<input name="decision" maxlength="120" value="${esc(x.decision || '')}" list="ap-d"></label>
      <datalist id="ap-d">${['Tableau d’honneur', 'Félicitations', 'Encouragements', 'Avertissement travail', 'Avertissement conduite', 'Admis(e) en classe supérieure', 'Redouble'].map(d => `<option value="${d}">`).join('')}</datalist>`,
      async f => { const v = Object.fromEntries(new FormData(f));
        verif(await sb.from('ec_appreciations').upsert({ espace_id: E(), eleve_id: x.id, trimestre: t, conduite: v.conduite === '' ? null : +v.conduite, appreciation: v.appreciation || null, decision: v.decision || null }, { onConflict: 'eleve_id,trimestre' }));
        toast(L('Enregistré ✓', 'Saved ✓')); apres() });
    document.querySelectorAll('[data-s]').forEach(b => b.onclick = () => { $('#ap-t').value = b.dataset.s });
  }
  function imprimer(c, r, eleves) {
    const e = CTX.espace, ti = ens(c.titulaire_id), annee = coReg('annee_scolaire') || '';
    const corps = eleves.map((x, i) => { const cl = CO_REF.clients.find(z => z.id === x.id);
      let tc = 0, tp = 0;
      const lignes = r.matieres.map(m => { const v = x.notes?.[m.id]; if (v != null) { tc += +m.coef; tp += v * m.coef }
        return `<tr><td>${esc(m.nom)}</td><td class="r">${m.coef}</td><td class="r"><b>${n2(v)}</b></td><td class="r">${v != null ? n2(v * m.coef) : '—'}</td><td class="r">${n2(m.moyenne_classe)}</td><td>${esc(ens(m.enseignant_id)?.nom || '')}</td></tr>` }).join('');
      return `<div style="${i ? 'page-break-before:always;' : ''}"><h1>${esc(L('BULLETIN DE NOTES', 'REPORT CARD'))} — ${esc(TRI_L(r.trimestre).toUpperCase())}${annee ? ' · ' + esc(annee) : ''}</h1>
       <table style="margin-bottom:14px"><tr><td style="border:0;padding:2px 0"><b>${esc(L('Élève', 'Student'))} :</b> ${esc(x.nom)}${cl?.champs?.matricule ? ' — ' + esc(L('Matricule ', 'ID ')) + esc(cl.champs.matricule) : ''}${cl?.champs?.date_naissance ? '<br>' + esc(L('Né(e) le ', 'Born ')) + coDateL(cl.champs.date_naissance) : ''}</td>
        <td style="border:0;padding:2px 0;text-align:right"><b>${esc(L('Classe', 'Class'))} :</b> ${esc(c.nom)} · ${esc(L('Effectif', 'Students'))} : ${r.effectif}<br>${esc(L('Titulaire', 'Form teacher'))} : ${esc(ti?.nom || '—')}</td></tr></table>
       <table><tr><th>${esc(L('Matière', 'Subject'))}</th><th class="r">Coef</th><th class="r">${esc(L('Moyenne /20', 'Average /20'))}</th><th class="r">${esc(L('Moy. × coef', 'Avg × weight'))}</th><th class="r">${esc(L('Moy. classe', 'Class avg'))}</th><th>${esc(L('Professeur', 'Teacher'))}</th></tr>${lignes}
        <tr><td><b>${esc(L('Total', 'Total'))}</b></td><td class="r"><b>${tc}</b></td><td></td><td class="r"><b>${n2(tp)}</b></td><td></td><td></td></tr></table>
       <table style="margin-top:14px"><tr><th>${esc(L('Moyenne générale', 'Overall average'))}</th><th>${esc(L('Rang', 'Rank'))}</th><th>${esc(L('Moyenne de la classe', 'Class average'))}</th><th>${esc(L('Conduite', 'Conduct'))}</th><th>${esc(L('Absences / retards', 'Absences / late'))}</th></tr>
        <tr><td style="font-size:14pt"><b>${n2(x.moyenne)} / 20</b></td><td><b>${x.rang ? x.rang + (x.rang === 1 ? L('er', 'st') : L('e', 'th')) + ' / ' + r.effectif : '—'}</b></td><td>${n2(r.moyenne_classe)}</td><td>${x.conduite != null ? x.conduite + ' / 20' : '—'}</td><td>${x.absences || 0} / ${x.retards || 0}</td></tr></table>
       <p style="margin-top:14px"><b>${esc(L('Appréciation', 'Comment'))} :</b> ${esc(x.appreciation || '')}</p>${x.decision ? `<p><b>${esc(L('Décision', 'Decision'))} :</b> ${esc(x.decision)}</p>` : ''}
       <div class="sig"><span>${esc(L('Le titulaire', 'Form teacher'))}</span><span>${esc(L('Le directeur', 'Head teacher'))}</span><span>${esc(L('Le parent', 'Parent'))}</span></div></div>` }).join('');
    rhPapier(L('Bulletins', 'Report cards') + ' ' + c.nom, corps || '<p>—</p>');
  }

  /* ---------------- Absences ---------------- */
  async function ecAbsences() {
    await ref(true); const liste = mesClasses();
    if (!liste.length) { C().innerHTML = entete(esc(L('Absences', 'Attendance'))) + vide(L('Créez d’abord vos classes.', 'Create your classes first.')); return }
    const cid = liste.some(c => c.id === window._ecAC) ? window._ecAC : liste[0].id; window._ecAC = cid;
    const c = cla(cid), d = window._ecAD || coAuj(), el = elevesDe(c);
    const [jour, rec] = await Promise.all([sb.from('ec_absences').select('*').eq('espace_id', E()).eq('date', d).then(verif),
      sb.from('ec_absences').select('*').eq('espace_id', E()).gte('date', new Date(Date.now() - 30 * 864e5).toISOString().slice(0, 10)).order('date', { ascending: false }).limit(300).then(verif)]);
    const etat = id => jour.find(x => x.eleve_id === id)?.type || 'present';
    const auj = jour.filter(x => x.type === 'absence').length;
    C().innerHTML = entete(esc(L('Absences et retards', 'Absences & late arrivals'))) + `
     <div class="kpis"><div class="kpi p"><small>${esc(L('Absents ce jour', 'Absent that day'))}</small><div>${auj}</div><small>${esc(L('toutes classes', 'all classes'))}</small></div>
      <div class="kpi"><small>${esc(L('Retards ce jour', 'Late that day'))}</small><div>${jour.filter(x => x.type === 'retard').length}</div></div>
      <div class="kpi"><small>${esc(L('Absences sur 30 jours', 'Absences, 30 days'))}</small><div>${rec.filter(x => x.type === 'absence').length}</div></div>
      <div class="kpi"><small>${esc(L('Non justifiées', 'Not excused'))}</small><div>${rec.filter(x => !x.justifiee).length}</div></div></div>
     <div class="deux"><div class="carte"><h3 style="margin-top:0">🙋 ${esc(L('Faire l’appel', 'Take attendance'))}</h3>
       <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px"><select id="ea-c" style="width:auto">${optsClasses(cid, liste)}</select><input type="date" id="ea-d" value="${d}" style="width:auto"></div>
       ${el.length ? `<div class="ec-appel">${el.map(x => `<div><span>${esc(x.nom)}</span><span class="ec-seg" data-e="${x.id}">${[['present', L('Présent', 'Present')], ['absence', L('Absent', 'Absent')], ['retard', L('Retard', 'Late')]].map(([k, t]) => `<button type="button" data-v="${k}" class="${etat(x.id) === k ? 'on ' + k : ''}" ${ro() ? 'disabled' : ''}>${esc(t)}</button>`).join('')}</span></div>`).join('')}</div>
        ${ro() ? '' : `<button class="btn" id="ea-ok" style="margin-top:12px">${esc(L('Enregistrer l’appel', 'Save attendance'))}</button>`}` : `<div class="vide">${esc(L('Aucun élève dans cette classe.', 'No student in this class.'))}</div>`}</div>
      <div class="carte"><h3 style="margin-top:0">${esc(L('30 derniers jours', 'Last 30 days'))}</h3>
       <div class="rh-liste">${rec.slice(0, 40).map(x => { const e = coCli(x.eleve_id), tel = telParent(e);
         return `<div><span><b>${esc(e?.nom || '—')}</b> <small>${esc(e?.champs?.classe || '')}</small><br><small>${coDateL(x.date)} · ${esc(x.type === 'retard' ? L('Retard', 'Late') : L('Absence', 'Absence'))}${x.motif ? ' · ' + esc(x.motif) : ''}</small></span>
          <span style="text-align:right;white-space:nowrap">${x.justifiee ? rhTag(L('Justifiée', 'Excused'), 'gris') : `${ro() ? '' : `<button class="btn lien pt" data-j="${x.id}">${esc(L('Justifier', 'Excuse'))}</button>`}`}${tel ? ` <a class="btn sec pt" target="_blank" href="https://wa.me/${coTel(tel)}?text=${encodeURIComponent(L(`Bonjour, nous vous informons que ${e.nom} a été ${x.type === 'retard' ? 'en retard' : 'absent(e)'} le ${coDateL(x.date)}. Merci de nous en indiquer le motif. ${CTX.espace.nom}`, `Hello, ${e.nom} was ${x.type === 'retard' ? 'late' : 'absent'} on ${coDateL(x.date)}. Please let us know the reason. ${CTX.espace.nom}`))}">WhatsApp</a>` : ''}</span></div>` }).join('') || `<div class="vide">${esc(L('Aucune absence', 'No absence'))}</div>`}</div></div></div>`;
    $('#ea-c').onchange = e => { window._ecAC = e.target.value; ecAbsences() };
    $('#ea-d').onchange = e => { window._ecAD = e.target.value; ecAbsences() };
    document.querySelectorAll('.ec-seg button').forEach(b => b.onclick = () => { b.parentNode.querySelectorAll('button').forEach(x => x.className = ''); b.className = 'on ' + b.dataset.v });
    if ($('#ea-ok')) $('#ea-ok').onclick = async () => { $('#ea-ok').disabled = true;
      try { const ids = el.map(x => x.id), avant = jour.filter(x => ids.includes(x.eleve_id));
        const choix = [...document.querySelectorAll('.ec-seg')].map(s => ({ id: s.dataset.e, v: s.querySelector('button.on')?.dataset.v || 'present' }));
        const suppr = avant.filter(a => choix.find(z => z.id === a.eleve_id)?.v !== a.type).map(a => a.id);
        if (suppr.length) verif(await sb.from('ec_absences').delete().in('id', suppr));
        const ajout = choix.filter(z => z.v !== 'present' && !avant.some(a => a.eleve_id === z.id && a.type === z.v)).map(z => ({ espace_id: E(), eleve_id: z.id, date: d, type: z.v }));
        if (ajout.length) verif(await sb.from('ec_absences').insert(ajout));
        toast(L('Appel enregistré ✓', 'Attendance saved ✓')); ecAbsences() } catch (e) { toast(erreurMsg(e)); $('#ea-ok').disabled = false } };
    document.querySelectorAll('[data-j]').forEach(b => b.onclick = () => modale(`<h3>${esc(L('Justifier', 'Excuse'))}</h3><label>${esc(L('Motif', 'Reason'))}<input name="motif" maxlength="200" placeholder="${esc(L('Maladie, rendez-vous…', 'Illness, appointment…'))}"></label>`,
      async f => { verif(await sb.from('ec_absences').update({ justifiee: true, motif: new FormData(f).get('motif') || null }).eq('id', b.dataset.j)); toast(L('Justifiée ✓', 'Excused ✓')); ecAbsences() }));
  }

  /* ---------------- Enseignants et personnel ---------------- */
  async function ecEnseignants() {
    await ref(true); const g = estGerant() && !ro(), mois = coAuj().slice(0, 7);
    const dep = estGerant() ? verif(await sb.from('co_depenses').select('libelle').eq('espace_id', E()).gte('date_depense', mois + '-01')) : [];
    const verse = x => dep.some(d => d.libelle === libSal(x, mois));
    const parF = FONCTIONS.map(f => [f, EC.ens.filter(s => s.fonction === f[0])]).filter(([, l]) => l.length);
    C().innerHTML = entete(esc(L('Enseignants et personnel', 'Teachers & staff')), g ? `<button class="btn" id="ee-new">+ ${esc(L('Ajouter', 'Add'))}</button>` : '') + `
     ${estGerant() ? `<div class="kpis"><div class="kpi p"><small>${esc(L('Masse salariale du mois', 'Monthly payroll'))}</small><div>${fmt(EC.ens.filter(x => x.actif).reduce((a, x) => a + +x.salaire, 0))}</div></div>
      <div class="kpi"><small>${esc(L('Déjà versé', 'Paid'))}</small><div>${EC.ens.filter(x => x.actif && verse(x)).length} / ${EC.ens.filter(x => x.actif && x.salaire > 0).length}</div></div>
      <div class="kpi"><small>${esc(L('Enseignants', 'Teachers'))}</small><div>${EC.ens.filter(x => x.actif && x.fonction === 'enseignant').length}</div></div>
      <div class="kpi"><small>${esc(L('Élèves par enseignant', 'Students per teacher'))}</small><div>${EC.ens.filter(x => x.actif && x.fonction === 'enseignant').length ? Math.round(CO_REF.clients.length / EC.ens.filter(x => x.actif && x.fonction === 'enseignant').length) : '—'}</div></div></div>` : ''}
     ${parF.length ? parF.map(([f, l]) => `<h3>${esc(LANG === 'en' ? f[2] : f[1])} (${l.length})</h3><div class="co-res">${l.map(s => { const tit = EC.classes.filter(c => c.titulaire_id === s.id).map(c => c.nom), crs = [...new Set(EC.cours.filter(c => c.enseignant_id === s.id).map(c => cla(c.classe_id)?.nom).filter(Boolean))];
       return `<div class="co-carte" style="${s.actif ? '' : 'opacity:.55'}"><h4>${esc(s.nom)}</h4><small>${esc([s.matieres, s.telephone].filter(Boolean).join(' · '))}</small>
        ${tit.length ? `<small>👩‍🏫 ${esc(L('Titulaire : ', 'Form teacher: '))}<b>${esc(tit.join(', '))}</b></small>` : ''}${crs.length ? `<small>📚 ${esc(L('Enseigne en : ', 'Teaches: '))}${esc(crs.join(', '))}</small>` : ''}
        ${estGerant() && s.salaire ? `<small>${esc(L('Salaire : ', 'Salary: '))}${fmt(s.salaire)} ${verse(s) ? '· ✅ ' + esc(L('versé ce mois', 'paid this month')) : ''}</small>` : ''}${s.membre_id ? `<small>🔑 ${esc(L('A un accès à Ilano', 'Has Ilano access'))}</small>` : ''}
        <div class="bas">${s.telephone ? `<a class="btn sec pt" target="_blank" href="https://wa.me/${coTel(s.telephone)}">WhatsApp</a>` : '<span></span>'}<span>${g && s.salaire && !verse(s) && s.actif ? `<button class="btn pt" data-pay="${s.id}">${esc(L('Verser le salaire', 'Pay salary'))}</button> ` : ''}${g ? `<button class="btn lien pt" data-ee="${s.id}">${esc(L('Modifier', 'Edit'))}</button>` : ''}</span></div></div>` }).join('')}</div>`).join('')
       : vide(L('Ajoutez vos enseignants et votre personnel.', 'Add your teachers and staff.'))}
     ${coMod('rh') ? '' : `<div class="carte" style="margin-top:16px;background:#f6fef9"><b>💼 ${esc(L('Bulletins de paie, congés, pointage ?', 'Payslips, leave, time clock?'))}</b><br><small style="color:var(--mut)">${esc(L('Activez RH Pro dans « Modules et réglages » pour la paie complète du personnel.', 'Turn on HR Pro in “Modules & settings” for full staff payroll.'))}</small></div>`}`;
    if ($('#ee-new')) $('#ee-new').onclick = () => ecFormEns();
    document.querySelectorAll('[data-ee]').forEach(b => b.onclick = () => ecFormEns(ens(b.dataset.ee)));
    document.querySelectorAll('[data-pay]').forEach(b => b.onclick = async () => { const s = ens(b.dataset.pay);
      if (!confirm(L(`Enregistrer le versement de ${fmt(s.salaire)} à ${s.nom} ?`, `Record a payment of ${fmt(s.salaire)} to ${s.nom}?`))) return;
      try { verif(await sb.from('co_depenses').insert({ espace_id: E(), date_depense: coAuj(), categorie: L('Salaires', 'Salaries'), libelle: libSal(s, mois), montant: +s.salaire, mode: 'especes', created_by: CTX.membre.id })); toast(L('Versement enregistré dans les dépenses ✓', 'Payment recorded in expenses ✓')); ecEnseignants() } catch (e) { toast(erreurMsg(e)) } });
  }
  const libSal = (s, mois) => L('Salaire ', 'Salary ') + s.nom + ' — ' + mois;
  function ecFormEns(s = { fonction: 'enseignant', actif: true }) {
    modale(`<h3>${esc(s.id ? s.nom : L('Nouveau membre du personnel', 'New staff member'))}</h3>
      <label>${esc(L('Nom complet', 'Full name'))} *<input name="nom" required maxlength="120" value="${esc(s.nom || '')}" placeholder="M. / Mme …"></label>
      <div class="deux"><label>${esc(L('Fonction', 'Role'))}<select name="fonction">${FONCTIONS.map(f => `<option value="${f[0]}" ${f[0] === s.fonction ? 'selected' : ''}>${esc(LANG === 'en' ? f[2] : f[1])}</option>`).join('')}</select></label>
       <label>${esc(L('Matières enseignées', 'Subjects taught'))}<input name="matieres" maxlength="200" value="${esc(s.matieres || '')}"></label></div>
      <div class="deux"><label>${esc(L('Téléphone', 'Phone'))}<input name="telephone" maxlength="40" value="${esc(s.telephone || '')}"></label>
       <label>${esc(L('Salaire mensuel', 'Monthly salary'))}<input type="number" min="0" step="any" name="salaire" value="${s.salaire || ''}"></label></div>
      <label>${esc(L('Compte Ilano (facultatif)', 'Ilano account (optional)'))}<select name="membre_id"><option value="">—</option>${CO_REF.membres.map(m => `<option value="${m.id}" ${m.id === s.membre_id ? 'selected' : ''}>${esc(m.nom_complet)}</option>`).join('')}</select></label>
      <p style="color:var(--mut);font-size:13px;margin-top:-4px">${esc(L('Relié à un compte, l’enseignant saisit lui-même les notes et fait l’appel de ses classes. Invitez-le d’abord dans « Équipe ».', 'Linked to an account, the teacher enters marks and takes attendance for their classes. Invite them first in “Team”.'))}</p>
      <label><input type="checkbox" name="actif" ${s.actif !== false ? 'checked' : ''}> ${esc(L('Actif', 'Active'))}</label>`,
      async f => { const v = Object.fromEntries(new FormData(f));
        const row = { nom: v.nom.trim(), fonction: v.fonction, matieres: v.matieres || null, telephone: v.telephone || null, salaire: +v.salaire || 0, membre_id: v.membre_id || null, actif: !!v.actif };
        if (s.id) verif(await sb.from('ec_enseignants').update(row).eq('id', s.id)); else verif(await sb.from('ec_enseignants').insert({ ...row, espace_id: E() }));
        toast(L('Enregistré ✓', 'Saved ✓')); await ref(true); ecEnseignants() });
  }

  /* ---------------- Espace parents ---------------- */
  async function ecParents() {
    await ref(true);
    const acces = verif(await sb.from('ec_parents').select('*').eq('espace_id', E()));
    const fam = new Map();
    for (const x of CO_REF.clients) { const t = coTel(x.champs?.parent_tel); if (t.length < 8) continue; const k = t.slice(-8);
      if (!fam.has(k)) fam.set(k, { tel: x.champs.parent_tel, nom: x.champs.parent_nom || '', enfants: [] }); fam.get(k).enfants.push(x) }
    const familles = [...fam.entries()].map(([k, f]) => ({ ...f, k, acc: acces.find(a => a.telephone.slice(-8) === k) })).sort((a, b) => (a.nom || '').localeCompare(b.nom || ''));
    const sansTel = CO_REF.clients.filter(x => coTel(x.champs?.parent_tel).length < 8).length;
    const q = (window._ecPQ || '').toLowerCase();
    const vues = familles.filter(f => !q || [f.nom, f.tel, ...f.enfants.map(e => e.nom)].join(' ').toLowerCase().includes(q));
    C().innerHTML = entete(esc(L('Espace parents', 'Parents’ space'))) + `
     <div class="carte" style="background:#f6fef9;margin-bottom:14px"><b>👨‍👩‍👧 ${esc(L('Chaque famille reçoit un lien personnel et un code à 4 chiffres.', 'Each family gets a personal link and a 4-digit code.'))}</b><br>
      <small style="color:var(--mut)">${esc(L('Le parent y voit, pour tous ses enfants : les notes et moyennes par matière, le rang, la conduite et l’appréciation, les absences, et ce qui reste à payer. Rien à installer : le lien s’ouvre sur son téléphone.', 'Parents see, for all their children: marks and averages per subject, rank, conduct and comments, absences, and what is left to pay. Nothing to install: the link opens on their phone.'))}</small></div>
     <div class="kpis"><div class="kpi p"><small>${esc(L('Familles', 'Families'))}</small><div>${familles.length}</div></div>
      <div class="kpi"><small>${esc(L('Accès envoyés', 'Access sent'))}</small><div>${familles.filter(f => f.acc).length}</div></div>
      <div class="kpi"><small>${esc(L('Parents venus voir', 'Parents who visited'))}</small><div>${familles.filter(f => f.acc?.derniere_visite).length}</div></div>
      <div class="kpi"><small>${esc(L('Élèves sans téléphone parent', 'Students without parent phone'))}</small><div>${sansTel}</div></div></div>
     <input id="ep-q" placeholder="${esc(L('Rechercher un parent ou un élève…', 'Search a parent or a student…'))}" value="${esc(window._ecPQ || '')}" style="margin-bottom:10px">
     <div class="carte"><div class="rh-liste">${vues.map(f => `<div><span><b>${esc(f.nom || L('Parent', 'Parent'))}</b> <small>${esc(f.tel)}</small><br><small>${f.enfants.map(e => esc(e.nom) + ' (' + esc(e.champs?.classe || '?') + ')').join(' · ')}</small>
       ${f.acc ? `<br><small style="color:var(--p)">${f.acc.derniere_visite ? '👁 ' + esc(L('Dernière visite ', 'Last visit ')) + coDateL(f.acc.derniere_visite) : '✓ ' + esc(L('Accès créé', 'Access created'))}</small>` : ''}</span>
       <span style="text-align:right;white-space:nowrap">${ro() ? '' : `<button class="btn pt" data-pe="${f.k}">${esc(f.acc ? L('Renvoyer', 'Resend') : L('Envoyer l’accès', 'Send access'))}</button>`}${f.acc && !ro() ? ` <button class="btn lien pt" data-pn="${f.k}" title="${esc(L('Nouveau lien et nouveau code', 'New link and code'))}">🔄</button>` : ''}</span></div>`).join('') || `<div class="vide">${esc(L('Renseignez le téléphone du parent dans la fiche de chaque élève.', 'Fill in the parent’s phone on each student’s record.'))}</div>`}</div></div>`;
    $('#ep-q').oninput = e => { window._ecPQ = e.target.value; clearTimeout(window._ecPT); window._ecPT = setTimeout(() => ecParents().then(() => { const i = $('#ep-q'); i.focus(); i.setSelectionRange(i.value.length, i.value.length) }), 300) };
    const envoyer = async (k, nouveau) => { const f = familles.find(z => z.k === k);
      if (nouveau && !confirm(L('Créer un nouveau lien et un nouveau code ? L’ancien lien ne marchera plus.', 'Create a new link and code? The old link will stop working.'))) return;
      try { const a = verif(await sb.rpc('ec_parent_acces', { p_espace: E(), p_telephone: f.tel, p_nom: f.nom, p_nouveau_code: !!nouveau }));
        const lien = location.origin + location.pathname.replace(/[^/]*$/, '') + 'parents.html?t=' + a.jeton;
        const msg = L(`Bonjour ${f.nom},\n\n${CTX.espace.nom} vous donne accès à l’espace parents : notes, moyennes, absences et paiements de ${f.enfants.map(e => e.nom.split(' ')[0]).join(', ')}.\n\nLien : ${lien}\nCode : ${a.code}\n\nGardez ce code pour vous.`,
          `Hello ${f.nom},\n\n${CTX.espace.nom} gives you access to the parents’ space: marks, averages, absences and payments for ${f.enfants.map(e => e.nom.split(' ')[0]).join(', ')}.\n\nLink: ${lien}\nCode: ${a.code}\n\nKeep this code private.`);
        window.open('https://wa.me/' + coTel(f.tel) + '?text=' + encodeURIComponent(msg), '_blank'); toast(L('Message prêt dans WhatsApp ✓', 'Message ready in WhatsApp ✓')); ecParents() } catch (e) { toast(erreurMsg(e)) } };
    document.querySelectorAll('[data-pe]').forEach(b => b.onclick = () => envoyer(b.dataset.pe));
    document.querySelectorAll('[data-pn]').forEach(b => b.onclick = () => envoyer(b.dataset.pn, true));
  }

  /* ---------------- Fiche élève et tableau de bord ---------------- */
  async function ecFiche(c, z) {
    if (!z) return;
    try { await ref(); const cl = EC.classes.find(x => x.nom === c.champs?.classe); if (!cl) return;
      const rs = await Promise.all([1, 2, 3].map(t => resultats(cl.id, t)));
      z.innerHTML = `<h4 style="margin:10px 0 4px">📚 ${esc(L('Résultats', 'Results'))} · ${esc(cl.nom)}</h4><div class="ec-tri">${rs.map((r, i) => { const x = r.eleves.find(e => e.id === c.id);
        return `<div><small>${esc(TRI_L(i + 1))}</small><b style="color:${couleurMoy(x?.moyenne)}">${n2(x?.moyenne)}</b><small>${x?.rang ? esc(L('Rang ', 'Rank ')) + x.rang + ' / ' + r.effectif : '—'}</small></div>` }).join('')}</div>
        <small style="color:var(--mut)">${esc(L('Absences : ', 'Absences: '))}${rs[0].eleves.find(e => e.id === c.id)?.absences || 0} · ${esc(L('Retards : ', 'Late: '))}${rs[0].eleves.find(e => e.id === c.id)?.retards || 0}</small>
        <div style="margin-top:8px"><button class="btn sec pt" id="fe-b">🖨️ ${esc(L('Bulletin du ', 'Report card, '))}${esc(TRI_L(TRI()))}</button></div>`;
      $('#fe-b').onclick = () => { const r = rs[TRI() - 1]; imprimer(cl, r, r.eleves.filter(e => e.id === c.id)) };
    } catch (e) { z.innerHTML = '' }
  }
  async function ecAccueil(z) {
    try { await ref(); const t = TRI();
      const [res, abs] = await Promise.all([Promise.all(EC.classes.map(c => resultats(c.id, t).catch(() => null))), sb.from('ec_absences').select('eleve_id,type').eq('espace_id', E()).eq('date', coAuj()).then(verif)]);
      if (!EC.classes.length) { z.innerHTML = `<div class="carte" style="margin-bottom:14px"><b>🎓 ${esc(L('Commencez par créer vos classes et vos matières', 'Start by creating your classes and subjects'))}</b> <button class="btn pt" onclick="aller('ec_classes')">${esc(L('Classes', 'Classes'))} →</button></div>`; return }
      z.innerHTML = `<div class="deux" style="margin-bottom:14px"><div class="carte"><h3 style="margin-top:0;display:flex;justify-content:space-between;align-items:center">🎓 ${esc(L('Classes', 'Classes'))} · ${esc(TRI_L(t))}<button class="btn lien pt" onclick="aller('ec_classes')">${esc(L('Tout voir', 'See all'))} →</button></h3>
        <div class="rh-liste">${EC.classes.map((c, i) => `<div data-ka="${c.id}" style="cursor:pointer"><span><b>${esc(c.nom)}</b> <small>${elevesDe(c).length} ${esc(L('élèves', 'students'))} · ${esc(ens(c.titulaire_id)?.nom || '')}</small></span><b style="color:${couleurMoy(res[i]?.moyenne_classe)}">${n2(res[i]?.moyenne_classe)}</b></div>`).join('')}</div></div>
        <div class="carte"><h3 style="margin-top:0;display:flex;justify-content:space-between;align-items:center">🙋 ${esc(L('Aujourd’hui', 'Today'))}<button class="btn lien pt" onclick="aller('ec_absences')">${esc(L('Faire l’appel', 'Take attendance'))} →</button></h3>
        <div class="rh-info"><span>${esc(L('Absents', 'Absent'))}</span><b>${abs.filter(x => x.type === 'absence').length}</b><span>${esc(L('Retards', 'Late'))}</span><b>${abs.filter(x => x.type === 'retard').length}</b>
         <span>${esc(L('Élèves inscrits', 'Students enrolled'))}</span><b>${CO_REF.clients.length}</b><span>${esc(L('Moyenne de l’école', 'School average'))}</span><b>${n2(avg(res.map(r => r?.moyenne_classe)))}</b></div>
        ${abs.length ? `<div class="rh-liste" style="margin-top:8px">${abs.slice(0, 6).map(a => { const e = coCli(a.eleve_id); return `<div><span>${esc(e?.nom || '')} <small>${esc(e?.champs?.classe || '')}</small></span>${rhTag(a.type === 'retard' ? L('Retard', 'Late') : L('Absent', 'Absent'), a.type === 'retard' ? 'orange' : 'rouge')}</div>` }).join('')}</div>` : ''}</div></div>`;
      document.querySelectorAll('[data-ka]').forEach(b => b.onclick = () => { aller('ec_classes'); setTimeout(() => ecClasse(b.dataset.ka), 50) });
    } catch (e) { z.innerHTML = '' }
  }

  const st = document.createElement('style');
  st.textContent = `.ec-barre{height:6px;background:#eef2f6;border-radius:4px;overflow:hidden}.ec-barre i{display:block;height:100%;background:var(--p)}
   .ec-mats{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px}.ec-mats span{background:#f6f8fa;border:1px solid var(--bord);border-radius:20px;padding:5px 12px;font-size:13px}.ec-mats b{color:var(--mut);font-weight:600;margin-left:4px}
   .ec-rang{display:inline-flex;align-items:center;justify-content:center;min-width:26px;height:26px;border-radius:50%;background:#f2f4f7;font-size:12px;margin-right:6px}
   .ec-grille{width:100%}.ec-grille th{text-align:center;white-space:nowrap}.ec-grille th:first-child,.ec-grille td:first-child{text-align:left;white-space:nowrap}.ec-grille td{text-align:center}.ec-grille .ec-moy td{background:#f7f8fa;font-weight:600}
   .ec-saisie{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:6px 14px}.ec-saisie label{display:flex;align-items:center;justify-content:space-between;gap:10px;margin:0;font-weight:500}.ec-saisie input{width:90px}
   .ec-cours>div{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f2f4f7}.ec-cours label{margin:0;font-weight:500}
   .ec-sugg{display:flex;flex-wrap:wrap;gap:6px;margin:-4px 0 10px}.ec-sugg .btn{font-size:12px;padding:5px 10px}
   .ec-appel>div{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:7px 0;border-bottom:1px solid #f2f4f7}
   .ec-seg{display:inline-flex;border:1px solid var(--bord);border-radius:10px;overflow:hidden}.ec-seg button{border:0;background:#fff;padding:6px 10px;font-size:13px;cursor:pointer;color:var(--mut)}
   .ec-seg button.on.present{background:#e8f5ee;color:var(--p);font-weight:600}.ec-seg button.on.absence{background:#fef3f2;color:#b42318;font-weight:600}.ec-seg button.on.retard{background:#fffaeb;color:#b54708;font-weight:600}
   .ec-tri{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:6px}.ec-tri>div{background:#f6f8fa;border:1px solid var(--bord);border-radius:10px;padding:8px 10px;display:flex;flex-direction:column}.ec-tri small{color:var(--mut);font-size:11px}.ec-tri b{font-size:18px}`;
  document.head.appendChild(st);

  Object.assign(CO_IC, {
    ec_classes: '<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>',
    ec_notes: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',
    ec_bulletins: '<path d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M14 3v6h6M8 13h2M8 17h2M13 13h3M13 17h3"/>',
    ec_absences: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 14l2 2 4-4"/>',
    ec_enseignants: '<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a4 4 0 014-4h6a4 4 0 014 4v2M19 8v6M22 11h-6"/>',
    ec_parents: '<circle cx="8" cy="7" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M2 20v-1a5 5 0 0110 0v1M13 20v-1a4 4 0 018 0v1"/>'
  });
  Object.assign(CO_PAGE_MOD, { ec_classes: 'classes', ec_notes: 'notes', ec_bulletins: 'notes', ec_absences: 'absences', ec_enseignants: 'enseignants', ec_parents: 'espace_parents' });
  window.ecNomsClasses = () => EC && EC.e === E() ? EC.classes.map(c => c.nom) : null;
  Object.assign(window, { ecClasses, ecClasse, ecNotes, ecBulletins, ecAbsences, ecEnseignants, ecParents, ecFiche, ecAccueil });
  Object.assign(window.RH_VUES, { ec_classes: ecClasses, ec_notes: ecNotes, ec_bulletins: ecBulletins, ec_absences: ecAbsences, ec_enseignants: ecEnseignants, ec_parents: ecParents });
})();
