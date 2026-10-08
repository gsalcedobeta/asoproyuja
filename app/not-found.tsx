import type { Metadata } from "next";
import { CtaPanel, PageHero } from "@/components/Blocks";

export const metadata: Metadata = { title: "Página no encontrada", robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <>
      <PageHero
        migas={[{ title: "Página no encontrada" }]}
        eyebrow="Error 404"
        titulo="No encontramos esta página"
        texto="Es posible que la dirección haya cambiado. Usa el menú o vuelve al inicio."
      />
      <section className="section" style={{ paddingBottom: 0 }} />
      <CtaPanel
        cta={{
          eyebrow: "Asoproyuja",
          titulo: "Sigue explorando",
          texto: "Conoce nuestras noticias y el trabajo que hacemos con la niñez y las familias.",
          boton: { title: "Ver noticias", url: "/noticias" },
        }}
      />
    </>
  );
}
