import { mkdir, rm, copyFile, readdir, readFile, cp } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { SITE } from '../site-config.js';
import { packages } from '../catalog.js';
import { renderNew1TpeProducts } from './render-1tpe-new-products.mjs';
import { renderLaunchVault1Tpe } from './render-launchvault-1tpe.mjs';

await renderNew1TpeProducts();
await renderLaunchVault1Tpe();

const root = resolve(new URL('..', import.meta.url).pathname);
const out = join(root, 'dist');
await rm(out, {recursive:true,force:true});
await mkdir(join(out,'assets'), {recursive:true});
const files = ['relecture-pack-rh.html','solutions-rh-en.html','solutions-rh.html','solutions-rh.css','solutions-rh.js','index.html','legal.html','styles.css','design.css','script.js','legal.js','site-config.js','catalog.js','robots.txt','sitemap.xml','catalogue-1tpe.html','vente-suivi-ventes-1tpe.html','vente-gestion-stocks-1tpe.html','vente-conges-absences-rh-1tpe.html','vente-launchvault-1tpe.html','vente-launchvault-500-prompts-1tpe.html','apercu-launchvault-1tpe.html','vente-ia-au-bureau-1tpe.html','vente-pack-rh-documents-1tpe.html','1tpe-product-pages.css','launchvault-1tpe.css'];
for (const file of files) await copyFile(join(root,file),join(out,file));
const previewPdfs = ['ia-bureau-extrait.pdf','pack-rh-apercu.pdf'];
const assets = (await readdir(join(root,'assets'))).filter(file=>(/\.(png|webp|woff2|svg)$/.test(file) || previewPdfs.includes(file)) && !file.endsWith('-source.png'));
for(const file of assets) await copyFile(join(root,'assets',file),join(out,'assets',file));
await mkdir(join(out,'assets','rh'), {recursive:true});
for (const file of ['pack-fr.webp','pack-en.webp','apercu-fr.pdf','dashboard-fr.webp','word-fr.webp']) await copyFile(join(root,'assets','rh',file),join(out,'assets','rh',file));
await copyFile(join(root,'.nojekyll'),join(out,'.nojekyll'));
await cp(join(root,'nova-clean-benin'),join(out,'nova-clean-benin'), {recursive:true});
await cp(join(root,'pack-nettoyage'),join(out,'pack-nettoyage'), {recursive:true});
await cp(join(root,'branding-immobilier'),join(out,'branding-immobilier'), {recursive:true});
await cp(join(root,'somaf'),join(out,'somaf'), {recursive:true});
for(const list of Object.values(packages)) for(const pack of list) {
  if(!SITE.forms[pack.form])throw new Error(`Missing order brief for ${pack.id}`);
  const payment=SITE.payments[pack.id];
  if(payment && new URL(payment).protocol!=='https:')throw new Error(`Invalid payment URL for ${pack.id}`);
}
for(const file of ['index.html','legal.html']) {
  const html=await readFile(join(root,file),'utf8');
  for(const match of html.matchAll(/(?:src|href)="\.\/([^"?#]+)"/g)) {
    await readFile(join(out,match[1]));
  }
}

for (const file of ['vente-ia-au-bureau-1tpe.html','vente-pack-rh-documents-1tpe.html','vente-launchvault-500-prompts-1tpe.html']) {
  const html = await readFile(join(out,file),'utf8');
  const language = 'fr'; // 1TPE requires French sales pages; the RH product files remain in English.
  if (!new RegExp(`<html\\b[^>]*\\blang="${language}"(?:\\s|>)`).test(html) || !html.includes('https://www.sackoconcept.com/'+file)) throw new Error('Missing language or canonical metadata: '+file);
  if (/<iframe\b/i.test(html)) throw new Error('Payment must open on 1TPE: '+file);
  if (!html.includes('mailto:') || !html.includes('id="conditions"') || !html.includes('https://www.1tpe.com/CGV.pdf')) throw new Error('Product conditions or support missing: '+file);
  for (const match of html.matchAll(/(?:src|href)="(assets\/[^"?#]+|(?:1tpe-product-pages|launchvault-1tpe)\.css)"/g)) await readFile(join(out,match[1]));
}
for (const file of previewPdfs) {
  const bytes = await readFile(join(out,'assets',file));
  if (bytes.subarray(0,5).toString() !== '%PDF-') throw new Error('Invalid preview PDF: '+file);
}

const canonical = 'https://www.sackoconcept.com/';
const home = await readFile(join(out, 'index.html'), 'utf8');
const legal = await readFile(join(out, 'legal.html'), 'utf8');
const robots = await readFile(join(out, 'robots.txt'), 'utf8');
const sitemap = await readFile(join(out, 'sitemap.xml'), 'utf8');
if (!home.includes('<link rel="canonical" href="' + canonical + '">')) throw new Error('Home page canonical URL is missing or incorrect');
if (!legal.includes('<link rel="canonical" href="' + canonical + 'legal.html">')) throw new Error('Legal page canonical URL is missing or incorrect');
if (!home.includes('<meta property="og:url" content="' + canonical + '">')) throw new Error('Open Graph website URL is missing or incorrect');
if (!home.includes('<meta property="og:image" content="' + canonical + 'assets/hero-studio.webp">')) throw new Error('Social preview image is missing or incorrect');
if (!robots.includes('Sitemap: ' + canonical + 'sitemap.xml')) throw new Error('Robots sitemap URL must use the live custom domain');
for (const route of ['', 'legal.html']) {
  if (!sitemap.includes('<loc>' + canonical + route + '</loc>')) throw new Error('Sitemap is missing ' + route);
}
if (sitemap.includes('sackoconcept8-prog.github.io')) throw new Error('Sitemap still contains the old hosting domain');

console.log(`Built ${files.length+assets.length+1} production files. All local references, custom-domain SEO metadata and order links resolved.`);

