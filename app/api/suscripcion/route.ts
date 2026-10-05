// Recibe el correo del Newsletter (Inicio) y lo guarda en WordPress → "Suscriptores".
import { NextResponse } from "next/server";
import { claveEntorno, WP_URL, wpEnabled } from "@/lib/wp";

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

  const correo = String(body.correo ?? "").trim().toLowerCase().slice(0, 120);
  if (!CORREO.test(correo)) {
    return NextResponse.json({ error: "Escribe un correo electrónico válido." }, { status: 422 });
  }

  const secret = claveEntorno("FORM_SECRET");
  if (!wpEnabled || !secret) {
    return NextResponse.json({ error: "La suscripción aún no está habilitada." }, { status: 503 });
  }

  try {
    const res = await fetch(`${WP_URL}/wp-json/asoproyuja/v1/suscriptores`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Asoproyuja-Secret": secret },
      body: JSON.stringify({ correo }),
      cache: "no-store",
    });
    const json = (await res.json().catch(() => ({}))) as { message?: string };
    if (!res.ok) throw new Error(json.message || `WordPress respondió ${res.status}`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error guardando suscriptor en WordPress:", err);
    return NextResponse.json({ error: "No fue posible registrar tu correo en este momento." }, { status: 502 });
  }
}
