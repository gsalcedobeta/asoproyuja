// Exporta el contenido local (/content) a JSON para el importador del plugin de WordPress.
// Uso: npm run exportar-contenido
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import * as sitio from "../content/sitio";
import { noticias } from "../content/noticias";
import { menuEnlaces, menuFooter, menuPrincipal } from "../lib/nav";

const destino = resolve(__dirname, "../wordpress/asoproyuja-headless/seed/contenido.json");

const paginas = [
  { slug: "inicio", titulo: "Inicio", plantilla: "asoproyuja-inicio", grupo: "inicio", acf: sitio.inicio },
  { slug: "quienes-somos", titulo: "Quiénes somos", plantilla: "asoproyuja-quienes-somos", grupo: "quienes-somos", acf: sitio.quienesSomos },
  { slug: "noticias", titulo: "Noticias", plantilla: "asoproyuja-noticias", grupo: "noticias-pagina", acf: sitio.noticiasPagina },
  { slug: "contacto", titulo: "Contacto", plantilla: "asoproyuja-contacto", grupo: "contacto", acf: sitio.contacto },
  {
    slug: "preguntas-frecuentes",
    titulo: "Preguntas frecuentes",
    plantilla: "asoproyuja-preguntas-frecuentes",
    grupo: "preguntas-frecuentes",
    acf: sitio.preguntasFrecuentes,
  },
  { slug: "como-ayudar", titulo: "Cómo ayudar", plantilla: "asoproyuja-como-ayudar", grupo: "como-ayudar", acf: sitio.comoAyudar },
  {
    slug: "politica-de-datos",
    titulo: "Política de tratamiento de datos",
    plantilla: "asoproyuja-politica-datos",
    grupo: "politica-datos",
    // ACF guarda las fechas como Ymd
    acf: { ...sitio.politicaDatos, actualizado: sitio.politicaDatos.actualizado.replace(/-/g, "") },
  },
];

const data = {
  generado: new Date().toISOString(),
  ajustes: sitio.ajustes,
  menus: { principal: menuPrincipal, footer: menuFooter, enlaces: menuEnlaces },
  paginas,
  noticias: noticias.map((n) => ({
    slug: n.slug,
    titulo: n.titulo,
    fecha: n.fecha,
    imagen: n.imagen,
    imagen_alt: n.imagen_alt,
    contenido: n.contenido,
    acf: { extracto: n.extracto },
  })),
};

mkdirSync(dirname(destino), { recursive: true });
writeFileSync(destino, JSON.stringify(data, null, 2), "utf-8");
console.log(`Contenido exportado a ${destino}`);
