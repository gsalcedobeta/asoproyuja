import type { Metadata } from "next";
import { getNoticiasPagina } from "@/lib/cms";
import { metadatos } from "@/lib/seo";
import { ListadoNoticias } from "@/components/ListadoNoticias";

export const revalidate = 600;
export async function generateMetadata(): Promise<Metadata> {
  return metadatos({ seo: (await getNoticiasPagina()).seo, ruta: "/noticias" });
}

export default function NoticiasPage() {
  return <ListadoNoticias pagina={1} />;
}
