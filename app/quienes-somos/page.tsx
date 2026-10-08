import type { Metadata } from "next";
import { metadatos } from "@/lib/seo";
import type { CSSProperties } from "react";
import { CtaPanel, Eyebrow, Html, PageHero, SectionHead } from "@/components/Blocks";
import { IconoCirculo } from "@/components/Icon";
import { Piezas } from "@/components/Piezas";
import { getQuienesSomos } from "@/lib/cms";

export const revalidate = 600;
export async function generateMetadata(): Promise<Metadata> {
  return metadatos({ seo: (await getQuienesSomos()).seo, ruta: "/quienes-somos" });
}

export default async function QuienesSomosPage() {
  const d = await getQuienesSomos();
  const direcciones = d.organigrama.direcciones || [];

  return (
    <>
      <PageHero
        migas={[{ title: "Quiénes somos" }]}
        eyebrow={d.hero.eyebrow}
        titulo={d.hero.titulo}
        texto={d.hero.texto}
        contenido={d.hero.contenido}
      />

      <section className="section">
        <div className="wrap">
          <SectionHead eyebrow={d.mision_vision.eyebrow} titulo={d.mision_vision.titulo} texto={d.mision_vision.texto} />
          <div className="mv-grid">
            <div className="mv-card mision reveal">
              <Eyebrow>Misión</Eyebrow>
              <h3>Nuestra misión</h3>
              <Html html={d.mision_vision.mision} className="rich" />
            </div>
            <div className="mv-card vision reveal">
              <Eyebrow>Visión</Eyebrow>
              <h3>Nuestra visión</h3>
              <Html html={d.mision_vision.vision} className="rich" />
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="wrap">
          <SectionHead eyebrow={d.valores.eyebrow} titulo={d.valores.titulo} texto={d.valores.texto} centro />
          <div className="valores-grid">
            {d.valores.items.map((v, i) => (
              <div key={i} className="valor-card reveal">
                <div className="quick-tape"></div>
                <IconoCirculo name={v.icono} color={v.color} />
                <h4>{v.titulo}</h4>
                <p>{v.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {d.lineas.items?.length > 0 && (
        <section className="section noticias texture">
          <Piezas grupo="noticias" />
          <div className="wrap">
            <SectionHead eyebrow={d.lineas.eyebrow} titulo={d.lineas.titulo} texto={d.lineas.texto} />
            <div className="lineas-grid">
              {d.lineas.items.map((l, i) => (
                <div key={i} className="linea-card reveal">
                  <IconoCirculo name={l.icono} color={l.color} />
                  <h4>{l.titulo}</h4>
                  <ul>
                    {(l.items || []).map((t, k) => (
                      <li key={k}>{t.texto}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {direcciones.length > 0 && (
        <section className="section">
          <div className="wrap">
            <SectionHead eyebrow={d.organigrama.eyebrow} titulo={d.organigrama.titulo} texto={d.organigrama.texto} centro />
            <div className="organigrama reveal">
              {(d.organigrama.niveles || []).map((n, i) => (
                <div key={i} style={{ display: "contents" }}>
                  <div className={`org-nivel${i === 0 ? " principal" : ""}`}>{n.texto}</div>
                  <div className="org-linea"></div>
                </div>
              ))}
              <div className="org-direcciones" style={{ "--cols": direcciones.length } as CSSProperties}>
                {direcciones.map((dir, i) => (
                  <div key={i} className="org-direccion">
                    <h4>{dir.titulo}</h4>
                    {(dir.areas || []).map((a, k) => (
                      <div key={k} className="org-area">
                        {a.titulo ? <b>{a.titulo}</b> : null}
                        {a.cargos && a.cargos.length > 0 ? (
                          <ul>
                            {a.cargos.map((c, j) => (
                              <li key={j}>{c.texto}</li>
                            ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <CtaPanel cta={d.cta} />
    </>
  );
}
