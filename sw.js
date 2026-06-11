// ============================================================
//  Aprendi+ | sw.js — Service Worker
//  Corrigido para GitHub Pages (/Projeto-AprendiMais/)
// ============================================================

const BASE      = "/Projeto-AprendiMais";
const CACHE_NAME = "aprendimais-v2";

const CACHE_URLS = [
  `${BASE}/register/index.html`,
  `${BASE}/dashboard/aluno/index.html`,
  `${BASE}/dashboard/aluno/aulas.html`,
  `${BASE}/dashboard/aluno/mensagens.html`,
  `${BASE}/dashboard/aluno/perfil.html`,
  `${BASE}/dashboard/aluno/desafio.html`,
  `${BASE}/dashboard/professor/index.html`,
  `${BASE}/dashboard/professor/turma.html`,
  `${BASE}/dashboard/professor/mensagens.html`,
  `${BASE}/dashboard/professor/perfil.html`,
  `${BASE}/scripts/Database.js`,
  `${BASE}/scripts/aulasDB.js`,
  `${BASE}/scripts/questoes.js`,
  `${BASE}/scripts/desafio.js`,
  `${BASE}/scripts/aluno-index.js`,
  `${BASE}/scripts/aluno-ia.js`,
  `${BASE}/scripts/aluno-aulas.js`,
  `${BASE}/scripts/mensagens.js`,
  `${BASE}/scripts/professor-index.js`,
  `${BASE}/scripts/escolaPicker.js`,
  `${BASE}/css/style.css`,
  `${BASE}/images/logo.png`,
  `${BASE}/images/favicon.ico`,
  `${BASE}/images/icon-192.png`,
  `${BASE}/images/icon-512.png`,
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      Promise.allSettled(CACHE_URLS.map(url => cache.add(url).catch(() => null)))
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);

  // Deixa APIs externas passarem direto
  if (!url.pathname.startsWith(BASE)) return;

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;
      return fetch(e.request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return response;
        })
        .catch(() => {
          if (e.request.headers.get("accept")?.includes("text/html")) {
            return caches.match(`${BASE}/register/index.html`);
          }
        });
    })
  );
});