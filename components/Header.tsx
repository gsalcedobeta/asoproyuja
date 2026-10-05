"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { SmartLink } from "@/components/SmartLink";
import { LOGO_SVG } from "@/lib/logo";
import { dividirMenu, isActive, type NavItem } from "@/lib/nav";

function Item({ item, pathname }: { item: NavItem; pathname: string }) {
  return (
    <li>
      <SmartLink
        href={item.url}
        newTab={item.target === "_blank" ? true : undefined}
        aria-current={isActive(item, pathname) ? "page" : undefined}
      >
        {item.title}
      </SmartLink>
    </li>
  );
}

/** Encabezado del diseño: menú partido alrededor del logo y panel lateral en móvil. */
export function Header({ menu }: { menu: NavItem[] }) {
  const pathname = usePathname() || "/";
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [izquierda, derecha] = dividirMenu(menu);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cierra el menú móvil al navegar
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <header id="siteHeader" className={scrolled ? "scrolled" : undefined}>
        <div className="nav-row">
          <div className="nav-side nav-left">
            <ul>
              {izquierda.map((it) => (
                <Item key={it.url + it.title} item={it} pathname={pathname} />
              ))}
            </ul>
          </div>
          <Link className="brand-center" href="/" aria-label="Asoproyuja">
            <span className="cloud-badge"></span>
            <span className="logo-mark" dangerouslySetInnerHTML={{ __html: LOGO_SVG }} />
          </Link>
          <div className="nav-side nav-right">
            <ul>
              {derecha.map((it) => (
                <Item key={it.url + it.title} item={it} pathname={pathname} />
              ))}
            </ul>
          </div>
          <button className="menu-toggle" id="menuToggle" aria-label="Abrir menú" onClick={() => setOpen(true)}>
            ☰
          </button>
        </div>
      </header>

      <div className={`mobile-nav-backdrop${open ? " open" : ""}`} id="mobileNavBackdrop" onClick={() => setOpen(false)}></div>
      <nav className={`mobile-nav${open ? " open" : ""}`} id="mobileNav" aria-label="Menú móvil">
        <button className="mobile-nav-close" id="mobileNavClose" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
          ✕
        </button>
        <ul onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(false)}>
          {menu.map((it) => (
            <Item key={it.url + it.title} item={it} pathname={pathname} />
          ))}
        </ul>
      </nav>
    </>
  );
}
