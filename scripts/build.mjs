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
const assets = (await readdir(join(root,'assets'))).filter(file=>/\.(webp|woff2|svg)$/.test(file));
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
console.log(`Built ${files.length+assets.length+1} production files. All local references and order links resolved.`);
