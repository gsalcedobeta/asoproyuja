// Bloques de las páginas interiores. Reutilizan las clases del diseño aprobado
// (eyebrow, section-head, card-panel, noticia-card, bien-media…); lo nuevo está en extra.css.
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { JsonLd } from "@/components/JsonLd";
import { Pieza } from "@/components/Piezas";
import { SmartLink } from "@/components/SmartLink";
import { schemaMigas } from "@/lib/seo";
import { optimizada } from "@/lib/imagen";
import type { Cta, Noticia, Proximamente } from "@/lib/types";

export type Miga = { title: string; url?: string };

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="eyebrow">
      <span className="eyebrow-dot"></span>
      {children}
    </span>
  );
}

/** Encabezado de página interior: franja verde con la textura del hero del Inicio. */
export function PageHero({
  migas,
  eyebrow,
  titulo,
  texto,
  contenido,
  nombreSchema,
}: {
  migas: Miga[];
  eyebrow: string;
  titulo: string;
  texto?: string;
  /** Texto adicional en HTML bajo el título (por ejemplo, en Quiénes somos). */
  contenido?: string;
  /** Nombre del último paso de la ruta para Google, si difiere del visible (p. ej. el título de una noticia). */
  nombreSchema?: string;
}) {
  return (
    <section className={`page-hero${contenido ? " con-texto" : ""}`}>
      <JsonLd data={schemaMigas(nombreSchema ? [...migas.slice(0, -1), { title: nombreSchema }] : migas)} />
      <Pieza p={{ s: 96, c: "#F2B035", w: 5.5, o: 0.28, r: 18, pos: { top: "18%", right: "6%" } }} />
      <Pieza p={{ s: 54, c: "#3F8557", w: 6, o: 0.45, r: -24, pos: { bottom: "14%", right: "18%" } }} />
      <div className="wrap">
        <div className="breadcrumb">
          <Link href="/">Inicio</Link>
          {migas.map((m, i) => (
            <span key={i}>
              <span className="sep">/</span>
              {m.url ? <Link href={m.url}>{m.title}</Link> : <span aria-current="page">{m.title}</span>}
            </span>
          ))}
        </div>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1 className={titulo.length > 70 ? "h1-long" : undefined}>{titulo}</h1>
        {texto ? <p>{texto}</p> : null}
        {contenido ? <Html html={contenido} className="page-hero-texto" /> : null}
      </div>
    </section>
  );
}

export function SectionHead({
  eyebrow,
  titulo,
  texto,
  centro,
}: {
  eyebrow: string;
  titulo: string;
  texto?: string;
  centro?: boolean;
}) {
  return (
    <div className={`section-head reveal${centro ? " center" : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2>{titulo}</h2>
      {texto ? <p>{texto}</p> : null}
    </div>
  );
}

/** Tarjeta de noticia, idéntica a la del Inicio. */
export function NoticiaCard({ n }: { n: Noticia }) {
  return (
    <article className="noticia-card reveal">
      <div className="noticia-img">
        <img {...optimizada(n.imagen, "(max-width: 900px) 92vw, 380px", 1080)} alt={n.imagen_alt} loading="lazy" decoding="async" />
      </div>
      <div className="noticia-body">
        <h3>{n.titulo}</h3>
        <p>{n.extracto}</p>
        <Link className="noticia-link" href={`/noticias/${n.slug}`}>
          Leer más →
        </Link>
      </div>
    </article>
  );
}

/** Llamado a la acción con el panel naranja del Newsletter. */
export function CtaPanel({ cta }: { cta: Cta }) {
  if (!cta?.titulo) return null;
  return (
    <section className="section cta-section">
      <div className="wrap">
        <div className="card-panel news-panel cta-panel reveal">
          <div>
            <Eyebrow>{cta.eyebrow}</Eyebrow>
            <h2>{cta.titulo}</h2>
            {cta.texto ? <p>{cta.texto}</p> : null}
          </div>
          {cta.boton?.url ? (
            <SmartLink className="cta-btn" href={cta.boton.url} newTab={cta.boton.target === "_blank" ? true : undefined}>
              {cta.boton.title}
            </SmartLink>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Plantilla "Muy pronto": se muestra mientras la página no tenga su contenido cargado. */
export function ProximamenteBloque({ d }: { d: Proximamente }) {
  return (
    <section className="section pronto">
      <div className="wrap">
        <div className="card-panel dona-panel pronto-panel reveal">
          <div className="pronto-copy">
            <Eyebrow>{d.eyebrow}</Eyebrow>
            <h2>{d.titulo}</h2>
            <p>{d.texto}</p>
            {d.boton?.url ? (
              <SmartLink className="dona-btn" href={d.boton.url}>
                {d.boton.title}
              </SmartLink>
            ) : null}
          </div>
          {d.imagen ? <img className="pronto-mascot" {...optimizada(d.imagen, "250px", 640)} alt="" loading="lazy" decoding="async" /> : null}
        </div>
      </div>
    </section>
  );
}

export function Paginacion({ pagina, total }: { pagina: number; total: number }) {
  if (total < 2) return null;
  const url = (n: number) => (n === 1 ? "/noticias" : `/noticias/pagina/${n}`);
  return (
    <div className="paginacion" role="navigation" aria-label="Páginas de noticias">
      {pagina > 1 ? (
        <Link href={url(pagina - 1)} className="pag-btn" aria-label="Página anterior">
          ‹
        </Link>
      ) : (
        <span className="pag-btn disabled" aria-hidden="true">
          ‹
        </span>
      )}
      {Array.from({ length: total }, (_, i) => i + 1).map((n) =>
        n === pagina ? (
          <span key={n} className="pag-btn active" aria-current="page">
            {n}
          </span>
        ) : (
          <Link key={n} href={url(n)} className="pag-btn">
            {n}
          </Link>
        )
      )}
      {pagina < total ? (
        <Link href={url(pagina + 1)} className="pag-btn" aria-label="Página siguiente">
          ›
        </Link>
      ) : (
        <span className="pag-btn disabled" aria-hidden="true">
          ›
        </span>
      )}
    </div>
  );
}

export function Html({ html, className, style }: { html: string; className?: string; style?: CSSProperties }) {
  return <div className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />;
}
