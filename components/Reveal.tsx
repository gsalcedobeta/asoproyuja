"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Animación de entrada del diseño: agrega .in-view a cada .reveal cuando aparece en pantalla. */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    document.querySelectorAll(".reveal:not(.in-view)").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
