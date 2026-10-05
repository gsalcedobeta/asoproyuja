// Noticias de respaldo. En WordPress: menú "Noticias" (el importador las crea con su foto).
// La fecha solo ordena el listado (de la más reciente a la más antigua); el diseño no la muestra.
import type { Noticia } from "@/lib/types";

const ig = (usuario: string) => `<a href="https://www.instagram.com/${usuario}" target="_blank" rel="noopener">@${usuario}</a>`;

export const noticias: Noticia[] = [
  {
    slug: "espacios-seguros-libres-de-violencia",
    titulo: "Promovemos espacios seguros, respetuosos y libres de violencia",
    fecha: "2026-04-28",
    imagen: "/assets/img/noticias/espacios-seguros-libres-de-violencia.jpg",
    imagen_alt: "Equipo de Asoproyuja en el Parque Industrial de Santa Marta",
    extracto:
      "En alianza con el Parque Industrial de Santa Marta, participamos en la Semana de la Salud y la Seguridad en el Trabajo con un espacio de sensibilización sobre la violencia de género.",
    contenido:
      "<p>En alianza con el Parque Industrial de Santa Marta, participamos en la Semana de la Salud y la Seguridad en el Trabajo, desarrollando un espacio de sensibilización y reflexión sobre la violencia de género.</p>" +
      "<p>A través del diálogo y la educación rescatamos la importancia de reconocer, prevenir y rechazar cualquier forma de violencia, promoviendo entornos laborales y personales donde prevalezca el respeto, la igualdad y la dignidad.</p>",
  },
  {
    slug: "manana-blanca-hogar-infantil-pedro-leon-acosta",
    titulo: "Mañana Blanca | Hogar Infantil Pedro León Acosta",
    fecha: "2025-12-05",
    imagen: "/assets/img/noticias/manana-blanca-hogar-infantil-pedro-leon-acosta.jpg",
    imagen_alt: "Familia celebrando la Mañana Blanca del Hogar Infantil Pedro León Acosta",
    extracto:
      "Nos llena de orgullo ver cómo nuestros niños y niñas avanzan hacia nuevos horizontes para continuar con su crecimiento y formación.",
    contenido:
      "<p>Desde Asoproyuja nos llena de orgullo, alegría y también de un poco de nostalgia ver cómo, dentro de nuestros procesos pedagógicos, nuestros niños y niñas avanzan y escalan hacia nuevos horizontes para continuar con su crecimiento y formación.</p>" +
      "<p>En Asoproyuja impulsamos, apoyamos y acompañamos cada paso de este hermoso proceso educativo. Gracias a todas las familias por confiar en nosotros y permitirnos ser parte de este proceso.</p>",
  },
  {
    slug: "pre-clausura-hogar-infantil-pedro-leon-acosta",
    titulo: "Pre-Clausura | Hogar Infantil Pedro León Acosta",
    fecha: "2025-11-28",
    imagen: "/assets/img/noticias/pre-clausura-hogar-infantil-pedro-leon-acosta.jpg",
    imagen_alt: "Niña en la Pre-Clausura del Hogar Infantil Pedro León Acosta",
    extracto:
      "Acompañamos cada paso del proceso educativo de nuestros niños y niñas. Gracias a las familias por confiar en nosotros.",
    contenido:
      "<p>Desde Asoproyuja nos llena de orgullo, alegría y también de un poco de nostalgia ver cómo, dentro de nuestros procesos pedagógicos, nuestros niños y niñas avanzan y escalan hacia nuevos horizontes para continuar con su crecimiento y formación.</p>" +
      "<p>En Asoproyuja impulsamos, apoyamos y acompañamos cada paso de este hermoso proceso educativo. Gracias a todas las familias por confiar en nosotros y permitirnos ser parte de este proceso.</p>",
  },
  {
    slug: "un-encuentro-rosa",
    titulo: "Un encuentro rosa",
    fecha: "2025-10-24",
    imagen: "/assets/img/noticias/un-encuentro-rosa.jpg",
    imagen_alt: "Jornada de Octubre Rosa con la Fundación Corazón Rosa",
    extracto: "Tuvimos 500 razones para recordarnos la importancia del autoexamen, un acto de amor propio y prevención que puede salvar vidas.",
    contenido:
      "<p>Tuvimos 500 razones para recordarnos la importancia del autoexamen, un acto de amor propio y prevención que puede salvar vidas.</p>" +
      `<p>Desde ${ig("asoproyuja")}, en alianza con la ${ig("funcorazonrosa")}, promovemos la salud, el cuidado y el amor seguro. La jornada de hoy fue todo un éxito. Nuestro compromiso sigue en pie con el bienestar, la vida y el cuidado físico de cada mujer que hace parte de nuestra institución.</p>`,
  },
  {
    slug: "jornada-pedagogica-2025",
    titulo: "Jornada Pedagógica 2025 – Un encuentro por la niñez",
    fecha: "2025-08-22",
    imagen: "/assets/img/noticias/jornada-pedagogica-2025.jpg",
    imagen_alt: "Talento humano en la Jornada Pedagógica 2025",
    extracto:
      "Más de 200 personas de talento humano se reunieron en una jornada de aprendizajes, integración y cultura por el bienestar de los niños y niñas de nuestra ciudad.",
    contenido:
      "<p>La Asociación Agropecuaria Campesina Nacional – Asoproyuja, en alianza con APF San Fernando y APF La Esperanza, reunió el 22 de agosto de 2025 a más de 200 personas de talento humano en una jornada cargada de aprendizajes, integración, muestras culturales y alegría, reafirmando el compromiso conjunto por el bienestar, la protección y el cuidado de los niños y niñas de nuestra ciudad.</p>" +
      "<p>Con la participación musical de Deimer Marín y el compositor Rafael Manjarres, esta jornada también celebró la cultura y el arte como expresiones que fortalecen la infancia y el tejido social.</p>" +
      "<p>Agradecemos el respaldo del ICBF Regional Magdalena, Sintracihobi y los medios de comunicación locales, aliados estratégicos que acompañan esta misión de transformar la vida de la niñez con oportunidades, protección y esperanza.</p>",
  },
  {
    slug: "cerramos-julio-con-gratitud",
    titulo: "Desde Asoproyuja cerramos julio con el corazón lleno de gratitud e inspiración",
    fecha: "2025-07-31",
    imagen: "/assets/img/noticias/cerramos-julio-con-gratitud.jpg",
    imagen_alt: "Niñas, niños y docentes celebrando los 500 años de Santa Marta",
    extracto:
      "Celebramos los 500 años de Santa Marta reafirmando nuestro compromiso con la niñez samaria: entornos seguros donde el juego, el amor y la felicidad sean la base del aprendizaje.",
    contenido:
      "<p>En este mes tan especial, celebramos los 500 años de nuestra querida Santa Marta, reafirmando nuestro compromiso con la niñez samaria: construir entornos seguros donde el juego, el amor y la felicidad sean la base del aprendizaje.</p>" +
      "<p>Seguimos creyendo en una ciudad que crece cuando protege a sus niños y niñas, que educa desde el afecto y que transforma a través del juego.</p>" +
      "<p>Gracias, Santa Marta, por ser el hogar que nos inspira a seguir sembrando futuro.</p>",
  },
];
