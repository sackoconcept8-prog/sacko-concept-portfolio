/* Service worker de l'espace de gestion : fonctionnement sans réseau et notifications. */
const VERSION = "espace-v1";
const COQUILLE = ["./", "./index.html", "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(COQUILLE.map(u => c.add(new Request(u, { cache: "reload" })).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== VERSION).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});

// Page : réseau d'abord, copie en cache si pas de réseau. Bibliothèques et images : cache d'abord.
self.addEventListener("fetch", e => {
  const r = e.request, u = new URL(r.url);
  if (r.method !== "GET") return;
  if (u.hostname.endsWith("supabase.co")) return; // données : jamais en cache
  const page = r.mode === "navigate";
  if (page) {
    e.respondWith(fetch(r).then(rep => { const c = rep.clone(); caches.open(VERSION).then(x => x.put("./index.html", c)); return rep; })
      .catch(() => caches.match("./index.html")));
    return;
  }
  const statique = /cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.(googleapis|gstatic)\.com/.test(u.hostname) || /\.(png|jpg|jpeg|webp|svg|woff2)$/.test(u.pathname);
  if (!statique) return;
  e.respondWith(caches.match(r).then(m => m || fetch(r).then(rep => { if (rep.ok || rep.type === "opaque") { const c = rep.clone(); caches.open(VERSION).then(x => x.put(r, c)); } return rep; })));
});

// Notifications (alerte SOS, incident grave)
self.addEventListener("push", e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { titre: "Nouvelle alerte", corps: e.data ? e.data.text() : "" }; }
  e.waitUntil(self.registration.showNotification(d.titre || "Nouvelle alerte", {
    body: d.corps || "", tag: d.tag || "alerte", renotify: true, requireInteraction: !!d.sos,
    vibrate: d.sos ? [400, 150, 400, 150, 400, 150, 800] : [200, 100, 200],
    icon: "../assets/sacko-logo-vert-192.png", badge: "../assets/sacko-logo-vert-96.png",
    data: { url: d.url || "./" }
  }));
});
self.addEventListener("notificationclick", e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "./";
  e.waitUntil(self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(l => {
    for (const c of l) if ("focus" in c) { c.navigate(url).catch(() => {}); return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
