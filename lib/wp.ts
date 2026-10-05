// Cliente mínimo de la API REST de WordPress (headless).
// Si WP_URL no está definido, todas las funciones devuelven null y el sitio
// usa el contenido local de /content.

export const WP_URL = (process.env.WP_URL || "").trim().replace(/\/+$/, "");

/** Lee una clave de entorno quitando espacios, saltos de línea y comillas pegadas por error. */
export function claveEntorno(nombre: string): string {
  return (process.env[nombre] || "").trim().replace(/^["'“”‘’]+|["'“”‘’]+$/g, "").trim();
}

export const wpEnabled = WP_URL.length > 0;

/** Segundos entre regeneraciones automáticas. WordPress además avisa al guardar (ver /api/revalidate). */
export const REVALIDATE_SECONDS = 600;

export async function wpFetch<T>(path: string): Promise<T | null> {
  if (!wpEnabled) return null;
  try {
    const res = await fetch(`${WP_URL}/wp-json${path}`, {
      next: { revalidate: REVALIDATE_SECONDS, tags: ["wp"] },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export type WpPage = {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  acf?: Record<string, unknown> | [];
  date: string;
  modified?: string;
  menu_order?: number;
  _embedded?: {
    "wp:featuredmedia"?: { source_url: string; alt_text?: string }[];
  };
};

/** Página de WordPress por slug (con los campos ACF ya formateados). */
export async function wpPage(slug: string): Promise<WpPage | null> {
  const pages = await wpFetch<WpPage[]>(`/wp/v2/pages?slug=${encodeURIComponent(slug)}&acf_format=standard`);
  return pages && pages.length ? pages[0] : null;
}

/** Campos ACF de una página, o null si la página no existe o no tiene campos. */
export async function wpPageFields(slug: string): Promise<Record<string, unknown> | null> {
  const page = await wpPage(slug);
  if (!page || !page.acf || Array.isArray(page.acf)) return null;
  return page.acf;
}

const ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  laquo: "«",
  raquo: "»",
};

/** Decodifica entidades HTML de los títulos que entrega WordPress (&#8220; etc.). */
export function decodeEntities(s: string): string {
  return s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

export function stripTags(html: string): string {
  return decodeEntities(html.replace(/<[^>]+>/g, "")).trim();
}

/**
 * Convierte enlaces absolutos al CMS (cms.asoproyuja.org/contacto/) en rutas
 * del sitio (/contacto). Los archivos de /wp-content/ se dejan intactos.
 */
export function localizeUrl(url: string): string {
  if (!wpEnabled || !url.startsWith(WP_URL)) return url;
  const rest = url.slice(WP_URL.length);
  if (rest.startsWith("/wp-content/")) return url;
  const path = rest.replace(/\/+(?=$|[?#])/, "") || "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function localizeHtml(html: string): string {
  if (!wpEnabled) return html;
  return html.replace(/href="([^"]+)"/g, (_, href: string) => `href="${localizeUrl(href)}"`);
}
