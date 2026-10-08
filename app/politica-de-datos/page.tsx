import type { Metadata } from "next";
import { metadatos } from "@/lib/seo";
import { Html, PageHero } from "@/components/Blocks";
import { getPoliticaDatos } from "@/lib/cms";
import { fechaLarga } from "@/lib/format";

export const revalidate = 600;
export async function generateMetadata(): Promise<Metadata> {
  return metadatos({ seo: (await getPoliticaDatos()).seo, ruta: "/politica-de-datos" });
}

export default async function PoliticaDatosPage() {
  const d = await getPoliticaDatos();
  return (
    <>
      <PageHero migas={[{ title: "Política de datos" }]} eyebrow={d.hero.eyebrow} titulo={d.hero.titulo} texto={d.hero.texto} />
      <section className="section tight">
        <div className="wrap legal">
          {d.actualizado ? <p className="legal-fecha">Última actualización: {fechaLarga(d.actualizado)}</p> : null}
          <Html html={d.contenido} className="rich" />
        </div>
      </section>
    </>
  );
}
