"use client";

import { dispararEventoMeta } from "@/components/MetaPixel";

export default function BotaoCheckout({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => dispararEventoMeta("InitiateCheckout")}
    >
      {children}
    </a>
  );
}
