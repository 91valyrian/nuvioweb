"use client";
import styles from "./field.module.css";
import { useState } from "react";

export default function Checkbox({
  label,
  name,
  value,
  defaultChecked = false,
  className,
}) {
  const [checked, setChecked] = useState(defaultChecked);
  const id = `${name}-${value}`;
  return (
    <label
      htmlFor={id}
      className={`${styles.checkboxRow} ${checked ? "on bg-main border-main" : ""} ${className || ""} text-[32px] md:text-[24px] border border-1 rounded-[10px] py-[20px] px-[15px] justify-center cursor-pointer`}
    >
      <input
        id={id}
        type="checkbox"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        onChange={(e) => setChecked(e.target.checked)}
        className="sr-only"
      />
      <span>{label}</span>
    </label>
  );
}
