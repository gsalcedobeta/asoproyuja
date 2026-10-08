import type { NextConfig } from "next";

const WP_URL = (process.env.WP_URL || "").trim().replace(/\/+$/, "");

/** Versión de los archivos CSS (cambia en cada despliegue para que el navegador no use una copia vieja). */
const VERSION = (process.env.VERCEL_GIT_COMMIT_SHA || String(Date.now())).slice(0, 8);

const seguridad = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
];

const nextConfig: NextConfig = {
  // Permite builds de prueba en otra carpeta sin chocar con `npm run dev` (por defecto .next)
  distDir: process.env.NEXT_DIST_DIR || ".next",
  trailingSlash: false,
  poweredByHeader: false,
  images: {
    // Optimización automática: WebP/AVIF al tamaño de cada pantalla (ver lib/imagen.ts)
    formats: ["image/avif", "image/webp"],
    deviceSizes: [384, 640, 828, 1080, 1200, 1920],
    imageSizes: [256],
    minimumCacheTTL: 2592000,
  },
  env: { NEXT_PUBLIC_VERSION: VERSION },

  async rewrites() {
    // Las imágenes que se suben en WordPress se sirven desde asoproyuja.org/wp-content/uploads/…
    // (mejor para SEO y el visitante nunca ve cms.asoproyuja.org)
    return WP_URL ? [{ source: "/wp-content/uploads/:ruta*", destination: `${WP_URL}/wp-content/uploads/:ruta*` }] : [];
  },

  async headers() {
    return [
      { source: "/:ruta*", headers: seguridad },
      // El dominio técnico de Vercel no se indexa: en Google solo debe aparecer asoproyuja.org
      {
        source: "/:ruta*",
        has: [{ type: "host", value: "(?<sub>.*)\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      // Caché del navegador: CSS versionado (1 año), imágenes (30 días)
      { source: "/assets/css/:archivo*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
      {
        source: "/assets/img/:archivo*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, stale-while-revalidate=86400" }],
      },
      {
        source: "/wp-content/uploads/:archivo*",
        headers: [{ key: "Cache-Control", value: "public, max-age=2592000, s-maxage=2592000, stale-while-revalidate=86400" }],
      },
    ];
  },

  async redirects() {
    return [
      { source: "/inicio", destination: "/", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      // "Atención al ciudadano" y "Contacto" son la misma página
      { source: "/atencion-al-ciudadano", destination: "/contacto", permanent: true },
      { source: "/nosotros", destination: "/quienes-somos", permanent: true },
      { source: "/quiero-apoyar", destination: "/como-ayudar", permanent: true },
      { source: "/donar", destination: "/como-ayudar", permanent: true },
      { source: "/noticias/pagina/1", destination: "/noticias", permanent: true },
      { source: "/politica-de-privacidad", destination: "/politica-de-datos", permanent: true },
    ];
  },
};

export default nextConfig;
