import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { metadatos, schemaPreguntas } from "@/lib/seo";
import { CtaPanel, Html, PageHero, ProximamenteBloque, SectionHead } from "@/components/Blocks";
import { Icon } from "@/components/Icon";
import { getPreguntasFrecuentes } from "@/lib/cms";

export const revalidate = 600;
export async function generateMetadata(): Promise<Metadata> {
  const d = await getPreguntasFrecuentes();
  const vacia = !(d.preguntas || []).some((p) => p.pregunta);
  // Mientras esté en "Muy pronto" no se indexa (contenido escaso); se indexa sola al cargar preguntas
  return metadatos({ seo: d.seo, ruta: "/preguntas-frecuentes", noindex: vacia });
}

export default async function PreguntasFrecuentesPage() {
  const d = await getPreguntasFrecuentes();
  const preguntas = (d.preguntas || []).filter((p) => p.pregunta);

  return (
    <>
      <PageHero migas={[{ title: "Preguntas frecuentes" }]} eyebrow={d.hero.eyebrow} titulo={d.hero.titulo} texto={d.hero.texto} />
      {preguntas.length > 0 && <JsonLd data={schemaPreguntas(preguntas)} />}
      {preguntas.length === 0 ? (
        <ProximamenteBloque d={d.proximamente} />
      ) : (
        <>
          <section className="section">
            <div className="wrap">
              <SectionHead eyebrow={d.intro.eyebrow} titulo={d.intro.titulo} texto={d.intro.texto} centro />
              <div className="faq">
                {preguntas.map((p, i) => (
                  <details key={i} className="reveal">
                    <summary>
                      {p.pregunta}
                      <Icon name="chevron" size={20} stroke={2.2} />
                    </summary>
                    <Html html={p.respuesta} className="rich" />
                  </details>
                ))}
              </div>
            </div>
          </section>
          <CtaPanel cta={d.cta} />
        </>
      )}
    </>
  );
}
