// Acceso a contenido: WordPress primero, contenido local como respaldo.
import { cache } from "react";
import * as local from "@/content/sitio";
import { noticias as noticiasLocales } from "@/content/noticias";
import type {
  Ajustes,
  ComoAyudar,
  Contacto,
  Inicio,
  Noticia,
  NoticiasPagina,
  PoliticaDatos,
  PreguntasFrecuentes,
  QuienesSomos,
} from "@/lib/types";
import { menuEnlaces, menuFooter, menuPrincipal, type NavItem } from "@/lib/nav";
import { decodeEntities, localizeHtml, localizeUrl, stripTags, wpFetch, wpPageFields, type WpPage } from "@/lib/wp";

type Plain = Record<string, unknown>;
const isPlain = (v: unknown): v is Plain => typeof v === "object" && v !== null && !Array.isArray(v);
const isEmpty = (v: unknown) =>
  v === null || v === undefined || v === false || v === "" || (Array.isArray(v) && v.length === 0);

/**
 * Combina los datos de WordPress con el contenido local: todo campo vacío o inexistente
 * en WordPress toma el valor local. Así las páginas nunca quedan en blanco mientras
 * se cargan los contenidos en el CMS.
 */
function withDefaults<T>(wp: unknown, fallback: T): T {
  if (isEmpty(wp)) return fallback;
  if (isPlain(wp) && isPlain(fallback)) {
    const out: Plain = { ...fallback };
    for (const key of Object.keys(wp)) out[key] = withDefaults(wp[key], (fallback as Plain)[key]);
    return out as T;
  }
  return normalize(wp) as T;
}

/** Ajusta URLs y HTML provenientes de WordPress para que apunten al front. */
function normalize(v: unknown): unknown {
  if (typeof v === "string") return v.includes("<") ? localizeHtml(v) : localizeUrl(v);
  if (Array.isArray(v)) return v.map(normalize);
  if (isPlain(v)) return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, normalize(x)]));
  return v;
}

async function pageData<T>(slug: string, fallback: T): Promise<T> {
  const acf = await wpPageFields(slug);
  return acf ? withDefaults(acf, fallback) : fallback;
}

// ---------------- Menús ----------------
type WpMenuItem = { title: string; url: string; target?: string; children?: WpMenuItem[] };
export type Menus = { principal: NavItem[]; footer: NavItem[]; enlaces: NavItem[] };

function mapMenu(items: WpMenuItem[]): NavItem[] {
  return items.map((i) => ({
    title: decodeEntities(i.title),
    url: localizeUrl(i.url || "#"),
    target: i.target || undefined,
    children: i.children && i.children.length ? mapMenu(i.children) : undefined,
  }));
}

/** Menús de WordPress (Apariencia → Menús). Si una ubicación no tiene menú asignado se usa el del código. */
export const getMenus = cache(async (): Promise<Menus> => {
  const wp = await wpFetch<Partial<Record<keyof Menus, WpMenuItem[]>>>("/asoproyuja/v1/menus");
  return {
    principal: wp?.principal?.length ? mapMenu(wp.principal) : menuPrincipal,
    footer: wp?.footer?.length ? mapMenu(wp.footer) : menuFooter,
    enlaces: wp?.enlaces?.length ? mapMenu(wp.enlaces) : menuEnlaces,
  };
});

// ---------------- Globales y páginas ----------------
export const getAjustes = cache(async (): Promise<Ajustes> => {
  const opts = await wpFetch<Plain>("/asoproyuja/v1/ajustes");
  return opts ? withDefaults(opts, local.ajustes) : local.ajustes;
});

export const getInicio = cache(() => pageData<Inicio>("inicio", local.inicio));
export const getQuienesSomos = cache(() => pageData<QuienesSomos>("quienes-somos", local.quienesSomos));
export const getContacto = cache(() => pageData<Contacto>("contacto", local.contacto));
export const getNoticiasPagina = cache(() => pageData<NoticiasPagina>("noticias", local.noticiasPagina));
export const getPreguntasFrecuentes = cache(() => pageData<PreguntasFrecuentes>("preguntas-frecuentes", local.preguntasFrecuentes));
export const getComoAyudar = cache(() => pageData<ComoAyudar>("como-ayudar", local.comoAyudar));
export const getPoliticaDatos = cache(() => pageData<PoliticaDatos>("politica-de-datos", local.politicaDatos));

// ---------------- Noticias ----------------
function mapNoticia(p: WpPage): Noticia {
  const acf = (isPlain(p.acf) ? p.acf : {}) as Plain;
  const media = p._embedded?.["wp:featuredmedia"]?.[0];
  const titulo = decodeEntities(p.title.rendered);
  return {
    slug: p.slug,
    titulo,
    fecha: p.date.slice(0, 10),
    modificado: (p.modified || p.date).slice(0, 19),
    imagen: media?.source_url ? localizeUrl(media.source_url) : "/assets/img/hero-comunidad.jpg",
    imagen_alt: media?.alt_text || titulo,
    extracto: (acf.extracto as string) || stripTags(p.excerpt?.rendered || ""),
    contenido: localizeHtml(p.content.rendered),
  };
}

/** Todas las noticias publicadas, de la más reciente a la más antigua. */
export const getNoticias = cache(async (): Promise<Noticia[]> => {
  const posts = await wpFetch<WpPage[]>("/wp/v2/noticias?per_page=100&_embed=wp:featuredmedia&acf_format=standard");
  return posts && posts.length ? posts.map(mapNoticia) : noticiasLocales;
});

export async function getNoticia(slug: string): Promise<Noticia | null> {
  return (await getNoticias()).find((n) => n.slug === slug) ?? null;
}

/** Noticias de una página del listado (la primera es 1). */
export async function getPaginaNoticias(pagina: number) {
  const [todas, d] = await Promise.all([getNoticias(), getNoticiasPagina()]);
  const porPagina = Math.max(1, Number(d.por_pagina) || 9);
  const total = Math.max(1, Math.ceil(todas.length / porPagina));
  return {
    noticias: todas.slice((pagina - 1) * porPagina, pagina * porPagina),
    pagina,
    total,
    existe: pagina >= 1 && pagina <= total,
  };
}

// ---------------- Fechas para el sitemap ----------------
/** Fecha de última modificación de cada página de WordPress (slug → ISO). Vacío sin WordPress. */
export const getFechasPaginas = cache(async (): Promise<Record<string, string>> => {
  const pages = await wpFetch<{ slug: string; modified: string }[]>("/wp/v2/pages?per_page=50&_fields=slug,modified");
  return Object.fromEntries((pages || []).map((p) => [p.slug, p.modified]));
});
