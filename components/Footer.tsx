import { Fragment } from "react";
import { Icon } from "@/components/Icon";
import { SmartLink } from "@/components/SmartLink";
import { LOGO_SVG } from "@/lib/logo";
import type { NavItem } from "@/lib/nav";
import type { Ajustes } from "@/lib/types";

function Columna({ titulo, items }: { titulo: string; items: NavItem[] }) {
  return (
    <div className="footer-col">
      <h5>{titulo}</h5>
      <ul>
        {items.map((m) => (
          <li key={m.url + m.title}>
            <SmartLink href={m.url} newTab={m.target === "_blank" ? true : undefined}>
              {m.title}
            </SmartLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Texto con saltos de línea → <br> */
export function Lineas({ texto }: { texto: string }) {
  const lineas = texto.split(/\r?\n/);
  return (
    <>
      {lineas.map((l, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {l}
        </Fragment>
      ))}
    </>
  );
}

export function Footer({ a, navegacion, enlaces }: { a: Ajustes; navegacion: NavItem[]; enlaces: NavItem[] }) {
  const redes = [
    { url: a.youtube, label: "YouTube", icono: "youtube" as const },
    { url: a.facebook, label: "Facebook", icono: "facebook" as const },
    { url: a.instagram, label: "Instagram", icono: "instagram" as const },
  ].filter((r) => r.url);

  return (
    <footer id="contacto-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div className="footer-logo" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
            <p style={{ fontSize: "0.88rem", maxWidth: "32ch", color: "#B9C6A8" }}>{a.descripcion_pie}</p>
            <div className="footer-social">
              {redes.map((r) => (
                <a key={r.label} href={r.url} target="_blank" rel="noopener" aria-label={r.label}>
                  <Icon name={r.icono} />
                </a>
              ))}
            </div>
          </div>
          <Columna titulo="Navegación" items={navegacion} />
          <Columna titulo="Enlaces" items={enlaces} />
          <div className="footer-col">
            <h5>Contacto</h5>
            <ul>
              {a.direccion && (
                <li className="footer-contact-item">
                  <Icon name="ubicacion" />
                  <span>
                    <Lineas texto={a.direccion} />
                  </span>
                </li>
              )}
              {a.telefono_fijo && (
                <li className="footer-contact-item">
                  <Icon name="telefono" />
                  <span>{a.telefono_fijo}</span>
                </li>
              )}
              {a.celular && (
                <li className="footer-contact-item">
                  <Icon name="celular" />
                  <span>{a.celular}</span>
                </li>
              )}
              {a.correo && (
                <li className="footer-contact-item">
                  <Icon name="correo" />
                  <span>{a.correo}</span>
                </li>
              )}
              {a.sitio_web && <li>{a.sitio_web}</li>}
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{a.texto_copyright}</span>
          <span>
            {a.texto_creditos}{" "}
            {a.creditos_enlace?.url ? (
              <a href={a.creditos_enlace.url} target="_blank" rel="noopener">
                <strong style={{ color: "#E7EEDD" }}>{a.creditos_enlace.title}</strong>
              </a>
            ) : (
              <strong style={{ color: "#E7EEDD" }}>{a.creditos_enlace?.title}</strong>
            )}
          </span>
        </div>
      </div>
    </footer>
  );
}

/** Botón flotante "Donar ahora" (esquina inferior derecha). */
export function BotonFlotante({ boton }: { boton: Ajustes["boton_flotante"] }) {
  if (!boton?.url) return null;
  return (
    <SmartLink className="floating-donate" href={boton.url} aria-label={boton.title}>
      <span className="fd-ico">
        <Icon name="corazon_lleno" size={20} color="#fff" />
      </span>
      <span className="fd-label">{boton.title}</span>
    </SmartLink>
  );
}
