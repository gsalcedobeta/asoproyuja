import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite builds de prueba en otra carpeta sin chocar con `npm run dev` (por defecto .next)
  distDir: process.env.NEXT_DIST_DIR || ".next",
  trailingSlash: false,
  images: { unoptimized: true },
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
    ];
  },
};

export default nextConfig;
