import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ListadoNoticias } from "@/components/ListadoNoticias";
import { getPaginaNoticias } from "@/lib/cms";

export const revalidate = 600;

type Params = { params: Promise<{ n: string }> };

export async function generateStaticParams() {
  const { total } = await getPaginaNoticias(1);
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ n: String(i + 2) }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  return { title: `Noticias — página ${(await params).n}` };
}

export default async function NoticiasPaginaN({ params }: Params) {
  const n = Number((await params).n);
  // La página 1 es /noticias (redirección en next.config.ts)
  if (!Number.isInteger(n) || n < 2 || !(await getPaginaNoticias(n)).existe) notFound();
  return <ListadoNoticias pagina={n} />;
}
