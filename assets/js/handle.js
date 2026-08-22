/* handle.js
   Generator for the social-handle page.
   Reads NF_HANDLE_DATA (defined in the page) and produces names
   from a niche + vibe + length + topic combo.
*/
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function cap(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }
  function slug(s, sep) { return s.toLowerCase().replace(/[^a-z0-9]+/g, sep || ''); }

  function buildHandle() {
    const data = window.NF_HANDLE_DATA;
    if (!data) return [];

    const platform = $("#hf-platform").value;
    const niche = $("#hf-niche").value;
    const vibe = $("#hf-vibe").value;
    const length = $("#hf-length").value;
    const topicRaw = ($("#hf-topic").value || "").trim();
    const topic = topicRaw ? slug(topicRaw, '') : '';

    const n = data.banks.niches[niche];
    const v = data.banks.vibes[vibe];
    if (!n || !v) return [];

    const out = [];
    const seen = new Set();
    let safety = 0;
    while (out.length < data.defaults.count && safety < data.defaults.count * 14) {
      safety++;
      const parts = [];
      // Vibe prefix ~50% of the time
      if (v.prefix && v.prefix.length && Math.random() > 0.45) {
        parts.push(pick(v.prefix));
      }
      parts.push(pick(n.words));
      // Length: short = 1, medium = 2, long = 3
      const wantN = length === 'short' ? 1 : (length === 'medium' ? 2 : 3);
      while (parts.length < wantN) parts.push(pick(n.suffixes));
      // Topic slot: insert with low probability
      if (topic && Math.random() > 0.55) {
        const insertAt = Math.min(parts.length - 1, 1);
        parts.splice(insertAt, 0, topic);
      }
      // Format for platform
      const pMeta = data.banks.platforms[platform] || data.banks.platforms.generic;
      const sep = pMeta.separator;
      let candidate;
      if (sep === ' ') {
        // Capitalize each word for YouTube style
        candidate = parts.map(cap).join(' ');
      } else {
        candidate = parts.map(p => slug(p, sep)).join(sep);
      }
      // Enforce max length
      if (candidate.length > pMeta.maxLen) candidate = candidate.slice(0, pMeta.maxLen);
      if (!seen.has(candidate.toLowerCase()) && candidate.length >= 3) {
        seen.add(candidate.toLowerCase());
        out.push(candidate);
      }
    }
    return out;
  }

  function formatFor(name, platform) {
    if (platform === 'youtube') return name.replace(/(^|\s)\w/g, m => m.toUpperCase());
    return name;
  }

  function renderResults(names) {
    const grid = $("#results");
    if (!grid) return;
    grid.innerHTML = "";
    if (!names.length) {
      grid.innerHTML = '<p class="muted">No handles yet. Fill the form and hit Generate.</p>';
      return;
    }
    const platform = $("#hf-platform").value;
    const platformLabel = (window.NF_HANDLE_DATA.banks.platforms[platform] || {}).label || "Social";
    names.forEach(name => {
      const display = formatFor(name, platform);
      const card = document.createElement("article");
      card.className = "name-card";
      card.setAttribute("data-name", display);
      card.innerHTML = `
        <div class="name-head">
          <div class="name-text"></div>
          <div style="display:flex; gap:2px;">
            <button class="icon-btn copy-btn" title="Copy" aria-label="Copy handle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
        </div>
        <div class="name-meta">${platformLabel} · likely available</div>
      `;
      card.querySelector(".name-text").textContent = display;
      card.querySelector(".copy-btn").addEventListener("click", (e) => {
        const btn = e.currentTarget;
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(display);
        } else {
          const ta = document.createElement("textarea");
          ta.value = display; document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); } catch (e) {}
          document.body.removeChild(ta);
        }
        const toast = document.createElement("span");
        toast.className = "toast";
        toast.textContent = "Copied";
        btn.style.position = "relative";
        btn.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add("show"));
        setTimeout(() => { toast.classList.remove("show"); setTimeout(() => toast.remove(), 200); }, 1100);
      });
      grid.appendChild(card);
    });
  }

  function init() {
    const form = $("#handle-form");
    if (!form) return;
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      renderResults(buildHandle());
    });
    const surprise = $("#handle-surprise");
    if (surprise) {
      surprise.addEventListener("click", () => {
        const niches = Object.keys(window.NF_HANDLE_DATA.banks.niches);
        const vibes = Object.keys(window.NF_HANDLE_DATA.banks.vibes);
        const platforms = Object.keys(window.NF_HANDLE_DATA.banks.platforms);
        const lengths = ["short","medium","long"];
        $("#hf-platform").value = platforms[Math.floor(Math.random() * platforms.length)];
        $("#hf-niche").value = niches[Math.floor(Math.random() * niches.length)];
        $("#hf-vibe").value = vibes[Math.floor(Math.random() * vibes.length)];
        $("#hf-length").value = lengths[Math.floor(Math.random() * lengths.length)];
        renderResults(buildHandle());
      });
    }
    // Initial generation on load
    renderResults(buildHandle());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
