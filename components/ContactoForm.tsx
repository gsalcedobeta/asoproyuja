"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import type { Texto } from "@/lib/types";

type Estado = { tipo: "idle" | "enviando" | "ok" | "error"; mensaje?: string };

/** Formulario de contacto: guarda el mensaje en WordPress (Mensajes) y avisa por correo. */
export function ContactoForm({ asuntos, telefono }: { asuntos: Texto[]; telefono: string }) {
  const [estado, setEstado] = useState<Estado>({ tipo: "idle" });

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = Object.fromEntries(new FormData(form).entries());
    setEstado({ tipo: "enviando" });
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "No fue posible enviar tu mensaje.");
      form.reset();
      setEstado({ tipo: "ok", mensaje: "¡Gracias! Recibimos tu mensaje y te responderemos pronto." });
    } catch (err) {
      setEstado({
        tipo: "error",
        mensaje: `${err instanceof Error ? err.message : "Ocurrió un error."}${telefono ? ` También puedes llamarnos al ${telefono}.` : ""}`,
      });
    }
  }

  return (
    <form className="contacto-form" onSubmit={onSubmit}>
      {/* campo trampa para bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden="true" />

      <div className="form-row">
        <div>
          <label htmlFor="nombre">Nombre completo</label>
          <input type="text" id="nombre" name="nombre" placeholder="Escribe tu nombre" required maxLength={120} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="correo">Correo electrónico</label>
          <input type="email" id="correo" name="correo" placeholder="tu@correo.com" required maxLength={120} autoComplete="email" />
        </div>
      </div>

      <div className="form-row">
        <div>
          <label htmlFor="telefono">
            Teléfono <span className="form-opcional">(opcional)</span>
          </label>
          <input type="tel" id="telefono" name="telefono" placeholder="300 000 0000" maxLength={30} autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="asunto">Asunto</label>
          <select id="asunto" name="asunto">
            {asuntos.map((o) => (
              <option key={o.texto}>{o.texto}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="mensaje">Mensaje</label>
        <textarea id="mensaje" name="mensaje" required maxLength={5000} placeholder="Cuéntanos en qué podemos ayudarte"></textarea>
      </div>

      <label className="form-consent">
        <input type="checkbox" name="autorizacion" value="si" required />
        <span>
          Autorizo a ASOPROYUJA el tratamiento de mis datos personales conforme a la{" "}
          <Link href="/politica-de-datos">política de tratamiento de datos</Link> (Ley 1581 de 2012).
        </span>
      </label>

      <button type="submit" className="btn btn-primary" disabled={estado.tipo === "enviando"}>
        {estado.tipo === "enviando" ? "Enviando…" : "Enviar mensaje"}
      </button>

      {estado.mensaje && (
        <p className={`form-status ${estado.tipo}`} role="status">
          {estado.mensaje}
        </p>
      )}
    </form>
  );
}
