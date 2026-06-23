import type { ReactNode } from "react";
import "./card.component.css";

export function CardComponent({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card ${className.includes("p-0") ? "" : "card-padded"} ${className}`}>
      {children}
    </div>
  );
}
