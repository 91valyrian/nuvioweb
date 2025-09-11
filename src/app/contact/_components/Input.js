"use client";
import { forwardRef, useId } from "react";
import styles from "./field.module.css";

const Input = forwardRef(function Input(
  {
    label,
    id,
    name,
    type = "text",
    required = false,
    help,
    error,
    className = "",
    ...props
  },
  ref
) {
  const genId = useId();
  const inputId = id || `${name || "field"}-${genId}`;
  const helpId = help ? `${inputId}-help` : undefined;
  const errId = error ? `${inputId}-error` : undefined;

  return (
    <div className={`${styles.field} ${className}`}>
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label} {required && <span aria-hidden="true" className={styles.req}>*</span>}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        name={name}
        type={type}
        required={required}
        aria-invalid={!!error}
        aria-describedby={error ? errId : help ? helpId : undefined}
        className={`${styles.input} ${error ? styles.inputError : ""}`}
        {...props}
      />
      {help && !error && (
        <div id={helpId} className={styles.help}>{help}</div>
      )}
      {error && (
        <div id={errId} className={styles.error}>{error}</div>
      )}
    </div>
  );
});

export default Input;