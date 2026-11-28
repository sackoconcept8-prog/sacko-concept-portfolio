/* Ilano — métier Clinique : consultations et dossier patient, ordonnances, hospitalisations,
   équipe médicale, gardes, honoraires des médecins. Chargé après socle.js. */
(function () {
  const FONCTIONS = [['medecin', 'Médecin', 'Doctor'], ['infirmier', 'Infirmier(ère)', 'Nurse'], ['sage_femme', 'Sage-femme', 'Midwife'], ['laborantin', 'Laborantin(e)', 'Lab technician'],
    ['pharmacien', 'Pharmacien(ne)', 'Pharmacist'], ['aide_soignant', 'Aide-soignant(e)', 'Care assistant'], ['administratif', 'Administratif', 'Admin staff'], ['autre', 'Autre', 'Other']];
  const PAIES = [['salaire', 'Salaire fixe', 'Fixed salary'], ['pourcentage', '% des actes', '% of procedures'], ['par_acte', 'Montant par acte', 'Amount per procedure']];
  const ST = { en_attente: ['En attente', 'Waiting', 'orange'], en_cours: ['En consultation', 'In progress', ''], terminee: ['Terminée', 'Done', 'gris'] };
  const CONST = [['ta', 'Tension (TA)', 'Blood pressure', '120/80'], ['temp', 'Température (°C)', 'Temperature (°C)', '37'], ['poids', 'Poids (kg)', 'Weight (kg)', ''], ['taille', 'Taille (cm)', 'Height (cm)', ''],
    ['pouls', 'Pouls (bpm)', 'Pulse (bpm)', ''], ['spo2', 'SpO2 (%)', 'SpO2 (%)', ''], ['glycemie', 'Glycémie (g/L)', 'Blood sugar (g/L)', '']];
  const lib = (T, k) => { const x = T.find(t => t[0] === k); return x ? (LANG === 'en' ? x[2] : x[1]) : k };
  const tag = s => { const x = ST[s] || [s, s, '']; return rhTag(esc(LANG === 'en' ? x[1] : x[0]), x[2]) };
  const ilYa = d => Math.max(1, Math.ceil((Date.now() - new Date(d)) / 864e5));
  const age = d => { if (!d) return ''; const ms = Date.now() - new Date(d + 'T12:00:00'); const y = Math.floor(ms / 31557600000); return y >= 2 ? y + L(' ans', ' y') : Math.max(0, Math.floor(ms / 2629800000)) + L(' mois', ' mo') };
  let SOI = null, SOI_E = null;
  async function soignants(force) { if (!force && SOI && SOI_E === E()) return SOI; SOI = verif(await sb.from('cl_soignants').select('*').eq('espace_id', E()).order('nom')); SOI_E = E(); return SOI }
  const soi = id => (SOI || []).find(x => x.id === id);
  const moiSoignant = () => (SOI || []).find(x => x.membre_id && x.membre_id === CTX.membre.id);
  const optsSoi = (sel, filtre) => (SOI || []).filter(x => x.actif && (!filtre || filtre(x))).map(x => `<option value="${x.id}" ${x.id === sel ? 'selected' : ''}>${esc(x.nom)}${x.specialite ? ' — ' + esc(x.specialite) : ''}</option>`).join('');
  const soigne = x => ['medecin', 'sage_femme', 'infirmier'].includes(x.fonction);
  const optsPat = sel => CO_REF.clients.map(c => `<option value="${c.id}" ${c.id === sel ? 'selected' : ''}>${esc(c.nom)}${c.telephone ? ' · ' + esc(c.telephone) : ''}</option>`).join('');
  const ro = () => coRO();

  /* ---------------- Consultations ---------------- */
  async function clConsult() {
    await Promise.all([coRef(true), soignants(true)]);
    const f = window._clCF || 'jour', q = window._clCQ || '';
    const d30 = new Date(Date.now() - 30 * 864e5).toISOString();
    const l = verif(await sb.from('cl_consultations').select('*').eq('espace_id', E()).gte('date', d30).order('date', { ascending: false }).limit(500));
    const auj = coAuj(), moi = moiSoignant();
    const deJour = l.filter(x => x.date.slice(0, 10) === auj || coLocal(x.date).slice(0, 10) === auj);
    const att = l.filter(x => x.statut !== 'terminee');
    let v = f === 'jour' ? deJour : f === 'attente' ? att : f === 'moi' ? l.filter(x => moi && x.soignant_id === moi.id) : l;
    if (q) v = v.filter(x => [coCli(x.patient_id)?.nom, x.motif, x.diagnostic, soi(x.soignant_id)?.nom].join(' ').toLowerCase().includes(q.toLowerCase()));
    const ca = deJour.reduce((a, x) => a + (+x.montant || 0), 0);
    C().innerHTML = entete(esc(L('Consultations', 'Consultations')), ro() ? '' : `<button class="btn" id="cl-new">+ ${esc(L('Nouvelle consultation', 'New consultation'))}</button>`) + `
     <div class="kpis"><div class="kpi p"><small>${esc(L('Aujourd’hui', 'Today'))}</small><div>${deJour.length}</div><small>${esc(L('consultation(s)', 'consultation(s)'))}</small></div>
      <div class="kpi"><small>${esc(L('Salle d’attente', 'Waiting room'))}</small><div>${att.length}</div></div>
      <div class="kpi"><small>${esc(L('Actes du jour', 'Today’s fees'))}</small><div>${fmt(ca)}</div></div>
      <div class="kpi"><small>${esc(L('30 derniers jours', 'Last 30 days'))}</small><div>${l.length}</div></div></div>
     <div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:10px">${rhChips('cl-f', [['jour', L('Aujourd’hui', 'Today')], ['attente', L('En attente', 'Waiting') + ' (' + att.length + ')'], ...(moi ? [['moi', L('Mes patients', 'My patients')]] : []), ['tous', L('30 jours', '30 days')]], f)}
      <input id="cl-q" placeholder="${esc(L('Rechercher un patient, un diagnostic…', 'Search patient, diagnosis…'))}" value="${esc(q)}" style="flex:1;min-width:200px"></div>
     <div class="carte"><div class="rh-liste" id="cl-l">${v.length ? v.map(x => {
      const c = coCli(x.patient_id), s = soi(x.soignant_id);
      return `<div data-c="${x.id}" style="cursor:pointer"><span><b>${esc(c?.nom || '—')}</b> <small>· ${coDateL(x.date)} ${coHeure(x.date)}</small><br><small>${esc([x.motif, x.diagnostic && ('➜ ' + x.diagnostic), s?.nom].filter(Boolean).join(' · '))}</small></span>
        <span style="text-align:right">${x.montant ? fmt(x.montant) + '<br>' : ''}${tag(x.statut)}${x.facture_id ? ' ' + rhTag(L('Facturée', 'Invoiced'), 'gris') : ''}</span></div>` }).join('') : `<div class="vide">${esc(L('Aucune consultation ici.', 'No consultation here.'))}</div>`}</div></div>`;
    document.querySelectorAll('#cl-f [data-chip]').forEach(b => b.onclick = () => { window._clCF = b.dataset.chip; clConsult() });
    $('#cl-q').oninput = e => { window._clCQ = e.target.value; clearTimeout(window._clT); window._clT = setTimeout(() => { clConsult().then(() => { const i = $('#cl-q'); i.focus(); i.setSelectionRange(i.value.length, i.value.length) }) }, 350) };
    document.querySelectorAll('[data-c]').forEach(b => b.onclick = () => clVoir(l.find(x => x.id === b.dataset.c)));
    if ($('#cl-new')) $('#cl-new').onclick = () => clForm();
  }

  async function clForm(x = {}) {
    await Promise.all([coRef(), soignants()]);
    const moi = moiSoignant(), ordo = (x.ordonnance && x.ordonnance.length ? x.ordonnance : [{ m: '', p: '', d: '' }]);
    const k = x.constantes || {};
    modale(`<h3>${esc(x.id ? L('Consultation', 'Consultation') : L('Nouvelle consultation', 'New consultation'))}</h3>
      <div class="deux"><label>${esc(L('Patient', 'Patient'))} *<select name="patient_id" id="cf-p" required><option value="">—</option>${optsPat(x.patient_id)}</select>
        <button type="button" class="btn lien pt" id="cf-np">+ ${esc(L('Nouveau patient', 'New patient'))}</button></label>
       <label>${esc(L('Médecin / soignant', 'Doctor / carer'))}<select name="soignant_id"><option value="">—</option>${optsSoi(x.soignant_id || moi?.id, soigne)}</select></label></div>
      <div id="cf-al"></div>
      <div class="deux"><label>${esc(L('Date et heure', 'Date & time'))}<input type="datetime-local" name="date" value="${coLocal(x.date || new Date())}"></label>
       <label>${esc(L('Statut', 'Status'))}<select name="statut">${Object.keys(ST).map(s => `<option value="${s}" ${s === (x.statut || 'en_cours') ? 'selected' : ''}>${esc(lib(Object.entries(ST).map(([a, b]) => [a, b[0], b[1]]), s))}</option>`).join('')}</select></label></div>
      <label>${esc(L('Motif de consultation', 'Reason for visit'))}<input name="motif" maxlength="500" value="${esc(x.motif || '')}"></label>
      <h4 style="margin:12px 0 4px">${esc(L('Constantes', 'Vital signs'))}</h4>
      <div class="cl-const">${CONST.map(c => `<label>${esc(LANG === 'en' ? c[2] : c[1])}<input name="k_${c[0]}" value="${esc(k[c[0]] ?? '')}" placeholder="${c[3]}" inputmode="decimal"></label>`).join('')}</div>
      <label>${esc(L('Examen clinique', 'Clinical exam'))}<textarea name="examen" rows="2" maxlength="4000">${esc(x.examen || '')}</textarea></label>
      <label>${esc(L('Diagnostic', 'Diagnosis'))}<input name="diagnostic" maxlength="2000" value="${esc(x.diagnostic || '')}"></label>
      <label>${esc(L('Examens demandés (labo, imagerie)', 'Tests ordered (lab, imaging)'))}<input name="examens" maxlength="2000" value="${esc(x.examens || '')}"></label>
      <h4 style="margin:12px 0 4px">${esc(L('Ordonnance', 'Prescription'))}</h4>
      <table class="rh-compact" style="width:100%"><tbody id="cf-o"></tbody></table><button type="button" class="btn sec pt" id="cf-oa">+ ${esc(L('Médicament', 'Medicine'))}</button>
      <div class="deux" style="margin-top:12px"><label>${esc(L('Acte facturé', 'Procedure billed'))}<select name="prestation_id" id="cf-a"><option value="">—</option>${CO_REF.prestations.map(p => `<option value="${p.id}" data-prix="${p.prix}" ${p.id === x.prestation_id ? 'selected' : ''}>${esc(p.nom)} · ${fmt(p.prix)}</option>`).join('')}</select></label>
       <label>${esc(L('Montant', 'Amount'))}<input type="number" min="0" step="any" name="montant" id="cf-m" value="${x.montant ?? ''}"></label></div>
      <label>${esc(L('Note interne', 'Internal note'))}<textarea name="note" rows="2" maxlength="2000">${esc(x.note || '')}</textarea></label>`,
      async f => {
        const v = Object.fromEntries(new FormData(f)); const cst = {};
        for (const c of CONST) if (v['k_' + c[0]]) cst[c[0]] = v['k_' + c[0]];
        const ord = [...document.querySelectorAll('#cf-o tr')].map(t => ({ m: t.querySelector('[data-k=m]').value.trim(), p: t.querySelector('[data-k=p]').value.trim(), d: t.querySelector('[data-k=d]').value.trim() })).filter(o => o.m);
        const row = { patient_id: v.patient_id, soignant_id: v.soignant_id || null, date: new Date(v.date).toISOString(), statut: v.statut, motif: v.motif || null, constantes: cst, examen: v.examen || null,
          diagnostic: v.diagnostic || null, examens: v.examens || null, ordonnance: ord, prestation_id: v.prestation_id || null, montant: +v.montant || 0, note: v.note || null };
        const res = x.id ? verif(await sb.from('cl_consultations').update(row).eq('id', x.id).select().single())
          : verif(await sb.from('cl_consultations').insert({ ...row, espace_id: E(), rdv_id: x.rdv_id || null, created_by: CTX.membre.id }).select().single());
        toast(L('Consultation enregistrée ✓', 'Consultation saved ✓')); setTimeout(() => clVoir(res), 60); if (VUE === 'cl_consult') clConsult();
      });
    rhModaleLarge();
    const ligne = o => `<tr><td style="width:42%"><input data-k="m" value="${esc(o.m || '')}" placeholder="${esc(L('Médicament et dosage', 'Medicine and dose'))}"></td><td style="width:33%"><input data-k="p" value="${esc(o.p || '')}" placeholder="${esc(L('Posologie', 'Dosage'))}"></td><td style="width:18%"><input data-k="d" value="${esc(o.d || '')}" placeholder="${esc(L('Durée', 'Duration'))}"></td><td><button type="button" class="btn lien pt" data-x>✕</button></td></tr>`;
    const lier = () => document.querySelectorAll('#cf-o [data-x]').forEach(b => b.onclick = () => b.closest('tr').remove());
    $('#cf-o').innerHTML = ordo.map(ligne).join(''); lier();
    $('#cf-oa').onclick = () => { $('#cf-o').insertAdjacentHTML('beforeend', ligne({})); lier() };
    $('#cf-a').onchange = () => { const o = $('#cf-a').selectedOptions[0]; if (o?.dataset.prix) $('#cf-m').value = o.dataset.prix };
    const alerte = () => { const c = coCli($('#cf-p').value); const a = [c?.champs?.allergies && ['⚠️ ' + L('Allergies', 'Allergies'), c.champs.allergies], c?.champs?.antecedents && ['📋 ' + L('Antécédents', 'History'), c.champs.antecedents]].filter(Boolean);
      $('#cf-al').innerHTML = a.map(([t, v]) => `<div class="co-alerte"${t.startsWith('📋') ? ' style="background:#f0f9ff;border-color:#b9e6fe;color:#065986"' : ''}><b>${esc(t)} :</b> ${esc(v)}</div>`).join('') };
    $('#cf-p').onchange = alerte; alerte();
    $('#cf-np').onclick = () => coFormClient({ categorie: 'patient' }, async c => { await coRef(true); clForm({ ...x, patient_id: c.id }) });
  }

  async function clVoir(x) {
    await Promise.all([coRef(), soignants()]);
    const c = coCli(x.patient_id), s = soi(x.soignant_id), k = x.constantes || {};
    $('#modale-zone').innerHTML = `<div class="voile"><div class="modale large"><h3>${esc(c?.nom || '—')} ${tag(x.statut)}</h3>
      <p style="color:var(--mut);margin:2px 0 10px">${coDateL(x.date)} ${coHeure(x.date)}${s ? ' · ' + esc(s.nom) : ''}${c?.champs?.date_naissance ? ' · ' + esc(age(c.champs.date_naissance)) : ''}</p>
      ${c?.champs?.allergies ? `<div class="co-alerte">⚠️ <b>${esc(L('Allergies', 'Allergies'))} :</b> ${esc(c.champs.allergies)}</div>` : ''}
      ${Object.keys(k).length ? `<div class="cl-chips">${CONST.filter(z => k[z[0]]).map(z => `<span><small>${esc(LANG === 'en' ? z[2] : z[1])}</small><b>${esc(k[z[0]])}</b></span>`).join('')}</div>` : ''}
      <div class="rh-info" style="margin:10px 0">${[['Motif', 'Reason', x.motif], ['Examen', 'Exam', x.examen], ['Diagnostic', 'Diagnosis', x.diagnostic], ['Examens demandés', 'Tests ordered', x.examens], ['Note', 'Note', x.note]].filter(z => z[2]).map(z => `<span>${esc(L(z[0], z[1]))}</span><b style="font-weight:500">${esc(z[2])}</b>`).join('')}
       ${x.montant ? `<span>${esc(L('Montant', 'Amount'))}</span><b>${fmt(x.montant)}</b>` : ''}</div>
      ${(x.ordonnance || []).length ? `<h4 style="margin:10px 0 4px">💊 ${esc(L('Ordonnance', 'Prescription'))}</h4><div class="rh-liste">${x.ordonnance.map(o => `<div><span><b>${esc(o.m)}</b><br><small>${esc(o.p || '')}</small></span><small>${esc(o.d || '')}</small></div>`).join('')}</div>` : ''}
      <div class="actions" style="flex-wrap:wrap">${(x.ordonnance || []).length ? `<button class="btn sec" id="cv-o">🖨️ ${esc(L('Ordonnance', 'Prescription'))}</button>` : ''}
       <button class="btn sec" id="cv-d">📁 ${esc(L('Dossier patient', 'Patient file'))}</button>
       ${ro() ? '' : `<button class="btn sec" id="cv-m">${esc(L('Modifier', 'Edit'))}</button>${!x.facture_id && x.montant > 0 && coMod('factures') ? `<button class="btn" id="cv-f">${esc(L('Facturer', 'Bill'))}</button>` : ''}`}
       ${x.facture_id ? `<button class="btn sec" id="cv-vf">${esc(L('Voir la facture', 'View invoice'))}</button>` : ''}<button class="btn sec" onclick="fermer()">${esc(L('Fermer', 'Close'))}</button></div></div></div>`;
    $('.voile').onclick = e => { if (e.target.classList.contains('voile')) fermer() };
    if ($('#cv-o')) $('#cv-o').onclick = () => clOrdonnance(x);
    $('#cv-d').onclick = () => coFicheClient(x.patient_id);
    if ($('#cv-m')) $('#cv-m').onclick = () => clForm(x);
    if ($('#cv-f')) $('#cv-f').onclick = async () => {
      try { const pr = coPre(x.prestation_id); const f = verif(await sb.from('co_factures').insert({ espace_id: E(), type: 'facture', statut: 'emise', client_id: x.patient_id, objet: L('Consultation du ', 'Consultation on ') + coDateL(x.date),
        lignes: [{ libelle: pr?.nom || L('Consultation', 'Consultation'), qte: 1, pu: +x.montant }], taux_assurance: +c?.champs?.taux_assurance || 0, created_by: CTX.membre.id }).select().single());
        await sb.from('cl_consultations').update({ facture_id: f.id }).eq('id', x.id); toast(L('Facture ', 'Invoice ') + f.numero + ' ✓'); coVoirFacture(f); if (VUE === 'cl_consult') clConsult() } catch (e) { toast(erreurMsg(e)) } };
    if ($('#cv-vf')) $('#cv-vf').onclick = async () => coVoirFacture(verif(await sb.from('co_factures').select('*').eq('id', x.facture_id).single()));
  }

  function clOrdonnance(x) {
    const c = coCli(x.patient_id), s = soi(x.soignant_id);
    rhPapier(L('Ordonnance', 'Prescription'), `<h1>${esc(L('ORDONNANCE MÉDICALE', 'MEDICAL PRESCRIPTION'))}</h1>
      <table style="margin-bottom:18px"><tr><td style="border:0;padding:2px 0"><b>${esc(L('Patient', 'Patient'))} :</b> ${esc(c?.nom || '')}${c?.champs?.date_naissance ? ' — ' + esc(age(c.champs.date_naissance)) : ''}${c?.champs?.sexe ? ' — ' + esc(c.champs.sexe) : ''}</td>
       <td style="border:0;padding:2px 0;text-align:right">${esc(L('Le ', 'Date: '))}${coDateL(x.date)}</td></tr>
       ${c?.champs?.allergies ? `<tr><td colspan="2" style="border:0;padding:2px 0;color:#b42318"><b>${esc(L('Allergies', 'Allergies'))} :</b> ${esc(c.champs.allergies)}</td></tr>` : ''}</table>
      <table><tr><th style="width:5%">#</th><th>${esc(L('Médicament', 'Medicine'))}</th><th>${esc(L('Posologie', 'Dosage'))}</th><th>${esc(L('Durée', 'Duration'))}</th></tr>
       ${(x.ordonnance || []).map((o, i) => `<tr><td>${i + 1}</td><td><b>${esc(o.m)}</b></td><td>${esc(o.p || '')}</td><td>${esc(o.d || '')}</td></tr>`).join('')}</table>
      ${x.examens ? `<p style="margin-top:18px"><b>${esc(L('Examens demandés', 'Tests ordered'))} :</b> ${esc(x.examens)}</p>` : ''}
      <div class="sig"><span></span><span style="text-align:center">${esc(s?.nom || L('Le médecin', 'The doctor'))}${s?.specialite ? '<br><small>' + esc(s.specialite) + '</small>' : ''}<br><br>${esc(L('Signature et cachet', 'Signature and stamp'))}</span></div>`);
  }

  /* Dossier médical dans la fiche patient */
  async function clFiche(c, z) {
    if (!z) return; z.innerHTML = '';
    try {
      await soignants();
      const [co, ho] = await Promise.all([sb.from('cl_consultations').select('*').eq('patient_id', c.id).order('date', { ascending: false }).limit(30).then(verif),
        sb.from('cl_hospitalisations').select('*').eq('patient_id', c.id).order('entree', { ascending: false }).limit(10).then(verif)]);
      z.innerHTML = `<h4 style="margin:10px 0 4px;display:flex;justify-content:space-between;align-items:center">📁 ${esc(L('Dossier médical', 'Medical record'))}${ro() ? '' : `<button class="btn pt" id="fm-c">+ ${esc(L('Consultation', 'Consultation'))}</button>`}</h4>
       ${co.length ? `<div class="rh-liste">${co.slice(0, 10).map(x => `<div data-fc="${x.id}" style="cursor:pointer"><span><b>${coDateL(x.date)}</b> · ${esc(x.diagnostic || x.motif || '—')}<br><small>${esc(soi(x.soignant_id)?.nom || '')}${(x.ordonnance || []).length ? ' · 💊 ' + x.ordonnance.length : ''}</small></span>${tag(x.statut)}</div>`).join('')}</div>` : `<div class="vide" style="padding:10px">${esc(L('Aucune consultation enregistrée.', 'No consultation yet.'))}</div>`}
       ${ho.length ? `<h4 style="margin:12px 0 4px">🛏️ ${esc(L('Hospitalisations', 'Admissions'))}</h4><div class="rh-liste">${ho.map(h => `<div><span>${coDateL(h.entree)} → ${h.sortie ? coDateL(h.sortie) : esc(L('en cours', 'ongoing'))}<br><small>${esc(h.motif || '')}</small></span>${h.statut === 'en_cours' ? rhTag(L('Hospitalisé', 'Admitted'), 'orange') : rhTag(L('Sorti', 'Discharged'), 'gris')}</div>`).join('')}</div>` : ''}`;
      document.querySelectorAll('[data-fc]').forEach(b => b.onclick = () => clVoir(co.find(x => x.id === b.dataset.fc)));
      if ($('#fm-c')) $('#fm-c').onclick = () => clForm({ patient_id: c.id });
    } catch (e) { z.innerHTML = '' }
  }

  /* ---------------- Hospitalisations ---------------- */
  async function clHospit() {
    const [ref] = await Promise.all([coRef(true), soignants()]);
    const h = verif(await sb.from('cl_hospitalisations').select('*').eq('espace_id', E()).order('entree', { ascending: false }).limit(200));
    const lits = ref.ressources.filter(r => r.type === 'lit'), enc = h.filter(x => x.statut === 'en_cours');
    const occ = id => enc.find(x => x.lit_id === id);
    C().innerHTML = entete(esc(L('Hospitalisations', 'Admissions')), ro() ? '' : `<button class="btn" id="ch-new">+ ${esc(L('Admettre un patient', 'Admit a patient'))}</button>`) + `
     <div class="kpis"><div class="kpi p"><small>${esc(L('Hospitalisés', 'In-patients'))}</small><div>${enc.length}</div></div>
      <div class="kpi"><small>${esc(L('Lits libres', 'Free beds'))}</small><div>${lits.filter(l => !occ(l.id)).length} / ${lits.length}</div></div>
      <div class="kpi"><small>${esc(L('Taux d’occupation', 'Occupancy'))}</small><div>${lits.length ? Math.round(100 * enc.filter(x => x.lit_id).length / lits.length) : 0} %</div></div>
      <div class="kpi"><small>${esc(L('À facturer (en cours)', 'To bill (ongoing)'))}</small><div>${fmt(enc.reduce((a, x) => a + ilYa(x.entree) * x.prix_jour, 0))}</div></div></div>
     <h3>${esc(L('Lits', 'Beds'))}</h3>
     <div class="co-res">${lits.length ? lits.map(l => { const x = occ(l.id), c = x && coCli(x.patient_id);
       return `<div class="co-carte" style="${x ? 'border-color:#fedf89;background:#fffcf5' : ''}"><div style="display:flex;justify-content:space-between;gap:8px"><h4>${esc(l.nom)}</h4>${x ? rhTag(L('Occupé', 'Occupied'), 'orange') : rhTag(L('Libre', 'Free'))}</div>
        <small>${esc(l.categorie || '')}${l.prix ? ' · ' + fmt(l.prix) + L(' / jour', ' / day') : ''}</small>
        ${x ? `<small><b style="color:var(--txt)">${esc(c?.nom || '')}</b> · ${ilYa(x.entree)} ${esc(L('jour(s)', 'day(s)'))}<br>${esc(x.motif || '')}</small>
         <div class="bas"><button class="btn sec pt" data-hv="${x.id}">${esc(L('Dossier', 'File'))}</button>${ro() ? '' : `<button class="btn pt" data-hs="${x.id}">${esc(L('Sortie', 'Discharge'))}</button>`}</div>`
        : (ro() ? '' : `<div class="bas"><span></span><button class="btn sec pt" data-ha="${l.id}">${esc(L('Admettre ici', 'Admit here'))}</button></div>`)}</div>` }).join('')
       : `<div class="carte vide" style="grid-column:1/-1">${esc(L('Ajoutez d’abord vos lits et chambres.', 'Add your beds and rooms first.'))} ${estGerant() ? `<a href="#" id="ch-lit">+ ${esc(L('Ajouter un lit', 'Add a bed'))}</a>` : ''}</div>`}</div>
     ${estGerant() && lits.length ? `<p><button class="btn lien pt" id="ch-lit">+ ${esc(L('Ajouter un lit ou une chambre', 'Add a bed or room'))}</button></p>` : ''}
     <h3>${esc(L('Sorties récentes', 'Recent discharges'))}</h3>
     <div class="carte"><div class="rh-liste">${h.filter(x => x.statut === 'sortie').slice(0, 15).map(x => `<div><span><b>${esc(coCli(x.patient_id)?.nom || '—')}</b><br><small>${coDateL(x.entree)} → ${coDateL(x.sortie)} · ${esc(x.motif || '')}</small></span>${x.facture_id ? rhTag(L('Facturée', 'Invoiced'), 'gris') : ''}</div>`).join('') || `<div class="vide">—</div>`}</div></div>`;
    if ($('#ch-new')) $('#ch-new').onclick = () => clAdmettre();
    document.querySelectorAll('#ch-lit').forEach(b => b.onclick = e => { e.preventDefault(); coFormRessource({ type: 'lit' }) });
    document.querySelectorAll('[data-ha]').forEach(b => b.onclick = () => clAdmettre({ lit_id: b.dataset.ha }));
    document.querySelectorAll('[data-hv]').forEach(b => b.onclick = () => coFicheClient(h.find(x => x.id === b.dataset.hv).patient_id));
    document.querySelectorAll('[data-hs]').forEach(b => b.onclick = () => clSortie(h.find(x => x.id === b.dataset.hs)));
  }
  async function clAdmettre(x = {}) {
    const ref = await coRef(true); await soignants();
    const enc = verif(await sb.from('cl_hospitalisations').select('lit_id').eq('espace_id', E()).eq('statut', 'en_cours')).map(z => z.lit_id);
    const lits = ref.ressources.filter(r => r.type === 'lit' && !enc.includes(r.id));
    modale(`<h3>${esc(L('Admettre un patient', 'Admit a patient'))}</h3>
      <label>${esc(L('Patient', 'Patient'))} *<select name="patient_id" required><option value="">—</option>${optsPat(x.patient_id)}</select></label>
      <div class="deux"><label>${esc(L('Lit', 'Bed'))}<select name="lit_id" id="ad-l"><option value="">—</option>${lits.map(l => `<option value="${l.id}" data-prix="${l.prix || 0}" ${l.id === x.lit_id ? 'selected' : ''}>${esc(l.nom)}</option>`).join('')}</select></label>
       <label>${esc(L('Médecin responsable', 'Doctor in charge'))}<select name="soignant_id"><option value="">—</option>${optsSoi(null, s => s.fonction !== 'administratif')}</select></label></div>
      <div class="deux"><label>${esc(L('Entrée', 'Admission'))}<input type="datetime-local" name="entree" value="${coLocal(new Date())}"></label>
       <label>${esc(L('Prix par jour', 'Price per day'))}<input type="number" min="0" step="any" name="prix_jour" id="ad-p" value="${coRes(x.lit_id)?.prix || ''}"></label></div>
      <label>${esc(L('Motif', 'Reason'))}<input name="motif" maxlength="500"></label>`,
      async f => { const v = Object.fromEntries(new FormData(f));
        verif(await sb.from('cl_hospitalisations').insert({ espace_id: E(), patient_id: v.patient_id, lit_id: v.lit_id || null, soignant_id: v.soignant_id || null, entree: new Date(v.entree).toISOString(), prix_jour: +v.prix_jour || 0, motif: v.motif || null }));
        if (v.lit_id) await sb.rpc('co_ressource_statut', { p_id: v.lit_id, p_statut: 'occupe' });
        toast(L('Patient admis ✓', 'Patient admitted ✓')); coRefVider(); clHospit() });
    $('#ad-l').onchange = () => { const o = $('#ad-l').selectedOptions[0]; if (o?.dataset.prix && +o.dataset.prix) $('#ad-p').value = o.dataset.prix };
  }
  function clSortie(x) {
    const c = coCli(x.patient_id), lit = coRes(x.lit_id), n = ilYa(x.entree);
    modale(`<h3>${esc(L('Sortie de ', 'Discharge: '))}${esc(c?.nom || '')}</h3>
      <div class="rh-info" style="margin-bottom:10px"><span>${esc(L('Entrée', 'Admission'))}</span><b>${coDateL(x.entree)}</b><span>${esc(L('Durée', 'Length'))}</span><b>${n} ${esc(L('jour(s)', 'day(s)'))}</b><span>${esc(L('Séjour', 'Stay'))}</span><b>${fmt(n * x.prix_jour)}</b></div>
      <label><input type="checkbox" name="fac" ${coMod('factures') && x.prix_jour > 0 ? 'checked' : ''} ${coMod('factures') ? '' : 'disabled'}> ${esc(L('Créer la facture du séjour', 'Create the stay invoice'))}</label>
      <label>${esc(L('Note de sortie', 'Discharge note'))}<textarea name="note" rows="2" maxlength="2000"></textarea></label>`,
      async f => { const v = Object.fromEntries(new FormData(f)); let fid = null;
        if (v.fac) { const fa = verif(await sb.from('co_factures').insert({ espace_id: E(), type: 'facture', statut: 'emise', client_id: x.patient_id, ressource_id: x.lit_id, objet: L('Hospitalisation du ', 'Admission from ') + coDateL(x.entree),
          lignes: [{ libelle: L('Hospitalisation', 'Hospital stay') + (lit ? ' — ' + lit.nom : ''), qte: n, pu: +x.prix_jour }], taux_assurance: +c?.champs?.taux_assurance || 0, created_by: CTX.membre.id }).select().single()); fid = fa.id; window._clFa = fa }
        verif(await sb.from('cl_hospitalisations').update({ statut: 'sortie', sortie: new Date().toISOString(), facture_id: fid, note: v.note || null }).eq('id', x.id));
        if (x.lit_id) await sb.rpc('co_ressource_statut', { p_id: x.lit_id, p_statut: 'disponible' });
        toast(L('Sortie enregistrée ✓', 'Discharge saved ✓')); coRefVider(); await clHospit(); if (fid) setTimeout(() => coVoirFacture(window._clFa), 80) });
  }

  /* ---------------- Équipe médicale ---------------- */
  async function clEquipe() {
    await Promise.all([coRef(true), soignants(true)]);
    const m1 = coAuj().slice(0, 7) + '-01';
    const co = verif(await sb.from('cl_consultations').select('soignant_id,montant').eq('espace_id', E()).gte('date', m1));
    const g = estGerant() && !ro();
    const parF = FONCTIONS.map(f => [f, SOI.filter(s => s.fonction === f[0])]).filter(([, l]) => l.length);
    C().innerHTML = entete(esc(L('Équipe médicale', 'Medical team')), g ? `<button class="btn" id="ce-new">+ ${esc(L('Ajouter', 'Add'))}</button>` : '') + `
     <p style="color:var(--mut);margin-top:-6px">${esc(L('Médecins, infirmières, sages-femmes, laborantins… avec leur mode de rémunération. Les honoraires se calculent tout seuls à partir des consultations.', 'Doctors, nurses, midwives, lab staff… with how they are paid. Fees are calculated automatically from consultations.'))}</p>
     ${parF.length ? parF.map(([f, l]) => `<h3>${esc(LANG === 'en' ? f[2] : f[1])} (${l.length})</h3><div class="co-res">${l.map(s => { const n = co.filter(x => x.soignant_id === s.id);
       return `<div class="co-carte" style="${s.actif ? '' : 'opacity:.55'}"><h4>${esc(s.nom)}</h4><small>${esc([s.specialite, s.telephone].filter(Boolean).join(' · '))}</small>
        <small>${esc(lib(PAIES, s.mode_paie))}${s.mode_paie === 'pourcentage' ? ' · ' + s.taux + ' %' : s.mode_paie === 'par_acte' ? ' · ' + fmt(s.taux) : g ? ' · ' + fmt(s.salaire) : ''}</small>
        ${['medecin', 'sage_femme'].includes(s.fonction) ? `<small>${esc(L('Ce mois : ', 'This month: '))}<b>${n.length}</b> ${esc(L('consultation(s)', 'consultation(s)'))}</small>` : ''}
        ${s.membre_id ? `<small>🔑 ${esc(L('A un accès à Ilano', 'Has Ilano access'))}</small>` : ''}
        <div class="bas">${s.telephone ? `<a class="btn sec pt" target="_blank" href="https://wa.me/${coTel(s.telephone)}">WhatsApp</a>` : '<span></span>'}${g ? `<button class="btn lien pt" data-se="${s.id}">${esc(L('Modifier', 'Edit'))}</button>` : ''}</div></div>` }).join('')}</div>`).join('')
       : `<div class="carte vide">${esc(L('Ajoutez vos médecins et votre personnel soignant.', 'Add your doctors and care staff.'))}</div>`}
     ${coMod('rh') ? '' : `<div class="carte" style="margin-top:16px;background:#f6fef9"><b>💼 ${esc(L('Bulletins de paie, congés, pointage ?', 'Payslips, leave, time clock?'))}</b><br><small style="color:var(--mut)">${esc(L('Activez RH Pro dans « Modules et réglages » pour gérer la paie complète de votre personnel.', 'Turn on HR Pro in “Modules & settings” to run full payroll for your staff.'))}</small></div>`}`;
    if ($('#ce-new')) $('#ce-new').onclick = () => clFormSoi();
    document.querySelectorAll('[data-se]').forEach(b => b.onclick = () => clFormSoi(soi(b.dataset.se)));
  }
  function clFormSoi(s = { fonction: 'medecin', mode_paie: 'pourcentage', actif: true }) {
    modale(`<h3>${esc(s.id ? s.nom : L('Nouveau membre de l’équipe', 'New team member'))}</h3>
      <label>${esc(L('Nom complet', 'Full name'))} *<input name="nom" required maxlength="120" value="${esc(s.nom || '')}" placeholder="Dr …"></label>
      <div class="deux"><label>${esc(L('Fonction', 'Role'))}<select name="fonction">${FONCTIONS.map(f => `<option value="${f[0]}" ${f[0] === s.fonction ? 'selected' : ''}>${esc(LANG === 'en' ? f[2] : f[1])}</option>`).join('')}</select></label>
       <label>${esc(L('Spécialité / service', 'Specialty / unit'))}<input name="specialite" maxlength="80" value="${esc(s.specialite || '')}"></label></div>
      <div class="deux"><label>${esc(L('Téléphone', 'Phone'))}<input name="telephone" maxlength="40" value="${esc(s.telephone || '')}"></label>
       <label>${esc(L('Compte Ilano (facultatif)', 'Ilano account (optional)'))}<select name="membre_id"><option value="">—</option>${CO_REF.membres.map(m => `<option value="${m.id}" ${m.id === s.membre_id ? 'selected' : ''}>${esc(m.nom_complet)}</option>`).join('')}</select></label></div>
      <div class="deux"><label>${esc(L('Rémunération', 'Pay'))}<select name="mode_paie" id="sf-m">${PAIES.map(p => `<option value="${p[0]}" ${p[0] === s.mode_paie ? 'selected' : ''}>${esc(LANG === 'en' ? p[2] : p[1])}</option>`).join('')}</select></label>
       <label id="sf-tl"><span id="sf-tt"></span><input type="number" min="0" step="any" name="taux" value="${s.taux || ''}"></label>
       <label id="sf-sl">${esc(L('Salaire mensuel', 'Monthly salary'))}<input type="number" min="0" step="any" name="salaire" value="${s.salaire || ''}"></label></div>
      <label><input type="checkbox" name="actif" ${s.actif !== false ? 'checked' : ''}> ${esc(L('Actif', 'Active'))}</label>`,
      async f => { const v = Object.fromEntries(new FormData(f));
        const row = { nom: v.nom.trim(), fonction: v.fonction, specialite: v.specialite || null, telephone: v.telephone || null, membre_id: v.membre_id || null, mode_paie: v.mode_paie, taux: +v.taux || 0, salaire: +v.salaire || 0, actif: !!v.actif };
        if (s.id) verif(await sb.from('cl_soignants').update(row).eq('id', s.id)); else verif(await sb.from('cl_soignants').insert({ ...row, espace_id: E() }));
        toast(L('Enregistré ✓', 'Saved ✓')); await soignants(true); clEquipe() });
    const maj = () => { const m = $('#sf-m').value; $('#sf-tl').classList.toggle('cache', m === 'salaire'); $('#sf-sl').classList.toggle('cache', m !== 'salaire');
      $('#sf-tt').textContent = m === 'pourcentage' ? L('Pourcentage des actes (%)', 'Share of procedures (%)') : L('Montant par acte', 'Amount per procedure') };
    $('#sf-m').onchange = maj; maj();
  }

  /* ---------------- Gardes ---------------- */
  async function clGardes() {
    await soignants();
    const lun = new Date(); lun.setHours(12, 0, 0, 0); lun.setDate(lun.getDate() - ((lun.getDay() + 6) % 7) + 7 * (window._clGS || 0));
    const jours = Array.from({ length: 7 }, (_, i) => { const d = new Date(lun); d.setDate(d.getDate() + i); return d.toISOString().slice(0, 10) });
    const gs = verif(await sb.from('cl_gardes').select('*').eq('espace_id', E()).gte('jour', jours[0]).lte('jour', jours[6]));
    const g = estGerant() && !ro();
    const cell = (j, c) => gs.filter(x => x.jour === j && x.creneau === c).map(x => `<span class="cl-g">${esc(soi(x.soignant_id)?.nom || '?')}${x.service ? `<small>${esc(x.service)}</small>` : ''}</span>`).join('') || `<small style="color:#98a2b3">—</small>`;
    C().innerHTML = entete(esc(L('Planning des gardes', 'Duty roster')), `<button class="btn sec pt" id="cg-p">←</button> <button class="btn sec pt" id="cg-a">${esc(L('Cette semaine', 'This week'))}</button> <button class="btn sec pt" id="cg-n">→</button> <button class="btn sec pt" id="cg-i">🖨️</button>`) + `
     <p style="color:var(--mut);margin-top:-6px">${esc(L('Semaine du ', 'Week of '))}${coDateL(jours[0])}${g ? ' · ' + esc(L('Touchez une case pour affecter le personnel.', 'Tap a cell to assign staff.')) : ''}</p>
     <div class="carte" style="overflow-x:auto"><table class="rh-compact cl-gt"><tr><th></th><th>☀️ ${esc(L('Jour', 'Day'))}</th><th>🌙 ${esc(L('Nuit', 'Night'))}</th></tr>
      ${jours.map(j => `<tr class="${j === coAuj() ? 'auj' : ''}"><th>${new Date(j + 'T12:00:00').toLocaleDateString(LOC(), { weekday: 'long', day: '2-digit', month: 'short' })}</th>
        <td data-gj="${j}" data-gc="jour">${cell(j, 'jour')}</td><td data-gj="${j}" data-gc="nuit">${cell(j, 'nuit')}</td></tr>`).join('')}</table></div>`;
    $('#cg-p').onclick = () => { window._clGS = (window._clGS || 0) - 1; clGardes() }; $('#cg-n').onclick = () => { window._clGS = (window._clGS || 0) + 1; clGardes() }; $('#cg-a').onclick = () => { window._clGS = 0; clGardes() };
    $('#cg-i').onclick = () => rhPapier(L('Planning des gardes', 'Duty roster'), `<h1>${esc(L('PLANNING DES GARDES', 'DUTY ROSTER'))} — ${coDateL(jours[0])}</h1><table><tr><th></th><th>${esc(L('Jour', 'Day'))}</th><th>${esc(L('Nuit', 'Night'))}</th></tr>${jours.map(j => `<tr><td><b>${new Date(j + 'T12:00:00').toLocaleDateString(LOC(), { weekday: 'long', day: '2-digit', month: 'short' })}</b></td>${['jour', 'nuit'].map(c => `<td>${gs.filter(x => x.jour === j && x.creneau === c).map(x => esc(soi(x.soignant_id)?.nom || '') + (x.service ? ' (' + esc(x.service) + ')' : '')).join('<br>')}</td>`).join('')}</tr>`).join('')}</table>`);
    if (g) document.querySelectorAll('[data-gj]').forEach(td => { td.style.cursor = 'pointer'; td.onclick = () => {
      const j = td.dataset.gj, c = td.dataset.gc, deja = gs.filter(x => x.jour === j && x.creneau === c);
      modale(`<h3>${esc(c === 'jour' ? L('Garde de jour', 'Day shift') : L('Garde de nuit', 'Night shift'))} · ${coDateL(j)}</h3>
        <div class="cl-coche">${SOI.filter(s => s.actif && s.fonction !== 'administratif').map(s => { const d = deja.find(x => x.soignant_id === s.id);
          return `<label><input type="checkbox" name="s_${s.id}" ${d ? 'checked' : ''}> ${esc(s.nom)} <small>${esc(lib(FONCTIONS, s.fonction))}</small><input name="v_${s.id}" placeholder="${esc(L('Service', 'Unit'))}" value="${esc(d?.service || s.specialite || '')}" style="max-width:140px;margin-left:auto"></label>` }).join('')}</div>`,
        async f => { const v = Object.fromEntries(new FormData(f));
          const garder = SOI.filter(s => v['s_' + s.id]).map(s => ({ espace_id: E(), soignant_id: s.id, jour: j, creneau: c, service: v['v_' + s.id] || null }));
          const ret = deja.filter(x => !v['s_' + x.soignant_id]).map(x => x.id);
          if (ret.length) verif(await sb.from('cl_gardes').delete().in('id', ret));
          if (garder.length) verif(await sb.from('cl_gardes').upsert(garder, { onConflict: 'soignant_id,jour,creneau' }));
          toast(L('Planning mis à jour ✓', 'Roster updated ✓')); clGardes() });
    } });
  }

  /* ---------------- Honoraires ---------------- */
  async function clHonoraires() {
    await soignants(true);
    const mois = window._clHM || coAuj().slice(0, 7);
    const d1 = new Date(mois + '-01T00:00:00'), d2 = new Date(d1); d2.setMonth(d2.getMonth() + 1);
    const [co, pa] = await Promise.all([sb.from('cl_consultations').select('*').eq('espace_id', E()).eq('statut', 'terminee').gte('date', d1.toISOString()).lt('date', d2.toISOString()).then(verif),
      sb.from('cl_honoraires').select('*').eq('espace_id', E()).eq('mois', mois).then(verif)]);
    const lignes = SOI.filter(s => s.actif || pa.some(p => p.soignant_id === s.id)).map(s => { const a = co.filter(x => x.soignant_id === s.id), ca = a.reduce((t, x) => t + (+x.montant || 0), 0);
      const du = s.mode_paie === 'salaire' ? +s.salaire : s.mode_paie === 'pourcentage' ? Math.round(ca * s.taux / 100) : a.length * s.taux;
      return { s, a, ca, du, p: pa.find(p => p.soignant_id === s.id) } }).filter(x => x.du > 0 || x.a.length || x.p);
    const tot = lignes.reduce((t, x) => t + x.du, 0), paye = lignes.reduce((t, x) => t + (x.p ? +x.p.montant : 0), 0), caT = co.reduce((t, x) => t + (+x.montant || 0), 0);
    const ms = Array.from({ length: 12 }, (_, i) => { const d = new Date(); d.setDate(1); d.setMonth(d.getMonth() - i); return d.toISOString().slice(0, 7) });
    C().innerHTML = entete(esc(L('Honoraires et salaires', 'Fees & salaries')), `<select id="ch-m" style="width:auto">${ms.map(m => `<option value="${m}" ${m === mois ? 'selected' : ''}>${new Date(m + '-15').toLocaleDateString(LOC(), { month: 'long', year: 'numeric' })}</option>`).join('')}</select>`) + `
     <div class="kpis"><div class="kpi p"><small>${esc(L('À verser ce mois', 'Due this month'))}</small><div>${fmt(tot)}</div></div>
      <div class="kpi"><small>${esc(L('Déjà versé', 'Paid'))}</small><div>${fmt(paye)}</div></div>
      <div class="kpi"><small>${esc(L('Reste à verser', 'Left to pay'))}</small><div>${fmt(Math.max(0, tot - paye))}</div></div>
      <div class="kpi"><small>${esc(L('Actes réalisés', 'Procedures billed'))}</small><div>${fmt(caT)}</div><small>${co.length} ${esc(L('consultation(s)', 'consultation(s)'))}</small></div></div>
     <div class="carte" style="overflow-x:auto"><table class="rh-compact" style="width:100%"><tr><th>${esc(L('Nom', 'Name'))}</th><th>${esc(L('Mode', 'Basis'))}</th><th style="text-align:right">${esc(L('Actes', 'Proc.'))}</th><th style="text-align:right">${esc(L('Chiffre généré', 'Revenue'))}</th><th style="text-align:right">${esc(L('À verser', 'Due'))}</th><th></th></tr>
      ${lignes.map(x => `<tr><td><b>${esc(x.s.nom)}</b><br><small>${esc(lib(FONCTIONS, x.s.fonction))}</small></td><td><small>${esc(lib(PAIES, x.s.mode_paie))}${x.s.mode_paie === 'pourcentage' ? ' ' + x.s.taux + ' %' : x.s.mode_paie === 'par_acte' ? ' ' + fmt(x.s.taux) : ''}</small></td>
        <td style="text-align:right">${x.a.length}</td><td style="text-align:right">${fmt(x.ca)}</td><td style="text-align:right"><b>${fmt(x.du)}</b></td>
        <td style="text-align:right;white-space:nowrap">${x.a.length ? `<button class="btn lien pt" data-hr="${x.s.id}">🖨️</button>` : ''}${x.p ? rhTag(L('Versé ✓', 'Paid ✓')) : ro() ? '' : `<button class="btn pt" data-hp="${x.s.id}">${esc(L('Verser', 'Pay'))}</button>`}</td></tr>`).join('') || `<tr><td colspan="6" class="vide">${esc(L('Rien pour ce mois.', 'Nothing this month.'))}</td></tr>`}</table></div>
     <p style="color:var(--mut);font-size:13px">${esc(L('« Verser » enregistre automatiquement la dépense dans vos comptes (catégorie Salaires et honoraires).', '“Pay” records the expense in your books automatically (Salaries & fees).'))}</p>`;
    $('#ch-m').onchange = e => { window._clHM = e.target.value; clHonoraires() };
    document.querySelectorAll('[data-hp]').forEach(b => b.onclick = async () => { const x = lignes.find(z => z.s.id === b.dataset.hp);
      if (!confirm(L(`Verser ${fmt(x.du)} à ${x.s.nom} ?`, `Pay ${fmt(x.du)} to ${x.s.nom}?`))) return;
      try { const d = verif(await sb.from('co_depenses').insert({ espace_id: E(), date_depense: coAuj(), categorie: L('Salaires et honoraires', 'Salaries & fees'), libelle: (x.s.mode_paie === 'salaire' ? L('Salaire ', 'Salary ') : L('Honoraires ', 'Fees ')) + x.s.nom + ' — ' + mois, montant: x.du, mode: 'especes', created_by: CTX.membre.id }).select().single());
        verif(await sb.from('cl_honoraires').insert({ espace_id: E(), soignant_id: x.s.id, mois, montant: x.du, depense_id: d.id })); toast(L('Versement enregistré ✓', 'Payment recorded ✓')); clHonoraires() } catch (e) { toast(erreurMsg(e)) } });
    document.querySelectorAll('[data-hr]').forEach(b => b.onclick = () => { const x = lignes.find(z => z.s.id === b.dataset.hr);
      rhPapier(L('Relevé d’honoraires', 'Fee statement'), `<h1>${esc(L('RELEVÉ D’HONORAIRES', 'FEE STATEMENT'))}</h1><p><b>${esc(x.s.nom)}</b>${x.s.specialite ? ' — ' + esc(x.s.specialite) : ''}<br>${esc(L('Période : ', 'Period: '))}${new Date(mois + '-15').toLocaleDateString(LOC(), { month: 'long', year: 'numeric' })}</p>
       <table><tr><th>Date</th><th>${esc(L('Patient', 'Patient'))}</th><th>${esc(L('Acte', 'Procedure'))}</th><th class="r">${esc(L('Montant', 'Amount'))}</th></tr>${x.a.map(c => `<tr><td>${coDateL(c.date)}</td><td>${esc(coCli(c.patient_id)?.nom || '')}</td><td>${esc(coPre(c.prestation_id)?.nom || c.diagnostic || '')}</td><td class="r">${fmt(c.montant)}</td></tr>`).join('')}
       <tr><td colspan="3"><b>${esc(L('Total des actes', 'Total procedures'))}</b></td><td class="r"><b>${fmt(x.ca)}</b></td></tr><tr><td colspan="3"><b>${esc(L('Honoraires dus', 'Fees due'))} (${esc(lib(PAIES, x.s.mode_paie))}${x.s.mode_paie === 'pourcentage' ? ' ' + x.s.taux + ' %' : ''})</b></td><td class="r"><b>${fmt(x.du)}</b></td></tr></table>
       <div class="sig"><span>${esc(L('Le médecin', 'The doctor'))}</span><span>${esc(L('La direction', 'Management'))}</span></div>`) });
  }

  /* ---------------- Tableau de bord : file d'attente + hospitalisés ---------------- */
  async function clAccueil(z) {
    try {
      await soignants();
      const auj = new Date(); auj.setHours(0, 0, 0, 0);
      const [co, ho] = await Promise.all([sb.from('cl_consultations').select('*').eq('espace_id', E()).gte('date', auj.toISOString()).order('date').limit(50).then(verif),
        sb.from('cl_hospitalisations').select('*').eq('espace_id', E()).eq('statut', 'en_cours').then(verif)]);
      const att = co.filter(x => x.statut !== 'terminee'), lits = CO_REF.ressources.filter(r => r.type === 'lit');
      z.innerHTML = `<div class="deux" style="margin-bottom:14px"><div class="carte"><h3 style="margin-top:0;display:flex;justify-content:space-between;align-items:center">🩺 ${esc(L('Salle d’attente', 'Waiting room'))} (${att.length})<button class="btn lien pt" onclick="aller('cl_consult')">${esc(L('Consultations', 'Consultations'))} →</button></h3>
         ${att.length ? `<div class="rh-liste">${att.map(x => `<div data-ac="${x.id}" style="cursor:pointer"><span><b>${esc(coCli(x.patient_id)?.nom || '—')}</b><br><small>${coHeure(x.date)} · ${esc([x.motif, soi(x.soignant_id)?.nom].filter(Boolean).join(' · '))}</small></span>${tag(x.statut)}</div>`).join('')}</div>` : `<div class="vide">${esc(L('Personne en attente', 'Nobody waiting'))} · ${co.length} ${esc(L('consultation(s) aujourd’hui', 'consultation(s) today'))}</div>`}</div>
        <div class="carte"><h3 style="margin-top:0;display:flex;justify-content:space-between;align-items:center">🛏️ ${esc(L('Hospitalisés', 'In-patients'))} (${ho.length}${lits.length ? ' / ' + lits.length + ' ' + esc(L('lits', 'beds')) : ''})<button class="btn lien pt" onclick="aller('cl_hospit')">${esc(L('Tout voir', 'See all'))} →</button></h3>
         ${ho.length ? `<div class="rh-liste">${ho.map(x => `<div><span><b>${esc(coCli(x.patient_id)?.nom || '—')}</b><br><small>${esc([coRes(x.lit_id)?.nom, x.motif].filter(Boolean).join(' · '))}</small></span><small>${ilYa(x.entree)} ${esc(L('j', 'd'))}</small></div>`).join('')}</div>` : `<div class="vide">${esc(L('Aucun patient hospitalisé', 'No in-patient'))}</div>`}</div></div>`;
      document.querySelectorAll('[data-ac]').forEach(b => b.onclick = () => clVoir(co.find(x => x.id === b.dataset.ac)));
    } catch (e) { z.innerHTML = '' }
  }

  const st = document.createElement('style');
  st.textContent = `.cl-const{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px}.cl-const label{font-size:12px}
   .cl-chips{display:flex;flex-wrap:wrap;gap:8px}.cl-chips span{background:#f6f8fa;border:1px solid var(--bord);border-radius:10px;padding:6px 10px;display:flex;flex-direction:column;min-width:90px}.cl-chips small{color:var(--mut);font-size:11px}
   .cl-gt{width:100%}.cl-gt th{text-align:left;white-space:nowrap;text-transform:capitalize}.cl-gt td{vertical-align:top;min-width:150px}.cl-gt tr.auj th{color:var(--p)}
   .cl-g{display:inline-flex;flex-direction:column;background:#eef6ff;border-radius:8px;padding:4px 8px;margin:2px 4px 2px 0;font-size:13px}.cl-g small{color:var(--mut);font-size:11px}
   .cl-coche label{display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #f2f4f7}.cl-coche small{color:var(--mut)}`;
  document.head.appendChild(st);

  Object.assign(CO_IC, {
    cl_consult: '<path d="M4.8 2.3A.3.3 0 105 2H4a2 2 0 00-2 2v5a6 6 0 006 6 6 6 0 006-6V4a2 2 0 00-2-2h-1a.2.2 0 10.3.3"/><path d="M8 15v1a6 6 0 006 6 6 6 0 006-6v-4"/><circle cx="20" cy="10" r="2"/>',
    cl_hospit: '<path d="M2 4v16M2 8h18a2 2 0 012 2v10M2 17h20M6 8v9"/>',
    cl_equipe: '<path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/>',
    cl_gardes: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    cl_honoraires: '<rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/><path d="M6 12h.01M18 12h.01"/>'
  });
  Object.assign(CO_PAGE_MOD, { cl_consult: 'consultations', cl_hospit: 'hospitalisation', cl_equipe: 'equipe_medicale', cl_gardes: 'gardes', cl_honoraires: 'honoraires' });
  Object.assign(window, { clConsult, clForm, clVoir, clFiche, clHospit, clEquipe, clGardes, clHonoraires, clAccueil });
  Object.assign(window.RH_VUES, { cl_consult: clConsult, cl_hospit: clHospit, cl_equipe: clEquipe, cl_gardes: clGardes, cl_honoraires: clHonoraires });
})();
