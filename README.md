# NameSwift

A fast, mobile-first fantasy and gaming name generator. Plain HTML, CSS, and JavaScript - no backend, no build step, no framework. All generation runs instantly in the browser.

## What's here

- 1 homepage (`index.html`)
- 18 fantasy race generators (Elf, Half-Elf, Drow, D&D Elf, Dwarf, Orc, Half-Orc, Gnome, Halfling, Tiefling, Dragonborn, Dragon, Demon, Angel, Fairy, Goblin, Vampire, Werewolf, Wizard, Witch)
- 6 gaming generators (Gamertag, Username, Skyrim, World of Warcraft, League of Legends, Elden Ring)
- 4 required pages (About, Contact, Privacy, Terms)
- `assets/css/style.css` - shared design system with dark mode
- `assets/js/app.js` - shared generator engine
- `sitemap.xml` - all pages for search engines
- `robots.txt` - allows crawling

## How to use

Drop the whole `nameforge` folder onto any static host (Vercel, Cloudflare Pages, Netlify, GitHub Pages, S3+CloudFront, plain Apache, plain nginx). No build, no install, no env vars.

When you deploy, replace `nameforge.example` in the meta tags, canonical URLs, sitemap.xml, and robots.txt with your real domain.

## Adding AdSense

Two ad slots are reserved in every page:

- `ad-below-results` - directly under the generated names
- `ad-in-content` - in the article content further down the page

Both are empty `<div class="ad-slot" data-id="..."></div>` elements. Replace the empty div with your AdSense `<ins class="adsbygoogle">` block to enable them. Ads will not appear above the generator.

## Customising

Each generator page defines its data inline in a `<script>window.NF_DATA = { ... }</script>` block at the bottom. Edit the `banks`, `presetNames`, `meanings`, and `character` objects to change the output. The shared engine in `assets/js/app.js` reads from this object.

## Theme

Dark mode is the default. The user's choice is stored in `localStorage` as a single entry `nf-theme`. No other data is persisted.
