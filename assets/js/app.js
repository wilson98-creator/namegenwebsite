/* =========================================================
   NameForge - generator engine
   Each page sets window.NF_DATA = { ... } then this runs.
   ========================================================= */
(function () {
  "use strict";

  // ---------- Theme ----------
  const root = document.documentElement;
  const stored = localStorage.getItem("nf-theme"); // theme preference only, no names
  if (stored) root.setAttribute("data-theme", stored);
  else root.setAttribute("data-theme", "dark");

  function bindTheme() {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cur = root.getAttribute("data-theme") || "dark";
        const next = cur === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        localStorage.setItem("nf-theme", next);
        btn.setAttribute("aria-label", next === "dark" ? "Switch to light mode" : "Switch to dark mode");
      });
    });
  }

  // ---------- Mobile menu ----------
  function bindMenu() {
    const toggle = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-mobile-menu]");
    if (!toggle || !menu) return;
    toggle.addEventListener("click", () => {
      menu.classList.toggle("open");
    });
  }

  // ---------- Utilities ----------
  function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function pickN(arr, n) {
    const copy = arr.slice();
    const out = [];
    while (out.length < n && copy.length) {
      const i = Math.floor(Math.random() * copy.length);
      out.push(copy.splice(i, 1)[0]);
    }
    return out;
  }
  function hasDouble(seq) {
    for (let i = 1; i < seq.length; i++) {
      if (seq[i] && seq[i] === seq[i - 1]) return true;
    }
    return false;
  }

  // ---------- Favourites (in-memory only) ----------
  const state = {
    saved: new Set(),
    gender: "neutral",
    vibe: null,
    count: 10,
    lastResults: [],
  };

  function saveName(name) {
    if (state.saved.has(name)) {
      state.saved.delete(name);
    } else {
      state.saved.add(name);
    }
    renderSaved();
    // Update the card visual
    document.querySelectorAll(".name-card").forEach((card) => {
      const n = card.getAttribute("data-name");
      const btn = card.querySelector(".save-btn");
      if (btn) {
        if (state.saved.has(n)) {
          card.classList.add("saved");
          btn.classList.add("active");
          btn.setAttribute("aria-pressed", "true");
        } else {
          card.classList.remove("saved");
          btn.classList.remove("active");
          btn.setAttribute("aria-pressed", "false");
        }
      }
    });
  }

  function renderSaved() {
    const list = document.getElementById("saved-list");
    const empty = document.getElementById("saved-empty");
    if (!list) return;
    list.innerHTML = "";
    if (state.saved.size === 0) {
      if (empty) empty.style.display = "";
      return;
    }
    if (empty) empty.style.display = "none";
    Array.from(state.saved).forEach((name) => {
      const pill = document.createElement("span");
      pill.className = "saved-pill";
      pill.innerHTML = '<span class="saved-name"></span><button title="Remove" aria-label="Remove">&times;</button>';
      pill.querySelector(".saved-name").textContent = name;
      pill.querySelector("button").addEventListener("click", () => saveName(name));
      list.appendChild(pill);
    });
  }

  function copyText(text, onDone) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(
        () => onDone && onDone(true),
        () => fallbackCopy(text, onDone)
      );
    } else {
      fallbackCopy(text, onDone);
    }
  }
  function fallbackCopy(text, onDone) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); onDone && onDone(true); }
    catch (e) { onDone && onDone(false); }
    finally { document.body.removeChild(ta); }
  }

  // ---------- Name generation ----------
  function buildName(data) {
    // Try with hand-picked full names occasionally for quality
    if (data.presetNames && Math.random() < 0.18) {
      return cap(pick(data.presetNames));
    }

    const gender = state.gender;
    const vibe = state.vibe;

    let prefix, middle, suffix;
    const banks = data.banks || {};

    // Vibe bank (e.g. noble / savage)
    if (vibe && banks.vibes && banks.vibes[vibe]) {
      const v = banks.vibes[vibe];
      prefix = pickOne(v.prefix, banks.prefix);
      middle = pickOne(v.middle, banks.middle, []);
      suffix = pickOne(v.suffix, banks.suffix, []);
    } else {
      prefix = banks.prefix;
      middle = banks.middle || [];
      suffix = banks.suffix;
    }

    // Gendered variants
    if (gender === "male" && banks.prefixMale) prefix = banks.prefixMale;
    if (gender === "female" && banks.prefixFemale) prefix = banks.prefixFemale;
    if (gender === "male" && banks.suffixMale) suffix = banks.suffixMale;
    if (gender === "female" && banks.suffixFemale) suffix = banks.suffixFemale;

    if (!prefix || !suffix) return null;

    // For some types (gamertags, username) we want tight combos
    const tight = !!data.tight;

    let name;
    let attempts = 0;
    do {
      const p = pick(prefix);
      const s = pick(suffix);
      const m = (middle && middle.length && Math.random() < (tight ? 0.5 : 0.7)) ? pick(middle) : "";
      name = tight
        ? (cap(p) + s)
        : cap(p) + m + s;
      attempts++;
    } while (name && hasDouble([...name.toLowerCase().match(/[aeiouy]+/g) || []]) && attempts < 6 && !tight);

    // Reject names that accidentally have three same letters in a row
    if (/(.)\1\1/.test(name)) return buildName(data);

    // Reject empty/short results
    if (!name || name.length < 3) return buildName(data);
    return name;
  }

  function pickOne(...lists) {
    const merged = [];
    lists.forEach((l) => l && l.forEach((x) => merged.push(x)));
    if (!merged.length) return null;
    return merged;
  }

  // ---------- Meanings / traits ----------
  function describe(name, data) {
    if (data.meanings && data.meanings.length) {
      return pick(data.meanings).replace("{name}", name);
    }
    if (data.traits && data.traits.length) {
      return pick(data.traits);
    }
    return "A name whispered in old songs.";
  }

  // ---------- Render results ----------
  function renderResults(names, data) {
    const grid = document.getElementById("results");
    if (!grid) return;
    grid.innerHTML = "";
    if (!names.length) {
      grid.innerHTML = '<p class="muted">No names yet. Hit Generate.</p>';
      return;
    }
    names.forEach((name) => {
      const card = document.createElement("article");
      card.className = "name-card";
      if (state.saved.has(name)) card.classList.add("saved");
      card.setAttribute("data-name", name);
      card.innerHTML = `
        <div class="name-head">
          <div class="name-text"></div>
          <div style="display:flex; gap:2px;">
            <button class="icon-btn copy-btn" title="Copy" aria-label="Copy name">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <button class="icon-btn save-btn" title="Save" aria-label="Save name" aria-pressed="${state.saved.has(name)}">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="${state.saved.has(name) ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>
        </div>
        <div class="name-meta"></div>
      `;
      card.querySelector(".name-text").textContent = name;
      card.querySelector(".name-meta").textContent = describe(name, data);

      card.querySelector(".copy-btn").addEventListener("click", (e) => {
        copyText(name, (ok) => {
          const btn = e.currentTarget;
          const toast = document.createElement("span");
          toast.className = "toast";
          toast.textContent = ok ? "Copied" : "Failed";
          btn.style.position = "relative";
          btn.appendChild(toast);
          requestAnimationFrame(() => toast.classList.add("show"));
          setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 200); }, 1100);
        });
      });
      card.querySelector(".save-btn").addEventListener("click", () => saveName(name));

      grid.appendChild(card);
    });
  }

  // ---------- Generate ----------
  function generate() {
    const data = window.NF_DATA;
    if (!data) return;
    const want = state.count;
    const seen = new Set();
    const out = [];
    let safety = 0;
    while (out.length < want && safety < want * 12) {
      const n = buildName(data);
      safety++;
      if (n && !seen.has(n.toLowerCase())) {
        seen.add(n.toLowerCase());
        out.push(n);
      }
    }
    state.lastResults = out;
    renderResults(out, data);
  }

  // ---------- Character generator ----------
  function generateCharacter() {
    const data = window.NF_DATA;
    if (!data || !data.character) return;
    const c = data.character;
    const name = buildName(data) || "Aelar";
    const origin = pick(c.origins || ["a distant realm"]);
    const drive = pick(c.drives || ["a restless longing"]);
    const quirk = pick(c.quirks || ["a habit of speaking to the wind"]);
    const traitA = pick(c.traits || ["Brave"]);
    const traitB = pick((c.traits || ["Cunning"]).filter((t) => t !== traitA));

    const backstory = `${cap(name)} hails from ${origin}. ${cap(name)} is driven by ${drive}, and is known for ${quirk}.`;

    const card = document.getElementById("character-card");
    if (!card) return;
    card.style.display = "";
    card.querySelector(".char-name").textContent = name;
    card.querySelector(".backstory").textContent = backstory;
    card.querySelector(".traits").innerHTML = "";
    [traitA, traitB].forEach((t) => {
      const span = document.createElement("span");
      span.className = "trait";
      span.textContent = t;
      card.querySelector(".traits").appendChild(span);
    });
    const share = `${name} - ${backstory} Traits: ${traitA}, ${traitB}`;
    const copyBtn = card.querySelector(".char-copy");
    const regenBtn = card.querySelector(".char-regen");
    if (copyBtn) copyBtn.onclick = () => copyText(share, (ok) => {
      copyBtn.textContent = ok ? "Copied!" : "Copy failed";
      setTimeout(() => (copyBtn.textContent = "Copy character"), 1400);
    });
    if (regenBtn) regenBtn.onclick = () => generateCharacter();
  }

  // ---------- Controls binding ----------
  function bindControls() {
    document.querySelectorAll("[data-gender]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-gender]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        state.gender = btn.getAttribute("data-gender");
        if (state.lastResults.length) generate();
      });
    });
    document.querySelectorAll("[data-vibe]").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll("[data-vibe]").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const v = btn.getAttribute("data-vibe");
        state.vibe = v === "any" ? null : v;
        if (state.lastResults.length) generate();
      });
    });
    const countSlider = document.getElementById("count-slider");
    const countOut = document.getElementById("count-out");
    if (countSlider) {
      countSlider.value = state.count;
      countOut.textContent = state.count;
      countSlider.addEventListener("input", () => {
        state.count = parseInt(countSlider.value, 10);
        countOut.textContent = state.count;
      });
      countSlider.addEventListener("change", () => {
        if (state.lastResults.length) generate();
      });
    }
    const genBtn = document.getElementById("generate-btn");
    if (genBtn) genBtn.addEventListener("click", generate);

    const charBtn = document.getElementById("character-btn");
    if (charBtn) charBtn.addEventListener("click", generateCharacter);

    const copyAll = document.getElementById("copy-saved");
    if (copyAll) copyAll.addEventListener("click", () => {
      if (state.saved.size === 0) {
        copyAll.textContent = "Nothing saved yet";
        setTimeout(() => (copyAll.textContent = "Copy all saved"), 1400);
        return;
      }
      const text = Array.from(state.saved).join("\n");
      copyText(text, (ok) => {
        copyAll.textContent = ok ? "Copied all!" : "Copy failed";
        setTimeout(() => (copyAll.textContent = "Copy all saved"), 1400);
      });
    });

    const clearSaved = document.getElementById("clear-saved");
    if (clearSaved) clearSaved.addEventListener("click", () => {
      state.saved.clear();
      renderSaved();
      // Also un-mark cards
      document.querySelectorAll(".name-card.saved").forEach((c) => {
        c.classList.remove("saved");
        const btn = c.querySelector(".save-btn");
        if (btn) { btn.classList.remove("active"); btn.setAttribute("aria-pressed", "false"); }
      });
    });
  }

  // ---------- Init ----------
  function init() {
    bindTheme();
    bindMenu();
    bindControls();
    renderSaved();
    // Initial generation
    const data = window.NF_DATA;
    if (data && document.getElementById("results")) {
      // Default selection state
      const defaultGender = (data.defaults && data.defaults.gender) || "neutral";
      const defaultVibe = data.defaults && data.defaults.vibe;
      state.gender = defaultGender;
      state.vibe = defaultVibe || null;
      if (data.defaults && data.defaults.count) {
        state.count = data.defaults.count;
        const s = document.getElementById("count-slider");
        if (s) { s.value = state.count; document.getElementById("count-out").textContent = state.count; }
      }
      generate();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
