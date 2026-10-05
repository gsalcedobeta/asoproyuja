const fmt = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

/** "2026-07-24" → "24 de julio de 2026" */
export function fechaLarga(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? iso : fmt.format(d);
}

export const isExternal = (url: string) => /^(https?:)?\/\//.test(url) || url.startsWith("mailto:") || url.startsWith("tel:");
