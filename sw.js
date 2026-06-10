// ============================================================
//  Aprendi+ | sw.js — Service Worker
//  Habilita funcionamento offline e cache de assets
// ============================================================

const CACHE_NAME  = "Aprendi+";
const CACHE_URLS  = [
  "/Projeto-AprendiMais/",
  "/Projeto-AprendiMais/register/index.html",
  "/Projeto-AprendiMais/dashboard/aluno/index.html",
  "/Projeto-AprendiMais/dashboard/aluno/aulas.html",
  "/Projeto-AprendiMais/dashboard/aluno/mensagens.html",
  "/Projeto-AprendiMais/dashboard/aluno/perfil.html",
  "/Projeto-AprendiMais/dashboard/aluno/desafio.html",
  "/Projeto-AprendiMais/dashboard/professor/index.html",
  "/Projeto-AprendiMais/dashboard/professor/turma.html",
  "/Projeto-AprendiMais/dashboard/professor/mensagens.html",
  "/Projeto-AprendiMais/dashboard/professor/perfil.html",
  "/Projeto-AprendiMais/scripts/Database.js",
  "/Projeto-AprendiMais/scripts/questoes.js",
  "/Projeto-AprendiMais/scripts/desafio.js",
  "/Projeto-AprendiMais/Projeto-AprendiMais/scripts/aluno-index.js",
  "/Projeto-AprendiMais/scripts/aluno-ia.js",
  "/Projeto-AprendiMais/scripts/aulas.js",
  "/Projeto-AprendiMais/scripts/mensagens.js",
  "/Projeto-AprendiMais/scripts/professor-index.js",
  "/Projeto-AprendiMais/scripts/escolaPicker.js",
  "/Projeto-AprendiMais/css/style.css",
  "/Projeto-AprendiMais/images/logo.png",
  "/Projeto-AprendiMais/images/favicon.ico",
  "/Projeto-AprendiMais/images/icon-192.png",
  "/Projeto-AprendiMais/images/icon-512.png",
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
            return caches.match("/Projeto-AprendiMais/register/index.html");
          }
        });
    })
  );
});