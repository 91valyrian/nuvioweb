"use client";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  variant = "default", // "default" | "success" | "error"
  size = "md", // "sm" | "md" | "lg"
  ariaLabelledby,
  className = "",
}) {
  if (!open) return null;

  const sizeClass =
    size === "lg"
      ? "w-[min(920px,92vw)]"
      : size === "sm"
        ? "w-[428px]"
        : "w-[628px]".replace(" ", "");

  const iconWrapClass =
    variant === "success"
      ? "bg-main/20 text-main"
      : variant === "error"
        ? "bg-rose-600/20 text-rose-400"
        : "bg-white/10 text-white/80";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledby || "modal-title"}
      className={`fixed inset-0 z-[1000] flex items-center justify-center ${className}`}
      onClick={(e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Dialog */}
      <div
        className={`relative z-[1] ${sizeClass} bg-neutral-950 text-white border border-white/10 rounded-2xl shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-6 md:px-8 py-5 border-b border-white/10">
          {/* Variant Icon (optional) */}
          <div
            className={`grid place-items-center w-10 h-10 rounded-[9999px] w-[70px] h-[70px] md:w-[50px] md:h-[50px] ${iconWrapClass}`}
            aria-hidden="true"
          >
            {variant === "success" && (
              <svg
                viewBox="0 0 20 20"
                className="w-[44px] h-[44px] md:w-[24px] md:h-[24px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 10l4 4 8-8" />
              </svg>
            )}
            {variant === "error" && (
              <svg
                viewBox="0 0 20 20"
                className="w-[44px] h-[44px] md:w-[24px] md:h-[24px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6l8 8M14 6l-8 8" />
              </svg>
            )}
            {variant === "default" && (
              <svg
                viewBox="0 0 20 20"
                className="w-[44px] h-[44px] md:w-[24px] md:h-[24px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="10" cy="10" r="6" />
              </svg>
            )}
          </div>

          <h4
            id={ariaLabelledby || "modal-title"}
            className="text-[36px] md:text-[24px] font-bold"
          >
            {title}
          </h4>

          <button
            type="button"
            onClick={onClose}
            className="ml-auto text-white/80 hover:text-white text-[50px] md:text-[34px] leading-none cursor-pointer"
            aria-label="닫기"
          >
            ×
          </button>
        </div>

        {/* Body */}
        <div className="px-6 md:px-8 py-6 text-white/90 text-[30px] md:text-[18px] max-h-[70vh] overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="flex justify-end gap-2 px-6 md:px-8 py-4 border-t border-white/10">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
