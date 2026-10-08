import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListadoNoticias } from "@/components/ListadoNoticias";
import { getNoticiasPagina, getPaginaNoticias } from "@/lib/cms";
import { metadatos } from "@/lib/seo";

export const revalidate = 600;

type Params = { params: Promise<{ n: string }> };

export async function generateStaticParams() {
  const { total } = await getPaginaNoticias(1);
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const n = (await params).n;
  const seo = (await getNoticiasPagina()).seo;
  return metadatos({ seo: { ...seo, titulo: `${seo.titulo} — página ${n}` }, ruta: `/noticias/pagina/${n}` });
}

export default async function NoticiasPaginaN({ params }: Params) {
  const n = Number((await params).n);
  // La página 1 es /noticias (redirección en next.config.ts)
  if (!Number.isInteger(n) || n < 2 || !(await getPaginaNoticias(n)).existe) notFound();
  return <ListadoNoticias pagina={n} />;
}
