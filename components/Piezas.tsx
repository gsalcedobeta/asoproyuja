// Piezas de rompecabezas decorativas del diseño aprobado (posiciones exactas del preview).
// Generado a partir de entregables/asoproyuja-home-propuesta.html; no editar a mano.
import type { CSSProperties } from "react";

const RUTA =
  "M0,0 L35,0 C35,-12 42,-18 50,-18 C58,-18 65,-12 65,0 L100,0 L100,35 C112,35 118,42 118,50 C118,58 112,65 100,65 L100,100 L65,100 C65,88 58,82 50,82 C42,82 35,88 35,100 L0,100 L0,65 C18,65 18,58 18,50 C18,42 18,35 0,35 Z";

type Pieza = { s: number; c: string; w: number; o: number; r: number; pos: CSSProperties; cls?: string };

const GRUPOS = {
  "bienvenida": [
    {
      "s": 110,
      "c": "#3F8557",
      "w": 5.5,
      "o": 0.42,
      "r": 14,
      "pos": {
        "top": "0px",
        "right": "4%"
      },
      "cls": "bien-piece"
    },
    {
      "s": 86,
      "c": "#F2B035",
      "w": 6.5,
      "o": 0.4,
      "r": -34,
      "pos": {
        "top": "190px",
        "right": "1%"
      },
      "cls": "bien-piece"
    },
    {
      "s": 96,
      "c": "#C1502E",
      "w": 5.5,
      "o": 0.4,
      "r": 52,
      "pos": {
        "top": "360px",
        "right": "7%"
      },
      "cls": "bien-piece"
    }
  ],
  "quick": [
    {
      "s": 42,
      "c": "#F2B035",
      "w": 6.0,
      "o": 0.4,
      "r": -20,
      "pos": {
        "bottom": "20px",
        "left": "6%"
      }
    },
    {
      "s": 36,
      "c": "#3F8557",
      "w": 6.0,
      "o": 0.38,
      "r": 30,
      "pos": {
        "bottom": "30px",
        "left": "47%"
      }
    },
    {
      "s": 44,
      "c": "#C1502E",
      "w": 5.5,
      "o": 0.4,
      "r": -45,
      "pos": {
        "bottom": "16px",
        "left": "88%"
      }
    }
  ],
  "noticias": [
    {
      "s": 48,
      "c": "#F2B035",
      "w": 5.5,
      "o": 0.4,
      "r": 22,
      "pos": {
        "top": "20px",
        "left": "5%"
      }
    },
    {
      "s": 36,
      "c": "#3F8557",
      "w": 6.0,
      "o": 0.38,
      "r": -30,
      "pos": {
        "top": "34px",
        "left": "32%"
      }
    },
    {
      "s": 52,
      "c": "#C1502E",
      "w": 5.5,
      "o": 0.4,
      "r": 18,
      "pos": {
        "top": "14px",
        "left": "60%"
      }
    },
    {
      "s": 40,
      "c": "#F2B035",
      "w": 6.0,
      "o": 0.4,
      "r": -48,
      "pos": {
        "top": "30px",
        "left": "88%"
      }
    },
    {
      "s": 44,
      "c": "#3F8557",
      "w": 5.5,
      "o": 0.4,
      "r": -18,
      "pos": {
        "bottom": "24px",
        "left": "10%"
      }
    },
    {
      "s": 38,
      "c": "#C1502E",
      "w": 6.0,
      "o": 0.38,
      "r": 36,
      "pos": {
        "bottom": "32px",
        "left": "46%"
      }
    },
    {
      "s": 46,
      "c": "#3F8557",
      "w": 5.5,
      "o": 0.4,
      "r": 8,
      "pos": {
        "bottom": "20px",
        "left": "80%"
      }
    },
    {
      "s": 30,
      "c": "#3F8557",
      "w": 6.5,
      "o": 0.36,
      "r": -10,
      "pos": {
        "top": "8px",
        "left": "2%"
      }
    },
    {
      "s": 26,
      "c": "#F2B035",
      "w": 6.5,
      "o": 0.34,
      "r": 40,
      "pos": {
        "top": "44px",
        "left": "16%"
      }
    },
    {
      "s": 34,
      "c": "#C1502E",
      "w": 6.0,
      "o": 0.36,
      "r": -25,
      "pos": {
        "top": "6px",
        "left": "44%"
      }
    },
    {
      "s": 28,
      "c": "#3F8557",
      "w": 6.5,
      "o": 0.34,
      "r": 15,
      "pos": {
        "top": "40px",
        "left": "74%"
      }
    },
    {
      "s": 24,
      "c": "#F2B035",
      "w": 6.5,
      "o": 0.34,
      "r": -40,
      "pos": {
        "top": "18px",
        "left": "96%"
      }
    },
    {
      "s": 30,
      "c": "#F2B035",
      "w": 6.5,
      "o": 0.36,
      "r": 25,
      "pos": {
        "bottom": "10px",
        "left": "24%"
      }
    },
    {
      "s": 24,
      "c": "#3F8557",
      "w": 6.5,
      "o": 0.34,
      "r": -32,
      "pos": {
        "bottom": "40px",
        "left": "36%"
      }
    },
    {
      "s": 32,
      "c": "#C1502E",
      "w": 6.0,
      "o": 0.36,
      "r": 10,
      "pos": {
        "bottom": "6px",
        "left": "62%"
      }
    },
    {
      "s": 26,
      "c": "#F2B035",
      "w": 6.5,
      "o": 0.34,
      "r": -18,
      "pos": {
        "bottom": "44px",
        "left": "70%"
      }
    },
    {
      "s": 28,
      "c": "#3F8557",
      "w": 6.5,
      "o": 0.34,
      "r": 38,
      "pos": {
        "bottom": "14px",
        "left": "94%"
      }
    }
  ],
  "duo": [
    {
      "s": 90,
      "c": "#3F8557",
      "w": 5.5,
      "o": 0.38,
      "r": -16,
      "pos": {
        "top": "20px",
        "left": "2%"
      }
    },
    {
      "s": 70,
      "c": "#F2B035",
      "w": 6.5,
      "o": 0.36,
      "r": 30,
      "pos": {
        "top": "230px",
        "left": "0.5%"
      }
    },
    {
      "s": 80,
      "c": "#C1502E",
      "w": 5.5,
      "o": 0.38,
      "r": 48,
      "pos": {
        "top": "60px",
        "right": "2%"
      }
    },
    {
      "s": 60,
      "c": "#3F8557",
      "w": 6.0,
      "o": 0.36,
      "r": -30,
      "pos": {
        "bottom": "20px",
        "left": "20%"
      }
    },
    {
      "s": 72,
      "c": "#F2B035",
      "w": 6.0,
      "o": 0.36,
      "r": 20,
      "pos": {
        "bottom": "34px",
        "left": "55%"
      }
    }
  ]
} satisfies Record<string, Pieza[]>;

export type GrupoPiezas = keyof typeof GRUPOS;

export function Pieza({ p }: { p: Pieza }) {
  return (
    <svg
      className={p.cls}
      style={{ position: "absolute", ...p.pos, pointerEvents: "none", zIndex: 0 }}
      width={p.s}
      height={p.s}
      viewBox="-20 -20 140 140"
      fill="none"
    >
      <path d={RUTA} stroke={p.c} strokeWidth={p.w} opacity={p.o} transform={`rotate(${p.r} 50 50)`} />
    </svg>
  );
}

/** Piezas de un grupo (bienvenida, quick, noticias, duo). Van como primeros hijos de su sección. */
export function Piezas({ grupo }: { grupo: GrupoPiezas }) {
  return (
    <>
      {(GRUPOS[grupo] as Pieza[]).map((p, i) => (
        <Pieza key={i} p={p} />
      ))}
    </>
  );
}
