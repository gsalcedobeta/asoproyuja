// Imágenes optimizadas por Next.js (WebP/AVIF al tamaño justo de cada pantalla), sin cambiar el <img> del diseño.
// Uso: <img {...optimizada(src, "(max-width: 900px) 100vw, 380px")} alt="…" />

/** Deben coincidir con images.deviceSizes / images.imageSizes de next.config.ts */
export const ANCHOS = [256, 384, 640, 828, 1080, 1200, 1920];

const OPTIMIZABLE = /\.(jpe?g|png|webp)$/i;

export function urlOptimizada(src: string, ancho: number, calidad = 75) {
  return `/_next/image?url=${encodeURIComponent(src)}&w=${ancho}&q=${calidad}`;
}

/**
 * Devuelve src, srcSet y sizes para un <img>. Solo optimiza imágenes del propio sitio
 * (/assets/… y /wp-content/uploads/…); SVG y URL externas se dejan tal cual.
 * @param sizes ancho con el que se muestra la imagen (atributo sizes de HTML)
 * @param max ancho máximo que vale la pena generar
 */
export function optimizada(src: string, sizes: string, max = 1920) {
  if (!src || !src.startsWith("/") || !OPTIMIZABLE.test(src.split("?")[0])) return { src };
  const anchos = ANCHOS.filter((w) => w <= max);
  return {
    src: urlOptimizada(src, anchos[Math.min(anchos.length - 1, 3)]),
    srcSet: anchos.map((w) => `${urlOptimizada(src, w)} ${w}w`).join(", "),
    sizes,
  };
}
