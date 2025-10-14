"use client";
import { forwardRef, useId } from "react";
import styles from "./field.module.css";

const Textarea = forwardRef(function Textarea(
  {
    label,
    id,
    name,
    required = false,
    rows = 6,
    help,
    error,
    className = "",
    ...props
  },
  ref
) {
  const genId = useId();
  const areaId = id || `${name || "textarea"}-${genId}`;
  const helpId = help ? `${areaId}-help` : undefined;
  const errId = error ? `${areaId}-error` : undefined;

  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label htmlFor={areaId} className="sr-only">
          {label}{" "}
          {required && (
            <span aria-hidden="true" className={styles.req}>
              *
            </span>
          )}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        name={name}
        rows={rows}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errId : help ? helpId : undefined}
        className={`h-[94px] text-[24px] md:text-[34px] leading-[34px] md:leading-[44px] py-[20px] border-b overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${styles.textarea} ${error ? styles.inputError : ""}`}
        {...props}
      />
      {help && !error && (
        <div id={helpId} className={styles.help}>
          {help}
        </div>
      )}
      {error && (
        <div id={errId} className={styles.error}>
          {error}
        </div>
      )}
    </div>
  );
});

export default Textarea;
