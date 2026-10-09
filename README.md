# Asoproyuja — Sitio web

**Español** | [English](README.en.md)

Sitio institucional de **ASOPROYUJA, Asociación Agropecuaria Campesina Nacional** (NIT 825.001.418-2), Santa Marta, Colombia.

| | |
|---|---|
| **Sitio público** | https://asoproyuja.org — Next.js en Vercel |
| **Administrador de contenido** | https://cms.asoproyuja.org — WordPress headless (solo para el equipo) |
| **Desarrollo** | WeDoo.digital |
| **Rama de producción** | `main` (cada push publica automáticamente) |

El sitio es **headless**: WordPress solo se usa para editar el contenido; Next.js lo lee por la API y genera el sitio. Los visitantes nunca ven WordPress.

---

## Índice

1. [Arquitectura](#1-arquitectura)
2. [Tecnologías y servicios](#2-tecnologías-y-servicios)
3. [Estructura del repositorio](#3-estructura-del-repositorio)
4. [Desarrollo local](#4-desarrollo-local)
5. [Variables de entorno](#5-variables-de-entorno)
6. [Despliegue desde cero, paso a paso](#6-despliegue-desde-cero-paso-a-paso)
7. [Plugin de WordPress "Asoproyuja Headless"](#7-plugin-de-wordpress-asoproyuja-headless)
8. [Modelo de contenido](#8-modelo-de-contenido)
9. [Formularios y correo](#9-formularios-y-correo)
10. [SEO](#10-seo)
11. [Rendimiento y analítica](#11-rendimiento-y-analítica)
12. [Estilos y diseño](#12-estilos-y-diseño)
13. [Tareas frecuentes](#13-tareas-frecuentes)
14. [Mantenimiento](#14-mantenimiento)
15. [Solución de problemas](#15-solución-de-problemas)
16. [Pendientes de contenido](#16-pendientes-de-contenido)

---

## 1. Arquitectura

```
 Equipo de Asoproyuja
        │  edita páginas, noticias, menús y ajustes
        ▼
 WordPress — cms.asoproyuja.org (SiteGround, detrás de Cloudflare)
  + Secure Custom Fields (campos por secciones)
  + plugin "Asoproyuja Headless"  ─── al guardar ───┐
        │                                           │ POST /api/revalidate
        │ API REST (JSON)                           ▼
        └──────────────────────────────►  Next.js — asoproyuja.org (Vercel)
                                           · páginas estáticas regeneradas (ISR)
                                           · si WordPress no responde → contenido local
        ┌────────────────────────────────  Visitante envía el formulario de contacto o el newsletter
        │ /api/contacto, /api/suscripcion  (servidor a servidor, con clave compartida)
        ▼
 WordPress guarda el mensaje o el suscriptor y envía el correo de aviso (Post SMTP + Brevo)
```

Puntos clave:

- **Páginas estáticas:** Next.js genera todas las páginas en el build y las regenera cada 10 minutos (`revalidate = 600`). Además, WordPress avisa a `/api/revalidate` cada vez que se guarda algo, así los cambios se ven en segundos.
- **Contenido de respaldo:** `content/` tiene todo el contenido aprobado. Se usa si `WP_URL` no está definido, si WordPress no responde o si un campo está vacío. El sitio nunca queda en blanco.
- **Los nombres coinciden:** los campos de ACF se llaman exactamente como las propiedades de `lib/types.ts`, así que el JSON de WordPress se usa sin traducir campos.
- **El CMS está cerrado al público:** todo lo que no sea `/wp-admin`, el acceso o la API redirige a `asoproyuja.org` y nada de `cms.asoproyuja.org` se indexa en Google.

---

## 2. Tecnologías y servicios

| Pieza | Qué es | Dónde se administra |
|---|---|---|
| Front | Next.js 16 (App Router), React 19, TypeScript | Este repositorio → Vercel |
| Hosting del front | Vercel (proyecto `asoproyuja`, equipo WeDoo digital) | vercel.com |
| CMS | WordPress + Secure Custom Fields + plugin propio | `cms.asoproyuja.org/wp-admin` (SiteGround) |
| DNS | Cloudflare (`asoproyuja.org`) | dash.cloudflare.com |
| Correo saliente del sitio | Post SMTP (WordPress) + Brevo, remitente `contacto@asoproyuja.org` | Brevo y WordPress → Post SMTP |
| Correo del dominio | Zoho Mail (registros MX) | Zoho |
| Analítica | Google Tag Manager, Google Analytics 4, Vercel Web Analytics y Speed Insights | Google y Vercel |
| Buscadores | Google Search Console (propiedad de dominio `asoproyuja.org`) | search.google.com/search-console |

Plugins de WordPress en uso: **Secure Custom Fields**, **Asoproyuja Headless**, **Post SMTP**, **Speed Optimizer** y **Security Optimizer** (de SiteGround).

---

## 3. Estructura del repositorio

```
app/                          Rutas de Next.js (App Router)
  layout.tsx                  Documento base: estilos, encabezado, pie, botón "Donar", datos estructurados y analítica
  page.tsx                    Inicio (mismo HTML que el diseño aprobado)
  quienes-somos/              Nosotros: texto en el encabezado, misión y visión, valores, áreas de intervención, organigrama
  noticias/                   Listado paginado (/noticias, /noticias/pagina/N) y detalle (/noticias/[slug])
  contacto/                   Contacto y atención al ciudadano + formulario
  preguntas-frecuentes/       "Muy pronto" hasta que se carguen preguntas
  como-ayudar/                "Muy pronto" hasta que se carguen formas de ayudar o datos para donar
  politica-de-datos/          Política de tratamiento de datos (Ley 1581 de 2012)
  api/revalidate/             Webhook que llama WordPress al guardar
  api/contacto/               Recibe el formulario de contacto y lo reenvía a WordPress
  api/suscripcion/            Recibe el correo del newsletter y lo reenvía a WordPress
  sitemap.ts, robots.ts       Mapa del sitio y robots
  manifest.ts, icon.png, apple-icon.png, favicon.ico   Iconos y manifest
  not-found.tsx               Página 404
components/
  Header.tsx                  Menú partido alrededor del logo + panel lateral en móvil
  Footer.tsx                  Pie de página y botón flotante "Donar ahora"
  Slider.tsx                  Slider del Inicio
  ReelsCarousel.tsx           Carrusel de reels de Instagram
  Piezas.tsx                  Piezas de rompecabezas decorativas (posiciones exactas del diseño)
  Blocks.tsx                  Encabezado de página, llamados a la acción, tarjetas, "Muy pronto", paginación
  ListadoNoticias.tsx         Listado paginado de noticias
  Icon.tsx                    Iconos lineales (claves = opciones del campo "Icono" en ACF)
  ContactoForm.tsx            Formulario de contacto
  NewsletterForm.tsx          Formulario del newsletter
  Analytics.tsx               Google Tag Manager, GA4 y eventos de conversión
  JsonLd.tsx                  Datos estructurados (schema.org)
  Reveal.tsx                  Animación de entrada de los bloques (.reveal)
content/                      Contenido local de respaldo (textos aprobados)
  sitio.ts                    Ajustes globales y todas las páginas (incluida la pestaña SEO)
  noticias.ts                 Noticias
lib/
  types.ts                    Tipos de contenido (= nombres de campos ACF)
  wp.ts                       Cliente de la API REST de WordPress y conversión de URL del CMS
  cms.ts                      Obtención de datos: WordPress primero, contenido local de respaldo
  seo.ts                      Metadatos, canónicas, Open Graph y datos estructurados
  imagen.ts                   Imágenes optimizadas (srcset AVIF/WebP)
  nav.ts                      Menús por defecto (si WordPress no tiene menús asignados)
  logo.ts                     Logo en SVG (va en línea porque la hoja de estilos lo estiliza como <svg>)
  format.ts                   Fechas y utilidades
public/assets/
  css/style.css               Hoja de estilos del diseño aprobado. NO SE MODIFICA
  css/extra.css               Estilos de todo lo nuevo
  img/                        Imágenes, logos de aliados, portadas de reels, iconos, imagen para compartir
scripts/
  exportar-contenido.ts       Exporta content/ a JSON para el importador de WordPress
wordpress/                    No se despliega en Vercel (ver .vercelignore)
  asoproyuja-headless/        Plugin de WordPress (ver sección 7)
  asoproyuja-headless.zip     Plugin empaquetado para subir a WordPress
  tools/generar-acf-json.py   Genera los grupos de campos ACF
next.config.ts                Proxy de imágenes, optimización, cabeceras, caché y redirecciones
```

No se suben al repositorio (`.gitignore`): `entregables/` (el preview en HTML aprobado) y `design-src/` (archivos fuente de la propuesta). Si los tiene en su copia local, son la referencia visual del diseño.

---

## 4. Desarrollo local

Requisitos: **Node.js 20 o superior** y npm.

```bash
npm install
npm run dev          # desarrollo con recarga automática → http://localhost:3000
```

Para verlo exactamente como en producción:

```bash
npm run build
npm start            # → http://localhost:3000
```

- Sin `.env.local`, el sitio usa el contenido de `content/`.
- Para ver el contenido real, copie `.env.example` a `.env.local` y llene `WP_URL=https://cms.asoproyuja.org`. Solo se lee; no se modifica nada en WordPress.
- Los formularios solo funcionan en local si además define `FORM_SECRET` (y llegarían mensajes reales al CMS: úselo con cuidado).
- La analítica no mide en local (solo en el dominio oficial).

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (también verifica TypeScript) |
| `npm start` | Sirve el build de producción |
| `npm run typecheck` | Solo verificación de tipos |
| `npm run exportar-contenido` | Regenera `wordpress/asoproyuja-headless/seed/contenido.json` desde `content/` |
| `python wordpress/tools/generar-acf-json.py` | Regenera los grupos de campos ACF del plugin |

> En Windows, si `npm install` falla con *"node" no se reconoce como un comando*, ejecútelo desde PowerShell en lugar de Git Bash.

---

## 5. Variables de entorno

Se configuran en **Vercel → Settings → Environment Variables** (y en `.env.local` para desarrollo). **Péguelas sin comillas ni espacios.**

| Variable | Obligatoria | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sí | URL pública, sin barra final: `https://asoproyuja.org`. Se usa en canónicas, sitemap, robots y para saber en qué dominio medir la analítica. |
| `WP_URL` | Sí (producción) | URL de WordPress: `https://cms.asoproyuja.org`. Vacía = contenido local. |
| `REVALIDATE_SECRET` | Con WordPress | Clave compartida con `ASOPROYUJA_REVALIDATE_SECRET` (wp-config.php). |
| `FORM_SECRET` | Con WordPress | Clave compartida con `ASOPROYUJA_FORM_SECRET` (wp-config.php). La usan el formulario de contacto y el newsletter. |
| `NEXT_PUBLIC_GTM_ID` | No | Contenedor de Google Tag Manager. Por defecto `GTM-K9H7CCQT`; `off` lo desactiva. |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4. Por defecto `G-0ZYNYKJ7X6`; `off` lo desactiva (por ejemplo, si GA4 se configura dentro de GTM). |
| `NEXT_DIST_DIR` | No | Solo para pruebas locales: carpeta de build alternativa (por defecto `.next`). |

Las claves reales **no están en el repositorio**: están en Vercel y en `wp-config.php`. Para generar una nueva:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 6. Despliegue desde cero, paso a paso

Así se montó el proyecto. Sirve para reinstalarlo, moverlo de cuenta o entender cómo está conectado.

### 6.1 Vercel (front)

1. Vercel → **Add New → Project** → importar el repositorio. El proyecto Next.js está en la raíz: no cambiar *Root Directory* ni comandos.
2. Variable `NEXT_PUBLIC_SITE_URL` (al principio puede ser la URL `https://….vercel.app`).
3. **Deploy.** El sitio funciona de inmediato con el contenido local de `content/`.

### 6.2 WordPress (CMS)

1. Instalar WordPress en `cms.asoproyuja.org` (SiteGround).
2. Instalar y activar **Secure Custom Fields** (gratuito). El ACF gratuito no sirve: no tiene repetidores ni página de opciones.
3. Plugins → Añadir nuevo → Subir plugin → `wordpress/asoproyuja-headless.zip` → Activar.
4. Agregar a `wp-config.php`, antes de `/* That's all, stop editing! */`:
   ```php
   define( 'ASOPROYUJA_FRONT_URL', 'https://asoproyuja.org' );       // o la URL de Vercel mientras no haya dominio
   define( 'ASOPROYUJA_REVALIDATE_SECRET', 'clave-larga-aleatoria-1' ); // = REVALIDATE_SECRET en Vercel
   define( 'ASOPROYUJA_FORM_SECRET', 'clave-larga-aleatoria-2' );       // = FORM_SECRET en Vercel
   ```
5. Ajustes → Enlaces permanentes → "Nombre de la entrada" → Guardar.
6. Ajustes → Generales → **Zona horaria: Bogotá**.
7. SCF → Grupos de campos: los 9 grupos aparecen solos. Si dice "Sincronización disponible", sincronizar.
8. Herramientas → **Importar contenido Asoproyuja** → Importar. **El sitio debe estar publicado en `ASOPROYUJA_FRONT_URL`**, porque el importador descarga las imágenes desde ahí. Se puede repetir sin duplicar.
9. **Ajustes del sitio** → pestaña Contacto → **Correo que recibe los mensajes del formulario** (por ejemplo, `contacto@asoproyuja.org`). El correo de administración de WordPress (avisos técnicos) es otro y no se cambia.

### 6.3 Conectar Vercel con WordPress

1. En Vercel agregar `WP_URL`, `REVALIDATE_SECRET` y `FORM_SECRET` (las mismas claves de `wp-config.php`).
2. **Redeploy.** Desde ese momento el sitio lee el contenido de WordPress.
3. Prueba: cambiar un texto en WordPress, guardar y recargar el sitio (debe verse en segundos).

### 6.4 Dominio y DNS (Cloudflare)

1. Vercel → Settings → **Domains**: agregar `asoproyuja.org` (conectado a Production) y `www.asoproyuja.org` con **Redirect to `asoproyuja.org` (308 permanente)**.
2. En Cloudflare, para `@` y `www`: el registro que indica Vercel (CNAME al valor `…vercel-dns-017.com` o registro A `76.76.21.21`), siempre en **Solo DNS (nube gris)**. Con la nube naranja Vercel no puede emitir el certificado SSL.
3. Cloudflare no deja crear el CNAME si ya existe un registro A con el mismo nombre: hay que borrar uno para crear el otro.
4. **No tocar:** `cms` (va con la nube naranja, hacia SiteGround), `send` y los TXT de Brevo, ni los MX de Zoho (correo del dominio).
5. Cambiar `NEXT_PUBLIC_SITE_URL` (Vercel) y `ASOPROYUJA_FRONT_URL` (wp-config.php) a `https://asoproyuja.org` y hacer **Redeploy**.

### 6.5 Correo (Post SMTP + Brevo)

Ver la [sección 9](#9-formularios-y-correo). Prueba final: enviar el formulario de `/contacto` y verificar que en WordPress → Mensajes diga "Correo de aviso: Enviado".

### 6.6 Analítica y buscadores

1. **Vercel → Analytics → Enable** (Hobby) y **Speed Insights → Enable**. Si no llegan datos en 24 horas, hacer un Redeploy.
2. **Search Console:** Sitemaps → enviar `https://asoproyuja.org/sitemap.xml`. En Inspección de URLs, solicitar la indexación del Inicio, Quiénes somos y Noticias.
3. **GA4:** Administrar → Eventos → marcar `generate_lead` y `sign_up` como **eventos clave**.
4. **GTM:** Vista previa (Tag Assistant) sobre `https://asoproyuja.org` y publicar el contenedor. **No crear en GTM una etiqueta de GA4 con el mismo ID** (ya se carga directamente; se duplicarían las visitas).

### 6.7 Verificación final

- [ ] `asoproyuja.org` carga y `www.asoproyuja.org` redirige a `asoproyuja.org`.
- [ ] `cms.asoproyuja.org` redirige al sitio (también con sesión iniciada) y `cms.asoproyuja.org/robots.txt` dice `Disallow: /`.
- [ ] Un cambio en WordPress aparece en el sitio en segundos.
- [ ] Formulario de contacto: llega el correo y queda en Mensajes. Newsletter: queda en Suscriptores.
- [ ] `asoproyuja.org/sitemap.xml` lista las páginas y noticias.
- [ ] GA4 → Tiempo real muestra la visita.

---

## 7. Plugin de WordPress "Asoproyuja Headless"

Carpeta `wordpress/asoproyuja-headless/` (versión actual en el encabezado de `asoproyuja-headless.php`). Todas las funciones, opciones y metadatos usan el prefijo `asoproyuja_`; la API usa el namespace `asoproyuja/v1`.

| Función | Archivo |
|---|---|
| Tipo de contenido **Noticias** (`noticia`) en la API REST | `includes/contenido.php` |
| Plantillas de página "Asoproyuja: …", que activan cada grupo de campos | `includes/contenido.php` |
| Página de opciones **Ajustes del sitio** y `GET /wp-json/asoproyuja/v1/ajustes` | `includes/contenido.php` |
| Menús **Menú principal**, **Pie de página: Navegación** y **Pie de página: Enlaces**, y `GET /wp-json/asoproyuja/v1/menus` | `includes/contenido.php` |
| Redirección headless: todo visitante (también con sesión) va al sitio; páginas y noticias a su dirección, lo propio de WordPress (feeds, búsquedas, archivos) al inicio | `includes/contenido.php` |
| Formularios: `POST /asoproyuja/v1/mensajes` y `POST /asoproyuja/v1/suscriptores` (cabecera `X-Asoproyuja-Secret`), tipos privados **Mensajes** y **Suscriptores**, correo de aviso y **exportación CSV** | `includes/formularios.php` |
| Aviso a Vercel (`/api/revalidate`) al guardar y botón "↻ Actualizar sitio" en la barra superior | `includes/publicacion.php` |
| Seguridad del CMS: `noindex` en todo, `robots.txt` con `Disallow: /`, sin sitemap de WordPress, sin XML-RPC, lista de usuarios de la API solo con sesión, mensaje de login genérico, fotos reducidas a 1920 px al subirlas | `includes/seguridad.php` |
| Importador del contenido inicial (Herramientas → Importar contenido Asoproyuja) desde `seed/contenido.json` | `includes/importador.php` |
| Carga de los grupos de campos desde `acf-json/` | `asoproyuja-headless.php` |

**Acceso al administrador:** la URL de acceso está personalizada con Security Optimizer (no es `/wp-login.php`, que responde 404). Pida la dirección y las credenciales al administrador del proyecto; no se documentan en el repositorio.

**Actualizar el plugin:** subir el zip nuevo en Plugins → Añadir nuevo → Subir plugin → **"Reemplazar el instalado con el subido"**. No hace falta desactivarlo ni volver a importar.

---

## 8. Modelo de contenido

### Páginas (WordPress → Páginas)

Cada página se identifica por su **slug** y usa una **plantilla**, que activa sus campos. Cada sección es una **pestaña**; los listados (diapositivas, logos, valores, preguntas…) son **repetidores**: se agregan, quitan, editan y reordenan. Todas las páginas tienen además la pestaña **SEO (Google y redes)**.

| Ruta | Slug | Plantilla | Pestañas | Tipo en `lib/types.ts` |
|---|---|---|---|---|
| `/` | `inicio` | Asoproyuja: Inicio | Slider · Bienvenida · Accesos rápidos · Noticias · Reels de Instagram · Aliados · Newsletter · Apóyanos | `Inicio` |
| `/quienes-somos` | `quienes-somos` | Asoproyuja: Quiénes somos | Encabezado (con el texto de quiénes somos) · Misión y visión · Valores · Áreas de intervención · Organigrama · Llamado a la acción | `QuienesSomos` |
| `/noticias` | `noticias` | Asoproyuja: Noticias | Encabezado · Listado (noticias por página) · Llamado a la acción | `NoticiasPagina` |
| `/contacto` | `contacto` | Asoproyuja: Contacto | Encabezado · Canales de atención · Formulario (opciones de asunto) · Mapa | `Contacto` |
| `/preguntas-frecuentes` | `preguntas-frecuentes` | Asoproyuja: Preguntas frecuentes | Encabezado · Muy pronto · Preguntas · Llamado a la acción | `PreguntasFrecuentes` |
| `/como-ayudar` | `como-ayudar` | Asoproyuja: Cómo ayudar | Encabezado · Muy pronto · Formas de ayudar · Donaciones · Llamado a la acción | `ComoAyudar` |
| `/politica-de-datos` | `politica-de-datos` | Asoproyuja: Política de datos | Encabezado · Contenido | `PoliticaDatos` |

**"Muy pronto":** Preguntas frecuentes y Cómo ayudar muestran el bloque "Muy pronto" (mascota, mensaje y botón a contacto) mientras sus repetidores estén vacíos. En cuanto se carga la primera pregunta, forma de ayudar o dato para donar, la página muestra el contenido real y entra al sitemap.

### Otros contenidos

| Qué | Dónde en WordPress | Cómo se lee en el front |
|---|---|---|
| Datos globales (dirección, teléfonos, correo, horario, mapa, redes, textos del pie, botón "Donar ahora") | **Ajustes del sitio** | `GET /wp-json/asoproyuja/v1/ajustes` → `getAjustes()` |
| Menús | **Apariencia → Menús** | `GET /wp-json/asoproyuja/v1/menus` → `getMenus()` |
| Noticias | **Noticias**: título, cuerpo, imagen destacada y "Resumen de la tarjeta" | `GET /wp/v2/noticias` → `getNoticias()` |
| Mensajes del formulario | **Mensajes** (privado, Exportar CSV) | No se exponen en la API pública |
| Suscriptores del newsletter | **Suscriptores** (privado, Exportar CSV) | No se exponen en la API pública |

### Reglas de combinación (`lib/cms.ts`)

- Si la página existe en WordPress, se usan sus campos. **Todo campo vacío** (texto vacío, imagen sin cargar, repetidor sin filas) **toma el valor local** de `content/`.
- Si WordPress no tiene noticias, se usan las locales.
- Los enlaces a `cms.asoproyuja.org/...` o `asoproyuja.org/...` se convierten en rutas del sitio (`/contacto`), y las imágenes de `cms.asoproyuja.org/wp-content/uploads/…` se sirven como `asoproyuja.org/wp-content/uploads/…` (proxy en `next.config.ts`).

### Comportamientos automáticos del diseño

- **Menú principal:** en escritorio, la primera mitad de los ítems va a la izquierda del logo y el resto a la derecha.
- **Slider:** el marco, el giro y las cintas de cada foto se repiten en ciclo como en el diseño. Los títulos de más de 55 caracteres se muestran un poco más pequeños.
- **Aliados** y **Reels:** si no hay elementos, la sección no se muestra. Los reels llevan portada vertical (9:16), URL y descripción corta (hasta 4 líneas); el carrusel avanza solo y abre el reel en Instagram.
- **Noticias:** el diseño no muestra fechas; la fecha de publicación solo ordena el listado. Las 3 más recientes aparecen en el Inicio; el listado pagina de a 9.

### Iconos

`components/Icon.tsx` contiene los iconos lineales del diseño. En ACF el campo "Icono" es un selector con esas mismas claves, y "Color del icono" elige entre el círculo verde y el amarillo (icono terracota).

---

## 9. Formularios y correo

### Contacto (`/contacto`)

1. Campos: nombre, correo, teléfono (opcional), asunto (opciones editables), mensaje y la **casilla de autorización de datos** (Ley 1581 de 2012) con enlace a `/politica-de-datos`. Un campo oculto filtra bots.
2. `app/api/contacto/route.ts` valida y reenvía a WordPress con la cabecera `X-Asoproyuja-Secret`.
3. El plugin crea un **Mensaje** privado con la fecha y hora de la autorización (prueba del art. 9 de la Ley 1581). Máximo 5 mensajes por hora por correo.
4. Envía un correo HTML de aviso al "Correo que recibe los mensajes del formulario" (Ajustes del sitio), con **Reply-To** del visitante.
5. El mensaje queda guardado **aunque el correo falle**. La columna "Correo de aviso" dice "Enviado" o "Falló el envío". **Mensajes → Exportar CSV** descarga todos los envíos.

### Newsletter (Inicio)

El correo queda en **Suscriptores** (sin duplicados). **Exportar CSV** descarga la lista para la herramienta de boletines que se elija. El sitio no envía boletines.

Sin `WP_URL` o `FORM_SECRET`, los formularios responden "aún no está habilitado".

### SMTP: Post SMTP + Brevo

- **Opción API (recomendada):** en Post SMTP elegir *Brevo* y pegar una **clave API v3** (Brevo → SMTP y API → **Claves API** → Generar; empieza por `xkeysib-`). **No** sirve la clave SMTP (`xsmtpsib-…`): Brevo responde `401 Key not found`.
- **Opción SMTP:** `smtp-relay.brevo.com`, puerto `587`, TLS. Usuario: el *login* de la pestaña SMTP de Brevo (termina en `@smtp-brevo.com`). Contraseña: la clave SMTP.
- **Remitente:** `contacto@asoproyuja.org` (verificado en Brevo, con DKIM y DMARC). Activar "forzar remitente" en Post SMTP.
- Si Brevo tiene activado **Seguridad → IP autorizadas**, agregar la IP del servidor de SiteGround o desactivar la restricción.
- **Destinos:** los mensajes del formulario van al correo de Ajustes del sitio; los avisos técnicos de WordPress (actualizaciones, errores) siguen yendo al correo de administración (Ajustes → Generales).

---

## 10. SEO

### Metadatos

- Pestaña **SEO (Google y redes)** en cada página: título (50–60 caracteres), descripción (140–160) e imagen opcional. Vacíos = textos por defecto de `content/sitio.ts`.
- **Al compartir en redes:** las páginas muestran el **logo cuadrado** (`public/assets/img/compartir-asoproyuja.jpg`, 1200 × 1200, tarjeta "summary"). Las **noticias** muestran su título, su resumen y su foto destacada (tarjeta grande).
- Automático: URL canónica, Open Graph y Twitter Card, idioma `es-CO`, `theme-color`, manifest e iconos.
- Todo se arma en `lib/seo.ts`.

### Datos estructurados (schema.org)

- **NGO** (organización) y **WebSite** en todas las páginas: nombre, NIT, logo, dirección, teléfonos y redes (de Ajustes del sitio).
- **BreadcrumbList** en las páginas interiores, **NewsArticle** en cada noticia y **FAQPage** en Preguntas frecuentes cuando tenga preguntas.
- Validación: https://search.google.com/test/rich-results.

### Indexación

- `asoproyuja.org/sitemap.xml`: páginas con prioridad, fecha de última modificación (de WordPress) e imágenes; cada noticia con su foto. Se actualiza solo.
- Preguntas frecuentes y Cómo ayudar quedan con `noindex` y fuera del sitemap mientras estén en "Muy pronto".
- `robots.txt` permite todo menos `/api/` y apunta al sitemap.
- `*.vercel.app` y `cms.asoproyuja.org` responden con `X-Robots-Tag: noindex`: en Google solo aparece `asoproyuja.org`.
- Redirecciones (`next.config.ts`): `/atencion-al-ciudadano` → `/contacto`, `/nosotros` → `/quienes-somos`, `/quiero-apoyar` y `/donar` → `/como-ayudar`, `/politica-de-privacidad` → `/politica-de-datos`, `/inicio` e `/index.html` → `/`.

---

## 11. Rendimiento y analítica

### Rendimiento

- Páginas estáticas (ISR) servidas desde la red de Vercel.
- Imágenes optimizadas: `lib/imagen.ts` genera `srcset` en AVIF/WebP al tamaño de cada pantalla (la foto del slider pasa de 292 KB a 22 KB en móvil). Carga diferida bajo el primer pantallazo y prioridad alta para la foto principal.
- Caché: CSS 1 año (con `?v=` que cambia en cada despliegue), imágenes 30 días.
- Cabeceras de seguridad: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`.
- Lighthouse en móvil al publicar: rendimiento 93–98, SEO 100, buenas prácticas 100, accesibilidad 91–98, cero saltos de diseño (CLS 0). Las observaciones de accesibilidad restantes son del diseño aprobado (contraste del enlace verde "Escríbenos" 4,46:1, tamaño de los puntos del slider y orden h4/h5).

### Analítica

| Herramienta | Qué mide | Dónde está |
|---|---|---|
| Google Tag Manager `GTM-K9H7CCQT` | Contenedor para etiquetas de marketing | `components/Analytics.tsx` |
| Google Analytics 4 `G-0ZYNYKJ7X6` | Visitas, fuentes, conversiones | `components/Analytics.tsx` |
| Vercel Web Analytics | Visitas y páginas más vistas, sin cookies | `app/layout.tsx` |
| Vercel Speed Insights | Velocidad real de los visitantes (LCP, INP, CLS) | `app/layout.tsx` |

- GTM y GA4 **solo miden en el dominio de `NEXT_PUBLIC_SITE_URL`** (con o sin `www`): no cuentan `localhost` ni las versiones de prueba de Vercel.
- **Eventos de conversión** (a GA4 y al `dataLayer` de GTM): `generate_lead` al enviar el formulario de contacto (con el asunto) y `sign_up` al suscribirse al newsletter.
- **No crear en GTM una etiqueta de GA4 con el mismo ID:** GA4 ya se carga directamente. Si se prefiere manejarlo desde GTM, poner `NEXT_PUBLIC_GA_ID=off`.
- Vercel en plan Hobby: 50.000 eventos/mes de Analytics para todo el equipo; si se llega al límite deja de registrar, sin cobros ni efecto en el sitio.

---

## 12. Estilos y diseño

- `public/assets/css/style.css` es la **hoja de estilos del diseño aprobado por el cliente, copiada sin cambios del preview en HTML. No se modifica.**
- `public/assets/css/extra.css` contiene todo lo nuevo (encabezado de páginas interiores, logos de aliados, reels, formularios, organigrama, acordeón, "Muy pronto", paginación) y usa solo las variables de `style.css` (`--brand`, `--brand-deep`, `--accent`, `--gold`, `--bg-alt`, `--border`…).
- El Inicio genera el mismo HTML y las mismas clases que el preview. Las páginas interiores reutilizan esas clases (`.eyebrow`, `.section-head`, `.bien-grid`, `.quick-ico`, `.card-panel`, `.noticia-card`…).
- Tipografías del sistema, como en el diseño: Century Gothic (títulos) y Segoe UI (texto). No se cargan fuentes externas.
- Las imágenes usan `<img>` normal (no el componente `next/image`) para respetar el diseño, pero pasan por el optimizador con `optimizada()` de `lib/imagen.ts`.
- El logo va en línea (`lib/logo.ts`) porque la hoja aprobada lo estiliza como `<svg>`; la copia en archivo está en `public/assets/img/logo.svg`.

**Verificación visual:** el Inicio se comparó con capturas contra el preview aprobado (`entregables/asoproyuja-home-propuesta.html`) en 1440 px y 390 px, en cada diapositiva. Es idéntico salvo los cambios aprobados después: logos reales de Aliados, enlace "Política de datos" en el pie, noticias reales y la sección de reels.

---

## 13. Tareas frecuentes

### Publicar un cambio de código

1. Probar en local con `npm run build && npm start`.
2. Commit y push a `main`. Vercel publica solo en 1–2 minutos (Vercel → Deployments para ver el estado o volver a una versión anterior con **Promote**).

### Agregar un campo a una sección

1. Agregar la propiedad en `lib/types.ts` y su valor por defecto en `content/…`.
2. Usarla en la página de `app/`.
3. Agregar el campo en `wordpress/tools/generar-acf-json.py` **con el mismo nombre** y ejecutar `python wordpress/tools/generar-acf-json.py`.
4. `npm run exportar-contenido` (si el campo tiene contenido inicial).
5. Subir la versión del plugin (`Version:` en `asoproyuja-headless.php`), reempaquetar el zip (la carpeta `asoproyuja-headless` en la raíz del zip), reemplazarlo en WordPress y sincronizar en SCF → Grupos de campos.

También se puede crear el campo desde la interfaz de SCF: el plugin guarda los cambios en `acf-json/`. En ese caso, copie el JSON al repositorio para no perderlo.

### Agregar una página nueva

1. Crear `app/nueva-pagina/page.tsx` reutilizando `PageHero`, `SectionHead` y `CtaPanel` de `components/Blocks.tsx`, con `generateMetadata` usando `metadatos()` de `lib/seo.ts`.
2. Si debe ser editable: tipo en `lib/types.ts`, contenido local, plantilla (`asoproyuja_plantillas()` en `includes/contenido.php`), grupo ACF en el generador (con `+ seo()`), función `getX()` en `lib/cms.ts` y la página en `scripts/exportar-contenido.ts`.
3. Agregarla al menú (WordPress o `lib/nav.ts`) y a `app/sitemap.ts`.

### Contenido (lo hace el equipo de Asoproyuja en WordPress)

- **Noticia:** Noticias → Agregar noticia: título, cuerpo, **imagen destacada** (horizontal) y "Resumen de la tarjeta". El orden lo da la fecha de publicación.
- **Reel:** Páginas → Inicio → pestaña **Reels de Instagram** → portada vertical (9:16), URL del reel y descripción corta.
- **Logo de aliado:** Páginas → Inicio → pestaña **Aliados** → PNG con fondo transparente.
- **Menús:** Apariencia → Menús (si una ubicación queda vacía, el sitio usa `lib/nav.ts`).
- **Ver los cambios al instante:** botón "↻ Actualizar sitio" en la barra superior.

### Cambiar textos del contenido de respaldo

Editar `content/`, ejecutar `npm run exportar-contenido` y reempaquetar el zip. **No vuelva a correr el importador con "Sobrescribir"** en un WordPress en uso: reemplazaría lo que el cliente haya editado.

---

## 14. Mantenimiento

- **WordPress y plugins:** mantener actualizados WordPress, Secure Custom Fields, Post SMTP y los de SiteGround. Probar el sitio después de actualizar SCF.
- **Copias de seguridad:** SiteGround hace copias diarias del CMS; el código está en este repositorio.
- **Seguridad:** activar la identificación en dos pasos de Security Optimizer para administradores y editores. Dar a los usuarios del cliente el rol **Editor** (no Administrador).
- **Rotar claves:** si `REVALIDATE_SECRET` o `FORM_SECRET` se exponen, generar nuevas y cambiarlas a la vez en Vercel y en `wp-config.php`, y hacer Redeploy.
- **Vercel:** el proyecto está en el plan Hobby, que según sus condiciones es para uso no comercial. Para un sitio de cliente se recomienda una cuenta **Pro** (de WeDoo o del cliente).
- **Revisar cada mes:** Search Console (errores de indexación), Speed Insights (Core Web Vitals en verde) y que Mensajes diga "Enviado".

---

## 15. Solución de problemas

| Síntoma | Causa probable |
|---|---|
| Un cambio en WordPress no aparece | Use "↻ Actualizar sitio" o espere 10 minutos. Verifique que `REVALIDATE_SECRET` coincida en ambos lados y que `ASOPROYUJA_FRONT_URL` sea la URL publicada. Si persiste, excluya `/wp-json/*` de la caché en SiteGround → Speed Optimizer y purgue la caché. |
| El sitio muestra el contenido local aunque WordPress tiene otro | `WP_URL` no está definido en Vercel, o la página no tiene el slug o la plantilla correctos. |
| Una imagen de ACF no aparece | El campo debe tener "Formato de retorno: URL" (los grupos incluidos ya vienen así). |
| El formulario responde "no está habilitado" | Falta `WP_URL` o `FORM_SECRET` en Vercel. |
| "No fue posible enviar tu mensaje" | `FORM_SECRET` (Vercel) y `ASOPROYUJA_FORM_SECRET` (wp-config) no coinciden, o WordPress no responde. Detalle en Vercel → Logs. |
| Mensajes dice "Falló el envío" o Post SMTP marca "Fallido" | SMTP mal configurado. `401 Key not found` = clave de Brevo equivocada (ver sección 9). |
| Los avisos llegan al correo de soporte | Falta el "Correo que recibe los mensajes del formulario" en Ajustes del sitio. |
| `cms.asoproyuja.org` todavía muestra páginas | Plugin desactualizado o caché: reemplazar el plugin, purgar la caché de SiteGround y probar en incógnito. |
| El importador no descarga imágenes | El sitio no está publicado en `ASOPROYUJA_FRONT_URL`. WordPress solo descarga desde direcciones públicas y puertos 80/443. |
| Cloudflare no deja crear el registro de Vercel | Ya existe un registro A o CNAME con ese nombre: edítelo o bórrelo primero. Nube gris en `@` y `www`. |
| Un menú cambiado no aparece | El menú no está asignado a su ubicación (Apariencia → Menús → Gestionar ubicaciones). |
| En SCF no aparecen los grupos de campos | Secure Custom Fields no está activo, o falta sincronizar. |
| Speed Insights o Analytics sin datos | Recién activados: esperar visitas reales. Si en 24 horas no hay datos, Redeploy. Los bloqueadores de anuncios impiden la medición. |

Para revisar qué entrega WordPress: `https://cms.asoproyuja.org/wp-json/wp/v2/pages?slug=inicio&acf_format=standard`.

---

## 16. Pendientes de contenido

- **Preguntas frecuentes y Cómo ayudar:** en "Muy pronto" hasta que el cliente envíe el contenido.
- **Correo público y horario de atención:** mientras estén vacíos en Ajustes del sitio, no se muestran.
- **Mapa:** ubicado por la dirección (Calle 9 N. 19-42, Los Almendros, Santa Marta). Confirmar el punto; si no, pegar en Ajustes del sitio la URL de "Insertar un mapa" de Google Maps.
- **Facebook:** apunta a `facebook.com/asociacion.asoneshca` (nombre anterior de la asociación). Si hay una página con el nombre nuevo, cambiarla en Ajustes del sitio.
- **Noticias:** las fechas de publicación solo ordenan el listado y algunas son aproximadas. La foto de "Mañana Blanca" muestra al fondo un pendón con el nombre anterior.
- **Política de datos:** texto base conforme a la Ley 1581 de 2012; debe revisarlo la asociación o su asesor legal.
- **Newsletter:** el diseño aprobado no tiene casilla de autorización; se recomienda ajustar la "Nota bajo el formulario" para mencionar la política de datos.
