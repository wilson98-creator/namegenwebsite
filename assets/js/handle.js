/* handle.js
   Realistic social-handle generator.
   Uses first names, activity verbs, niche words, mood adjectives, and
   aesthetic objects combined with platform-aware patterns. Generates
   names that look like real Instagram, TikTok, YouTube, X, Twitch,
   Discord, and GitHub handles.
*/
(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function initialOf(name) { return name ? name.charAt(0).toLowerCase() : ''; }
  function lc(s) { return s ? s.toLowerCase() : s; }
  function slug(s) { return lc(s).replace(/[^a-z0-9]+/g, ''); }
  function trim(s, n) { return s ? s.slice(0, n) : s; }

  // Find a word in a bank that fits within `maxLen` after slugging,
  // and is at least 3 chars (filters out single letters like "r", "s", "j").
  function pickFitting(bank, maxLen) {
    for (let i = 0; i < 12; i++) {
      const w = pick(bank);
      const sw = slug(w);
      if (sw.length >= 3 && sw.length <= maxLen) return w;
    }
    // Fallback: any word that slugs to at least 3 chars
    for (let i = 0; i < 8; i++) {
      const w = pick(bank);
      if (slug(w).length >= 3) return w;
    }
    return '';
  }

  // Fill a {slot} template with a word from the matching bank
  function fillSlot(slot, ctx) {
    const d = ctx.data;
    const niche = d.banks.niches[ctx.niche];
    if (!niche) return '';
    switch (slot) {
      case 'name': {
        // Use seed if provided, else use a name from the niche's first-name pool
        if (ctx.seed) return slug(ctx.seed);
        return pickFitting(niche.names, 10);
      }
      case 'initial':
        return initialOf(ctx.seed || pick(niche.names));
      case 'number':
        return pick(d.banks.smallNums);
      case 'adjective':
        return pickFitting(niche.adjectives, 8);
      case 'object':
        // If user provided a topic, prefer to use it as object slot
        if (ctx.topic) return slug(ctx.topic);
        return pickFitting(niche.objects, 10);
      case 'niche_word':
        return pickFitting(niche.nicheWords, 10);
      case 'activity':
        return pickFitting(niche.activities, 10);
      case 'mood':
        return pickFitting(d.banks.moods, 6);
      default:
        return '';
    }
  }

  // Apply the platform's separator style to a candidate string
  function applySeparator(parts, platform, allowed, fallback) {
    // `parts` is an array of words. We join them using a separator.
    const sep = pick(allowed);
    if (sep === ' ' || sep === 'space') {
      return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ');
    }
    if (sep === 'dash' || sep === '-') {
      return parts.join('-');
    }
    if (sep === 'either') {
      // random between dot, underscore, nothing
      const opts = ['.', '_', ''];
      const chosen = pick(opts);
      if (chosen === '') return parts.join('');
      return parts.join(chosen);
    }
    return parts.join(sep);
  }

  // Pick a separator respecting Instagram's no-leading/trailing-dot rules
  function pickSeparator(allowed, candidate) {
    let sep = pick(allowed);
    if (sep === '.' || sep === '_' || sep === '-') {
      // Ensure we don't end or start with a separator
      while (candidate.startsWith(sep) || candidate.endsWith(sep)) {
        candidate = candidate.replace(new RegExp('^\\' + sep), '').replace(new RegExp('\\' + sep + '$'), '');
      }
    }
    return candidate;
  }

  // Main build function
  function buildHandle() {
    const data = window.NF_HANDLE_DATA;
    if (!data) return [];

    const platform = $("#hf-platform").value;
    const niche = $("#hf-niche").value;
    const vibe = $("#hf-vibe").value;
    const length = $("#hf-length").value;
    const topicRaw = ($("#hf-topic").value || "").trim();
    const topic = topicRaw ? slug(topicRaw) : '';
    const seedRaw = ($("#hf-seed").value || "").trim();
    const seed = seedRaw ? slug(seedRaw) : '';

    const v = data.banks.vibes[vibe];
    const pMeta = data.banks.platforms[platform] || data.banks.platforms.generic;
    if (!v) return [];

    // Length -> target max length
    const wantMax = length === 'short' ? 10 : (length === 'medium' ? 18 : 30);
    const wantMin = length === 'short' ? 3 : (length === 'medium' ? 8 : 14);
    const maxLen = Math.min(wantMax, pMeta.maxLen);

    const ctx = { data, niche, vibe, topic, seed };

    const out = [];
    const seen = new Set();
    let safety = 0;
    while (out.length < data.defaults.count && safety < data.defaults.count * 30) {
      safety++;
      const pattern = pick(v.patterns);
      // Fill each slot, slugging each one individually so the literal separator in the template survives
      const filled = pattern.replace(/\{([a-z_]+)\}/g, (m, slot) => {
        const w = fillSlot(slot, ctx);
        return slug(w);
      });
      if (!filled) continue;

      let candidate = filled;

      // Platform-specific separator handling
      if (platform === 'youtube') {
        // Replace . _ - with spaces, then title-case each word
        candidate = candidate.replace(/[._-]+/g, ' ').trim();
        candidate = candidate.split(/\s+/).filter(Boolean).map(function (w) {
          return w.charAt(0).toUpperCase() + w.slice(1);
        }).join(' ');
      } else if (platform === 'github') {
        // Convert . and _ to -
        candidate = candidate.replace(/\./g, '-').replace(/_/g, '-');
        candidate = candidate.replace(/-{2,}/g, '-');
      } else if (platform === 'x' || platform === 'twitch' || platform === 'discord') {
        // Strip dots and underscores (X/Twitch/Discord don't allow them)
        candidate = candidate.replace(/[._]/g, '');
      }
      // IG, TikTok, generic: keep as-is

      // Trim to max length
      if (candidate.length > maxLen) candidate = candidate.slice(0, maxLen);

      // Strip leading/trailing separators
      candidate = candidate.replace(/^[._-]+/, '').replace(/[._-]+$/, '');
      // Collapse double separators
      candidate = candidate.replace(/[._-]{2,}/g, '.');
      // Re-strip any new edge separators after collapsing
      candidate = candidate.replace(/^[._-]+/, '').replace(/[._-]+$/, '');

      // Min length check
      if (length === 'short' && candidate.length < wantMin) continue;
      if (candidate.length < 3) continue;

      if (seen.has(candidate.toLowerCase())) continue;
      seen.add(candidate.toLowerCase());
      out.push(candidate);
    }
    return out;
  }

  // For YouTube, the engine already produces "Title Case With Spaces" so we
  // just return as-is. For other platforms, return as-is.
  function formatFor(name, platform) {
    return name;
  }

  function renderResults(names) {
    const grid = $("#results");
    if (!grid) return;
    grid.innerHTML = "";
    if (!names.length) {
      grid.innerHTML = '<p class="muted">No handles yet. Try a different niche, vibe, or length and hit Generate again.</p>';
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
        $("#hf-topic").value = "";
        $("#hf-seed").value = "";
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
