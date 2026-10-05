import type { Metadata } from "next";
import { Html, PageHero } from "@/components/Blocks";
import { getPoliticaDatos } from "@/lib/cms";
import { fechaLarga } from "@/lib/format";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Política de tratamiento de datos",
  description: "Política de tratamiento de datos personales de Asoproyuja (Ley 1581 de 2012).",
};

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
