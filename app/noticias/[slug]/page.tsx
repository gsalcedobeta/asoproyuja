import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaPanel, Html, NoticiaCard, PageHero, SectionHead } from "@/components/Blocks";
import { getNoticia, getNoticias, getNoticiasPagina } from "@/lib/cms";

export const revalidate = 600;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getNoticias()).map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const n = await getNoticia((await params).slug);
  if (!n) return {};
  return { title: n.titulo, description: n.extracto, openGraph: { images: [n.imagen] } };
}

export default async function NoticiaPage({ params }: Params) {
  const { slug } = await params;
  const [n, todas, pagina] = await Promise.all([getNoticia(slug), getNoticias(), getNoticiasPagina()]);
  if (!n) notFound();

  // Las 3 noticias siguientes, en círculo
  const i = todas.findIndex((x) => x.slug === n.slug);
  const otras = [1, 2, 3].map((k) => todas[(i + k) % todas.length]).filter((x) => x.slug !== n.slug);

  return (
    <>
      <PageHero migas={[{ title: "Noticias", url: "/noticias" }, { title: "Noticia" }]} eyebrow="Noticias" titulo={n.titulo} />

      <section className="section tight">
        <div className="wrap">
          <article className="articulo">
            <div className="articulo-foto">
              <img src={n.imagen} alt={n.imagen_alt} />
            </div>
            <Html html={n.contenido} className="rich" />
            <Link href="/noticias" className="volver">
              ← Volver a noticias
            </Link>
          </article>
        </div>
      </section>

      {otras.length > 0 && (
        <section className="section noticias texture">
          <div className="wrap">
            <SectionHead eyebrow="Más noticias" titulo="Otras noticias" />
            <div className="noticias-grid">
              {otras.map((o) => (
                <NoticiaCard key={o.slug} n={o} />
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaPanel cta={pagina.cta} />
    </>
  );
}
