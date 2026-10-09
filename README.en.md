# Asoproyuja — Website

[Español](README.md) | **English**

Institutional website of **ASOPROYUJA, Asociación Agropecuaria Campesina Nacional** (Tax ID / NIT 825.001.418-2), Santa Marta, Colombia.

| | |
|---|---|
| **Public site** | https://asoproyuja.org — Next.js on Vercel |
| **Content admin** | https://cms.asoproyuja.org — headless WordPress (team only) |
| **Development** | WeDoo.digital |
| **Production branch** | `main` (every push deploys automatically) |

The site is **headless**: WordPress is only used to edit content; Next.js reads it through the API and builds the site. Visitors never see WordPress.

> The WordPress admin is in Spanish. Menu and button names are quoted as they appear there (e.g. "Ajustes del sitio" = Site settings).

---

## Contents

1. [Architecture](#1-architecture)
2. [Technologies and services](#2-technologies-and-services)
3. [Repository structure](#3-repository-structure)
4. [Local development](#4-local-development)
5. [Environment variables](#5-environment-variables)
6. [Deploying from scratch, step by step](#6-deploying-from-scratch-step-by-step)
7. [WordPress plugin "Asoproyuja Headless"](#7-wordpress-plugin-asoproyuja-headless)
8. [Content model](#8-content-model)
9. [Forms and email](#9-forms-and-email)
10. [SEO](#10-seo)
11. [Performance and analytics](#11-performance-and-analytics)
12. [Styles and design](#12-styles-and-design)
13. [Common tasks](#13-common-tasks)
14. [Maintenance](#14-maintenance)
15. [Troubleshooting](#15-troubleshooting)
16. [Pending content](#16-pending-content)

---

## 1. Architecture

```
 Asoproyuja team
        │  edits pages, news, menus and settings
        ▼
 WordPress — cms.asoproyuja.org (SiteGround, behind Cloudflare)
  + Secure Custom Fields (fields per section)
  + "Asoproyuja Headless" plugin  ─── on save ───┐
        │                                        │ POST /api/revalidate
        │ REST API (JSON)                        ▼
        └───────────────────────────►  Next.js — asoproyuja.org (Vercel)
                                        · static pages regenerated (ISR)
                                        · if WordPress is down → local content
        ┌─────────────────────────────  Visitor submits the contact form or the newsletter
        │ /api/contacto, /api/suscripcion  (server to server, with a shared secret)
        ▼
 WordPress stores the message or subscriber and sends the notification email (Post SMTP + Brevo)
```

Key points:

- **Static pages:** Next.js renders every page at build time and regenerates them every 10 minutes (`revalidate = 600`). WordPress also calls `/api/revalidate` whenever something is saved, so changes show up within seconds.
- **Fallback content:** `content/` holds all the approved content. It is used when `WP_URL` is not set, when WordPress does not respond, or when a field is empty. The site never goes blank.
- **Names match:** ACF field names are exactly the property names in `lib/types.ts`, so the WordPress JSON is used without mapping.
- **The CMS is closed to the public:** anything other than `/wp-admin`, the login and the API redirects to `asoproyuja.org`, and nothing on `cms.asoproyuja.org` is indexed by Google.

---

## 2. Technologies and services

| Piece | What it is | Where it is managed |
|---|---|---|
| Front end | Next.js 16 (App Router), React 19, TypeScript | This repository → Vercel |
| Front-end hosting | Vercel (project `asoproyuja`, team WeDoo digital) | vercel.com |
| CMS | WordPress + Secure Custom Fields + custom plugin | `cms.asoproyuja.org/wp-admin` (SiteGround) |
| DNS | Cloudflare (`asoproyuja.org`) | dash.cloudflare.com |
| Outgoing site email | Post SMTP (WordPress) + Brevo, sender `contacto@asoproyuja.org` | Brevo and WordPress → Post SMTP |
| Domain mailboxes | Zoho Mail (MX records) | Zoho |
| Analytics | Google Tag Manager, Google Analytics 4, Vercel Web Analytics and Speed Insights | Google and Vercel |
| Search | Google Search Console (domain property `asoproyuja.org`) | search.google.com/search-console |

WordPress plugins in use: **Secure Custom Fields**, **Asoproyuja Headless**, **Post SMTP**, **Speed Optimizer** and **Security Optimizer** (by SiteGround).

---

## 3. Repository structure

```
app/                          Next.js routes (App Router)
  layout.tsx                  Base document: styles, header, footer, "Donate" button, structured data and analytics
  page.tsx                    Home (same HTML as the approved design)
  quienes-somos/              About us: text in the page header, mission and vision, values, areas of work, org chart
  noticias/                   Paginated news list (/noticias, /noticias/pagina/N) and detail (/noticias/[slug])
  contacto/                   Contact and citizen services + form
  preguntas-frecuentes/       "Coming soon" until FAQs are added
  como-ayudar/                "Coming soon" until ways to help or donation details are added
  politica-de-datos/          Personal data policy (Colombian Law 1581 of 2012)
  api/revalidate/             Webhook called by WordPress on save
  api/contacto/               Receives the contact form and forwards it to WordPress
  api/suscripcion/            Receives the newsletter email and forwards it to WordPress
  sitemap.ts, robots.ts       Sitemap and robots
  manifest.ts, icon.png, apple-icon.png, favicon.ico   Icons and manifest
  not-found.tsx               404 page
components/
  Header.tsx                  Menu split around the logo + mobile side panel
  Footer.tsx                  Footer and floating "Donar ahora" button
  Slider.tsx                  Home slider
  ReelsCarousel.tsx           Instagram reels carousel
  Piezas.tsx                  Decorative puzzle pieces (exact positions from the design)
  Blocks.tsx                  Page header, calls to action, cards, "Coming soon", pagination
  ListadoNoticias.tsx         Paginated news list
  Icon.tsx                    Line icons (keys = options of the ACF "Icono" field)
  ContactoForm.tsx            Contact form
  NewsletterForm.tsx          Newsletter form
  Analytics.tsx               Google Tag Manager, GA4 and conversion events
  JsonLd.tsx                  Structured data (schema.org)
  Reveal.tsx                  Entrance animation for blocks (.reveal)
content/                      Local fallback content (approved copy)
  sitio.ts                    Global settings and every page (including the SEO tab)
  noticias.ts                 News
lib/
  types.ts                    Content types (= ACF field names)
  wp.ts                       WordPress REST client and CMS URL rewriting
  cms.ts                      Data access: WordPress first, local content as fallback
  seo.ts                      Metadata, canonical URLs, Open Graph and structured data
  imagen.ts                   Optimized images (AVIF/WebP srcset)
  nav.ts                      Default menus (when WordPress has none assigned)
  logo.ts                     Inline SVG logo (the stylesheet styles it as <svg>)
  format.ts                   Dates and helpers
public/assets/
  css/style.css               Approved design stylesheet. DO NOT MODIFY
  css/extra.css               Styles for everything new
  img/                        Images, partner logos, reel covers, icons, share image
scripts/
  exportar-contenido.ts       Exports content/ to JSON for the WordPress importer
wordpress/                    Not deployed to Vercel (see .vercelignore)
  asoproyuja-headless/        WordPress plugin (see section 7)
  asoproyuja-headless.zip     Packaged plugin to upload to WordPress
  tools/generar-acf-json.py   Generates the ACF field groups
next.config.ts                Image proxy, optimization, headers, caching and redirects
```

Not committed (`.gitignore`): `entregables/` (the approved HTML preview) and `design-src/` (proposal source files). If you have them locally, they are the visual reference of the design.

---

## 4. Local development

Requirements: **Node.js 20 or later** and npm.

```bash
npm install
npm run dev          # dev server with hot reload → http://localhost:3000
```

To see it exactly as in production:

```bash
npm run build
npm start            # → http://localhost:3000
```

- Without `.env.local`, the site uses the content in `content/`.
- To see the real content, copy `.env.example` to `.env.local` and set `WP_URL=https://cms.asoproyuja.org`. It is read-only; nothing in WordPress is changed.
- Forms only work locally if you also set `FORM_SECRET` (and real messages would reach the CMS: use with care).
- Analytics does not track locally (only on the official domain).

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build (also type-checks) |
| `npm start` | Serves the production build |
| `npm run typecheck` | Type-check only |
| `npm run exportar-contenido` | Regenerates `wordpress/asoproyuja-headless/seed/contenido.json` from `content/` |
| `python wordpress/tools/generar-acf-json.py` | Regenerates the plugin's ACF field groups |

> On Windows, if `npm install` fails with *"node" is not recognized as an internal or external command*, run it from PowerShell instead of Git Bash.

---

## 5. Environment variables

Set them in **Vercel → Settings → Environment Variables** (and in `.env.local` for development). **Paste them without quotes or spaces.**

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes | Public URL, no trailing slash: `https://asoproyuja.org`. Used for canonical URLs, sitemap, robots, and to decide which domain analytics tracks. |
| `WP_URL` | Yes (production) | WordPress URL: `https://cms.asoproyuja.org`. Empty = local content. |
| `REVALIDATE_SECRET` | With WordPress | Secret shared with `ASOPROYUJA_REVALIDATE_SECRET` (wp-config.php). |
| `FORM_SECRET` | With WordPress | Secret shared with `ASOPROYUJA_FORM_SECRET` (wp-config.php). Used by the contact form and the newsletter. |
| `NEXT_PUBLIC_GTM_ID` | No | Google Tag Manager container. Defaults to `GTM-K9H7CCQT`; `off` disables it. |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4. Defaults to `G-0ZYNYKJ7X6`; `off` disables it (e.g. if GA4 is configured inside GTM). |
| `NEXT_DIST_DIR` | No | Local testing only: alternative build folder (defaults to `.next`). |

The real secrets are **not in the repository**: they live in Vercel and in `wp-config.php`. To generate a new one:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 6. Deploying from scratch, step by step

This is how the project was set up. Use it to reinstall, move accounts, or understand how everything is connected.

### 6.1 Vercel (front end)

1. Vercel → **Add New → Project** → import the repository. The Next.js project is at the root: do not change *Root Directory* or the commands.
2. Add `NEXT_PUBLIC_SITE_URL` (it can be the `https://….vercel.app` URL at first).
3. **Deploy.** The site works right away with the local content in `content/`.

### 6.2 WordPress (CMS)

1. Install WordPress on `cms.asoproyuja.org` (SiteGround).
2. Install and activate **Secure Custom Fields** (free). Free ACF will not work: it has no repeaters or options page.
3. Plugins → "Añadir nuevo" (Add new) → "Subir plugin" (Upload) → `wordpress/asoproyuja-headless.zip` → Activate.
4. Add to `wp-config.php`, before `/* That's all, stop editing! */`:
   ```php
   define( 'ASOPROYUJA_FRONT_URL', 'https://asoproyuja.org' );       // or the Vercel URL until the domain is live
   define( 'ASOPROYUJA_REVALIDATE_SECRET', 'long-random-secret-1' );  // = REVALIDATE_SECRET in Vercel
   define( 'ASOPROYUJA_FORM_SECRET', 'long-random-secret-2' );        // = FORM_SECRET in Vercel
   ```
5. Settings → Permalinks → "Post name" → Save.
6. Settings → General → **Timezone: Bogotá**.
7. SCF → Field groups: the 9 groups appear automatically. If it says "Sync available", sync them.
8. Tools → **"Importar contenido Asoproyuja"** → Import. **The site must already be live at `ASOPROYUJA_FRONT_URL`**, because the importer downloads the images from there. It can be run again without creating duplicates.
9. **"Ajustes del sitio"** (Site settings) → Contact tab → **"Correo que recibe los mensajes del formulario"** (email that receives form messages), e.g. `contacto@asoproyuja.org`. WordPress's admin email (technical notices) is separate and stays as is.

### 6.3 Connect Vercel and WordPress

1. In Vercel add `WP_URL`, `REVALIDATE_SECRET` and `FORM_SECRET` (same secrets as in `wp-config.php`).
2. **Redeploy.** From then on the site reads its content from WordPress.
3. Test: change some text in WordPress, save and reload the site (it should update within seconds).

### 6.4 Domain and DNS (Cloudflare)

1. Vercel → Settings → **Domains**: add `asoproyuja.org` (connected to Production) and `www.asoproyuja.org` with **Redirect to `asoproyuja.org` (308 permanent)**.
2. In Cloudflare, for `@` and `www`: the record Vercel asks for (CNAME to the `…vercel-dns-017.com` value, or an A record `76.76.21.21`), always **DNS only (grey cloud)**. With the orange cloud Vercel cannot issue the SSL certificate.
3. Cloudflare will not let you create the CNAME if an A record with the same name already exists: delete one before creating the other.
4. **Do not touch:** `cms` (orange cloud, points to SiteGround), `send` and Brevo's TXT records, or Zoho's MX records (domain mailboxes).
5. Change `NEXT_PUBLIC_SITE_URL` (Vercel) and `ASOPROYUJA_FRONT_URL` (wp-config.php) to `https://asoproyuja.org` and **Redeploy**.

### 6.5 Email (Post SMTP + Brevo)

See [section 9](#9-forms-and-email). Final test: submit the form at `/contacto` and check that WordPress → "Mensajes" shows "Correo de aviso: Enviado" (notification email: sent).

### 6.6 Analytics and search engines

1. **Vercel → Analytics → Enable** (Hobby) and **Speed Insights → Enable**. If no data arrives within 24 hours, redeploy.
2. **Search Console:** Sitemaps → submit `https://asoproyuja.org/sitemap.xml`. In URL Inspection, request indexing for the Home, About us and News pages.
3. **GA4:** Admin → Events → mark `generate_lead` and `sign_up` as **key events**.
4. **GTM:** Preview (Tag Assistant) on `https://asoproyuja.org` and publish the container. **Do not create a GA4 tag in GTM with the same ID** (GA4 is already loaded directly; visits would be counted twice).

### 6.7 Final checklist

- [ ] `asoproyuja.org` loads and `www.asoproyuja.org` redirects to `asoproyuja.org`.
- [ ] `cms.asoproyuja.org` redirects to the site (also when logged in) and `cms.asoproyuja.org/robots.txt` says `Disallow: /`.
- [ ] A change in WordPress shows up on the site within seconds.
- [ ] Contact form: the email arrives and the message is stored in "Mensajes". Newsletter: stored in "Suscriptores".
- [ ] `asoproyuja.org/sitemap.xml` lists the pages and news.
- [ ] GA4 → Realtime shows the visit.

---

## 7. WordPress plugin "Asoproyuja Headless"

Folder `wordpress/asoproyuja-headless/` (current version in the header of `asoproyuja-headless.php`). Every function, option and meta key uses the `asoproyuja_` prefix; the API uses the `asoproyuja/v1` namespace.

| Feature | File |
|---|---|
| **News** post type (`noticia`) in the REST API | `includes/contenido.php` |
| "Asoproyuja: …" page templates, which enable each field group | `includes/contenido.php` |
| **"Ajustes del sitio"** options page and `GET /wp-json/asoproyuja/v1/ajustes` | `includes/contenido.php` |
| Menu locations **main menu**, **footer: navigation** and **footer: links**, and `GET /wp-json/asoproyuja/v1/menus` | `includes/contenido.php` |
| Headless redirect: every visitor (logged in or not) goes to the site; pages and news to their URL, WordPress-only views (feeds, search, archives) to the home page | `includes/contenido.php` |
| Forms: `POST /asoproyuja/v1/mensajes` and `POST /asoproyuja/v1/suscriptores` (`X-Asoproyuja-Secret` header), private **Messages** and **Subscribers** types, notification email and **CSV export** | `includes/formularios.php` |
| Notifies Vercel (`/api/revalidate`) on save and adds the "↻ Actualizar sitio" (refresh site) button to the admin bar | `includes/publicacion.php` |
| CMS hardening: `noindex` everywhere, `robots.txt` with `Disallow: /`, no WordPress sitemap, no XML-RPC, REST user list only when logged in, generic login error, uploads downscaled to 1920 px | `includes/seguridad.php` |
| Initial content importer (Tools → "Importar contenido Asoproyuja") from `seed/contenido.json` | `includes/importador.php` |
| Loads the field groups from `acf-json/` | `asoproyuja-headless.php` |

**Admin access:** the login URL is customized with Security Optimizer (it is not `/wp-login.php`, which returns 404). Ask the project administrator for the address and credentials; they are not documented in the repository.

**Updating the plugin:** upload the new zip in Plugins → Add new → Upload → **"Reemplazar el instalado con el subido"** (replace current with uploaded). No need to deactivate it or re-import.

---

## 8. Content model

### Pages (WordPress → Pages)

Each page is identified by its **slug** and uses a **template**, which enables its fields. Each section is a **tab**; lists (slides, logos, values, FAQs…) are **repeaters**: rows can be added, removed, edited and reordered. Every page also has the **"SEO (Google y redes)"** tab.

| Route | Slug | Template | Tabs | Type in `lib/types.ts` |
|---|---|---|---|---|
| `/` | `inicio` | Asoproyuja: Inicio | Slider · Welcome · Quick links · News · Instagram reels · Partners · Newsletter · Support us | `Inicio` |
| `/quienes-somos` | `quienes-somos` | Asoproyuja: Quiénes somos | Header (with the about text) · Mission and vision · Values · Areas of work · Org chart · Call to action | `QuienesSomos` |
| `/noticias` | `noticias` | Asoproyuja: Noticias | Header · List (news per page) · Call to action | `NoticiasPagina` |
| `/contacto` | `contacto` | Asoproyuja: Contacto | Header · Contact channels · Form (subject options) · Map | `Contacto` |
| `/preguntas-frecuentes` | `preguntas-frecuentes` | Asoproyuja: Preguntas frecuentes | Header · Coming soon · Questions · Call to action | `PreguntasFrecuentes` |
| `/como-ayudar` | `como-ayudar` | Asoproyuja: Cómo ayudar | Header · Coming soon · Ways to help · Donations · Call to action | `ComoAyudar` |
| `/politica-de-datos` | `politica-de-datos` | Asoproyuja: Política de datos | Header · Content | `PoliticaDatos` |

**"Coming soon":** the FAQ and How to help pages show the "Muy pronto" block (mascot, message and contact button) while their repeaters are empty. As soon as the first question, way to help or donation detail is added, the page shows the real content and joins the sitemap.

### Other content

| What | Where in WordPress | How the front end reads it |
|---|---|---|
| Global data (address, phones, email, hours, map, social links, footer copy, "Donar ahora" button) | **"Ajustes del sitio"** | `GET /wp-json/asoproyuja/v1/ajustes` → `getAjustes()` |
| Menus | **Appearance → Menus** | `GET /wp-json/asoproyuja/v1/menus` → `getMenus()` |
| News | **"Noticias"**: title, body, featured image and "Resumen de la tarjeta" (card summary) | `GET /wp/v2/noticias` → `getNoticias()` |
| Form messages | **"Mensajes"** (private, Export CSV) | Not exposed in the public API |
| Newsletter subscribers | **"Suscriptores"** (private, Export CSV) | Not exposed in the public API |

### Merge rules (`lib/cms.ts`)

- If the page exists in WordPress, its fields are used. **Any empty field** (empty text, missing image, repeater with no rows) **falls back to the local value** in `content/`.
- If WordPress has no news, the local ones are used.
- Links to `cms.asoproyuja.org/...` or `asoproyuja.org/...` become site routes (`/contacto`), and images at `cms.asoproyuja.org/wp-content/uploads/…` are served as `asoproyuja.org/wp-content/uploads/…` (proxy in `next.config.ts`).

### Automatic design behavior

- **Main menu:** on desktop, the first half of the items goes left of the logo and the rest to the right.
- **Slider:** frame, tilt and tape of each photo cycle as in the design. Titles longer than 55 characters are shown slightly smaller.
- **Partners** and **Reels:** hidden when empty. Reels need a vertical cover (9:16), URL and short description (up to 4 lines); the carousel autoplays and opens the reel on Instagram.
- **News:** the design shows no dates; the publish date only sorts the list. The 3 most recent appear on the home page; the list pages by 9.

### Icons

`components/Icon.tsx` holds the design's line icons. In ACF, the "Icono" field is a select with those same keys, and "Color del icono" picks the green or the yellow circle (terracotta icon).

---

## 9. Forms and email

### Contact (`/contacto`)

1. Fields: name, email, phone (optional), subject (editable options), message and the **data-processing consent checkbox** (Colombian Law 1581 of 2012) linking to `/politica-de-datos`. A hidden field filters bots.
2. `app/api/contacto/route.ts` validates and forwards to WordPress with the `X-Asoproyuja-Secret` header.
3. The plugin creates a private **Message** storing the consent date and time (proof under article 9 of Law 1581). Up to 5 messages per hour per email.
4. It sends an HTML notification to the "Correo que recibe los mensajes del formulario" address ("Ajustes del sitio"), with the visitor's **Reply-To**.
5. The message is stored **even if the email fails**. The "Correo de aviso" column says "Enviado" (sent) or "Falló el envío" (failed). **"Mensajes" → Exportar CSV** downloads every submission.

### Newsletter (home page)

The email is stored in **"Suscriptores"** (no duplicates). **Export CSV** downloads the list for whichever newsletter tool is chosen. The site does not send newsletters.

Without `WP_URL` or `FORM_SECRET`, forms respond "not enabled yet".

### SMTP: Post SMTP + Brevo

- **API option (recommended):** in Post SMTP choose *Brevo* and paste a **v3 API key** (Brevo → SMTP & API → **API Keys** → Generate; starts with `xkeysib-`). The SMTP key (`xsmtpsib-…`) **will not work** here: Brevo returns `401 Key not found`.
- **SMTP option:** `smtp-relay.brevo.com`, port `587`, TLS. Username: the *login* shown in Brevo's SMTP tab (ends in `@smtp-brevo.com`). Password: the SMTP key.
- **Sender:** `contacto@asoproyuja.org` (verified in Brevo, with DKIM and DMARC). Enable "force sender" in Post SMTP.
- If Brevo has **Security → Authorized IPs** enabled, add the SiteGround server IP or disable that restriction.
- **Recipients:** form messages go to the address in "Ajustes del sitio"; WordPress technical notices (updates, errors) still go to the admin email (Settings → General).

---

## 10. SEO

### Metadata

- **"SEO (Google y redes)"** tab on every page: title (50–60 characters), description (140–160) and optional image. Empty = defaults from `content/sitio.ts`.
- **Social sharing:** pages show the **square logo** (`public/assets/img/compartir-asoproyuja.jpg`, 1200 × 1200, "summary" card). **News** show their own title, summary and featured image (large card).
- Automatic: canonical URL, Open Graph and Twitter Card, `es-CO` language, `theme-color`, manifest and icons.
- Everything is built in `lib/seo.ts`.

### Structured data (schema.org)

- **NGO** (organization) and **WebSite** on every page: name, tax ID, logo, address, phones and social profiles (from "Ajustes del sitio").
- **BreadcrumbList** on inner pages, **NewsArticle** on every news item and **FAQPage** on the FAQ page once it has questions.
- Validate at https://search.google.com/test/rich-results.

### Indexing

- `asoproyuja.org/sitemap.xml`: pages with priority, last-modified date (from WordPress) and images; every news item with its photo. Updates itself.
- FAQ and How to help stay `noindex` and out of the sitemap while in "Coming soon".
- `robots.txt` allows everything except `/api/` and points to the sitemap.
- `*.vercel.app` and `cms.asoproyuja.org` respond with `X-Robots-Tag: noindex`: only `asoproyuja.org` appears on Google.
- Redirects (`next.config.ts`): `/atencion-al-ciudadano` → `/contacto`, `/nosotros` → `/quienes-somos`, `/quiero-apoyar` and `/donar` → `/como-ayudar`, `/politica-de-privacidad` → `/politica-de-datos`, `/inicio` and `/index.html` → `/`.

---

## 11. Performance and analytics

### Performance

- Static pages (ISR) served from Vercel's network.
- Optimized images: `lib/imagen.ts` builds AVIF/WebP `srcset` sized for each screen (the slider photo goes from 292 KB to 22 KB on mobile). Lazy loading below the fold and high priority for the main photo.
- Caching: CSS 1 year (with a `?v=` that changes on every deploy), images 30 days.
- Security headers: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`.
- Mobile Lighthouse at launch: performance 93–98, SEO 100, best practices 100, accessibility 91–98, zero layout shift (CLS 0). Remaining accessibility notes come from the approved design (green "Escríbenos" link contrast 4.46:1, slider dot size and h4/h5 order).

### Analytics

| Tool | What it measures | Where |
|---|---|---|
| Google Tag Manager `GTM-K9H7CCQT` | Container for marketing tags | `components/Analytics.tsx` |
| Google Analytics 4 `G-0ZYNYKJ7X6` | Visits, sources, conversions | `components/Analytics.tsx` |
| Vercel Web Analytics | Visits and top pages, cookieless | `app/layout.tsx` |
| Vercel Speed Insights | Real-user speed (LCP, INP, CLS) | `app/layout.tsx` |

- GTM and GA4 **only track on the `NEXT_PUBLIC_SITE_URL` domain** (with or without `www`): `localhost` and Vercel preview deployments are not counted.
- **Conversion events** (to GA4 and GTM's `dataLayer`): `generate_lead` when the contact form is sent (with the subject) and `sign_up` on newsletter subscription.
- **Do not create a GA4 tag in GTM with the same ID:** GA4 is already loaded directly. To manage it from GTM instead, set `NEXT_PUBLIC_GA_ID=off`.
- Vercel Hobby plan: 50,000 Analytics events/month for the whole team; when the limit is reached it stops recording, with no charge and no effect on the site.

---

## 12. Styles and design

- `public/assets/css/style.css` is the **client-approved design stylesheet, copied unchanged from the HTML preview. Do not modify it.**
- `public/assets/css/extra.css` holds everything new (inner page header, partner logos, reels, forms, org chart, accordion, "Coming soon", pagination) and only uses `style.css` variables (`--brand`, `--brand-deep`, `--accent`, `--gold`, `--bg-alt`, `--border`…).
- The home page renders the same HTML and classes as the preview. Inner pages reuse those classes (`.eyebrow`, `.section-head`, `.bien-grid`, `.quick-ico`, `.card-panel`, `.noticia-card`…).
- System fonts, as in the design: Century Gothic (headings) and Segoe UI (body). No external fonts are loaded.
- Images use a plain `<img>` (not the `next/image` component) to respect the design, but go through the optimizer via `optimizada()` in `lib/imagen.ts`.
- The logo is inline (`lib/logo.ts`) because the approved stylesheet targets it as `<svg>`; the file copy is `public/assets/img/logo.svg`.

**Visual check:** the home page was compared via screenshots against the approved preview (`entregables/asoproyuja-home-propuesta.html`) at 1440 px and 390 px, on every slide. It is identical except for the changes approved later: real partner logos, the "Política de datos" footer link, real news and the reels section.

---

## 13. Common tasks

### Shipping a code change

1. Test locally with `npm run build && npm start`.
2. Commit and push to `main`. Vercel deploys within 1–2 minutes (Vercel → Deployments to check status, or roll back to a previous version with **Promote**).

### Adding a field to a section

1. Add the property to `lib/types.ts` and its default value to `content/…`.
2. Use it in the page under `app/`.
3. Add the field to `wordpress/tools/generar-acf-json.py` **with the same name** and run `python wordpress/tools/generar-acf-json.py`.
4. `npm run exportar-contenido` (if the field has initial content).
5. Bump the plugin version (`Version:` in `asoproyuja-headless.php`), repackage the zip (with the `asoproyuja-headless` folder at the zip root), replace it in WordPress and sync in SCF → Field groups.

You can also create the field from the SCF UI: the plugin saves changes to `acf-json/`. In that case, copy the JSON into the repository so it is not lost.

### Adding a new page

1. Create `app/nueva-pagina/page.tsx` reusing `PageHero`, `SectionHead` and `CtaPanel` from `components/Blocks.tsx`, with `generateMetadata` calling `metadatos()` from `lib/seo.ts`.
2. If it must be editable: type in `lib/types.ts`, local content, template (`asoproyuja_plantillas()` in `includes/contenido.php`), ACF group in the generator (with `+ seo()`), a `getX()` function in `lib/cms.ts` and the page in `scripts/exportar-contenido.ts`.
3. Add it to the menu (WordPress or `lib/nav.ts`) and to `app/sitemap.ts`.

### Content (done by the Asoproyuja team in WordPress)

- **News item:** "Noticias" → Add: title, body, **featured image** (landscape) and "Resumen de la tarjeta". Order follows the publish date.
- **Reel:** Pages → Inicio → **"Reels de Instagram"** tab → vertical cover (9:16), reel URL and short description.
- **Partner logo:** Pages → Inicio → **"Aliados"** tab → PNG with transparent background.
- **Menus:** Appearance → Menus (if a location is left empty, the site uses `lib/nav.ts`).
- **See changes immediately:** "↻ Actualizar sitio" button in the admin bar.

### Changing the fallback copy

Edit `content/`, run `npm run exportar-contenido` and repackage the zip. **Do not re-run the importer with "Sobrescribir" (overwrite)** on a WordPress in use: it would replace whatever the client has edited.

---

## 14. Maintenance

- **WordPress and plugins:** keep WordPress, Secure Custom Fields, Post SMTP and the SiteGround plugins up to date. Check the site after updating SCF.
- **Backups:** SiteGround takes daily backups of the CMS; the code lives in this repository.
- **Security:** enable Security Optimizer's two-factor authentication for administrators and editors. Give client users the **Editor** role (not Administrator).
- **Rotating secrets:** if `REVALIDATE_SECRET` or `FORM_SECRET` is exposed, generate new ones and change them in Vercel and `wp-config.php` at the same time, then redeploy.
- **Vercel:** the project is on the Hobby plan, which its terms reserve for non-commercial use. A **Pro** account (WeDoo's or the client's) is recommended for a client site.
- **Monthly check:** Search Console (indexing errors), Speed Insights (Core Web Vitals in green) and "Mensajes" showing "Enviado".

---

## 15. Troubleshooting

| Symptom | Likely cause |
|---|---|
| A WordPress change does not appear | Use "↻ Actualizar sitio" or wait 10 minutes. Check that `REVALIDATE_SECRET` matches on both sides and that `ASOPROYUJA_FRONT_URL` is the live URL. If it persists, exclude `/wp-json/*` from caching in SiteGround → Speed Optimizer and purge the cache. |
| The site shows local content although WordPress has other content | `WP_URL` is not set in Vercel, or the page does not have the right slug or template. |
| An ACF image does not show | The field must have "Return format: URL" (the bundled groups already do). |
| The form says it is "not enabled" | `WP_URL` or `FORM_SECRET` is missing in Vercel. |
| "No fue posible enviar tu mensaje" (could not send) | `FORM_SECRET` (Vercel) and `ASOPROYUJA_FORM_SECRET` (wp-config) do not match, or WordPress is not responding. Details in Vercel → Logs. |
| "Mensajes" says "Falló el envío" or Post SMTP shows "Fallido" | SMTP misconfigured. `401 Key not found` = wrong Brevo key (see section 9). |
| Notifications go to the support mailbox | The "Correo que recibe los mensajes del formulario" field in "Ajustes del sitio" is empty. |
| `cms.asoproyuja.org` still shows pages | Outdated plugin or cache: replace the plugin, purge the SiteGround cache and test in a private window. |
| The importer does not download images | The site is not live at `ASOPROYUJA_FRONT_URL`. WordPress only downloads from public addresses on ports 80/443. |
| Cloudflare will not create Vercel's record | An A or CNAME record with that name already exists: edit or delete it first. Grey cloud on `@` and `www`. |
| A changed menu does not appear | The menu is not assigned to its location (Appearance → Menus → Manage locations). |
| SCF shows no field groups | Secure Custom Fields is not active, or the groups need syncing. |
| Speed Insights or Analytics show no data | Just enabled: wait for real visits. If there is no data after 24 hours, redeploy. Ad blockers prevent tracking. |

To inspect what WordPress returns: `https://cms.asoproyuja.org/wp-json/wp/v2/pages?slug=inicio&acf_format=standard`.

---

## 16. Pending content

- **FAQ and How to help:** in "Coming soon" until the client sends the content.
- **Public email and office hours:** hidden while empty in "Ajustes del sitio".
- **Map:** located by address (Calle 9 N. 19-42, Los Almendros, Santa Marta). Confirm the pin; otherwise paste Google Maps' "Embed a map" URL in "Ajustes del sitio".
- **Facebook:** points to `facebook.com/asociacion.asoneshca` (the association's former name). If there is a page under the new name, update it in "Ajustes del sitio".
- **News:** publish dates only sort the list and some are approximate. The "Mañana Blanca" photo shows a banner with the former name in the background.
- **Data policy:** a base text under Law 1581 of 2012; it should be reviewed by the association or its legal advisor.
- **Newsletter:** the approved design has no consent checkbox; consider updating the "Nota bajo el formulario" (note under the form) to mention the data policy.
