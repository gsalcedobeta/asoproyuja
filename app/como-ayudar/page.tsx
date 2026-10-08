import type { Metadata } from "next";
import { metadatos } from "@/lib/seo";
import { CtaPanel, Html, PageHero, ProximamenteBloque, SectionHead } from "@/components/Blocks";
import { IconoCirculo } from "@/components/Icon";
import { SmartLink } from "@/components/SmartLink";
import { getComoAyudar } from "@/lib/cms";

export const revalidate = 600;
export async function generateMetadata(): Promise<Metadata> {
  const d = await getComoAyudar();
  const vacia = !(d.formas || []).some((f) => f.titulo) && !d.donaciones?.contenido;
  // Mientras esté en "Muy pronto" no se indexa (contenido escaso); se indexa sola al cargar contenido
  return metadatos({ seo: d.seo, ruta: "/como-ayudar", noindex: vacia });
}

export default async function ComoAyudarPage() {
  const d = await getComoAyudar();
  const formas = (d.formas || []).filter((f) => f.titulo);
  const hayDonaciones = Boolean(d.donaciones?.contenido);

  return (
    <>
      <PageHero migas={[{ title: "Cómo ayudar" }]} eyebrow={d.hero.eyebrow} titulo={d.hero.titulo} texto={d.hero.texto} />
      {formas.length === 0 && !hayDonaciones ? (
        <ProximamenteBloque d={d.proximamente} />
      ) : (
        <>
          {formas.length > 0 && (
            <section className="section">
              <div className="wrap">
                <SectionHead eyebrow={d.intro.eyebrow} titulo={d.intro.titulo} texto={d.intro.texto} centro />
                <div className="formas-grid">
                  {formas.map((f, i) => (
                    <div key={i} className="forma-card reveal">
                      <IconoCirculo name={f.icono} color={f.color} />
                      <h4>{f.titulo}</h4>
                      <p>{f.texto}</p>
                      {f.enlace?.url ? (
                        <SmartLink className="noticia-link" href={f.enlace.url}>
                          {f.enlace.title} →
                        </SmartLink>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
          {hayDonaciones && (
            <section className="section bg-alt">
              <div className="wrap donaciones">
                <SectionHead eyebrow={d.donaciones.eyebrow} titulo={d.donaciones.titulo} texto={d.donaciones.texto} />
                <Html html={d.donaciones.contenido} className="rich reveal" />
              </div>
            </section>
          )}
          <CtaPanel cta={d.cta} />
        </>
      )}
    </>
  );
}
