// CHEGG site — shared behaviour

const SERVER_IP = "chegg.asrv.qzz.io";

function initNavToggle(){
  const nav = document.querySelector(".site-nav");
  const btn = document.querySelector(".nav-toggle");
  if(!btn || !nav) return;
  btn.addEventListener("click", () => nav.classList.toggle("open"));
}

function escapeHtml(s){
  return String(s == null ? "" : s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeParseArray(json, fallback){
  try{
    const v = JSON.parse(json);
    return Array.isArray(v) ? v : fallback;
  }catch(e){
    return fallback;
  }
}

function initCopyButtons(){
  document.querySelectorAll("[data-copy-ip]").forEach(btn => {
    const label = btn.querySelector(".copy-label");
    btn.addEventListener("click", async () => {
      const ip = btn.getAttribute("data-ip") || SERVER_IP;
      try{
        await navigator.clipboard.writeText(ip);
      }catch(e){
        const ta = document.createElement("textarea");
        ta.value = ip;
        document.body.appendChild(ta);
        ta.select();
        try{ document.execCommand("copy"); }catch(_){}
        document.body.removeChild(ta);
      }
      const original = label ? label.textContent : null;
      if(label) label.textContent = "Copied!";
      btn.classList.add("copied");
      setTimeout(() => {
        if(label && original) label.textContent = original;
        btn.classList.remove("copied");
      }, 1600);
    });
  });
}

// Renders a 7x7 stylized move/attack pattern grid into `container`
function renderPatternGrid(container, movePattern = [], attackPattern = []){
  container.innerHTML = "";
  const size = 7;
  const center = 3;
  const moveSet = new Set(movePattern.map(([r,c]) => `${r},${c}`));
  const attackSet = new Set(attackPattern.map(([r,c]) => `${r},${c}`));
  for(let r = 0; r < size; r++){
    for(let c = 0; c < size; c++){
      const dr = r - center, dc = c - center;
      const cell = document.createElement("div");
      cell.className = "cell";
      if(dr === 0 && dc === 0){
        cell.classList.add("center");
      } else if(attackSet.has(`${dr},${dc}`)){
        cell.classList.add("attack");
      } else if(moveSet.has(`${dr},${dc}`)){
        cell.classList.add("move");
      }
      container.appendChild(cell);
    }
  }
}

function tierLabel(tier){
  return { king:"King", offense:"Offense", support:"Support", utility:"Utility", defense:"Defense" }[tier] || tier;
}

function renderMinionCards(){
  const grid = document.querySelector("#minion-grid");
  if(!grid || typeof MINIONS === "undefined") return;

  MINIONS.forEach(m => {
    const card = document.createElement("article");
    card.className = "minion-card";
    card.dataset.tier = m.tier;
    card.dataset.cost = m.cost;

    const moveP = Array.isArray(m.movePattern) ? m.movePattern : [];
    const attackP = Array.isArray(m.attackPattern) ? m.attackPattern : [];
    card.innerHTML = `
      <div class="m-head">
        <div class="m-icon"><img src="${escapeHtml(m.img)}" alt="${escapeHtml(m.name)} spawn egg icon" loading="lazy"></div>
        <div>
          <h3 class="m-name">${escapeHtml(m.name)}</h3>
          <span class="m-tag tag-${escapeHtml(m.tier)}">${escapeHtml(tierLabel(m.tier))}</span>
        </div>
        <span class="m-cost">${escapeHtml(m.costLabel ? m.costLabel : m.cost + " mana")}</span>
      </div>
      <div class="m-body">
        <div class="m-desc">
          <dl>
            <dt>Move</dt><dd>${escapeHtml(m.move)}</dd>
            <dt>Attack</dt><dd>${escapeHtml(m.attack)}</dd>
            <dt>Ability</dt><dd>${escapeHtml(m.ability)}</dd>
          </dl>
          ${m.copyLimit ? `<div class="m-limit">${escapeHtml(m.copyLimit)}</div>` : ""}
        </div>
        <div>
          <div class="pattern-grid"></div>
        </div>
      </div>
    `;
    grid.appendChild(card);
    renderPatternGrid(card.querySelector(".pattern-grid"), moveP, attackP);
  });

  initMinionFilters();
}

function initMinionFilters(){
  const chips = document.querySelectorAll(".filter-chip");
  const grid = document.querySelector("#minion-grid");
  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      const filter = chip.dataset.filter;
      grid.querySelectorAll(".minion-card").forEach(card => {
        const show = filter === "all" || card.dataset.tier === filter;
        card.style.display = show ? "" : "none";
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNavToggle();
  initCopyButtons();
  renderMinionCards();

  // highlight the matching example pattern grid on the how-to-play page, if present
  document.querySelectorAll("[data-example-pattern]").forEach(el => {
    renderPatternGrid(el, safeParseArray(el.dataset.move || "[]", []), safeParseArray(el.dataset.attack || "[]", []));
  });
});
