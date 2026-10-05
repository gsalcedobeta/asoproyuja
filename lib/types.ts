// Tipos de contenido del sitio.
// Los nombres de propiedad coinciden 1:1 con los nombres de campo de ACF
// (ver wordpress/asoproyuja-headless/acf-json), así el JSON de la API REST
// de WordPress se usa directamente sin traducir campos.

import type { IconName } from "@/components/Icon";

/** Mismo formato que devuelve un campo "Enlace" (link) de ACF. */
export type Enlace = { title: string; url: string; target?: string };

export type Encabezado = {
  eyebrow: string;
  titulo: string;
  texto?: string;
};

/** Franja de llamado a la acción (panel naranja del diseño). */
export type Cta = {
  eyebrow: string;
  titulo: string;
  texto: string;
  boton: Enlace;
};

/** Combinación de color de los iconos en círculo (accesos rápidos, líneas, valores). */
export type ColorIcono = "verde" | "amarillo";

export type Texto = { texto: string };

// ---------- Ajustes globales (página de opciones "Ajustes del sitio") ----------
export type Ajustes = {
  /** Dirección; cada línea se muestra en un renglón. */
  direccion: string;
  telefono_fijo: string;
  celular: string;
  correo: string;
  /** Texto del sitio web que se muestra en el pie (ej. asoproyuja.org). */
  sitio_web: string;
  horario: string;
  /** URL para insertar el mapa (Google Maps, opción "Insertar un mapa"). Vacía = sin mapa. */
  mapa_url: string;
  youtube: string;
  facebook: string;
  instagram: string;
  descripcion_pie: string;
  texto_copyright: string;
  texto_creditos: string;
  creditos_enlace: Enlace;
  /** Botón flotante "Donar ahora". */
  boton_flotante: Enlace;
};

// ---------- Inicio ----------
export type Slide = {
  eyebrow: string;
  titulo: string;
  texto: string;
  imagen: string;
  imagen_alt: string;
  botones: { boton: Enlace; estilo: "primario" | "contorno" }[];
};

export type AccesoRapido = {
  icono: IconName;
  color: ColorIcono;
  titulo: string;
  texto: string;
  enlace: Enlace;
};

export type Aliado = { nombre: string; logo: string; url?: string };

export type Inicio = {
  slides: Slide[];
  bienvenida: {
    imagen: string;
    imagen_alt: string;
    sello_numero: string;
    sello_texto: string;
    eyebrow: string;
    titulo: string;
    texto: string;
    boton: Enlace;
  };
  accesos: AccesoRapido[];
  noticias: Encabezado & { cantidad: number };
  aliados: Encabezado & { logos: Aliado[]; texto_cta: string; enlace_cta: Enlace };
  newsletter: {
    eyebrow: string;
    titulo: string;
    texto: string;
    placeholder: string;
    boton: string;
    mensaje_exito: string;
    nota: string;
  };
  apoyo: {
    eyebrow: string;
    titulo: string;
    texto: string;
    boton: Enlace;
    mascota: string;
  };
};

// ---------- Quiénes somos ----------
export type QuienesSomos = {
  /** Encabezado verde; "contenido" es el texto de quiénes somos que va debajo del título. */
  hero: Encabezado & { contenido: string }; // HTML
  mision_vision: Encabezado & { mision: string; vision: string }; // HTML
  lineas: Encabezado & {
    items: { icono: IconName; color: ColorIcono; titulo: string; items: Texto[] }[];
  };
  valores: Encabezado & {
    items: { icono: IconName; color: ColorIcono; titulo: string; texto: string }[];
  };
  organigrama: Encabezado & {
    niveles: Texto[];
    direcciones: { titulo: string; areas: { titulo: string; cargos: Texto[] }[] }[];
  };
  cta: Cta;
};

// ---------- Noticias ----------
export type NoticiasPagina = {
  hero: Encabezado;
  por_pagina: number;
  mensaje_vacio: string;
  cta: Cta;
};

export type Noticia = {
  slug: string;
  titulo: string;
  fecha: string; // ISO yyyy-mm-dd (ordena el listado; el diseño no muestra fechas)
  imagen: string;
  imagen_alt: string;
  extracto: string;
  contenido: string; // HTML
};

// ---------- Contacto (también "Atención al ciudadano") ----------
export type Contacto = {
  hero: Encabezado;
  canales: Encabezado;
  formulario: Encabezado & { asuntos: Texto[] };
  mapa: Encabezado;
};

// ---------- Páginas con plantilla "Próximamente" ----------
export type Proximamente = {
  eyebrow: string;
  titulo: string;
  texto: string;
  boton: Enlace;
  imagen: string;
};

export type PreguntasFrecuentes = {
  hero: Encabezado;
  proximamente: Proximamente;
  intro: Encabezado;
  preguntas: { pregunta: string; respuesta: string }[]; // respuesta en HTML
  cta: Cta;
};

export type ComoAyudar = {
  hero: Encabezado;
  proximamente: Proximamente;
  intro: Encabezado;
  formas: { icono: IconName; color: ColorIcono; titulo: string; texto: string; enlace?: Enlace | null }[];
  donaciones: Encabezado & { contenido: string }; // HTML (cuentas, Nequi, etc.)
  cta: Cta;
};

// ---------- Política de datos ----------
export type PoliticaDatos = {
  hero: Encabezado;
  contenido: string; // HTML
  actualizado: string; // yyyy-mm-dd
};
