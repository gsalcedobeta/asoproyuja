// Mapa del sitio para Google (asoproyuja.org/sitemap.xml). Se envía una sola vez en Search Console.
// Incluye fechas de última modificación (WordPress), prioridad e imágenes de cada página y noticia.
// Las páginas en "Muy pronto" se agregan solas cuando tengan contenido.
import type { MetadataRoute } from "next";
import { getComoAyudar, getFechasPaginas, getInicio, getNoticias, getPreguntasFrecuentes } from "@/lib/cms";
import { absoluta, OG_DEFAULT, SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

type Entrada = MetadataRoute.Sitemap[number];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [noticias, fechas, inicio, faq, ayudar] = await Promise.all([
    getNoticias(),
    getFechasPaginas(),
    getInicio(),
    getPreguntasFrecuentes(),
    getComoAyudar(),
  ]);
  const ultimaNoticia = noticias[0]?.modificado || noticias[0]?.fecha;
  const fecha = (slug: string, respaldo?: string) => {
    const f = fechas[slug] || respaldo;
    return f ? new Date(f) : undefined;
  };

  const pagina = (ruta: string, slug: string, prioridad: number, frecuencia: Entrada["changeFrequency"], imagenes: string[] = [], respaldo?: string): Entrada => ({
    url: ruta === "/" ? `${SITE_URL}/` : `${SITE_URL}${ruta}`,
    lastModified: fecha(slug, respaldo),
    changeFrequency: frecuencia,
    priority: prioridad,
    images: imagenes.filter(Boolean).map(absoluta),
  });

  const paginas: Entrada[] = [
    pagina("/", "inicio", 1, "weekly", [...inicio.slides.map((s) => s.imagen), inicio.bienvenida.imagen], ultimaNoticia),
    pagina("/quienes-somos", "quienes-somos", 0.9, "monthly", [OG_DEFAULT]),
    pagina("/noticias", "noticias", 0.8, "weekly", [], ultimaNoticia),
    pagina("/contacto", "contacto", 0.7, "yearly"),
    pagina("/politica-de-datos", "politica-de-datos", 0.2, "yearly"),
  ];
  if ((faq.preguntas || []).some((p) => p.pregunta)) paginas.push(pagina("/preguntas-frecuentes", "preguntas-frecuentes", 0.6, "monthly"));
  if ((ayudar.formas || []).some((f) => f.titulo) || ayudar.donaciones?.contenido) {
    paginas.push(pagina("/como-ayudar", "como-ayudar", 0.7, "monthly"));
  }

  const articulos: Entrada[] = noticias.map((n) => ({
    url: `${SITE_URL}/noticias/${n.slug}`,
    lastModified: new Date(n.modificado || n.fecha),
    changeFrequency: "yearly",
    priority: 0.6,
    images: [absoluta(n.imagen)],
  }));

  return [...paginas, ...articulos];
}
