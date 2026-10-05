import type { Metadata } from "next";
import { CtaPanel, Html, PageHero, ProximamenteBloque, SectionHead } from "@/components/Blocks";
import { Icon } from "@/components/Icon";
import { getPreguntasFrecuentes } from "@/lib/cms";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Preguntas frecuentes",
  description: "Respuestas a las preguntas más comunes sobre los programas de Asoproyuja.",
};

export default async function PreguntasFrecuentesPage() {
  const d = await getPreguntasFrecuentes();
  const preguntas = (d.preguntas || []).filter((p) => p.pregunta);

  return (
    <>
      <PageHero migas={[{ title: "Preguntas frecuentes" }]} eyebrow={d.hero.eyebrow} titulo={d.hero.titulo} texto={d.hero.texto} />
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
