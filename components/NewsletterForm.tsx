"use client";

import { useState, type FormEvent } from "react";
import { evento } from "@/components/Analytics";
import type { Inicio } from "@/lib/types";

type Estado = "idle" | "enviando" | "ok" | "error";

/** Formulario del panel Newsletter: guarda el correo en WordPress (Suscriptores). */
export function NewsletterForm({ d }: { d: Inicio["newsletter"] }) {
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const datos = Object.fromEntries(new FormData(form).entries());
    setEstado("enviando");
    setError("");
    try {
      const res = await fetch("/api/suscripcion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(json.error || "No fue posible registrar tu correo.");
      evento("sign_up", { formulario: "newsletter" });
      form.reset();
      setEstado("ok");
    } catch (err) {
      setEstado("error");
      setError(err instanceof Error ? err.message : "No fue posible registrar tu correo.");
    }
  }

  return (
    <>
      <form className="news-form" onSubmit={onSubmit}>
        {/* campo trampa para bots */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
        <input type="email" name="correo" placeholder={d.placeholder} required maxLength={120} aria-label="Correo electrónico" />
        <button type="submit" disabled={estado === "enviando"}>
          {estado === "ok" ? d.mensaje_exito : estado === "enviando" ? "Enviando…" : d.boton}
        </button>
      </form>
      <p className="news-note" role={estado === "error" ? "alert" : undefined}>
        {estado === "error" ? error : d.nota}
      </p>
    </>
  );
}
