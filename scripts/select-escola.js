const EscolaPicker = (() => {

  const IBGE_ESTADOS = "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome";
  const IBGE_CIDADES = (uf) => `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`;

  // API dadosabertosbr — busca escolas por município e nome
  // Docs: http://educacao.dadosabertosbr.org/api
  const ESCOLAS_API  = (cidade, uf, termo) =>
    `http://educacao.dadosabertosbr.org/api/escolas/pesquisando?municipio=${encodeURIComponent(cidade)}&uf=${uf}&nome=${encodeURIComponent(termo)}&situacaoFuncionamento=1`;

  const cache = {};
  async function get(url) {
    if (cache[url]) return cache[url];
    const res  = await fetch(url);
    const data = await res.json();
    cache[url] = data;
    return data;
  }

  function criarHTML(containerId, index = 0, removivel = false) {
    return `
      <div class="escola-picker" id="picker-${containerId}-${index}" data-index="${index}">
        <div class="picker-row">
          <div class="picker-col">
            <label>Estado</label>
            <div class="select-wrap">
              <select class="picker-estado" onchange="EscolaPicker.onEstado(this)">
                <option value="" disabled selected>Selecione</option>
              </select>
            </div>
          </div>
          <div class="picker-col">
            <label>Cidade</label>
            <div class="select-wrap">
              <select class="picker-cidade" disabled onchange="EscolaPicker.onCidade(this)">
                <option value="" disabled selected>Selecione</option>
              </select>
            </div>
          </div>
        </div>

        <label style="margin-top:8px; display:block;">Escola</label>
        <div style="position:relative;">
          <input class="picker-escola-input" type="text"
            placeholder="Digite o nome da escola..." disabled
            oninput="EscolaPicker.onBusca(this)" autocomplete="off">
          <div class="picker-spinner" style="display:none; position:absolute; right:12px; top:50%; transform:translateY(-50%); font-size:0.78em; color:#aaa;">Buscando...</div>
          <ul class="picker-sugestoes" style="display:none;"></ul>
        </div>
        <input class="picker-escola-valor" type="hidden">
        <p class="picker-escola-selecionada" style="display:none; font-size:0.82em; color:var(--cor-botoes); margin:4px 0 0; font-weight:600;"></p>

        ${removivel ? `<button type="button" class="picker-remover" onclick="EscolaPicker.remover(this)">
          <i class="bi bi-trash"></i> Remover escola
        </button>` : ""}
      </div>`;
  }

  function injetarEstilos() {
    if (document.getElementById("escola-picker-styles")) return;
    const s = document.createElement("style");
    s.id = "escola-picker-styles";
    s.textContent = `
      .escola-picker { display:flex; flex-direction:column; gap:6px; }
      .picker-row { display:flex; gap:8px; }
      .picker-col { flex:1; display:flex; flex-direction:column; gap:4px; }
      .picker-col label, .escola-picker > label {
        font-size:0.9em; font-weight:600; color:var(--cor-titulo);
      }
      .select-wrap select, .picker-escola-input {
        width:100%; box-sizing:border-box;
        border:1px solid #ddd; border-radius:12px;
        padding:0 12px; height:44px; font-size:0.9em;
        font-family:inherit; background:#fff; outline:none;
        transition:border-color 0.2s; color:var(--cor-titulo);
        -webkit-appearance:none; appearance:none;
      }
      .select-wrap { position:relative; }
      .select-wrap::after {
        content:""; position:absolute; right:12px; top:50%;
        transform:translateY(-50%);
        border:5px solid transparent;
        border-top-color:#aaa; margin-top:3px; pointer-events:none;
      }
      .select-wrap select:focus, .picker-escola-input:focus { border-color:var(--cor-botoes); }
      .select-wrap select:disabled, .picker-escola-input:disabled {
        background:#f5f5f5; color:#aaa; cursor:not-allowed;
      }
      .picker-sugestoes {
        position:absolute; top:100%; left:0; right:0;
        background:#fff; border:1px solid #ddd; border-radius:12px;
        list-style:none; margin:4px 0 0; padding:4px 0;
        z-index:50; max-height:220px; overflow-y:auto;
        box-shadow:0 4px 16px rgba(0,0,0,0.1);
      }
      .picker-sugestoes li {
        padding:10px 14px; font-size:0.88em; cursor:pointer;
        transition:background 0.1s; border-bottom:1px solid #f5f5f5;
      }
      .picker-sugestoes li:last-child { border-bottom:none; }
      .picker-sugestoes li:hover { background:#f3f3f8; }
      .picker-sugestoes li .sug-nome { font-weight:600; color:var(--cor-titulo); }
      .picker-sugestoes li .sug-end  { font-size:0.78em; color:var(--cor-paragrafo); margin-top:2px; }
      .picker-remover {
        background:transparent; border:1.5px solid #fee2e2;
        color:#e53e3e; border-radius:10px; padding:7px 12px;
        font-size:0.82em; font-weight:600; cursor:pointer;
        display:flex; align-items:center; gap:6px;
        margin-top:4px; transition:background 0.15s; width:fit-content;
      }
      .picker-remover:hover { background:#fee2e2; }
      .picker-adicionar {
        background:transparent; border:1.5px dashed var(--cor-botoes);
        color:var(--cor-botoes); border-radius:12px; padding:10px;
        font-size:0.9em; font-weight:600; cursor:pointer;
        display:flex; align-items:center; justify-content:center; gap:8px;
        width:100%; margin-top:4px; transition:background 0.15s;
      }
      .picker-adicionar:hover { background:rgba(116,99,227,0.06); }
      .escolas-container { display:flex; flex-direction:column; gap:16px; }
      .escola-picker + .escola-picker { padding-top:14px; border-top:1px solid #ebebf2; }
    `;
    document.head.appendChild(s);
  }

  async function init(containerId, { multiplas = false } = {}) {
    injetarEstilos();
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `<div class="escolas-container">${criarHTML(containerId, 0, false)}</div>`;

    if (multiplas) {
      container.innerHTML += `
        <button type="button" class="picker-adicionar" id="btn-add-escola-${containerId}"
          onclick="EscolaPicker.adicionarEscola('${containerId}')">
          <i class="bi bi-plus-circle"></i> Adicionar outra escola
        </button>`;
    }

    await carregarEstados(containerId, 0);
  }

  async function carregarEstados(containerId, index) {
    const picker = document.getElementById(`picker-${containerId}-${index}`);
    const select = picker.querySelector(".picker-estado");
    try {
      const estados = await get(IBGE_ESTADOS);
      estados.forEach(e => {
        const opt = document.createElement("option");
        opt.value = e.sigla;
        opt.textContent = `${e.sigla} — ${e.nome}`;
        select.appendChild(opt);
      });
    } catch {
      select.innerHTML = `<option disabled>Erro ao carregar estados</option>`;
    }
  }

  async function onEstado(selectEl) {
    const picker    = selectEl.closest(".escola-picker");
    const uf        = selectEl.value;
    const selCidade = picker.querySelector(".picker-cidade");
    const inputEsc  = picker.querySelector(".picker-escola-input");

    selCidade.disabled = true;
    selCidade.innerHTML = `<option>Carregando cidades...</option>`;
    inputEsc.disabled = true;
    limparSelecao(picker);

    try {
      const cidades = await get(IBGE_CIDADES(uf));
      selCidade.innerHTML = `<option value="" disabled selected>Selecione a cidade</option>`;
      cidades.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c.nome;
        opt.textContent = c.nome;
        selCidade.appendChild(opt);
      });
      selCidade.disabled = false;
    } catch {
      selCidade.innerHTML = `<option disabled>Erro ao carregar cidades</option>`;
    }
  }

  function onCidade(selectEl) {
    const picker = selectEl.closest(".escola-picker");
    const input  = picker.querySelector(".picker-escola-input");
    input.disabled   = false;
    input.value      = "";
    input.placeholder = "Digite o nome da escola...";
    limparSelecao(picker);
    picker._uf     = picker.querySelector(".picker-estado").value;
    picker._cidade = selectEl.value;
  }

  let debounceTimer;
  async function onBusca(inputEl) {
    const picker  = inputEl.closest(".escola-picker");
    const sugs    = picker.querySelector(".picker-sugestoes");
    const spinner = picker.querySelector(".picker-spinner");
    const termo   = inputEl.value.trim();

    limparSelecao(picker);
    sugs.style.display = "none";
    if (termo.length < 2) return;

    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      spinner.style.display = "block";
      try {
        const uf     = picker._uf;
        const cidade = picker._cidade;
        const escolas = await buscarEscolas(termo, cidade, uf);

        spinner.style.display = "none";
        sugs.innerHTML = "";

        if (!escolas.length) {
          sugs.innerHTML = `<li style="color:var(--cor-paragrafo);font-size:0.85em;cursor:default;">
            Nenhuma escola encontrada. Tente digitar mais letras.
          </li>`;
          sugs.style.display = "block";
          return;
        }

        escolas.forEach(e => {
          const li = document.createElement("li");
          li.innerHTML = `
            <div class="sug-nome">${e.nome}</div>
            <div class="sug-end">${e.endereco || cidade + " — " + uf}</div>`;
          li.addEventListener("mousedown", (ev) => {
            ev.preventDefault(); // evita blur antes do click
            selecionarEscola(picker, e);
          });
          sugs.appendChild(li);
        });

        sugs.style.display = "block";
      } catch {
        spinner.style.display = "none";
        // Fallback: usa o que o usuário digitou
        sugs.innerHTML = `<li>
          <div class="sug-nome">${termo}</div>
          <div class="sug-end">${picker._cidade || ""} — ${picker._uf || ""} (digitado manualmente)</div>
        </li>`;
        sugs.querySelector("li").addEventListener("mousedown", (ev) => {
          ev.preventDefault();
          selecionarEscola(picker, { nome: termo, endereco: `${picker._cidade} — ${picker._uf}`, id: "" });
        });
        sugs.style.display = "block";
      }
    }, 400);
  }

  async function buscarEscolas(termo, cidade, uf) {
    // Tenta API dadosabertosbr
    try {
      const url  = ESCOLAS_API(cidade, uf, termo);
      const data = await get(url);
      const lista = Array.isArray(data) ? data : (data.items || data.escolas || []);
      return lista.slice(0, 10).map(e => ({
        nome:     e.nome || e.nomeEscola || e.NO_ENTIDADE || termo,
        endereco: e.endereco || e.logradouro || `${cidade} — ${uf}`,
        id:       e.codEscola || e.co_entidade || e.id || "",
      }));
    } catch {
      // Fallback: retorna o termo digitado como opção manual
      return [{ nome: termo, endereco: `${cidade} — ${uf}`, id: "" }];
    }
  }

  function selecionarEscola(picker, escola) {
    const input  = picker.querySelector(".picker-escola-input");
    const hidden = picker.querySelector(".picker-escola-valor");
    const label  = picker.querySelector(".picker-escola-selecionada");
    const sugs   = picker.querySelector(".picker-sugestoes");

    input.value  = escola.nome;
    hidden.value = JSON.stringify({
      nome:   escola.nome,
      cidade: picker._cidade,
      uf:     picker._uf,
      id:     escola.id,
    });

    label.textContent   = `✓ ${escola.nome}`;
    label.style.display = "block";
    sugs.style.display  = "none";
  }

  function limparSelecao(picker) {
    const hidden = picker.querySelector(".picker-escola-valor");
    const label  = picker.querySelector(".picker-escola-selecionada");
    if (hidden) hidden.value = "";
    if (label)  label.style.display = "none";
  }

  let _contadores = {};
  function adicionarEscola(containerId) {
    _contadores[containerId] = (_contadores[containerId] || 0) + 1;
    const index     = _contadores[containerId];
    const container = document.getElementById(containerId).querySelector(".escolas-container");
    const div = document.createElement("div");
    div.innerHTML = criarHTML(containerId, index, true);
    container.appendChild(div.firstElementChild);
    carregarEstados(containerId, index);
  }

  function remover(btnEl) { btnEl.closest(".escola-picker").remove(); }

  function lerEscolas(containerId) {
    const container = document.getElementById(containerId);
    const valores = [];
    container.querySelectorAll(".picker-escola-valor").forEach(h => {
      if (h.value) {
        try { valores.push(JSON.parse(h.value)); } catch {}
      }
    });
    return valores;
  }

  function validar(containerId) { return lerEscolas(containerId).length > 0; }

  return { init, onEstado, onCidade, onBusca, adicionarEscola, remover, lerEscolas, validar };
})();