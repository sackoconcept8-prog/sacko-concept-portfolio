import { mkdir, rm, copyFile, readdir, readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { SITE } from '../site-config.js';
import { packages } from '../catalog.js';

const root = resolve(new URL('..', import.meta.url).pathname);
const out = join(root, 'dist');
await rm(out, {recursive:true,force:true});
await mkdir(join(out,'assets'), {recursive:true});
const files = ['index.html','legal.html','styles.css','design.css','script.js','legal.js','site-config.js','catalog.js','robots.txt','sitemap.xml'];
for (const file of files) await copyFile(join(root,file),join(out,file));
const assets = (await readdir(join(root,'assets'))).filter(file=>/\.(png|webp|woff2|svg)$/.test(file) && !file.endsWith('-source.png'));
for(const file of assets) await copyFile(join(root,'assets',file),join(out,'assets',file));
await copyFile(join(root,'.nojekyll'),join(out,'.nojekyll'));
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
