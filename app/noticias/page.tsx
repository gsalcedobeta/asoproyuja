import type { Metadata } from "next";
import { ListadoNoticias } from "@/components/ListadoNoticias";

export const revalidate = 600;
export const metadata: Metadata = {
  title: "Noticias",
  description: "Historias y novedades del trabajo de Asoproyuja con la niñez, las familias y las comunidades.",
};

export default function NoticiasPage() {
  return <ListadoNoticias pagina={1} />;
}
