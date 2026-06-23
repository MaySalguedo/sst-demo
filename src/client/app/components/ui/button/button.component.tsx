import type { ButtonHTMLAttributes, ReactNode } from "react";
import "./button.component.css";

const variants = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  danger: "btn-danger",
};

export function ButtonComponent({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: keyof typeof variants;
}) {
  return (
    <button
      className={`btn ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
