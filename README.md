# Asoproyuja — Sitio web

Sitio institucional de ASOPROYUJA, Asociación Agropecuaria Campesina Nacional (NIT 825.001.418-2).

- **Sitio público:** https://asoproyuja.org (Next.js, publicado en Vercel)
- **Administrador de contenido:** https://cms.asoproyuja.org (WordPress headless)
- **Desarrollo:** WeDoo.digital

El sitio es **headless**: WordPress solo se usa para editar el contenido y Next.js lo muestra. Los visitantes nunca ven WordPress.

---

## Índice

1. [Cómo funciona](#1-cómo-funciona)
2. [Estructura del repositorio](#2-estructura-del-repositorio)
3. [Correr el proyecto en local](#3-correr-el-proyecto-en-local)
4. [Variables de entorno](#4-variables-de-entorno)
5. [Despliegue en Vercel](#5-despliegue-en-vercel)
6. [WordPress: instalación y plugin](#6-wordpress-instalación-y-plugin)
7. [Modelo de contenido](#7-modelo-de-contenido)
8. [Formularios: contacto y newsletter](#8-formularios-contacto-y-newsletter)
9. [Estilos y diseño](#9-estilos-y-diseño)
10. [Tareas frecuentes](#10-tareas-frecuentes)
11. [Solución de problemas](#11-solución-de-problemas)
12. [Pendientes de contenido](#12-pendientes-de-contenido)
13. [SEO, rendimiento y analítica](#13-seo-rendimiento-y-analítica)
14. [Lista para salir al aire](#14-lista-para-salir-al-aire)

---

## 1. Cómo funciona

```
 Equipo de Asoproyuja
        │  edita páginas, noticias, menús, ajustes…
        ▼
 WordPress (cms.asoproyuja.org)
  + Secure Custom Fields / ACF PRO
  + plugin "Asoproyuja Headless"  ──── al guardar ────┐
        │                                             │ POST /api/revalidate
        │ API REST (JSON)                             ▼
        └─────────────────────────────────►  Next.js en Vercel (asoproyuja.org)
                                              · páginas estáticas regeneradas (ISR)
                                              · si WordPress no responde → contenido local
        ┌─────────────────────────────────── Visitante envía el formulario de contacto o el newsletter
        │ /api/contacto, /api/suscripcion
        ▼
 WordPress guarda el mensaje o el suscriptor y envía el correo de aviso
```

Puntos clave:

- **Páginas estáticas:** Next.js genera todas las páginas en el build y las regenera cada 10 minutos (`revalidate = 600`). Además, WordPress avisa a `/api/revalidate` cada vez que se guarda algo, así los cambios se ven en segundos.
- **Contenido de respaldo:** la carpeta `content/` tiene todo el contenido aprobado. Se usa si `WP_URL` no está definido, si WordPress no responde o si un campo está vacío. El sitio nunca queda en blanco.
- **Los nombres coinciden:** los campos de ACF se llaman exactamente como las propiedades de `lib/types.ts`, así que el JSON de WordPress se usa sin traducir campos.

---

## 2. Estructura del repositorio

```
app/                        Rutas de Next.js (App Router)
  layout.tsx                Documento base: estilos, encabezado, pie y botón flotante "Donar"
  page.tsx                  Inicio (mismo HTML que el diseño aprobado)
  quienes-somos/            Nosotros: quiénes somos (en el encabezado), misión y visión, valores, áreas de intervención, organigrama
  noticias/                 Listado paginado (/noticias, /noticias/pagina/N) y detalle (/noticias/[slug])
  contacto/                 Contacto y atención al ciudadano + formulario
  preguntas-frecuentes/     Plantilla "Muy pronto" hasta que se carguen preguntas
  como-ayudar/              Plantilla "Muy pronto" hasta que se carguen formas de ayudar o datos para donar
  politica-de-datos/        Política de tratamiento de datos (Ley 1581 de 2012)
  api/revalidate/           Webhook que llama WordPress al guardar
  api/contacto/             Recibe el formulario de contacto y lo reenvía a WordPress
  api/suscripcion/          Recibe el correo del newsletter y lo reenvía a WordPress
  sitemap.ts, robots.ts     SEO
  not-found.tsx             Página 404
components/
  Header.tsx                Menú partido alrededor del logo + panel lateral en móvil
  Footer.tsx                Pie de página y botón flotante "Donar ahora"
  Slider.tsx                Slider del Inicio
  ReelsCarousel.tsx         Carrusel de reels de Instagram del Inicio
  Piezas.tsx                Piezas de rompecabezas decorativas (posiciones exactas del diseño)
  Blocks.tsx                Encabezado de página, llamados a la acción, tarjetas, "Muy pronto", paginación
  Icon.tsx                  Iconos lineales (claves = opciones del campo "Icono" en ACF)
  ContactoForm.tsx          Formulario de contacto
  NewsletterForm.tsx        Formulario del newsletter
  Reveal.tsx                Animación de entrada de los bloques (.reveal)
content/                    Contenido local de respaldo (textos aprobados)
  sitio.ts                  Ajustes globales y todas las páginas
  noticias.ts               Noticias
lib/
  types.ts                  Tipos de contenido (= nombres de campos ACF)
  wp.ts                     Cliente de la API REST de WordPress
  cms.ts                    Obtención de datos: WordPress primero, contenido local de respaldo
  nav.ts                    Menús por defecto (si WordPress no tiene menús asignados)
  logo.ts                   Logo en SVG (va en línea porque la hoja de estilos lo estiliza como <svg>)
public/assets/              Imágenes y CSS: style.css (aprobado, no se toca) y extra.css (lo nuevo)
scripts/
  exportar-contenido.ts     Exporta content/ a JSON para el importador de WordPress
wordpress/                  No se despliega en Vercel (ver .vercelignore)
  asoproyuja-headless/      Plugin de WordPress
    asoproyuja-headless.php Archivo principal
    includes/contenido.php  Noticias, plantillas, Ajustes del sitio, menús, redirección headless
    includes/formularios.php  Mensajes de contacto, suscriptores, correos y exportación CSV
    includes/publicacion.php  Aviso a Vercel al guardar
    includes/importador.php   Importación del contenido inicial
    acf-json/               9 grupos de campos ACF (se cargan solos)
    seed/contenido.json     Contenido inicial para el importador
  asoproyuja-headless.zip   Plugin empaquetado para subir a WordPress
  tools/generar-acf-json.py Genera acf-json/ a partir de una especificación
```

No se suben al repositorio (están en `.gitignore`): `entregables/` (el preview en HTML aprobado y la página "muy pronto") y `design-src/` (archivos fuente de la propuesta). Si los tiene en su copia local, son la referencia visual del diseño.

---

## 3. Correr el proyecto en local

Requisitos: Node.js 20 o superior.

```bash
npm install
npm run dev          # desarrollo con recarga automática → http://localhost:3000
```

Para verlo exactamente como en producción:

```bash
npm run build
npm start            # → http://localhost:3000
```

Sin `.env.local`, el sitio usa el contenido de `content/`. Para trabajar contra WordPress, copie `.env.example` a `.env.local` y llene `WP_URL`.

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (también verifica TypeScript) |
| `npm start` | Sirve el build de producción |
| `npm run typecheck` | Solo verificación de tipos |
| `npm run exportar-contenido` | Regenera `wordpress/asoproyuja-headless/seed/contenido.json` desde `content/` |

> En Windows, si `npm install` falla con *"node" no se reconoce como un comando*, ejecútelo desde PowerShell en lugar de Git Bash.

---

## 4. Variables de entorno

Se configuran en Vercel → Settings → Environment Variables (y en `.env.local` para desarrollo). **Péguelas sin comillas ni espacios.**

| Variable | Obligatoria | Descripción |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Sí | URL pública, sin barra final: `https://asoproyuja.org`. Se usa en sitemap, robots y metadatos. |
| `WP_URL` | No | URL de WordPress: `https://cms.asoproyuja.org`. Vacía = contenido local. |
| `REVALIDATE_SECRET` | Con WordPress | Clave compartida con `ASOPROYUJA_REVALIDATE_SECRET` (wp-config.php). |
| `FORM_SECRET` | Con WordPress | Clave compartida con `ASOPROYUJA_FORM_SECRET` (wp-config.php). La usan el formulario de contacto y el newsletter. |
| `NEXT_PUBLIC_GTM_ID` | No | Contenedor de Google Tag Manager. Por defecto `GTM-K9H7CCQT`; `off` lo desactiva. |
| `NEXT_PUBLIC_GA_ID` | No | Google Analytics 4. Por defecto `G-0ZYNYKJ7X6`; `off` lo desactiva (por ejemplo, si GA4 se configura dentro de GTM). |
| `NEXT_DIST_DIR` | No | Solo para pruebas locales: carpeta de build alternativa (por defecto `.next`). |

Para generar una clave larga: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

---

## 5. Despliegue en Vercel

El proyecto Next.js está en la raíz del repositorio, así que Vercel lo detecta sin configuración adicional.

1. Vercel → **Add New → Project** → importar el repositorio.
2. Framework: Next.js (automático). No cambiar Root Directory ni comandos.
3. Agregar `NEXT_PUBLIC_SITE_URL`. Las demás variables se agregan después de instalar WordPress (sección 6).
4. **Deploy.** Cada push a `main` publica automáticamente.
5. Dominio: Settings → Domains → `asoproyuja.org` y `www.asoproyuja.org`.

Qué se publica: solo las rutas de `app/` y los archivos de `public/`. La carpeta `wordpress/` y la documentación están en `.vercelignore`.

Redirecciones (`next.config.ts`): `/atencion-al-ciudadano` → `/contacto` (es la misma página), `/nosotros` → `/quienes-somos`, `/quiero-apoyar` y `/donar` → `/como-ayudar`, `/inicio` e `/index.html` → `/`.

---

## 6. WordPress: instalación y plugin

### Instalación (una sola vez)

1. Instalar WordPress en `cms.asoproyuja.org`.
2. Instalar y activar **Secure Custom Fields** (gratuito, WordPress.org) o **ACF PRO**. El ACF gratuito no sirve porque no tiene repetidores ni página de opciones.
3. Plugins → Añadir nuevo → Subir plugin → `wordpress/asoproyuja-headless.zip` → Activar.
4. Agregar a `wp-config.php` (antes de `/* That's all, stop editing! */`):
   ```php
   define( 'ASOPROYUJA_FRONT_URL', 'https://asoproyuja.org' );
   define( 'ASOPROYUJA_REVALIDATE_SECRET', 'clave-larga-aleatoria-1' ); // = REVALIDATE_SECRET en Vercel
   define( 'ASOPROYUJA_FORM_SECRET', 'clave-larga-aleatoria-2' );       // = FORM_SECRET en Vercel
   ```
   Mientras el dominio no esté activo, `ASOPROYUJA_FRONT_URL` puede ser la URL de Vercel (`https://….vercel.app`).
5. Ajustes → Enlaces permanentes → "Nombre de la entrada" → Guardar.
6. ACF → Grupos de campos: los 9 grupos aparecen solos. Si aparece "Sincronización disponible", sincronizar.
7. Herramientas → **Importar contenido Asoproyuja** → Importar. **Requiere que el sitio ya esté publicado en Vercel** (en `ASOPROYUJA_FRONT_URL`), porque descarga las imágenes desde ahí. Se puede repetir sin duplicar contenido.
8. Configurar SMTP (por ejemplo, *WP Mail SMTP* o *Post SMTP*) para que lleguen los correos de aviso.
9. Ajustes del sitio → **Correo que recibe los mensajes del formulario**: escribir el correo de Asoproyuja.
10. En Vercel, agregar `WP_URL`, `REVALIDATE_SECRET` y `FORM_SECRET`, y hacer **Redeploy**.

### Qué hace el plugin "Asoproyuja Headless"

| Función | Archivo |
|---|---|
| Registra el tipo **Noticias** (`noticia`) en la API REST | `includes/contenido.php` |
| Registra las plantillas de página "Asoproyuja: …", que activan cada grupo de campos | `includes/contenido.php` |
| Crea la página de opciones **Ajustes del sitio** y el endpoint `GET /wp-json/asoproyuja/v1/ajustes` | `includes/contenido.php` |
| Registra las ubicaciones de menú **Menú principal**, **Pie de página: Navegación** y **Pie de página: Enlaces**, y el endpoint `GET /wp-json/asoproyuja/v1/menus` | `includes/contenido.php` |
| Redirige al sitio público a quien visite WordPress sin sesión iniciada: cada página o noticia a su dirección en el sitio y lo demás al inicio. `cms.asoproyuja.org` solo sirve para entrar a `/wp-admin` y para la API | `includes/contenido.php` |
| Recibe el formulario de contacto en `POST /wp-json/asoproyuja/v1/mensajes` y el newsletter en `POST /wp-json/asoproyuja/v1/suscriptores` (cabecera `X-Asoproyuja-Secret`), guarda **Mensajes** y **Suscriptores** privados y envía el correo de aviso | `includes/formularios.php` |
| Avisa a Vercel (`/api/revalidate`) al guardar; agrega el botón "↻ Actualizar sitio" en la barra del administrador | `includes/publicacion.php` |
| Bloquea el CMS para el público: `noindex` en todo, `robots.txt` con `Disallow: /`, sin sitemap de WordPress, sin XML-RPC, lista de usuarios de la API solo con sesión iniciada, login sin pistas y fotos reducidas a 1920 px al subirlas | `includes/seguridad.php` |
| Importador del contenido inicial desde `seed/contenido.json` | `includes/importador.php` |
| Carga los grupos de campos desde `acf-json/` | `asoproyuja-headless.php` |

Todas las funciones, opciones y metadatos del plugin usan el prefijo `asoproyuja_`.

---

## 7. Modelo de contenido

### Páginas (WordPress → Páginas)

Cada página se identifica por su **slug** y usa una **plantilla**, que es la que activa sus campos ACF. Cada sección es una **pestaña**; los listados (diapositivas, logos, líneas, valores, preguntas…) son **repetidores**: se pueden agregar, quitar, editar y reordenar.

| Ruta del sitio | Slug en WP | Plantilla | Pestañas | Tipo en `lib/types.ts` |
|---|---|---|---|---|
| `/` | `inicio` | Asoproyuja: Inicio | Slider · Bienvenida · Accesos rápidos · Noticias · Reels de Instagram · Aliados · Newsletter · Apóyanos | `Inicio` |
| `/quienes-somos` | `quienes-somos` | Asoproyuja: Quiénes somos | Encabezado (con el texto de quiénes somos) · Misión y visión · Valores · Áreas de intervención · Organigrama · Llamado a la acción | `QuienesSomos` |
| `/noticias` | `noticias` | Asoproyuja: Noticias | Encabezado · Listado (noticias por página) · Llamado a la acción | `NoticiasPagina` |
| `/contacto` | `contacto` | Asoproyuja: Contacto | Encabezado · Canales de atención · Formulario (opciones de asunto) · Mapa | `Contacto` |
| `/preguntas-frecuentes` | `preguntas-frecuentes` | Asoproyuja: Preguntas frecuentes | Encabezado · Muy pronto · Preguntas · Llamado a la acción | `PreguntasFrecuentes` |
| `/como-ayudar` | `como-ayudar` | Asoproyuja: Cómo ayudar | Encabezado · Muy pronto · Formas de ayudar · Donaciones · Llamado a la acción | `ComoAyudar` |
| `/politica-de-datos` | `politica-de-datos` | Asoproyuja: Política de datos | Encabezado · Contenido | `PoliticaDatos` |

**Plantilla "Muy pronto":** Preguntas frecuentes y Cómo ayudar muestran el bloque "Muy pronto" (mascota, mensaje y botón a contacto) mientras sus repetidores estén vacíos. En cuanto se carga la primera pregunta, forma de ayudar o dato para donar, la página muestra el contenido real.

### Otros contenidos

| Qué | Dónde en WordPress | Cómo se lee en el front |
|---|---|---|
| Datos globales (dirección, teléfonos, correo, horario, mapa, redes, textos del pie, botón "Donar ahora") | **Ajustes del sitio** | `GET /wp-json/asoproyuja/v1/ajustes` → `getAjustes()` |
| Menús | **Apariencia → Menús**, ubicaciones "Menú principal", "Pie de página: Navegación" y "Pie de página: Enlaces" | `GET /wp-json/asoproyuja/v1/menus` → `getMenus()` |
| Noticias | **Noticias**: título, editor (cuerpo), imagen destacada (foto) y "Resumen de la tarjeta" | `GET /wp/v2/noticias` → `getNoticias()` |
| Mensajes del formulario | **Mensajes** (privado) | No se exponen en la API pública |
| Suscriptores del newsletter | **Suscriptores** (privado, botón "Exportar CSV") | No se exponen en la API pública |

### Reglas de combinación (`lib/cms.ts`)

- Si la página existe en WordPress, se usan sus campos. **Todo campo vacío** (texto vacío, imagen sin cargar, repetidor sin filas) **toma el valor local** de `content/`.
- Si WordPress no tiene noticias, se usan las locales.
- Los enlaces absolutos a `cms.asoproyuja.org/...` o a `asoproyuja.org/...` se convierten en rutas del sitio (`/contacto`). Los archivos de `/wp-content/` se dejan tal cual.

### Detalles del diseño que se resuelven solos

- **Menú principal:** en escritorio, la primera mitad de los ítems va a la izquierda del logo y el resto a la derecha.
- **Slider:** el marco, el giro y las cintas de cada foto se repiten en ciclo como en el diseño. Los títulos de más de 55 caracteres se muestran un poco más pequeños.
- **Aliados:** si no hay logos, la sección no se muestra.
- **Reels de Instagram:** cada reel lleva portada vertical (9:16), URL del reel y una descripción corta (se muestra hasta en 4 líneas). El carrusel avanza solo, se detiene al pasar el mouse y abre el reel en Instagram. Sin reels, la sección no se muestra.
- **Noticias:** el diseño no muestra fechas; la fecha de publicación solo ordena el listado (de la más reciente a la más antigua). Las 3 más recientes aparecen en el Inicio.

### Iconos

`components/Icon.tsx` contiene los iconos lineales del diseño. En ACF el campo "Icono" es un selector con esas mismas claves, y "Color del icono" elige entre el círculo verde y el amarillo (icono terracota), igual que los accesos rápidos del Inicio.

---

## 8. Formularios: contacto y newsletter

### Contacto (`/contacto`)

1. Campos: nombre, correo, teléfono (opcional), asunto (opciones editables en la página Contacto), mensaje y la **casilla de autorización de datos** (Ley 1581 de 2012) con enlace a `/politica-de-datos`. Un campo oculto filtra bots.
2. `app/api/contacto/route.ts` valida los datos y los reenvía a WordPress con la cabecera `X-Asoproyuja-Secret`.
3. El plugin crea un **Mensaje** privado y guarda la fecha y hora de la autorización como prueba (art. 9 de la Ley 1581). Máximo 5 mensajes por hora por correo.
4. Envía un correo HTML de aviso al "Correo que recibe los mensajes del formulario" (Ajustes del sitio), con **Reply-To** del visitante: se responde directamente desde el correo.
5. El mensaje queda guardado **aunque el correo falle**. La columna "Correo de aviso" del listado indica si salió ("Enviado" o "Falló el envío"), y **Mensajes → Exportar CSV** descarga todos los envíos (fecha, nombre, correo, teléfono, asunto, mensaje, fecha de autorización y estado del aviso).

### Correo (SMTP con Brevo)

WordPress envía los avisos con el plugin **Post SMTP** usando Brevo:

- **Opción API (recomendada):** en Post SMTP elegir *Brevo* y pegar una **clave API v3**: Brevo → SMTP y API → pestaña **Claves API** → Generar. Empieza por `xkeysib-`. **No** sirve la "clave SMTP" (`xsmtpsib-…`): con esa, Brevo responde `401 Key not found`.
- **Opción SMTP:** servidor `smtp-relay.brevo.com`, puerto `587`, TLS. Usuario: el *login* que muestra Brevo en la pestaña SMTP (termina en `@smtp-brevo.com`). Contraseña: la clave SMTP (`xsmtpsib-…`).
- **Remitente:** `contacto@asoproyuja.org` (verificado en Brevo, con DKIM y DMARC del dominio). Activar "forzar remitente" en Post SMTP para que todos los correos salgan con esa dirección.
- Si Brevo tiene activado **Seguridad → IP autorizadas**, agregar la IP del servidor de SiteGround o desactivar esa restricción.

### Newsletter (Inicio)

1. El visitante escribe su correo y pulsa "Suscribirme".
2. `app/api/suscripcion/route.ts` lo reenvía a WordPress, que crea un **Suscriptor** privado (sin duplicar el mismo correo).
3. Suscriptores → **Exportar CSV** descarga la lista para cargarla en la herramienta de envío de boletines que se elija (Mailchimp, Brevo, etc.). El sitio no envía boletines.

Sin `WP_URL` o `FORM_SECRET`, los formularios responden "aún no está habilitado".

---

## 9. Estilos y diseño

- `public/assets/css/style.css` es la **hoja de estilos del diseño aprobado por el cliente, copiada sin cambios del preview en HTML. No se modifica.**
- `public/assets/css/extra.css` contiene solo lo nuevo (encabezado de páginas interiores, logos de aliados, formularios, organigrama, acordeón, "Muy pronto", paginación) y usa exclusivamente las variables de `style.css` (`--brand`, `--brand-deep`, `--accent`, `--gold`, `--bg-alt`, `--border`…).
- El Inicio genera el mismo HTML y las mismas clases que el preview aprobado. Las páginas interiores reutilizan esas clases (`.eyebrow`, `.section-head`, `.bien-grid`, `.quick-ico`, `.card-panel`, `.noticia-card`…).
- Tipografías del sistema, como en el diseño: Century Gothic (títulos) y Segoe UI (texto). No se cargan fuentes externas.
- Las imágenes se sirven con `<img>` normal (no el componente `next/image`) para respetar el diseño original, pero pasan por el optimizador de Next.js: `lib/imagen.ts` genera `srcset` en AVIF/WebP al tamaño de cada pantalla (por ejemplo, la foto del slider baja de 292 KB a 22 KB en móvil).
- El logo va en línea (`lib/logo.ts`) porque la hoja aprobada lo estiliza como `<svg>`; la copia en archivo está en `public/assets/img/logo.svg`.

**Verificación visual:** el Inicio se comparó con capturas contra el preview (`entregables/asoproyuja-home-propuesta.html`) en escritorio (1440 px) y móvil (390 px), en cada diapositiva. Es idéntico al pixel salvo dos cambios aprobados: los logos reales de Aliados en lugar de los recuadros "Logo aliado", y el enlace "Política de datos" en la columna Enlaces del pie.

---

## 10. Tareas frecuentes

### Agregar un campo a una sección

1. Agregar la propiedad en `lib/types.ts`.
2. Agregar su valor por defecto en `content/…`.
3. Usarla en la página correspondiente de `app/`.
4. Agregar el campo en `wordpress/tools/generar-acf-json.py` **con el mismo nombre** y ejecutar:
   ```bash
   python wordpress/tools/generar-acf-json.py
   ```
5. Volver a empaquetar el plugin (comprimir la carpeta `wordpress/asoproyuja-headless` como `asoproyuja-headless.zip`, con la carpeta en la raíz del zip), actualizarlo en WordPress y sincronizar en ACF → Grupos de campos.

También se puede crear el campo desde la interfaz de ACF: el plugin guarda los cambios en `acf-json/`. En ese caso, copie el JSON resultante al repositorio para no perderlo.

### Agregar una página nueva

1. Crear la ruta en `app/nueva-pagina/page.tsx`, reutilizando `PageHero`, `SectionHead` y `CtaPanel` de `components/Blocks.tsx`.
2. Si debe ser editable: agregar su tipo, contenido local, plantilla (`asoproyuja_plantillas()` en `includes/contenido.php`), grupo ACF en el generador, la función `getX()` en `lib/cms.ts` y la página en `scripts/exportar-contenido.ts`.
3. Agregarla al menú (WordPress o `lib/nav.ts`) y al sitemap en `app/sitemap.ts`.

### Cambiar los menús

Desde WordPress: **Apariencia → Menús**. El importador crea "Menú principal", "Pie: Navegación" y "Pie: Enlaces" y los asigna a sus ubicaciones. Si una ubicación queda sin menú asignado, el sitio usa el de `lib/nav.ts`.

### Publicar una noticia

Noticias → Agregar noticia: título, cuerpo en el editor, **imagen destacada** (foto de la tarjeta, horizontal) y "Resumen de la tarjeta". Al publicar, aparece en el Inicio y en `/noticias`. El orden lo da la fecha de publicación.

### Agregar un reel de Instagram

Páginas → Inicio → pestaña **Reels de Instagram** → Agregar reel: portada vertical (captura del video, 9:16), URL del reel y descripción corta. Se reordenan arrastrando las filas.

### Cambiar textos del contenido de respaldo

Editar `content/` y luego ejecutar `npm run exportar-contenido` para que el importador de WordPress quede actualizado. Vuelva a empaquetar el zip si va a instalar el plugin de nuevo.

---

## 11. Solución de problemas

| Síntoma | Causa probable |
|---|---|
| Un cambio en WordPress no aparece | El aviso a Vercel falló: use "↻ Actualizar sitio" en la barra del administrador o espere hasta 10 minutos. Verifique que `REVALIDATE_SECRET` coincida en ambos lados y que `ASOPROYUJA_FRONT_URL` sea la URL publicada. |
| El sitio muestra el contenido viejo aunque WordPress tiene otro | `WP_URL` no está definido en Vercel, o la página de WordPress no tiene el slug o la plantilla correctos. |
| Una imagen de ACF no aparece | El campo debe tener "Formato de retorno: URL". Los grupos incluidos ya vienen así. |
| El formulario responde "no está habilitado" | Falta `WP_URL` o `FORM_SECRET` en Vercel. |
| El formulario dice "No fue posible enviar tu mensaje" | `FORM_SECRET` (Vercel) y `ASOPROYUJA_FORM_SECRET` (wp-config) no coinciden, o WordPress no responde. El detalle queda en los logs de la función en Vercel. |
| No llegan los correos de aviso | WordPress no tiene SMTP configurado, o falta el correo en Ajustes del sitio (se usa el del administrador). |
| El importador no descarga imágenes | El sitio aún no está publicado en `ASOPROYUJA_FRONT_URL`. WordPress solo descarga desde direcciones públicas y puertos estándar (80/443). |
| Un menú cambiado en WordPress no aparece | Verificar que el menú esté asignado a su ubicación en Apariencia → Menús → Gestionar ubicaciones. |
| En ACF no aparecen los grupos | No está activo Secure Custom Fields / ACF PRO, o falta sincronizar. |

Para revisar qué entrega WordPress: `https://cms.asoproyuja.org/wp-json/wp/v2/pages?slug=inicio&acf_format=standard`.

---

## 12. Pendientes de contenido

- **Correo y horario de atención:** no se tienen. Mientras estén vacíos en Ajustes del sitio, no se muestran en Contacto ni en el pie.
- **Mapa:** se ubicó con la dirección (Calle 9 N. 19-42, Los Almendros, Santa Marta). Confirmar que el punto quede bien; si no, pegar en Ajustes del sitio la URL de "Insertar un mapa" de Google Maps.
- **Facebook:** el enlace apunta a la página `asociacion.asoneshca`. Si la asociación tiene una página con el nombre nuevo, cambiarla en Ajustes del sitio.
- **Preguntas frecuentes y Cómo ayudar:** están en "Muy pronto" hasta que el cliente envíe el contenido (preguntas, formas de ayudar y datos para donar).
- **Noticias:** las 6 noticias reales están cargadas (en el contenido de respaldo y en el importador). Sus fechas solo ordenan el listado y algunas son aproximadas; se ajustan en WordPress → Noticias → "Publicado el". La foto de "Mañana Blanca" muestra al fondo un pendón con el nombre anterior de la asociación; si se quiere evitar, cambiarla por otra foto en WordPress.
- **Nosotros:** los textos de quiénes somos, misión, visión, valores, áreas de intervención y organigrama salen del brochure enviado por el cliente (con el nombre actual, ASOPROYUJA).
- **Política de datos:** es un texto base conforme a la Ley 1581 de 2012. Debe revisarlo la asociación (o su asesor legal) y completar un correo para el ejercicio de derechos cuando lo tengan.
- **Newsletter:** el diseño aprobado no tiene casilla de autorización. Se recomienda ajustar la "Nota bajo el formulario" para mencionar la política de datos.

---

## 13. SEO, rendimiento y analítica

### Metadatos (lo que muestra Google y las redes al compartir)

- Cada página tiene en WordPress una pestaña **SEO (Google y redes)** con título (50–60 caracteres), descripción (140–160) e imagen para compartir (1200 × 630). Vacíos = los textos por defecto de `content/sitio.ts`.
- Las noticias usan su título, el "Resumen de la tarjeta" y su foto destacada.
- Se generan automáticamente: URL canónica, Open Graph y Twitter Card, idioma `es-CO`, `theme-color`, manifest e iconos (`app/icon.png`, `app/apple-icon.png`, `app/favicon.ico`). Imagen general para compartir: `public/assets/img/og-asoproyuja.jpg`.
- Todo está en `lib/seo.ts`.

### Datos estructurados (schema.org)

- **NGO** (organización) y **WebSite** en todas las páginas: nombre, NIT, logo, dirección, teléfonos y redes (salen de Ajustes del sitio).
- **BreadcrumbList** en cada página interior (Inicio › Noticias › …).
- **NewsArticle** en cada noticia y **FAQPage** en Preguntas frecuentes cuando tenga preguntas.
- Se pueden validar en https://search.google.com/test/rich-results.

### Mapa del sitio e indexación

- `asoproyuja.org/sitemap.xml`: páginas con prioridad, fecha de última modificación (de WordPress) e imágenes; cada noticia con su foto. Se actualiza solo.
- **Preguntas frecuentes y Cómo ayudar** quedan con `noindex` y fuera del sitemap mientras estén en "Muy pronto"; al cargarles contenido se indexan solas.
- `robots.txt` permite todo menos `/api/` y apunta al sitemap.
- El dominio técnico `*.vercel.app` responde con `X-Robots-Tag: noindex`, y `cms.asoproyuja.org` también: en Google solo aparece `asoproyuja.org`.
- Las imágenes de WordPress se sirven como `asoproyuja.org/wp-content/uploads/…` (proxy en `next.config.ts`).

### Rendimiento

- Páginas estáticas (ISR), imágenes optimizadas (AVIF/WebP + `srcset`), carga diferida de lo que está bajo el primer pantallazo y prioridad alta para la foto principal.
- Caché del navegador: CSS 1 año (con `?v=` que cambia en cada despliegue), imágenes 30 días.
- Cabeceras de seguridad: `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy`.
- Lighthouse en móvil (antes de salir al aire): rendimiento 93–98, SEO 100, buenas prácticas 100, accesibilidad 91–98. Las observaciones de accesibilidad que quedan son del diseño aprobado (contraste del enlace verde "Escríbenos" 4,46:1, tamaño de los puntos del slider y el orden h4/h5 de tarjetas y pie).

### Google Tag Manager y Google Analytics 4

- `components/Analytics.tsx` carga GTM (`GTM-K9H7CCQT`, con su `noscript`) y GA4 (`G-0ZYNYKJ7X6`) después de que la página es interactiva, sin frenar la carga.
- **Solo miden en el dominio de `NEXT_PUBLIC_SITE_URL`** (con o sin `www`): no se cuentan las visitas de `localhost` ni de las versiones de prueba de Vercel.
- **Importante:** GA4 ya está instalado directamente. **No cree en GTM una etiqueta de GA4 con el mismo ID** o se duplicarán las visitas. Si prefiere manejar GA4 desde GTM, ponga `NEXT_PUBLIC_GA_ID=off` en Vercel.
- Eventos de conversión (llegan a GA4 y al `dataLayer` de GTM): `generate_lead` al enviar el formulario de contacto (con el asunto) y `sign_up` al suscribirse al newsletter. En GA4 → Administrar → Eventos se pueden marcar como **eventos clave**.

---

## 14. Lista para salir al aire

1. **Vercel → Settings → Domains:** agregar `asoproyuja.org` y `www.asoproyuja.org` (que `www` redirija a `asoproyuja.org`). Configurar los DNS que indica Vercel.
2. **Vercel → Environment Variables:** `NEXT_PUBLIC_SITE_URL=https://asoproyuja.org` → **Redeploy**.
3. **wp-config.php:** `ASOPROYUJA_FRONT_URL` → `https://asoproyuja.org`.
4. **WordPress:** subir la última versión del plugin (`wordpress/asoproyuja-headless.zip`). En SiteGround → Speed Optimizer, excluir `/wp-json/*` de la caché si los cambios tardan en verse.
5. **SMTP** (Brevo): configurado y probado con un envío del formulario de contacto.
6. **Search Console** (propiedad de dominio `asoproyuja.org`, ya verificada): Sitemaps → enviar `https://asoproyuja.org/sitemap.xml`. Luego, en Inspección de URLs, solicitar indexación del Inicio y de Quiénes somos.
7. **GA4:** comprobar en Informes → Tiempo real que llegan las visitas; marcar `generate_lead` y `sign_up` como eventos clave. **GTM:** Vista previa (Tag Assistant) sobre `https://asoproyuja.org` y publicar el contenedor.
8. Probar el formulario, el newsletter y un cambio desde WordPress en el dominio final.
