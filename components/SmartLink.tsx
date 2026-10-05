import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { isExternal } from "@/lib/format";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
  newTab?: boolean;
  "aria-label"?: string;
  "aria-current"?: "page";
};

/** <Link> para rutas internas, <a target=_blank> para externas. */
export function SmartLink({ href, newTab, children, ...rest }: Props) {
  if (isExternal(href) || newTab) {
    const blank = newTab ?? /^https?:/.test(href);
    return (
      <a href={href} {...(blank ? { target: "_blank", rel: "noopener" } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...rest}>
      {children}
    </Link>
  );
}
