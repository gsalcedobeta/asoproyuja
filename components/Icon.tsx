// Iconos lineales del diseño. Los de accesos rápidos, pie de página y redes son
// copia exacta del preview aprobado; el resto sigue el mismo trazo (24×24, puntas redondas).
// En ACF el campo "Icono" es un selector con estas mismas claves
// (wordpress/tools/generar-acf-json.py las lee de aquí).
import type { ReactNode } from "react";
import type { ColorIcono } from "@/lib/types";

type Trazo = (c: string, w: number) => ReactNode;

const paths = {
  mensaje: (c, w) => <path d="M4 5h13v13l-3.2-2.3H4V5Z" stroke={c} strokeWidth={w} strokeLinejoin="round" />,
  pregunta: (c, w) => (
    <>
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth={w} />
      <path d="M9.2,9.6a2.8,2.8 0 1 1 4,2.5c-1,0.5-1.3,1-1.3,2.1" stroke={c} strokeWidth={w} strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="1" fill={c} />
    </>
  ),
  corazon: (c, w) => (
    <path
      d="M12 20.5s-7-4.35-7-9.7A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7 2.8c0 5.35-7 9.7-7 9.7Z"
      stroke={c}
      strokeWidth={w}
      strokeLinejoin="round"
    />
  ),
  ubicacion: (c, w) => (
    <>
      <path d="M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z" stroke={c} strokeWidth={w} strokeLinejoin="round" />
      <circle cx="12" cy="9" r="2.3" stroke={c} strokeWidth={w} />
    </>
  ),
  telefono: (c, w) => (
    <path
      d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1L6.6 10.8Z"
      stroke={c}
      strokeWidth={w}
      strokeLinejoin="round"
    />
  ),
  celular: (c, w) => (
    <>
      <rect x="7" y="2.5" width="10" height="19" rx="2.2" stroke={c} strokeWidth={w} />
      <path d="M11 19h2" stroke={c} strokeWidth={w} strokeLinecap="round" />
    </>
  ),
  correo: (c, w) => (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke={c} strokeWidth={w} />
      <path d="m4 7 8 6 8-6" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  reloj: (c, w) => (
    <>
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth={w} />
      <path d="M12 7v5l3.2 2" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  web: (c, w) => (
    <>
      <circle cx="12" cy="12" r="9" stroke={c} strokeWidth={w} />
      <path
        d="M3 12h18M12 3c2.5 2.5 3.8 5.5 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.5-3.8-9S9.5 5.5 12 3Z"
        stroke={c}
        strokeWidth={w}
        strokeLinejoin="round"
      />
    </>
  ),
  hoja: (c, w) => (
    <>
      <path d="M5 19c0-8.5 5.5-13.5 14-14 0 8.5-5 14-13 14H5Z" stroke={c} strokeWidth={w} strokeLinejoin="round" />
      <path d="M5.5 18.5 13 11" stroke={c} strokeWidth={w} strokeLinecap="round" />
    </>
  ),
  construccion: (c, w) => (
    <>
      <path d="M4 20h16M6 20V9l6-4.5L18 9v11" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 20v-5.5h4V20" stroke={c} strokeWidth={w} strokeLinejoin="round" />
    </>
  ),
  libro: (c, w) => (
    <>
      <path
        d="M4 5.5C6.5 4.5 9.5 4.6 12 6.2c2.5-1.6 5.5-1.7 8-.7V19c-2.5-1-5.5-.9-8 .7-2.5-1.6-5.5-1.7-8-.7V5.5Z"
        stroke={c}
        strokeWidth={w}
        strokeLinejoin="round"
      />
      <path d="M12 6.2v13.5" stroke={c} strokeWidth={w} />
    </>
  ),
  salud: (c, w) => (
    <path d="M9.5 4h5v5.5H20v5h-5.5V20h-5v-5.5H4v-5h5.5V4Z" stroke={c} strokeWidth={w} strokeLinejoin="round" />
  ),
  personas: (c, w) => (
    <>
      <circle cx="9" cy="8" r="3" stroke={c} strokeWidth={w} />
      <circle cx="17" cy="9.5" r="2.3" stroke={c} strokeWidth={w} />
      <path d="M3.5 19.5c0-3.3 2.5-5.6 5.5-5.6s5.5 2.3 5.5 5.6" stroke={c} strokeWidth={w} strokeLinecap="round" />
      <path d="M15.3 14.2c2.8-.5 5.2 1.5 5.2 4.6" stroke={c} strokeWidth={w} strokeLinecap="round" />
    </>
  ),
  ninez: (c, w) => (
    <>
      <circle cx="12" cy="6.5" r="2.8" stroke={c} strokeWidth={w} />
      <path d="M6 11.5 12 13l6-1.5M12 13v3.5m0 0-3 4.5m3-4.5 3 4.5" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  alimentos: (c, w) => (
    <>
      <path d="M12 21V10" stroke={c} strokeWidth={w} strokeLinecap="round" />
      <path d="M12 14c-3.5 0-6-2.5-6-6 3.5 0 6 2.5 6 6Zm0-2c0-3.5 2.5-6 6-6 0 3.5-2.5 6-6 6Z" stroke={c} strokeWidth={w} strokeLinejoin="round" />
    </>
  ),
  colaboracion: (c, w) => (
    <>
      <circle cx="9" cy="12" r="5.5" stroke={c} strokeWidth={w} />
      <circle cx="15" cy="12" r="5.5" stroke={c} strokeWidth={w} />
    </>
  ),
  integridad: (c, w) => (
    <>
      <path d="M12 3 19 6v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6l7-3Z" stroke={c} strokeWidth={w} strokeLinejoin="round" />
      <path d="m9 12 2 2 4-4" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  creatividad: (c, w) => (
    <>
      <path
        d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3Z"
        stroke={c}
        strokeWidth={w}
        strokeLinejoin="round"
      />
      <path d="M9.5 19h5M10.5 21.5h3" stroke={c} strokeWidth={w} strokeLinecap="round" />
    </>
  ),
  voluntariado: (c, w) => (
    <>
      <path d="M3 13.5h3.5l4 3h4.5a1.5 1.5 0 0 0 0-3h-3" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 19.5H3m3.5 0 1-.5h7.8l4.7-4a1.6 1.6 0 0 0-2.2-2.3L16 14.5" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M15.5 9.8s-3.5-2.1-3.5-4.8A2.1 2.1 0 0 1 15.5 3.6 2.1 2.1 0 0 1 19 5c0 2.7-3.5 4.8-3.5 4.8Z"
        stroke={c}
        strokeWidth={w}
        strokeLinejoin="round"
      />
    </>
  ),
  alianza: (c, w) => (
    <>
      <path d="M3 8.5 7 6l5 2.5L17 6l4 2.5" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <path d="m7 12.5 3.2 3.2a1.5 1.5 0 0 0 2.1 0l4.9-4.9" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3 8.5v6l4 3M21 8.5v6l-4 3" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  donacion: (c, w) => (
    <>
      <rect x="3" y="9" width="18" height="11" rx="2" stroke={c} strokeWidth={w} />
      <path d="M12 9v11M3 13h18" stroke={c} strokeWidth={w} />
      <path d="M12 9C10 9 7.5 8 7.5 6.2 7.5 4.3 10.5 4 12 9Zm0 0c2 0 4.5-1 4.5-2.8 0-1.9-3-2.2-4.5 2.8Z" stroke={c} strokeWidth={w} strokeLinejoin="round" />
    </>
  ),
  documento: (c, w) => (
    <>
      <path d="M6 3h8l4 4v14H6V3Z" stroke={c} strokeWidth={w} strokeLinejoin="round" />
      <path d="M14 3v4h4M9 12h6M9 16h6" stroke={c} strokeWidth={w} strokeLinecap="round" />
    </>
  ),
  youtube: (c, w) => (
    <>
      <rect x="2" y="5.5" width="20" height="13" rx="4" stroke={c} strokeWidth={w} />
      <path d="M10 9.2v5.6l5-2.8-5-2.8Z" fill={c} />
    </>
  ),
  facebook: (c) => (
    <path
      d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06C2 17.08 5.66 21.23 10.44 22v-7.03H7.9v-2.9h2.55V9.85c0-2.52 1.49-3.9 3.78-3.9 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22C18.34 21.23 22 17.08 22 12.06Z"
      fill={c}
    />
  ),
  instagram: (c, w) => (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5.5" stroke={c} strokeWidth={w} />
      <circle cx="12" cy="12" r="4.2" stroke={c} strokeWidth={w} />
      <circle cx="17.3" cy="6.7" r="1.15" fill={c} />
    </>
  ),
  corazon_lleno: (c) => (
    <path d="M12 20.5s-7-4.35-7-9.7A4.3 4.3 0 0 1 12 8a4.3 4.3 0 0 1 7 2.8c0 5.35-7 9.7-7 9.7Z" fill={c} />
  ),
  chevron: (c, w) => <path d="m6 9 6 6 6-6" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />,
} satisfies Record<string, Trazo>;

export type IconName = keyof typeof paths;

export const ICONOS = Object.keys(paths) as IconName[];

export function Icon({
  name,
  size = 18,
  color = "currentColor",
  stroke = 1.8,
}: {
  name: IconName;
  size?: number;
  color?: string;
  stroke?: number;
}) {
  const trazo = (paths[name] ?? paths.documento) as Trazo;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {trazo(color, stroke)}
    </svg>
  );
}

/** Colores de los iconos en círculo, iguales a los accesos rápidos del Inicio. */
export const COLORES: Record<ColorIcono, { fondo: string; trazo: string }> = {
  verde: { fondo: "rgba(63,133,87,0.14)", trazo: "#3F8557" },
  amarillo: { fondo: "rgba(242,176,53,0.18)", trazo: "#C1502E" },
};

/** Icono dentro del círculo de color (clase .quick-ico del diseño). */
export function IconoCirculo({ name, color }: { name: IconName; color: ColorIcono }) {
  const c = COLORES[color] ?? COLORES.verde;
  return (
    <div className="quick-ico" style={{ background: c.fondo }}>
      <Icon name={name} size={26} color={c.trazo} stroke={2.2} />
    </div>
  );
}
