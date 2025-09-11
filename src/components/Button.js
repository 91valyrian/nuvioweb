"use client";
import Link from "next/link";
import clsx from "clsx";

export default function Button({
  href = "#",
  children,
  variant = "primary",
  size = "md",
  className,
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center gap-[10px] font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-full";

  const variants = {
    primary:
      "bg-indigo-600 text-neutral-100 hover:bg-indigo-700 focus:ring-indigo-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400",
    outlineDark:
      "border-2 border-neutral-100 text-neutral-100 bg-neutral-900 transition-all duration-500 hover:border-neutral-900 ",
  };

  const sizes = {
    xs: "px-[20px] py-[8px] text-[24px] md:text-[14px] font-medium",
    sm: "px-[24px] py-[10px] text-[26px] md:text-[16px] font-medium",
    md: "px-[28px] py-[12px] text-[26px] md:text-[16px] font-medium",
    lg: "px-[36px] py-[14px] text-[28px] md:text-[20px] font-medium",
  };

  return (
    <Link
      href={href}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}