"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SmartLink } from "@/components/SmartLink";
import { optimizada } from "@/lib/imagen";
import type { Slide } from "@/lib/types";

// Marco, giro y cintas de cada foto se repiten en ciclo, igual que en el diseño aprobado.
const MARCOS = [
  { giro: "rotate(-3deg)", cintas: ["corner-tr", "corner-bl rev"] },
  { giro: "rotate(2deg)", cintas: ["corner-tl", "corner-br rev"] },
  { giro: "rotate(-2deg)", cintas: ["bl", "corner-tr rev"] },
];

/** Títulos largos usan un tamaño menor para no pasar de cuatro líneas. */
const TITULO_LARGO = 55;

export function Slider({ slides }: { slides: Slide[] }) {
  const [actual, setActual] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const total = slides.length;

  const ir = useCallback((i: number) => setActual(((i % total) + total) % total), [total]);

  const detener = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const iniciar = useCallback(() => {
    detener();
    if (total < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    timer.current = setInterval(() => setActual((c) => (c + 1) % total), 6000);
  }, [detener, total]);

  useEffect(() => {
    iniciar();
    return detener;
  }, [iniciar, detener]);

  return (
    <>
      <div className="slider" onMouseEnter={detener} onMouseLeave={iniciar}>
        {slides.map((s, i) => {
          const m = MARCOS[i % MARCOS.length];
          return (
            <div key={i} className={`slide${i === actual ? " active" : ""}`} data-index={i}>
              <div className="slide-copy">
                <span className="eyebrow">
                  <span className="eyebrow-dot"></span>
                  {s.eyebrow}
                </span>
                <h1 className={s.titulo.length > TITULO_LARGO ? "h1-long" : undefined}>{s.titulo}</h1>
                <p>{s.texto}</p>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  {(s.botones || [])
                    .filter((b) => b.boton?.url)
                    .map((b, k) => (
                      <SmartLink
                        key={k}
                        className={`btn ${b.estilo === "contorno" ? "btn-outline" : "btn-primary"}`}
                        href={b.boton.url}
                        newTab={b.boton.target === "_blank" ? true : undefined}
                      >
                        {b.boton.title}
                      </SmartLink>
                    ))}
                </div>
              </div>
              <div className="slide-media" style={{ aspectRatio: "auto" }}>
                <div className="hero-photo-frame" style={{ transform: m.giro }}>
                  <div className="hero-photo-dash"></div>
                  <div className={`hero-tape ${m.cintas[0]}`}></div>
                  <div className={`hero-tape ${m.cintas[1]}`}></div>
                  <div className="hero-photo-img">
                    <img
                      {...optimizada(s.imagen, "(max-width: 900px) 290px, 500px", 1200)}
                      alt={s.imagen_alt}
                      decoding="async"
                      {...(i === 0 ? { fetchPriority: "high" as const } : {})}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="slider-controls">
        <button className="slider-arrow" id="prevBtn" aria-label="Anterior" onClick={() => ir(actual - 1)}>
          ‹
        </button>
        <div className="slider-dots" id="dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`dot${i === actual ? " active" : ""}`}
              aria-label={`Ir a diapositiva ${i + 1}`}
              onClick={() => ir(i)}
            ></button>
          ))}
        </div>
        <button className="slider-arrow" id="nextBtn" aria-label="Siguiente" onClick={() => ir(actual + 1)}>
          ›
        </button>
      </div>
    </>
  );
}
