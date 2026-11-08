const C="sacko-devis-v7";
const CORE=["./","./index.html","./manifest.json","../assets/sacko-logo-96.png","../assets/sacko-logo-512.png","../sacko-config.js",
 "https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.js","https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(CORE.map(u=>c.add(new Request(u,{mode:u.startsWith("http")?"no-cors":"same-origin"})).catch(()=>{}))))).then(()=>self.skipWaiting())});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  if(u.hostname.includes("script.google"))return;
  if(e.request.mode==="navigate"||u.pathname.endsWith(".js")&&u.origin===location.origin){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(C).then(c=>c.put(e.request,cp));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("./index.html"))));return}
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));return res})));
});
