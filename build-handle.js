/* build-handle.js
   Build:
   - handle-generator.html (quiz-style social handle generator)
   - best-gaming-names.html (SEO content page)
   - instagram-username-ideas.html (SEO content page)
   - Update index.html (add new tiles to homepage grid)
   - Update sitemap.xml (add new URLs)
   - Add cross-links to existing pages
*/
const fs = require('fs');
const path = require('path');

// =============================================================
// DATA: Syllable banks for handle generation
// =============================================================
const niches = {
  gaming: {
    label: 'Gaming',
    words: ['shadow','dark','void','ghost','ace','venom','fury','nexus','rune','storm','blade','fang','claw','hex','grim','crypt','demon','pulse','phantom','wraith','howl','echo','surge','reign','sovereign','clash','iron','bone','shade','mist','toxic','savage','feral','smoke','ember','ash','steel','crimson','dire','grim','cruel','wild','silent','arcane','royal','venom','nether'],
    suffixes: ['slayer','hunter','rage','shot','kill','aim','frag','blood','clash','surge','rider','master','knight','lord','king','reaper','warlord','demon','beast','wolf','sage','seer','rune','mancer','walker','stalker','prowler','fury','blade','fang','eye','grip','mantle','howl','shade','fang']
  },
  tech: {
    label: 'Tech',
    words: ['pixel','byte','cyber','dev','code','data','cloud','net','ai','stack','logic','binary','quantum','node','frame','loop','async','compile','kernel','thread','stream','cache','debug','merge','patch','commit','fork','push','pull','hack','trace','lambda','function','script','cipher','compute','render','neural','vector','matrix','reactor','core','sys','daemon','root'],
    suffixes: ['hub','lab','forge','stack','ops','wave','mind','sync','flow','core','base','mode','loop','grid','net','system','engine','protocol','kernel','node','lab','forge','dev','ops','core','stack','io','api']
  },
  fashion: {
    label: 'Fashion',
    words: ['velvet','silk','gold','blush','mode','luxe','style','noir','rose','pearl','ivory','onyx','crystal','amber','jade','coral','ruby','satin','lace','cashmere','cream','bone','sand','stone','clay','indigo','midnight','champagne','dusk','dawn','pearl','crystal','lilac','ivory','scarlet'],
    suffixes: ['couture','atelier','style','mode','chic','luxe','vogue','label','edition','drop','collection','couture','style','mode','studio','maison','house']
  },
  beauty: {
    label: 'Beauty',
    words: ['glow','blush','petal','rose','bloom','sheen','dew','silk','pearl','lush','soft','velvet','cream','satin','cloud','moon','sun','star','daisy','lily','luna','sol','dahlia','violet','rose','iris','jade','opal','pearl','amber'],
    suffixes: ['glow','beauty','skin','ritual','balm','luxe','ritual','drop','edit','studio','ritual','bar','bar','bar','bar']
  },
  fitness: {
    label: 'Fitness',
    words: ['fit','iron','power','lift','beast','grind','peak','blaze','pulse','ripped','swole','raw','crush','hammer','steel','force','drive','core','max','gainz','bulk','cut','shred','tank','mode','beast','alpha','beast','gains','grind','fuel','sweat'],
    suffixes: ['fit','mode','force','rep','mode','peak','lift','grind','beast','athlete','mode','mode','beast','gains','grind','fuel','mode']
  },
  music: {
    label: 'Music',
    words: ['sound','beat','wave','bass','drop','audio','amp','treble','tone','echo','note','chord','rhythm','vibe','tempo','groove','mood','vibe','rave','drift','mellow','echo','hush','drip','swell','surge','climax','chill','vibe','echo','lush','synth'],
    suffixes: ['beat','vibes','wave','sound','audio','mode','mix','drop','frequency','edit','tones','mode','wave','wave','mode','mix']
  },
  food: {
    label: 'Food',
    words: ['taste','savor','spice','fresh','kitchen','chef','plate','basil','thyme','ember','saffron','sage','basil','miso','tofu','noodle','ramen','pho','taco','salsa','taste','yum','drool','morsel','feast','spice','dumpling','pasta','pizza','basil','sour','sweet','bitter','umami'],
    suffixes: ['kitchen','taste','plate','dish','fork','palate','feast','bite','edit','chef','bites','table','bistro','eats','kitchen','cook']
  },
  travel: {
    label: 'Travel',
    words: ['wander','roam','atlas','journey','wayfarer','compass','drift','far','beyond','globe','nomad','drifter','pilgrim','explorer','sojourner','vagabond','wayfarer','trekker','voyager','rover','hiker','ranger','trailblazer','pathfinder','scout','cartographer','compass','north','south','east','west','sunrise','sunset','dusk','dawn'],
    suffixes: ['trip','voyage','atlas','trail','trek','roam','escape','passport','compass','trails','roam','mile','quest','journey','sojourn']
  },
  art: {
    label: 'Art',
    words: ['ink','brush','canvas','color','sketch','draw','paint','hue','studio','palette','chalk','pastel','watercolor','acrylic','oil','tempera','ink','charcoal','pencil','line','stroke','shade','tone','texture','pattern','form','shape','curve','edge','angle','arc','wave','spiral','dot','point','splash','drip','splash','drip','flow','stroke','line'],
    suffixes: ['studio','art','ink','canvas','brush','sketch','hue','palette','gallery','atelier','works','studio','studio','muse','mode']
  },
  comedy: {
    label: 'Comedy',
    words: ['lol','haha','pun','quip','snort','gaff','goof','zany','giggle','cackle','chuckle','snicker','titter','guffaw','hoot','cackle','deadpan','dry','witty','silly','goofy','dopey','wacky','nutty','batty','bonkers','cuckoo','daffy','batty','barmy','bats','insane','kooky','loony','mad','nutty','screwy','wacky','whacky','yerk'],
    suffixes: ['laugh','joke','gag','quip','giggle','pun','haha','lol','lolz','comedy','mode','mode','bit','set','bit']
  },
  education: {
    label: 'Education',
    words: ['study','learn','mind','brain','sage','quest','tutor','school','book','scholar','thesis','lecture','prof','academic','university','college','professor','doctor','phd','degree','class','course','lesson','chapter','module','unit','topic','subject','field','discipline','domain','realm','sphere','faculty','professor','graduate','alumnus'],
    suffixes: ['academy','learn','study','mind','lab','school','sage','scholar','notes','study','class','course','lab','mode','mode']
  },
  lifestyle: {
    label: 'Lifestyle',
    words: ['life','vibe','calm','slow','daily','cozy','peaceful','simple','soft','sunny','serene','mindful','gentle','quiet','still','warm','light','easy','free','open','honest','true','real','whole','balanced','centered','present','awake','aware','alive','growing','blooming'],
    suffixes: ['life','daily','vibe','slow','simple','journal','edit','moment','mindful','edit','life','days','hours','mornings','evenings','days']
  },
  business: {
    label: 'Business',
    words: ['pro','exec','founder','ceo','strategy','growth','scale','lead','capital','agency','partner','venture','startup','studio','lab','group','firm','co','hq','office','desk','board','pitch','deck','brand','market','scale','revenue','profit','margin','bottom','line','top','line','north','star','compass','lever'],
    suffixes: ['lab','capital','ventures','co','group','partners','agency','strategy','ops','growth','ventures','capital','fund','trust','llc','inc','co','group','co']
  }
};

const vibes = {
  cool:    { label: 'Cool',    prefix: ['x','prime','elite','apex','peak','bold','savage','raw','vip','official','pro','ace','zero','king','god','top','pure','rich','ultra'] },
  pro:     { label: 'Professional', prefix: ['pro','real','certified','premium','signature','true','authentic','genuine','actual','official','proper','solid','reliable'] },
  funny:   { label: 'Funny',   prefix: ['lol','lmao','dead','yeet','bruh','oof','kek','omg','cringe','sus','pog','chad','based','ratio','mid','npc'] },
  mystery: { label: 'Mysterious', prefix: ['void','shadow','ghost','phantom','hidden','secret','masked','faceless','null','zero','cipher','enigma','cryptic'] },
  cute:    { label: 'Cute',    prefix: ['sweet','soft','sunny','cozy','little','mini','tiny','pet','bunny','peach','plush','fluffy','dainty','tiny'] },
  edgy:    { label: 'Edgy',    prefix: ['dark','void','rage','venom','blood','nightmare','death','hell','doom','grim','cruel','savage','feral','broken'] },
  chill:   { label: 'Chill',   prefix: ['lofi','lowkey','mellow','smooth','easy','cozy','calm','slow','soft','zen','easy','soft','drift','mellow'] },
  luxury:  { label: 'Luxury',  prefix: ['gold','royal','luxe','elite','premium','private','bespoke','velvet','silk','crown','diamond','ivory','plush'] }
};

const platforms = {
  instagram: { label: 'Instagram', maxLen: 30, separator: '_' },
  youtube:   { label: 'YouTube',   maxLen: 100, separator: ' ' },
  tiktok:    { label: 'TikTok',    maxLen: 24, separator: '_' },
  x:         { label: 'X / Twitter',maxLen: 15, separator: '' },
  twitch:    { label: 'Twitch',    maxLen: 25, separator: '' },
  discord:   { label: 'Discord',   maxLen: 32, separator: '' },
  github:    { label: 'GitHub',    maxLen: 39, separator: '-' },
  generic:   { label: 'Any social',maxLen: 50, separator: '' }
};

// =============================================================
// Helper: build the handle generator HTML
// =============================================================
function buildHandleGenerator() {
  const data = {
    defaults: { count: 12 },
    banks: { niches, vibes, platforms }
  };
  const dataJson = JSON.stringify(data, null, 2)
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Social Handle Generator - Instagram, YouTube, TikTok, X Username Ideas</title>
<meta name="description" content="Free social media handle generator for Instagram, YouTube, TikTok, X, Twitch, Discord, and GitHub. Answer 4 quick questions about your channel and get 12 username ideas tailored to your niche and vibe." />
<meta name="theme-color" content="#0f1115" />
<link rel="canonical" href="https://nameswiftgenerator.com/handle-generator" />
<meta property="og:title" content="Social Handle Generator - Instagram, YouTube, TikTok, X" />
<meta property="og:description" content="Get 12 custom social media username ideas for your channel. Built for creators, gamers, streamers, and indie hackers." />
<meta property="og:type" content="website" />
<link rel="stylesheet" href="assets/css/style.css" />
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Social Handle Generator",
  "url": "https://nameswiftgenerator.com/handle-generator",
  "applicationCategory": "MultimediaApplication",
  "operatingSystem": "Any (browser)",
  "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  "description": "Free social media handle generator with niche + vibe + length customization."
}
</script>
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {"@type": "Question", "name": "How do I come up with a good social media username?",
     "acceptedAnswer": {"@type": "Answer", "text": "Start with your niche (gaming, tech, beauty, etc), pick a vibe that matches your personality (cool, professional, funny), and combine them into 1-3 short words. Keep it under 15 characters for X/Twitter, under 30 for Instagram, and under 100 for YouTube."}},
    {"@type": "Question", "name": "How do I check if a username is available?",
     "acceptedAnswer": {"@type": "Answer", "text": "For Instagram, TikTok, X, and Twitch, just paste your generated handle into the platform's sign-up or search. For YouTube, the handle is the same as your channel name, so check on YouTube. For Discord, the username is separate from the display name."}},
    {"@type": "Question", "name": "Can I use these names commercially?",
     "acceptedAnswer": {"@type": "Answer", "text": "Yes - all generated names are provided for creative use. Note that the actual availability on each platform is determined by the platform's sign-up system, so always verify before launching your account or brand."}},
    {"@type": "Question", "name": "Are these handles likely to be available?",
     "acceptedAnswer": {"@type": "Answer", "text": "We generate uncommon combinations of niche-specific syllables and vibe modifiers, so most suggestions are likely available. We can't check every platform in real time, so the names show a 'likely available' indicator based on uniqueness, not a live check."}},
    {"@type": "Question", "name": "What's the difference between a handle and a display name?",
     "acceptedAnswer": {"@type": "Answer", "text": "The handle is your unique @username (no spaces, used in URLs and mentions). The display name is the readable name shown next to your posts. You usually set both, and they can be different versions of the same idea."}}
  ]
}
</script>
</head>
<body>
<header class="site-header">
  <div class="container nav-row">
    <a class="brand" href="index.html"><span class="mark">N</span><span>NameSwift</span></a>
    <nav class="nav-links" aria-label="Primary">
      <a href="index.html">Home</a>
      <a href="elf-name-generator.html">Elf</a>
      <a href="dnd-elf-names.html">D&amp;D</a>
      <a href="gamertag-generator.html">Gamertag</a>
      <a href="about.html">About</a>
    </nav>
    <button class="theme-toggle" data-theme-toggle aria-label="Toggle dark mode"><span aria-hidden="true">&#9788;</span><span>Theme</span></button>
    <button class="menu-toggle" data-menu-toggle aria-label="Open menu">&#9776;</button>
  </div>
  <div class="container mobile-menu" data-mobile-menu>
    <a href="index.html">Home</a>
    <a href="handle-generator.html">Handle Generator</a>
    <a href="gamertag-generator.html">Gamertag</a>
    <a href="username-generator.html">Username</a>
    <a href="about.html">About</a>
    <a href="contact.html">Contact</a>
  </div>
</header>

<main>
  <section class="hero">
    <div class="container">
      <h1>Social Handle Generator</h1>
      <p>Get 12 custom social media username ideas for Instagram, YouTube, TikTok, X, Twitch, Discord, and GitHub. Tell us about your channel, pick a vibe, and we'll do the rest.</p>
    </div>
  </section>

  <div class="container">
    <div class="gen-card">
      <form id="handle-form" autocomplete="off">
        <div class="handle-grid">
          <div class="handle-field">
            <label for="hf-platform">Platform</label>
            <select id="hf-platform" name="platform">
              <option value="instagram">Instagram</option>
              <option value="youtube">YouTube</option>
              <option value="tiktok">TikTok</option>
              <option value="x">X / Twitter</option>
              <option value="twitch">Twitch</option>
              <option value="discord">Discord</option>
              <option value="github">GitHub</option>
              <option value="generic">Any social</option>
            </select>
          </div>
          <div class="handle-field">
            <label for="hf-niche">What is your channel about?</label>
            <select id="hf-niche" name="niche">
              ${Object.entries(niches).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}
            </select>
          </div>
          <div class="handle-field">
            <label for="hf-vibe">What is your vibe?</label>
            <select id="hf-vibe" name="vibe">
              ${Object.entries(vibes).map(([k, v]) => `<option value="${k}">${v.label}</option>`).join('')}
            </select>
          </div>
          <div class="handle-field">
            <label for="hf-length">How long should it be?</label>
            <select id="hf-length" name="length">
              <option value="short">Short (1 word)</option>
              <option value="medium" selected>Medium (2 words)</option>
              <option value="long">Long (3+ words)</option>
            </select>
          </div>
          <div class="handle-field handle-field-wide">
            <label for="hf-topic">Optional: a specific word to include (e.g. "arcade", "vegan", "espresso")</label>
            <input id="hf-topic" name="topic" type="text" maxlength="20" placeholder="leave blank to use the auto-generator" />
          </div>
        </div>
        <div class="generate-row" style="margin-top: 18px;">
          <button type="submit" class="btn-primary">Generate handles</button>
          <button type="button" class="btn-secondary" id="handle-surprise">Surprise me</button>
          <span class="muted" style="margin-left:auto; font-size:0.85rem;">12 fresh ideas, instantly</span>
        </div>
      </form>
      <div class="results" id="results" aria-live="polite" style="margin-top:24px;"></div>
    </div>

    <div class="ad-slot" data-id="ad-below-results" aria-label="Advertisement"></div>

    <article class="article">
      <h2>How to use this handle generator</h2>
      <ol>
        <li>Pick your platform (Instagram, YouTube, TikTok, X, Twitch, Discord, GitHub, or any social).</li>
        <li>Tell us what your channel is about (gaming, tech, beauty, fitness, music, food, travel, art, comedy, education, lifestyle, or business).</li>
        <li>Pick the vibe that matches your personality (cool, professional, funny, mysterious, cute, edgy, chill, or luxury).</li>
        <li>Choose a length - short (1 word), medium (2 words), or long (3+ words).</li>
        <li>Hit <strong>Generate handles</strong> for 12 fresh username ideas. Or hit <strong>Surprise me</strong> to randomize all four answers.</li>
        <li>Tap the copy icon to copy a handle you like, then paste it into your platform to check availability.</li>
      </ol>

      <h2>How to pick a great social media username</h2>
      <p>A good social media handle does three things: it tells people what your content is, it sticks in their head, and it stays available across platforms. This handle generator combines 12 niche categories (gaming, tech, fashion, beauty, fitness, music, food, travel, art, comedy, education, lifestyle, business) with 8 vibes (cool, professional, funny, mysterious, cute, edgy, chill, luxury) to produce uncommon combinations that are likely to be available.</p>

      <h2>Length rules by platform</h2>
      <ul>
        <li><strong>X / Twitter:</strong> 15 characters max. Go with <em>Short</em> or <em>Medium</em>.</li>
        <li><strong>TikTok:</strong> 24 characters max. <em>Short</em> or <em>Medium</em> works best.</li>
        <li><strong>Instagram:</strong> 30 characters max, allows underscores. <em>Medium</em> is the sweet spot.</li>
        <li><strong>Twitch:</strong> 25 characters max, lowercase only. <em>Short</em> or <em>Medium</em>.</li>
        <li><strong>YouTube:</strong> 100 characters max, allows spaces. <em>Long</em> is fine here.</li>
        <li><strong>Discord:</strong> 32 characters max for the username. <em>Short</em> or <em>Medium</em>.</li>
        <li><strong>GitHub:</strong> 39 characters max, allows hyphens. <em>Medium</em> or <em>Long</em>.</li>
      </ul>

      <h2>Examples by niche</h2>
      <ul>
        <li><strong>Gaming:</strong> <span class="example-name">shadowslayer</span>, <span class="example-name">voidwalker</span>, <span class="example-name">xraven</span></li>
        <li><strong>Tech:</strong> <span class="example-name">pixelhub</span>, <span class="example-name">bytelab</span>, <span class="example-name">apexdev</span></li>
        <li><strong>Fashion:</strong> <span class="example-name">velvetluxe</span>, <span class="example-name">ivorymode</span>, <span class="example-name">goldcouture</span></li>
        <li><strong>Fitness:</strong> <span class="example-name">ironbeast</span>, <span class="example-name">peakforce</span>, <span class="example-name">grindmode</span></li>
        <li><strong>Food:</strong> <span class="example-name">savorkitchen</span>, <span class="example-name">spicefeast</span>, <span class="example-name">freshplate</span></li>
        <li><strong>Art:</strong> <span class="example-name">inkstudio</span>, <span class="example-name">brushatelier</span>, <span class="example-name">huepalette</span></li>
        <li><strong>Travel:</strong> <span class="example-name">wanderatlas</span>, <span class="example-name">nomadcompass</span>, <span class="example-name">roamvoyage</span></li>
        <li><strong>Business:</strong> <span class="example-name">founderco</span>, <span class="example-name">growthcapital</span>, <span class="example-name">strategylab</span></li>
      </ul>

      <h2>Why combine niche + vibe?</h2>
      <p>Most handle generators give you one or the other - either random adjectives ("purple", "spicy", "fast") or random nouns ("cat", "ninja", "wizard"). This tool gives you the intersection: niche-relevant words (for a gaming channel, you get words like "void", "shadow", "phantom" - not "purple") crossed with vibe modifiers (cool, funny, luxury). The result is a handle that <em>means</em> something about your content rather than being a random string.</p>

      <h2>After you generate a name you like</h2>
      <ol>
        <li>Copy the handle with the copy button</li>
        <li>Paste it into the platform's sign-up or username-change form</li>
        <li>If it's taken, hit <strong>Generate handles</strong> again for 12 new options</li>
        <li>Once you secure it on one platform, register the same name on the others to build a consistent brand</li>
      </ol>

      <div class="faq">
        <h2>Frequently asked questions</h2>
        <details><summary>How do I come up with a good social media username?</summary><p>Start with your niche (gaming, tech, beauty, etc), pick a vibe that matches your personality (cool, professional, funny), and combine them into 1-3 short words. Keep it under 15 characters for X/Twitter, under 30 for Instagram, and under 100 for YouTube.</p></details>
        <details><summary>How do I check if a username is available?</summary><p>For Instagram, TikTok, X, and Twitch, just paste your generated handle into the platform's sign-up or search. For YouTube, the handle is the same as your channel name, so check on YouTube. For Discord, the username is separate from the display name.</p></details>
        <details><summary>Can I use these names commercially?</summary><p>Yes - all generated names are provided for creative use. Note that the actual availability on each platform is determined by the platform's sign-up system, so always verify before launching your account or brand.</p></details>
        <details><summary>Are these handles likely to be available?</summary><p>We generate uncommon combinations of niche-specific syllables and vibe modifiers, so most suggestions are likely available. We can't check every platform in real time, so the names show a "likely available" indicator based on uniqueness, not a live check.</p></details>
        <details><summary>What's the difference between a handle and a display name?</summary><p>The handle is your unique @username (no spaces, used in URLs and mentions). The display name is the readable name shown next to your posts. You usually set both, and they can be different versions of the same idea.</p></details>
        <details><summary>Should my Instagram handle match my TikTok handle?</summary><p>Yes, ideally. A consistent handle across platforms makes it easier for fans to find you everywhere. Use the <em>Surprise me</em> button until you find one you like, then register it on every platform you use.</p></details>
        <details><summary>What's a good username for a private/personal account vs a public/creator account?</summary><p>For a personal account, lean into your own name or a nickname (e.g. <em>jane.dev</em> or <em>janedoe</em>). For a public creator account, lean into your niche + vibe so the handle communicates your content at a glance (e.g. <em>apexdev</em> for a tech channel).</p></details>
      </div>
    </article>

    <div class="ad-slot" data-id="ad-in-content" aria-label="Advertisement"></div>

    <div class="cross-links">
      <h3>Related generators</h3>
      <a href="gamertag-generator.html">Gamertag Generator</a>
      <a href="username-generator.html">Username Generator</a>
      <a href="elf-name-generator.html">Elf Name Generator</a>
      <a href="dwarf-name-generator.html">Dwarf Name Generator</a>
      <a href="witch-name-generator.html">Witch Name Generator</a>
      <a href="world-of-warcraft-name-generator.html">World of Warcraft Names</a>
      <a href="index.html">All generators</a>
    </div>
  </div>
</main>

<footer class="site-footer">
  <div class="container footer-row">
    <div>&copy; <span id="yr"></span> NameSwift. Names are provided for creative use.</div>
    <div class="footer-links">
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
    </div>
  </div>
</footer>

<script>
window.NF_HANDLE_DATA = ${dataJson};
</script>
<script src="assets/js/handle.js" defer></script>
<script>
  document.getElementById("yr").textContent = new Date().getFullYear();
</script>
<script src="assets/js/app.js" defer></script>
</body>
</html>`;
}

// =============================================================
// build-handle.js (the generator engine for the handle page)
// =============================================================
function buildHandleJS() {
  return `/* handle.js
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
    if (platform === 'youtube') return name.replace(/(^|\\s)\\w/g, m => m.toUpperCase());
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
      card.innerHTML = \`
        <div class="name-head">
          <div class="name-text"></div>
          <div style="display:flex; gap:2px;">
            <button class="icon-btn copy-btn" title="Copy" aria-label="Copy handle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
          </div>
        </div>
        <div class="name-meta">\${platformLabel} \u00b7 likely available</div>
      \`;
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
`;
}

// =============================================================
// CSS additions for the handle form
// =============================================================
function appendHandleCSS() {
  const cssPath = path.join(__dirname, 'assets', 'css', 'style.css');
  let css = fs.readFileSync(cssPath, 'utf8');

  const block = `
/* ====== Handle generator form ====== */
.handle-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
}
@media (min-width: 720px) {
  .handle-grid { grid-template-columns: 1fr 1fr; }
}
.handle-field { display: flex; flex-direction: column; gap: 6px; }
.handle-field-wide { grid-column: 1 / -1; }
.handle-field label {
  font-family: var(--font-display);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-dim);
  font-weight: 700;
}
.handle-field select,
.handle-field input[type="text"] {
  background: var(--bg-elev-2);
  color: var(--text);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
  font-family: var(--font-body);
  font-size: 1rem;
  appearance: none;
  cursor: pointer;
  transition: border-color 0.15s ease;
}
.handle-field select { padding-right: 36px; background-image: linear-gradient(45deg, transparent 50%, var(--text-dim) 50%), linear-gradient(135deg, var(--text-dim) 50%, transparent 50%); background-position: calc(100% - 18px) 50%, calc(100% - 12px) 50%; background-size: 6px 6px, 6px 6px; background-repeat: no-repeat; }
.handle-field input[type="text"] { cursor: text; }
.handle-field select:focus,
.handle-field input[type="text"]:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-glow);
}
.handle-field select:hover,
.handle-field input[type="text"]:hover { border-color: color-mix(in srgb, var(--accent) 50%, var(--border)); }
`;

  if (!css.includes('/* ====== Handle generator form ====== */')) {
    css += block;
    fs.writeFileSync(cssPath, css);
    return true;
  }
  return false;
}

// =============================================================
// build SEO content page
// =============================================================
function buildSEOPage(opts) {
  const { slug, title, metaDesc, h1, intro, sections, faqs, relatedLinks, jsonLd } = opts;
  const head = JSON.stringify(jsonLd, null, 2);
  const related = relatedLinks.map((r) => `<a href="${r.href}">${r.label}</a>`).join('\n        ');
  const faqItems = faqs.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('\n        ');
  const sectionHTML = sections.map((s) => `<h2>${s.h2}</h2>\n${s.body}`).join('\n\n      ');

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${title}</title>
<meta name="description" content="${metaDesc}" />
<meta name="theme-color" content="#0f1115" />
<link rel="canonical" href="https://nameswiftgenerator.com/${slug}" />
<meta property="og:title" content="${title}" />
<meta property="og:description" content="${metaDesc}" />
<meta property="og:type" content="article" />
<link rel="stylesheet" href="assets/css/style.css" />
<script type="application/ld+json">
${head}
</script>
</head>
<body>
<header class="site-header">
  <div class="container nav-row">
    <a class="brand" href="index.html"><span class="mark">N</span><span>NameSwift</span></a>
    <nav class="nav-links" aria-label="Primary">
      <a href="index.html">Home</a>
      <a href="elf-name-generator.html">Elf</a>
      <a href="dnd-elf-names.html">D&amp;D</a>
      <a href="gamertag-generator.html">Gamertag</a>
      <a href="about.html">About</a>
    </nav>
    <button class="theme-toggle" data-theme-toggle aria-label="Toggle dark mode"><span aria-hidden="true">&#9788;</span><span>Theme</span></button>
    <button class="menu-toggle" data-menu-toggle aria-label="Open menu">&#9776;</button>
  </div>
  <div class="container mobile-menu" data-mobile-menu>
    <a href="index.html">Home</a>
    <a href="${slug}">${h1}</a>
    <a href="handle-generator.html">Handle Generator</a>
    <a href="gamertag-generator.html">Gamertag</a>
    <a href="about.html">About</a>
  </div>
</header>

<main>
  <section class="hero">
    <div class="container">
      <h1>${h1}</h1>
      <p>${intro}</p>
    </div>
  </section>

  <div class="container">
    <div class="ad-slot" data-id="ad-below-results" aria-label="Advertisement"></div>

    <article class="article">
      ${sectionHTML}

      <div class="faq">
        <h2>Frequently asked questions</h2>
        ${faqItems}
      </div>
    </article>

    <div class="ad-slot" data-id="ad-in-content" aria-label="Advertisement"></div>

    <div class="cross-links">
      <h3>Related generators</h3>
        ${related}
    </div>
  </div>
</main>

<footer class="site-footer">
  <div class="container footer-row">
    <div>&copy; <span id="yr"></span> NameSwift. Names are provided for creative use.</div>
    <div class="footer-links">
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
      <a href="privacy.html">Privacy</a>
      <a href="terms.html">Terms</a>
    </div>
  </div>
</footer>

<script>
  document.getElementById("yr").textContent = new Date().getFullYear();
</script>
<script src="assets/js/app.js" defer></script>
</body>
</html>`;
}

// =============================================================
// Build "Best Gaming Names" page
// =============================================================
function buildBestGamingNames() {
  const gamingNames = [
    "shadowslayer", "voidwalker", "ravenking", "ironwolf", "stormbreaker", "nightshade",
    "frostfang", "bloodmoon", "grimhunter", "dreadhowl", "venomshade", "ashbringer",
    "phantomrider", "chaosking", "doomcaller", "ironvanguard", "nightreaper", "soulreaver",
    "deathbringer", "crimsonknight", "shadowstrike", "voidhunter", "thunderfang", "wolfbane",
    "stormcaller", "bloodhunter", "dreadknight", "frostreaver", "ironclad", "shadowfang",
    "demonhunter", "nightshifter", "ashwalker", "soulstealer", "chaosrider", "grimreaper",
    "ironhowl", "stormhowl", "frostwolf", "shadestepper", "thunderwolf", "doomcrown",
    "ravenhowl", "venomfang", "nightfang", "ironpelt", "frosthunter", "grimfang",
    "stormshade", "bloodseeker", "soulrender", "crimsonfang", "voidcrown", "shadowblade"
  ];

  return buildSEOPage({
    slug: "best-gaming-names",
    title: "Best Gaming Names for 2026 - 50+ Cool Gamertag Ideas",
    metaDesc: "Looking for the best gaming names for 2026? Browse 50+ cool gamertag ideas organized by style (cool, funny, edgy, anime). Includes a free gamertag generator and tips for choosing a name that sticks.",
    h1: "Best Gaming Names for 2026",
    intro: "50+ cool gamertag ideas organized by style, with tips for picking a name that sticks. Whether you're a casual PS5 player, a ranked Valorant grinder, or a Minecraft builder, this list has something for you.",
    sections: [
      {
        h2: "Quick picks - 20 of the best gaming names right now",
        body: `<ul>
        <li><span class="example-name">shadowslayer</span> - sounds like a stealth assassin in any game</li>
        <li><span class="example-name">voidwalker</span> - mysterious, works for any genre</li>
        <li><span class="example-name">ravenking</span> - a little dark, a little royal</li>
        <li><span class="example-name">ironwolf</span> - the wolf pack vibes</li>
        <li><span class="example-name">stormbreaker</span> - feels like a Thor moment</li>
        <li><span class="example-name">nightshade</span> - elegant and dangerous</li>
        <li><span class="example-name">frostfang</span> - ice dragon energy</li>
        <li><span class="example-name">bloodmoon</span> - gothic, atmospheric</li>
        <li><span class="example-name">grimhunter</span> - doom slayer energy</li>
        <li><span class="example-name">dreadhowl</span> - werewolf vibes without trying</li>
        <li><span class="example-name">venomshade</span> - anti-hero, perfect for rogue mains</li>
        <li><span class="example-name">ashbringer</span> - paladin class, light-themed</li>
        <li><span class="example-name">phantomrider</span> - ghost in the shell</li>
        <li><span class="example-name">chaosking</span> - every MOBA main ever</li>
        <li><span class="example-name">doomcaller</span> - sounds like a boss fight</li>
        <li><span class="example-name">ironvanguard</span> - first-in-the-team vibes</li>
        <li><span class="example-name">nightreaper</span> - spooky without being try-hard</li>
        <li><span class="example-name">soulreaver</span> - demon souls main</li>
        <li><span class="example-name">deathbringer</span> - the "I'm the main character" energy</li>
        <li><span class="example-name">crimsonknight</span> - red knight, dark fantasy</li>
        </ul>`
      },
      {
        h2: "Cool gaming names (8 picks)",
        body: `<p>These names sound like they belong on a Twitch stream with 50k viewers. The trick: short, hard consonants, one sharp word.</p>
        <ul>
        <li><span class="example-name">xraven</span> - one letter, one word, infinite edge</li>
        <li><span class="example-name">primefang</span> - elite + danger</li>
        <li><span class="example-name">apexdoom</span> - sounds like a final boss</li>
        <li><span class="example-name">vexed</span> - one word, full attitude</li>
        <li><span class="example-name">grimzero</span> - number gives it weight</li>
        <li><span class="example-name">shade</span> - one word, one vibe</li>
        <li><span class="example-name">vanta</span> - feels like the inside of a stealth suit</li>
        <li><span class="example-name">hex</span> - three letters, one thousand hours played</li>
        </ul>`
      },
      {
        h2: "Funny gaming names (8 picks)",
        body: `<p>For when you want to be memorable without being scary. These work great on casual co-op nights and Discord servers.</p>
        <ul>
        <li><span class="example-name">npcenergy</span> - self-aware loot goblin</li>
        <li><span class="example-name">lagwitch</span> - blaming the wifi, always</li>
        <li><span class="example-name">crouchingsimpson</span> - the classic</li>
        <li><span class="example-name">altf4champ</span> - for the rage-quitters</li>
        <li><span class="example-name">potionhoarder</span> - never shares</li>
        <li><span class="example-name">lagspike</span> - you'll always be the one complaining about lag</li>
        <li><span class="example-name">gitgud</span> - tired but true</li>
        <li><span class="example-name">susmage</span> - multiplayer detective</li>
        </ul>`
      },
      {
        h2: "Edgy gaming names (8 picks)",
        body: `<p>For horror games, souls-likes, and the kind of usernames that get you killed first in Among Us.</p>
        <ul>
        <li><span class="example-name">dreadmoth</span> - genuinely unsettling</li>
        <li><span class="example-name">voidrot</span> - decay vibes</li>
        <li><span class="example-name">cruelthirteen</span> - lucky for nobody but you</li>
        <li><span class="example-name">ironveil</span> - cryptic, dark fantasy</li>
        <li><span class="example-name">blackmarrow</span> - witcher-coded</li>
        <li><span class="example-name">nightscream</span> - dramatic, classic</li>
        <li><span class="example-name">hollowking</span> - souls-like perfection</li>
        <li><span class="example-name">gorepriest</span> - for the Diablo mains</li>
        </ul>`
      },
      {
        h2: "How to pick a good gaming name",
        body: `<p>A great gamertag has four traits: it's <strong>short</strong> (under 12 characters reads well in any UI), <strong>memorable</strong> (one sharp word is better than three forgettable ones), <strong>pronounceable</strong> (your squad needs to be able to call it out in clutch), and <strong>genre-appropriate</strong> (a name that fits the game you're playing most). Avoid numbers and underscores when you can - they date your account and look like a placeholder.</p>
        <p>Need a custom one? Our <a href="gamertag-generator.html">free gamertag generator</a> combines 100+ prefixes (Shadow, Void, Iron, Storm, etc.) with 80+ suffixes (Slayer, Hunter, Reaper, etc.) to produce tens of thousands of unique combinations. Pick your vibe, hit generate, and you have 10 fresh ideas in under a second.</p>`
      },
      {
        h2: "How to change your gamertag in 2026",
        body: `<p>Every major platform lets you change your gamertag, though the rules vary:</p>
        <ul>
        <li><strong>Steam:</strong> Free once, then $5 per change. Profile names are separate from your account name.</li>
        <li><strong>Xbox:</strong> First change is free, then $9.99 per change. Limited to one change per 30 days.</li>
        <li><strong>PlayStation:</strong> First change free on PSN, then $4.99 per change. PSN IDs are unique forever - if someone has the name you want, even inactive, you can't take it.</li>
        <li><strong>Epic Games:</strong> Free, can change every 2 weeks.</li>
        <li><strong>Riot (Valorant, LoL):</strong> Free, can change occasionally, must include at least one letter and one number.</li>
        <li><strong>Battle.net:</strong> Free, can change every 30 days.</li>
        </ul>`
      }
    ],
    faqs: [
      { q: "What's a good gamertag?", a: "Short, memorable, pronounceable, and genre-appropriate. Aim for under 12 characters with one sharp word. Avoid numbers and underscores when possible." },
      { q: "How do I come up with a cool gamertag?", a: "Pick a vibe (cool, funny, edgy, anime) and a genre (fantasy, sci-fi, modern, horror). Combine one short word from each. Our gamertag generator does this for you - it produces 10 unique combinations in under a second." },
      { q: "Can I use the same gamertag on every platform?", a: "Often, but not always. Steam, Xbox, PlayStation, and Riot all have their own name spaces. Check availability on each platform after you find one you like." },
      { q: "Should my gamertag match my Twitch / YouTube name?", a: "Ideally yes - consistency makes it easier for fans to find you. Secure the name on every platform you stream on, even if you don't use them all yet." },
      { q: "Can I change my gamertag later?", a: "Most platforms let you change, usually for a small fee (Xbox $9.99, PSN $4.99, Steam $5). So don't stress too much - but picking a good one upfront saves money." }
    ],
    relatedLinks: [
      { href: "gamertag-generator.html", label: "Gamertag Generator" },
      { href: "username-generator.html", label: "Username Generator" },
      { href: "handle-generator.html", label: "Social Handle Generator" },
      { href: "skyrim-name-generator.html", label: "Skyrim Names" },
      { href: "world-of-warcraft-name-generator.html", label: "WoW Names" },
      { href: "league-of-legends-name-generator.html", label: "League of Legends Names" },
      { href: "elden-ring-name-generator.html", label: "Elden Ring Names" },
      { href: "dragon-name-generator.html", label: "Dragon Names" },
      { href: "index.html", label: "All generators" }
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Best Gaming Names for 2026 - 50+ Cool Gamertag Ideas",
      "description": "50+ cool gamertag ideas organized by style, with tips for picking a name that sticks.",
      "author": { "@type": "Organization", "name": "NameSwift" },
      "publisher": { "@type": "Organization", "name": "NameSwift", "url": "https://nameswiftgenerator.com" },
      "datePublished": "2026-08-22",
      "dateModified": "2026-08-22"
    }
  });
}

// =============================================================
// Build "Instagram Username Ideas" page
// =============================================================
function buildInstagramUsernameIdeas() {
  return buildSEOPage({
    slug: "instagram-username-ideas",
    title: "Instagram Username Ideas That Are Actually Available (2026)",
    metaDesc: "Looking for Instagram username ideas that are actually available? Browse 60+ creative username ideas by niche, get our free Instagram username generator, and learn the rules Instagram uses for username availability.",
    h1: "Instagram Username Ideas That Are Actually Available",
    intro: "60+ Instagram username ideas organized by niche, with a free generator that produces custom usernames for your account. Plus the rules Instagram uses for availability, and how to claim the name across platforms before someone else does.",
    sections: [
      {
        h2: "The Instagram username rules (2026)",
        body: `<p>Before picking a username, know what Instagram allows:</p>
        <ul>
        <li><strong>Length:</strong> 30 characters max, 2 characters min. The sweet spot for memorability is 8 to 15 characters.</li>
        <li><strong>Characters:</strong> Letters, numbers, periods, and underscores. No spaces, no hyphens, no special characters.</li>
        <li><strong>Uniqueness:</strong> Globally unique. If you want a name, you have to claim it before someone else does.</li>
        <li><strong>Periods and underscores don't make a name unique.</strong> <code>jane.doe</code>, <code>jane_doe</code>, and <code>janedoe</code> are all considered the same handle by Instagram's system.</li>
        <li><strong>Changes have a 14-day cooldown.</strong> Don't pick a name you'll regret. You can change it, but not often.</li>
        </ul>`
      },
      {
        h2: "60 Instagram username ideas by niche",
        body: `<p>Pick the category that matches your content, then run the free <a href="handle-generator.html">Instagram username generator</a> for 12 custom ideas based on your vibe.</p>

        <h3>Fashion and style</h3>
        <ul>
        <li><span class="example-name">velvetluxe</span>, <span class="example-name">ivorymode</span>, <span class="example-name">goldcouture</span>, <span class="example-name">silkatelier</span>, <span class="example-name">noirstyle</span>, <span class="example-name">pearlvogue</span></li>
        </ul>

        <h3>Beauty and skincare</h3>
        <ul>
        <li><span class="example-name">glowritual</span>, <span class="example-name">silkpetal</span>, <span class="example-name">rosebloom</span>, <span class="example-name">dewskin</span>, <span class="example-name">blushbar</span>, <span class="example-name">lushedit</span></li>
        </ul>

        <h3>Fitness and wellness</h3>
        <ul>
        <li><span class="example-name">ironbeast</span>, <span class="example-name">peakmode</span>, <span class="example-name">grindfits</span>, <span class="example-name">forceflex</span>, <span class="example-name">liftdaily</span>, <span class="example-name">pulseathlete</span></li>
        </ul>

        <h3>Food and cooking</h3>
        <ul>
        <li><span class="example-name">savorkitchen</span>, <span class="example-name">spicefeast</span>, <span class="example-name">freshplate</span>, <span class="example-name">basilbites</span>, <span class="example-name">emberchef</span>, <span class="example-name">noodletales</span></li>
        </ul>

        <h3>Travel</h3>
        <ul>
        <li><span class="example-name">wanderatlas</span>, <span class="example-name">nomadcompass</span>, <span class="example-name">roamvoyage</span>, <span class="example-name">beyondtrails</span>, <span class="example-name">driftglobe</span>, <span class="example-name">sojournmap</span></li>
        </ul>

        <h3>Art and design</h3>
        <ul>
        <li><span class="example-name">inkstudio</span>, <span class="example-name">brushatelier</span>, <span class="example-name">huepalette</span>, <span class="example-name">canvasdaily</span>, <span class="example-name">drawnedit</span>, <span class="example-name">sketchmuse</span></li>
        </ul>

        <h3>Photography</h3>
        <ul>
        <li><span class="example-name">aperturedaily</span>, <span class="example-name">focaledit</span>, <span class="example-name">exposureframe</span>, <span class="example-name">shutterpoem</span>, <span class="example-name">framelight</span>, <span class="example-name">lensandline</span></li>
        </ul>

        <h3>Music</h3>
        <ul>
        <li><span class="example-name">bassmode</span>, <span class="example-name">lofiwave</span>, <span class="example-name">soundedit</span>, <span class="example-name">mixandmuse</span>, <span class="example-name">treblekid</span>, <span class="example-name">echoviolet</span></li>
        </ul>

        <h3>Gaming</h3>
        <ul>
        <li><span class="example-name">shadowmancer</span>, <span class="example-name">voidwalker</span>, <span class="example-name">xraven</span>, <span class="example-name">grimzero</span>, <span class="example-name">runehex</span>, <span class="example-name">apexdoom</span></li>
        </ul>

        <h3>Tech and coding</h3>
        <ul>
        <li><span class="example-name">pixelhub</span>, <span class="example-name">bytelab</span>, <span class="example-name">apexdev</span>, <span class="example-name">codecore</span>, <span class="example-name">stackmode</span>, <span class="example-name">kernelkid</span></li>
        </ul>

        <h3>Lifestyle and daily</h3>
        <ul>
        <li><span class="example-name">slowvibes</span>, <span class="example-name">cozymode</span>, <span class="example-name">softdaily</span>, <span class="example-name">mindfullight</span>, <span class="example-name">sunnyhours</span>, <span class="example-name">quietsoul</span></li>
        </ul>

        <h3>Business and creator</h3>
        <ul>
        <li><span class="example-name">founderco</span>, <span class="example-name">growthcapital</span>, <span class="example-name">strategylab</span>, <span class="example-name">brandmode</span>, <span class="example-name">leadandgrow</span>, <span class="example-name">scalehq</span></li>
        </ul>`
      },
      {
        h2: "How to check if an Instagram username is available",
        body: `<p>Two ways. The fast way: open Instagram's sign-up screen, type the handle, and watch for the green check or the red "this username isn't available" message. The slower way: search for the exact handle in the Instagram search bar. If a profile comes up, it's taken. If you see "No results", it might still be available, or it might be hidden behind an inactive account.</p>
        <p>For inactive accounts, there's no public way to claim them. Some users wait 2 to 5 years and then contact Instagram support to ask for username release, but Instagram doesn't have a public process for this. The honest answer: if the name is taken by a dead account, you'll probably have to pick a different name.</p>`
      },
      {
        h2: "Should your Instagram handle match your TikTok and YouTube?",
        body: `<p>Yes, in 99% of cases. A consistent handle across platforms makes it dramatically easier for new fans to find you everywhere. Imagine someone watches your TikTok, types your handle into Instagram, and finds you instantly. The reverse is also true. If your handle is different on every platform, you lose some of those searches to people who gave up and followed a competitor instead.</p>
        <p>The exception: if your Instagram handle is taken but the same name is free on YouTube, you have three options. (1) Pick a close variation everywhere, like <code>@velvetluxe</code> on Instagram and <code>@velvetluxe.co</code> on YouTube. (2) Use a different handle on Instagram and add a "link in bio" to your YouTube on the Instagram profile. (3) Pick a completely new name that is free everywhere, and lose the older audience for the sake of consistency.</p>`
      },
      {
        h2: "Display name vs. username: what's the difference?",
        body: `<p>Your <strong>username</strong> is the unique handle that appears in your profile URL and in mentions. It's the part after the <code>@</code> and it's globally unique on Instagram. Your <strong>display name</strong> is the readable name shown at the top of your profile, next to your posts in the feed, and in your comments. It doesn't need to be unique and you can change it any time.</p>
        <p>A common pattern: use a short, brandable handle (<code>@velvetluxe</code>) and a longer, descriptive display name (<code>Velvet Luxe | Sustainable Style</code>). The handle is for tagging and searching, the display name is for first impressions.</p>`
      },
      {
        h2: "Names to avoid on Instagram",
        body: `<ul>
        <li><strong>Numbers that look like dates:</strong> <code>@jenny1995</code> is fine for a personal account, but reads weird for a brand.</li>
        <li><strong>Underscores at the start or end:</strong> Looks like a placeholder. <code>@_velvet</code> is a worse choice than <code>@velvet</code>.</li>
        <li><strong>Long compound words without separators:</strong> <code>@ilovefashionforever</code> is hard to read. <code>@ilovefashionforever</code> doesn't help. Use periods: <code>@i.love.fashion</code>.</li>
        <li><strong>Brand names you don't own:</strong> If your handle is <code>@nike_fan_official</code>, you're one trademark complaint away from losing it. Don't use brand names.</li>
        <li><strong>Hard-to-spell words:</strong> If you have to spell it out loud three times, it's not the right name. The easier you are to find, the more followers you'll get from word-of-mouth.</li>
        </ul>`
      },
      {
        h2: "Get a custom Instagram username idea in 2 seconds",
        body: `<p>Open the <a href="handle-generator.html">free Instagram username generator</a>, pick "Instagram" as the platform, choose your niche (fashion, beauty, fitness, food, travel, art, music, gaming, tech, lifestyle, business), pick a vibe (cool, professional, funny, mysterious, cute, edgy, chill, luxury), and hit <strong>Generate handles</strong>. You get 12 custom username ideas built from a 200+ word bank of niche-relevant syllables crossed with vibe modifiers. Copy the one you like, paste it into Instagram, and see if it's available. If not, hit generate again for 12 fresh ones.</p>`
      }
    ],
    faqs: [
      { q: "How long can an Instagram username be?", a: "Instagram usernames can be 2 to 30 characters. The sweet spot for memorability and shareability is 8 to 15 characters. Shorter is better, but don't sacrifice meaning to save a character." },
      { q: "Can Instagram usernames have periods and underscores?", a: "Yes, both. But Instagram treats jane.doe, jane_doe, and janedoe as the same handle, so you can't claim multiple variations of the same name. Pick one separator and stick with it." },
      { q: "How often can I change my Instagram username?", a: "You can change your Instagram username, but there's a 14-day cooldown between changes. So don't pick a name you'll regret. Also note that your old username becomes available for someone else to claim the moment you change it." },
      { q: "What if my Instagram handle is taken on a dead account?", a: "There's no public process to claim a handle from an inactive account. You can report the account to Instagram for impersonation if it's actually pretending to be you or your brand, but if it's just a dormant account that happens to have your name, you'll need to pick a different name." },
      { q: "Should I use my real name on Instagram?", a: "For personal accounts, yes. Your real name (or a close variation like first initial + last name) is the most discoverable choice. For creator or brand accounts, use a niche + vibe handle so the name communicates your content at a glance." }
    ],
    relatedLinks: [
      { href: "handle-generator.html", label: "Social Handle Generator" },
      { href: "gamertag-generator.html", label: "Gamertag Generator" },
      { href: "username-generator.html", label: "Username Generator" },
      { href: "best-gaming-names.html", label: "Best Gaming Names" },
      { href: "elf-name-generator.html", label: "Elf Name Generator" },
      { href: "dwarf-name-generator.html", label: "Dwarf Name Generator" },
      { href: "witch-name-generator.html", label: "Witch Name Generator" },
      { href: "vampire-name-generator.html", label: "Vampire Name Generator" },
      { href: "index.html", label: "All generators" }
    ],
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": "Instagram Username Ideas That Are Actually Available (2026)",
      "description": "60+ Instagram username ideas by niche, plus a free generator and the rules Instagram uses for availability.",
      "author": { "@type": "Organization", "name": "NameSwift" },
      "publisher": { "@type": "Organization", "name": "NameSwift", "url": "https://nameswiftgenerator.com" },
      "datePublished": "2026-08-22",
      "dateModified": "2026-08-22"
    }
  });
}

// =============================================================
// Update homepage (add 2 new tiles for Handle Generator + Best Gaming Names)
// =============================================================
function updateHomepage() {
  const indexPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(indexPath, 'utf8');

  // 1) Add the new tile in the generators grid (insert before closing </div> of grid)
  const newTile = `      <a class="gen-tile" href="handle-generator.html">
        <div class="gen-emoji">&#128221;</div>
        <h3>Social Handle Generator</h3>
        <p>Quiz-style generator for Instagram, YouTube, TikTok, X, Twitch, Discord, GitHub. 13 niches, 8 vibes.</p>
      </a>
      <a class="gen-tile" href="best-gaming-names.html">
        <div class="gen-emoji">&#127918;</div>
        <h3>Best Gaming Names</h3>
        <p>50+ cool gamertag ideas by style, with tips and the rules for changing your name on every platform.</p>
      </a>
      <a class="gen-tile" href="instagram-username-ideas.html">
        <div class="gen-emoji">&#128247;</div>
        <h3>Instagram Username Ideas</h3>
        <p>60+ creative Instagram handle ideas by niche, plus the rules Instagram uses for availability.</p>
      </a>
`;

  // Try to insert before the closing </div> of the gaming grid (the last grid before <div class="article">)
  if (!html.includes('href="handle-generator.html"')) {
    const articleIdx = html.indexOf('<div class="article">');
    if (articleIdx > -1) {
      // Find the last </div> before the article block (this closes the gaming grid)
      const before = html.slice(0, articleIdx);
      const lastDiv = before.lastIndexOf('</div>');
      if (lastDiv > -1) {
        html = before.slice(0, lastDiv) + newTile + '    ' + before.slice(lastDiv) + html.slice(articleIdx);
      }
    }
  }

  // 2) Add a link to handle-generator in the in-content cross-link block (if one exists)
  // We don't have an obvious in-content block in index.html, so we leave the homepage nav alone.

  fs.writeFileSync(indexPath, html);
}

// =============================================================
// Update sitemap.xml to include the 3 new URLs
// =============================================================
function updateSitemap() {
  const sitemapPath = path.join(__dirname, 'sitemap.xml');
  let xml = fs.readFileSync(sitemapPath, 'utf8');

  const today = '2026-08-22';
  const newUrls = [
    { loc: 'handle-generator.html',        priority: '0.9' },
    { loc: 'best-gaming-names.html',       priority: '0.8' },
    { loc: 'instagram-username-ideas.html',priority: '0.8' }
  ];

  let changed = false;
  newUrls.forEach(u => {
    if (!xml.includes(u.loc)) {
      const entry = `  <url>
    <loc>https://nameswiftgenerator.com/${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>
`;
      // Insert before </urlset>
      xml = xml.replace('</urlset>', entry + '</urlset>');
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(sitemapPath, xml);
    console.log('[sitemap] added new URLs');
  } else {
    console.log('[sitemap] no changes needed');
  }
}

// =============================================================
// MAIN - orchestrate everything
// =============================================================
function main() {
  console.log('--- NameSwift handle generator build ---');

  // 1) Write handle-generator.html
  const handleHTML = buildHandleGenerator();
  fs.writeFileSync(path.join(__dirname, 'handle-generator.html'), handleHTML);
  console.log('[write] handle-generator.html (' + handleHTML.length + ' bytes)');

  // 2) Write assets/js/handle.js
  const handleJS = buildHandleJS();
  const jsDir = path.join(__dirname, 'assets', 'js');
  if (!fs.existsSync(jsDir)) fs.mkdirSync(jsDir, { recursive: true });
  fs.writeFileSync(path.join(jsDir, 'handle.js'), handleJS);
  console.log('[write] assets/js/handle.js (' + handleJS.length + ' bytes)');

  // 3) Append CSS for the handle form
  const cssChanged = appendHandleCSS();
  console.log('[css] appended handle form CSS: ' + (cssChanged ? 'yes' : 'already present'));

  // 4) Write best-gaming-names.html
  const gamingHTML = buildBestGamingNames();
  fs.writeFileSync(path.join(__dirname, 'best-gaming-names.html'), gamingHTML);
  console.log('[write] best-gaming-names.html (' + gamingHTML.length + ' bytes)');

  // 5) Write instagram-username-ideas.html
  const igHTML = buildInstagramUsernameIdeas();
  fs.writeFileSync(path.join(__dirname, 'instagram-username-ideas.html'), igHTML);
  console.log('[write] instagram-username-ideas.html (' + igHTML.length + ' bytes)');

  // 6) Update homepage
  updateHomepage();
  console.log('[update] index.html');

  // 7) Update sitemap
  updateSitemap();

  console.log('--- Build complete ---');
}

main();
