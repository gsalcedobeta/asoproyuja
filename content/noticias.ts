// Noticias de respaldo (las tres aprobadas en el Inicio). En WordPress: menú "Noticias".
// La fecha solo ordena el listado (de la más reciente a la más antigua); el diseño no la muestra.
import type { Noticia } from "@/lib/types";

export const noticias: Noticia[] = [
  {
    slug: "desarrollo-integral-y-educacion-inicial",
    titulo:
      "Promovemos el desarrollo integral y la educación inicial de niños y niñas a través de programas que fortalecen sus capacidades, bienestar y oportunidades desde la primera infancia",
    fecha: "2026-07-03",
    imagen: "/assets/img/noticia-desarrollo-integral.jpg",
    imagen_alt: "Graduación primera infancia",
    extracto:
      "Niños y niñas de nuestro territorio dan un nuevo paso en su camino de educación inicial, creciendo, aprendiendo y construyendo sueños desde sus primeros años.",
    contenido:
      "<p>Niños y niñas de nuestro territorio dan un nuevo paso en su camino de educación inicial, creciendo, aprendiendo y construyendo sueños desde sus primeros años.</p>",
  },
  {
    slug: "encuentro-de-formacion-talento-humano",
    titulo: "Encuentro de formación - Talento humano",
    fecha: "2026-06-28",
    imagen: "/assets/img/noticia-talento-humano.jpg",
    imagen_alt: "Encuentro comunitario",
    extracto:
      "Un espacio de capacitación, actualización, reconocimiento y exaltación por la labor continua de nuestro talento humano.",
    contenido:
      "<p>Un espacio de capacitación, actualización, reconocimiento y exaltación por la labor continua de nuestro talento humano.</p>",
  },
  {
    slug: "familias-y-ninez",
    titulo: "Familias y niñez",
    fecha: "2026-06-15",
    imagen: "/assets/img/noticia-familias-y-ninez.jpg",
    imagen_alt: "Niñas sonriendo",
    extracto: "Protegemos los derechos de la niñez y el fortalecimiento y bienestar de las familias.",
    contenido: "<p>Protegemos los derechos de la niñez y el fortalecimiento y bienestar de las familias.</p>",
  },
];
