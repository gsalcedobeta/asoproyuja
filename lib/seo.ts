// SEO: metadatos de cada página (título, descripción, canónica, Open Graph) y datos estructurados (JSON-LD).
// Los textos salen de la pestaña "SEO" de cada página en WordPress; si está vacía se usan los de content/.
import type { Metadata } from "next";
import type { Ajustes, Noticia, Seo } from "@/lib/types";

/** URL pública del sitio, sin barra final. Al conectar el dominio: NEXT_PUBLIC_SITE_URL=https://asoproyuja.org */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://asoproyuja.org").trim().replace(/\/+$/, "");
export const SITE_NAME = "Asoproyuja";
export const NOMBRE_LEGAL = "ASOPROYUJA — Asociación Agropecuaria Campesina Nacional";
export const NIT = "825.001.418-2";

/** Imagen para compartir en redes cuando la página no tiene una propia (1200×630). */
export const OG_DEFAULT = "/assets/img/og-asoproyuja.jpg";
export const LOGO = "/assets/img/logo-asoproyuja.png";

/** Convierte rutas relativas (/assets/…, /wp-content/…) en URL absolutas del sitio. */
export function absoluta(url: string): string {
  if (!url) return SITE_URL;
  if (/^https?:\/\//.test(url)) return url;
  return `${SITE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

/** Recorta la descripción a ~160 caracteres sin partir palabras. */
export function resumen(texto: string, max = 160): string {
  const limpio = texto.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (limpio.length <= max) return limpio;
  return limpio.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

type Opciones = {
  seo: Seo;
  /** Ruta de la página: "/", "/contacto"… (canónica y og:url) */
  ruta: string;
  /** Título absoluto (sin " | Asoproyuja"), como en el Inicio. */
  absoluto?: boolean;
  /** Imagen de respaldo si la pestaña SEO no tiene una. */
  imagen?: string;
  /** Páginas que aún no deben aparecer en Google (por ejemplo, en "Muy pronto"). */
  noindex?: boolean;
  tipo?: "website" | "article";
  publicado?: string;
  modificado?: string;
};

export function metadatos({ seo, ruta, absoluto, imagen, noindex, tipo = "website", publicado, modificado }: Opciones): Metadata {
  const titulo = seo.titulo || SITE_NAME;
  const descripcion = resumen(seo.descripcion || "");
  const img = absoluta(seo.imagen || imagen || OG_DEFAULT);
  const url = absoluta(ruta === "/" ? "" : ruta);
  return {
    title: absoluto ? { absolute: titulo } : titulo,
    description: descripcion,
    alternates: { canonical: url },
    robots: noindex ? { index: false, follow: true } : { index: true, follow: true, "max-image-preview": "large" },
    openGraph: {
      type: tipo,
      url,
      siteName: SITE_NAME,
      locale: "es_CO",
      title: titulo,
      description: descripcion,
      images: [{ url: img, alt: titulo }],
      ...(tipo === "article" ? { publishedTime: publicado, modifiedTime: modificado || publicado } : {}),
    },
    twitter: { card: "summary_large_image", title: titulo, description: descripcion, images: [img] },
  };
}

// ---------------- Datos estructurados (schema.org) ----------------

/** Organización: aparece en el panel de Google con logo, dirección, teléfono y redes. */
export function schemaOrganizacion(a: Ajustes) {
  const [calle] = (a.direccion || "").split(/\r?\n/);
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${SITE_URL}/#organizacion`,
    name: SITE_NAME,
    legalName: NOMBRE_LEGAL,
    alternateName: "Asociación Agropecuaria Campesina Nacional",
    url: `${SITE_URL}/`,
    logo: absoluta(LOGO),
    image: absoluta(OG_DEFAULT),
    description:
      "Asociación que trabaja por el fortalecimiento y bienestar de la niñez y las familias en Colombia: primera infancia, seguridad alimentaria y desarrollo comunitario.",
    taxID: NIT,
    ...(a.correo ? { email: a.correo } : {}),
    telephone: [a.telefono_fijo, a.celular].filter(Boolean),
    address: {
      "@type": "PostalAddress",
      streetAddress: calle || "Calle 9 N. 19-42, Los Almendros",
      addressLocality: "Santa Marta",
      addressRegion: "Magdalena",
      addressCountry: "CO",
    },
    areaServed: { "@type": "Country", name: "Colombia" },
    sameAs: [a.facebook, a.instagram, a.youtube].filter(Boolean),
  };
}

export function schemaSitio() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#sitio`,
    url: `${SITE_URL}/`,
    name: SITE_NAME,
    inLanguage: "es-CO",
    publisher: { "@id": `${SITE_URL}/#organizacion` },
  };
}

/** Ruta de navegación (Inicio › Noticias › …) para que Google la muestre en los resultados. */
export function schemaMigas(migas: { title: string; url?: string }[]) {
  const items = [{ title: "Inicio", url: "/" }, ...migas];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((m, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: m.title,
      ...(m.url ? { item: absoluta(m.url === "/" ? "" : m.url) } : {}),
    })),
  };
}

export function schemaNoticia(n: Noticia) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: absoluta(`/noticias/${n.slug}`),
    headline: n.titulo.length > 110 ? n.titulo.slice(0, 109) + "…" : n.titulo,
    description: resumen(n.extracto),
    image: [absoluta(n.imagen)],
    datePublished: n.fecha,
    dateModified: n.modificado || n.fecha,
    inLanguage: "es-CO",
    author: { "@type": "Organization", name: SITE_NAME, url: `${SITE_URL}/` },
    publisher: { "@id": `${SITE_URL}/#organizacion` },
  };
}

export function schemaPreguntas(preguntas: { pregunta: string; respuesta: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: preguntas.map((p) => ({
      "@type": "Question",
      name: p.pregunta,
      acceptedAnswer: { "@type": "Answer", text: resumen(p.respuesta, 1000) },
    })),
  };
}
