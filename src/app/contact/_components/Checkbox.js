"use client";
import styles from "./field.module.css";

export default function Checkbox({ label, name, value, defaultChecked=false }) {
  const id = `${name}-${value}`;
  return (
    <label htmlFor={id} className={styles.checkboxRow}>
      <input id={id} type="checkbox" name={name} value={value} defaultChecked={defaultChecked} />
      <span>{label}</span>
    </label>
  );
}