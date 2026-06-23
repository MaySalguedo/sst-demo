import "./spinner.component.css";

export function SpinnerComponent({ className = "" }: { className?: string }) {
  return <div className={`spinner ${className}`} />;
}
