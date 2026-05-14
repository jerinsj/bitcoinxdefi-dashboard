import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "outline";
};

export function Button({
  className = "",
  variant = "default",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-slate-400 disabled:pointer-events-none disabled:opacity-50";
  const variants = {
    default: "bg-slate-950 text-white hover:bg-slate-800",
    secondary: "bg-slate-100 text-slate-950 hover:bg-slate-200",
    outline: "border border-slate-200 bg-white text-slate-950 hover:bg-slate-50"
  };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
