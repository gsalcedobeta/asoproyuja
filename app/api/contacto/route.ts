// Recibe el formulario de contacto y lo guarda en WordPress (plugin "Asoproyuja Headless"
// → tipo de contenido privado "Mensajes"), que envía el correo de aviso a Asoproyuja.
import { NextResponse } from "next/server";
import { claveEntorno, WP_URL, wpEnabled } from "@/lib/wp";

const CAMPOS = ["nombre", "correo", "telefono", "asunto", "mensaje", "autorizacion"] as const;
const CORREO = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  // Bot: el campo trampa viene lleno → respondemos OK sin guardar.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const datos: Record<string, string> = {};
  for (const k of CAMPOS) datos[k] = String(body[k] ?? "").trim().slice(0, k === "mensaje" ? 5000 : 200);

  if (!datos.nombre || !datos.mensaje) {
    return NextResponse.json({ error: "Escribe tu nombre y el mensaje." }, { status: 422 });
  }
  if (!CORREO.test(datos.correo)) {
    return NextResponse.json({ error: "El correo electrónico no es válido." }, { status: 422 });
  }
  if (datos.autorizacion !== "si") {
    return NextResponse.json({ error: "Debes autorizar el tratamiento de tus datos personales." }, { status: 422 });
  }

  const secret = claveEntorno("FORM_SECRET");
  if (!wpEnabled || !secret) {
    return NextResponse.json({ error: "El formulario en línea aún no está habilitado." }, { status: 503 });
  }

  try {
    const res = await fetch(`${WP_URL}/wp-json/asoproyuja/v1/mensajes`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Asoproyuja-Secret": secret },
      body: JSON.stringify(datos),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => ({}))) as { message?: string };
    if (!res.ok) throw new Error(json.message || `WordPress respondió ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error guardando mensaje en WordPress:", err);
    return NextResponse.json({ error: "No fue posible enviar tu mensaje en este momento." }, { status: 502 });
  }
}
