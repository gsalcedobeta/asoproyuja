import type { MetadataRoute } from "next";
import { getNoticias, getPaginaNoticias } from "@/lib/cms";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://asoproyuja.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [noticias, { total }] = await Promise.all([getNoticias(), getPaginaNoticias(1)]);
  const rutas = [
    "",
    "/quienes-somos",
    "/noticias",
    ...Array.from({ length: Math.max(0, total - 1) }, (_, i) => `/noticias/pagina/${i + 2}`),
    "/contacto",
    "/preguntas-frecuentes",
    "/como-ayudar",
    "/politica-de-datos",
    ...noticias.map((n) => `/noticias/${n.slug}`),
  ];
  return rutas.map((r) => ({ url: `${SITE_URL}${r}` }));
}
