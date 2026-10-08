import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Asoproyuja — Asociación Agropecuaria Campesina Nacional",
    short_name: "Asoproyuja",
    description: "Trabajamos por el fortalecimiento y bienestar de la niñez y las familias en Colombia.",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFFFF",
    theme_color: "#1F4430",
    lang: "es-CO",
    icons: [
      { src: "/assets/img/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/img/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
