// WordPress llama a este endpoint al guardar contenido (plugin "Asoproyuja Headless")
// para que los cambios se vean en el sitio al instante, sin esperar la regeneración automática.
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { claveEntorno } from "@/lib/wp";

export async function POST(req: Request) {
  const secret = claveEntorno("REVALIDATE_SECRET");
  const recibido = req.headers.get("x-revalidate-secret") ?? new URL(req.url).searchParams.get("secret");
  if (!secret || recibido !== secret) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  // Todo el sitio depende de pocos datos; se revalida completo.
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidado: true, fecha: new Date().toISOString() });
}
