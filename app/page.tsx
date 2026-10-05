// Inicio. Reproduce el HTML del diseño aprobado (entregables/asoproyuja-home-propuesta.html)
// con las mismas clases; los textos e imágenes vienen de WordPress (Página: Inicio).
import { NoticiaCard } from "@/components/Blocks";
import { Icon, IconoCirculo } from "@/components/Icon";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Piezas } from "@/components/Piezas";
import { Slider } from "@/components/Slider";
import { SmartLink } from "@/components/SmartLink";
import { getInicio, getNoticias } from "@/lib/cms";

export const revalidate = 600;

export default async function InicioPage() {
  const [d, noticias] = await Promise.all([getInicio(), getNoticias()]);
  const recientes = noticias.slice(0, Number(d.noticias.cantidad) || 3);
  const logos = (d.aliados.logos || []).filter((l) => l.logo);

  return (
    <>
      <section className="hero" id="inicio">
        <div className="wrap">
          <Slider slides={d.slides} />
        </div>
      </section>

      <section className="section bienvenida" id="bienvenida" style={{ paddingBottom: 20 }}>
        <Piezas grupo="bienvenida" />
        <div className="wrap bien-grid">
          <div className="bien-media reveal">
            <div className="mask-frame">
              <img src={d.bienvenida.imagen} alt={d.bienvenida.imagen_alt} />
            </div>
            <div className="bien-badge">
              <span className="bien-badge-num">{d.bienvenida.sello_numero}</span>
              <span className="bien-badge-txt">{d.bienvenida.sello_texto}</span>
            </div>
          </div>
          <div>
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              {d.bienvenida.eyebrow}
            </span>
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", margin: "14px 0 16px" }}>{d.bienvenida.titulo}</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "1.02rem", maxWidth: "52ch" }}>{d.bienvenida.texto}</p>
            {d.bienvenida.boton?.url ? (
              <div style={{ marginTop: 28 }}>
                <SmartLink className="btn btn-outline" href={d.bienvenida.boton.url}>
                  {d.bienvenida.boton.title}
                </SmartLink>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="quick">
        <Piezas grupo="quick" />
        <div className="wrap">
          <div className="quick-grid">
            {d.accesos.map((a, i) => (
              <SmartLink key={i} className="quick-card reveal" href={a.enlace?.url || "/contacto"}>
                <div className="quick-tape"></div>
                <IconoCirculo name={a.icono} color={a.color} />
                <h4>{a.titulo}</h4>
                <p>{a.texto}</p>
              </SmartLink>
            ))}
          </div>
        </div>
      </section>

      <section className="section noticias texture" id="noticias">
        <Piezas grupo="noticias" />
        <div className="wrap">
          <div className="section-head reveal">
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              {d.noticias.eyebrow}
            </span>
            <h2>{d.noticias.titulo}</h2>
            <p>{d.noticias.texto}</p>
          </div>
          <div className="noticias-grid">
            {recientes.map((n) => (
              <NoticiaCard key={n.slug} n={n} />
            ))}
          </div>
        </div>
      </section>

      {logos.length > 0 && (
        <section className="section aliados" id="aliados">
          <div className="wrap">
            <div className="section-head reveal">
              <span className="eyebrow">
                <span className="eyebrow-dot"></span>
                {d.aliados.eyebrow}
              </span>
              <h2>{d.aliados.titulo}</h2>
              <p>{d.aliados.texto}</p>
            </div>
            <div className="aliados-row reveal">
              {logos.map((l, i) => {
                const img = <img src={l.logo} alt={l.nombre} />;
                return l.url ? (
                  <a key={i} className="aliado-slot aliado-logo" href={l.url} target="_blank" rel="noopener" title={l.nombre}>
                    {img}
                  </a>
                ) : (
                  <div key={i} className="aliado-slot aliado-logo" title={l.nombre}>
                    {img}
                  </div>
                );
              })}
            </div>
            {d.aliados.texto_cta ? (
              <p className="aliados-cta">
                {d.aliados.texto_cta}{" "}
                {d.aliados.enlace_cta?.url ? <SmartLink href={d.aliados.enlace_cta.url}>{d.aliados.enlace_cta.title}</SmartLink> : null}
              </p>
            ) : null}
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0 }}>
        <Piezas grupo="duo" />
        <div className="wrap duo">
          <div className="card-panel news-panel reveal">
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              {d.newsletter.eyebrow}
            </span>
            <h2>{d.newsletter.titulo}</h2>
            <p>{d.newsletter.texto}</p>
            <NewsletterForm d={d.newsletter} />
          </div>
          <div className="card-panel dona-panel reveal">
            <span className="eyebrow">
              <span className="eyebrow-dot"></span>
              {d.apoyo.eyebrow}
            </span>
            <h2>{d.apoyo.titulo}</h2>
            <p>{d.apoyo.texto}</p>
            {d.apoyo.boton?.url ? (
              <SmartLink className="dona-btn" href={d.apoyo.boton.url}>
                <Icon name="corazon_lleno" />
                {d.apoyo.boton.title}
              </SmartLink>
            ) : null}
            {d.apoyo.mascota ? <img className="dona-mascot" src={d.apoyo.mascota} alt="Mascota Asoproyuja" /> : null}
          </div>
        </div>
      </section>
    </>
  );
}
