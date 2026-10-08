import type { Metadata } from "next";
import { metadatos } from "@/lib/seo";
import { Eyebrow, PageHero, SectionHead } from "@/components/Blocks";
import { ContactoForm } from "@/components/ContactoForm";
import { Lineas } from "@/components/Footer";
import { Icon, IconoCirculo } from "@/components/Icon";
import { getAjustes, getContacto } from "@/lib/cms";

export const revalidate = 600;
export async function generateMetadata(): Promise<Metadata> {
  return metadatos({ seo: (await getContacto()).seo, ruta: "/contacto" });
}

const tel = (n: string) => `tel:${n.replace(/[^\d+]/g, "")}`;

export default async function ContactoPage() {
  const [d, a] = await Promise.all([getContacto(), getAjustes()]);
  const redes = [
    { url: a.youtube, label: "YouTube", icono: "youtube" as const },
    { url: a.facebook, label: "Facebook", icono: "facebook" as const },
    { url: a.instagram, label: "Instagram", icono: "instagram" as const },
  ].filter((r) => r.url);

  return (
    <>
      <PageHero migas={[{ title: "Contacto" }]} eyebrow={d.hero.eyebrow} titulo={d.hero.titulo} texto={d.hero.texto} />

      <section className="section">
        <div className="wrap contacto-grid">
          <div>
            <SectionHead eyebrow={d.canales.eyebrow} titulo={d.canales.titulo} texto={d.canales.texto} />
            <div className="canales">
              {a.direccion && (
                <div className="canal reveal">
                  <IconoCirculo name="ubicacion" color="verde" />
                  <div>
                    <b>Dirección</b>
                    <span>
                      <Lineas texto={a.direccion} />
                    </span>
                  </div>
                </div>
              )}
              {(a.telefono_fijo || a.celular) && (
                <div className="canal reveal">
                  <IconoCirculo name="telefono" color="amarillo" />
                  <div>
                    <b>Teléfonos</b>
                    {a.telefono_fijo && <a href={tel(a.telefono_fijo)}>{a.telefono_fijo}</a>}
                    {a.telefono_fijo && a.celular && <span> · </span>}
                    {a.celular && <a href={tel(a.celular)}>{a.celular}</a>}
                  </div>
                </div>
              )}
              {a.correo && (
                <div className="canal reveal">
                  <IconoCirculo name="correo" color="verde" />
                  <div>
                    <b>Correo</b>
                    <a href={`mailto:${a.correo}`}>{a.correo}</a>
                  </div>
                </div>
              )}
              {a.horario && (
                <div className="canal reveal">
                  <IconoCirculo name="reloj" color="amarillo" />
                  <div>
                    <b>Horario de atención</b>
                    <span>
                      <Lineas texto={a.horario} />
                    </span>
                  </div>
                </div>
              )}
              {redes.length > 0 && (
                <div className="canal reveal">
                  <IconoCirculo name="web" color="verde" />
                  <div>
                    <b>Redes sociales</b>
                    <div className="canal-redes">
                      {redes.map((r) => (
                        <a key={r.label} href={r.url} target="_blank" rel="noopener" aria-label={r.label}>
                          <Icon name={r.icono} />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="form-card reveal" id="formulario">
            <Eyebrow>{d.formulario.eyebrow}</Eyebrow>
            <h2>{d.formulario.titulo}</h2>
            {d.formulario.texto ? <p>{d.formulario.texto}</p> : null}
            <ContactoForm asuntos={d.formulario.asuntos} telefono={a.telefono_fijo || a.celular} />
          </div>
        </div>
      </section>

      {a.mapa_url && (
        <section className="section" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <SectionHead eyebrow={d.mapa.eyebrow} titulo={d.mapa.titulo} texto={d.mapa.texto} />
            <div className="mapa reveal">
              <iframe src={a.mapa_url} loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Ubicación de Asoproyuja"></iframe>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
