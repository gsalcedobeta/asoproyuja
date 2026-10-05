// Menús por defecto. Se administran en WordPress (Apariencia → Menús, ubicaciones
// "Menú principal", "Pie: Navegación" y "Pie: Enlaces"); estos valores se usan mientras
// WordPress no tenga menús asignados o no responda.

export type NavItem = { title: string; url: string; target?: string; children?: NavItem[] };

/** En escritorio, la primera mitad va a la izquierda del logo y el resto a la derecha. */
export const menuPrincipal: NavItem[] = [
  { title: "Inicio", url: "/" },
  { title: "Nosotros", url: "/quienes-somos" },
  { title: "Noticias", url: "/noticias" },
  { title: "Contacto", url: "/contacto" },
];

export const menuFooter: NavItem[] = [
  { title: "Inicio", url: "/" },
  { title: "Quiénes somos", url: "/quienes-somos" },
  { title: "Noticias", url: "/noticias" },
  { title: "Contacto", url: "/contacto" },
];

export const menuEnlaces: NavItem[] = [
  { title: "Preguntas frecuentes", url: "/preguntas-frecuentes" },
  { title: "Cómo ayudar", url: "/como-ayudar" },
  { title: "Política de datos", url: "/politica-de-datos" },
];

/** Divide el menú principal en dos columnas alrededor del logo (la izquierda lleva la mitad redondeada hacia arriba). */
export function dividirMenu(items: NavItem[]): [NavItem[], NavItem[]] {
  const mitad = Math.ceil(items.length / 2);
  return [items.slice(0, mitad), items.slice(mitad)];
}

export function isActive(item: NavItem, pathname: string): boolean {
  if (!/^\//.test(item.url)) return false;
  return item.url === "/" ? pathname === "/" : pathname === item.url || pathname.startsWith(item.url + "/");
}
