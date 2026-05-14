// ============================================================
//  Aprendi+ | sw.js — Service Worker
//  Habilita funcionamento offline e cache de assets
// ============================================================

const CACHE_NAME  = "aprendimais-v1";
const CACHE_URLS  = [
  "/",
  "/register/index.html",
  "/dashboard/aluno/index.html",
  "/dashboard/aluno/aulas.html",
  "/dashboard/aluno/mensagens.html",
  "/dashboard/aluno/perfil.html",
  "/dashboard/aluno/desafio.html",
  "/dashboard/professor/index.html",
  "/dashboard/professor/turma.html",
  "/dashboard/professor/mensagens.html",
  "/dashboard/professor/perfil.html",
  "/scripts/Database.js",
  "/scripts/questoes.js",
  "/scripts/desafio.js",
  "/scripts/aluno-index.js",
  "/scripts/aluno-ia.js",
  "/scripts/aulas.js",
  "/scripts/mensagens.js",
  "/scripts/professor-index.js",
  "/scripts/escolaPicker.js",
  "/css/style.css",
  "/images/logo.png",
  "/images/favicon.ico",
  "/images/icon-192.png",
  "/images/icon-512.png",
];

// ── Instalação: faz cache dos arquivos principais ─────────────
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Adiciona um por um pra não falhar tudo se um arquivo não existir
      return Promise.allSettled(
        CACHE_URLS.map(url => cache.add(url).catch(() => null))
      );
    })
  );
  self.skipWaiting();
});

// ── Ativação: limpa caches antigos ────────────────────────────
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// ── Fetch: serve do cache, busca na rede se não tiver ─────────
self.addEventListener("fetch", (e) => {
  // Ignora requisições que não são GET
  if (e.request.method !== "GET") return;

  // Ignora APIs externas (IBGE, CDNs)
  const url = new URL(e.request.url);
  if (!url.origin.includes(self.location.origin)) {
    return; // deixa passar direto pra rede
  }

  e.respondWith(
    caches.match(e.request).then((cached) => {
      if (cached) return cached;

      return fetch(e.request)
        .then((response) => {
          // Salva no cache pra próxima vez
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline e não tem cache — retorna página offline se for HTML
          if (e.request.headers.get("accept")?.includes("text/html")) {
            return caches.match("/register/index.html");
          }
        });
    })
  );
});