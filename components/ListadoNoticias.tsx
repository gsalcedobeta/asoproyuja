import { CtaPanel, NoticiaCard, PageHero, Paginacion } from "@/components/Blocks";
import { Piezas } from "@/components/Piezas";
import { getNoticiasPagina, getPaginaNoticias } from "@/lib/cms";

/** Listado paginado de noticias (/noticias y /noticias/pagina/N). */
export async function ListadoNoticias({ pagina }: { pagina: number }) {
  const [d, p] = await Promise.all([getNoticiasPagina(), getPaginaNoticias(pagina)]);
  const migas = pagina > 1 ? [{ title: "Noticias", url: "/noticias" }, { title: `Página ${pagina}` }] : [{ title: "Noticias" }];
  return (
    <>
      <PageHero migas={migas} eyebrow={d.hero.eyebrow} titulo={d.hero.titulo} texto={d.hero.texto} />
      <section className="section noticias texture">
        <Piezas grupo="noticias" />
        <div className="wrap">
          {p.noticias.length ? (
            <div className="noticias-grid">
              {p.noticias.map((n) => (
                <NoticiaCard key={n.slug} n={n} />
              ))}
            </div>
          ) : (
            <p className="noticias-vacio">{d.mensaje_vacio}</p>
          )}
          <Paginacion pagina={p.pagina} total={p.total} />
        </div>
      </section>
      <CtaPanel cta={d.cta} />
    </>
  );
}
