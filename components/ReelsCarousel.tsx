"use client";

import { useEffect, useRef } from "react";
import { Icon } from "@/components/Icon";
import type { Reel } from "@/lib/types";

function ReelCard({ r, hidden }: { r: Reel; hidden?: boolean }) {
  return (
    <a
      href={r.url}
      target="_blank"
      rel="noopener"
      className="reel-card"
      title={r.titulo}
      {...(hidden ? { "aria-hidden": true, tabIndex: -1 } : { "aria-label": `Ver reel en Instagram: ${r.titulo}` })}
    >
      <img className="reel-cover" src={r.portada} alt="" />
      <span className="reel-ig-badge">
        <Icon name="instagram" size={14} />
      </span>
      <span className="reel-play">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <polygon points="6 3 20 12 6 21 6 3" />
        </svg>
      </span>
      <span className="reel-caption">{r.titulo}</span>
    </a>
  );
}

/** Carrusel infinito de reels: la lista se duplica y al pasar del primer set se regresa sin animación. */
export function ReelsCarousel({ items }: { items: Reel[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const carousel = carouselRef.current;
    const prevBtn = prevRef.current;
    const nextBtn = nextRef.current;
    if (!carousel || !prevBtn || !nextBtn) return;

    const cards = Array.from(carousel.querySelectorAll<HTMLElement>(".reel-card"));
    const realCount = cards.length / 2;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let timer: ReturnType<typeof setInterval> | undefined;
    let scrollTimer: ReturnType<typeof setTimeout> | undefined;
    let setWidth = 0;

    const gap = () => parseFloat(getComputedStyle(carousel).columnGap) || 20;
    const cardStep = () => (cards[0] ? cards[0].getBoundingClientRect().width + gap() : 220);
    const computeSetWidth = () => {
      setWidth = cards[realCount] ? cards[realCount].offsetLeft - cards[0].offsetLeft : 0;
    };
    const normalize = () => {
      if (!setWidth) return;
      if (carousel.scrollLeft >= setWidth) carousel.scrollLeft -= setWidth;
      else if (carousel.scrollLeft < 0) carousel.scrollLeft += setWidth;
    };
    const next = () => carousel.scrollBy({ left: cardStep(), behavior: "smooth" });
    const prev = () => {
      if (carousel.scrollLeft < cardStep()) carousel.scrollLeft += setWidth;
      carousel.scrollBy({ left: -cardStep(), behavior: "smooth" });
    };
    const start = () => {
      clearInterval(timer);
      if (!reduced) timer = setInterval(next, 3800);
    };
    const stop = () => clearInterval(timer);
    const onScroll = () => {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(normalize, 150);
    };
    const onNext = () => {
      next();
      start();
    };
    const onPrev = () => {
      prev();
      start();
    };

    computeSetWidth();
    window.addEventListener("resize", computeSetWidth);
    carousel.addEventListener("scroll", onScroll);
    nextBtn.addEventListener("click", onNext);
    prevBtn.addEventListener("click", onPrev);
    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("touchstart", stop, { passive: true });
    carousel.addEventListener("touchend", start);
    start();

    return () => {
      stop();
      clearTimeout(scrollTimer);
      window.removeEventListener("resize", computeSetWidth);
      carousel.removeEventListener("scroll", onScroll);
      nextBtn.removeEventListener("click", onNext);
      prevBtn.removeEventListener("click", onPrev);
      carousel.removeEventListener("mouseenter", stop);
      carousel.removeEventListener("mouseleave", start);
      carousel.removeEventListener("touchstart", stop);
      carousel.removeEventListener("touchend", start);
    };
  }, [items]);

  return (
    <div className="reels-carousel-wrap">
      <button className="reels-arrow prev" ref={prevRef} aria-label="Reel anterior">
        ‹
      </button>
      <div className="reels-carousel" ref={carouselRef}>
        {items.map((r, i) => (
          <ReelCard key={`a${i}`} r={r} />
        ))}
        {/* duplicado para el loop infinito */}
        {items.map((r, i) => (
          <ReelCard key={`b${i}`} r={r} hidden />
        ))}
      </div>
      <button className="reels-arrow next" ref={nextRef} aria-label="Siguiente reel">
        ›
      </button>
    </div>
  );
}
