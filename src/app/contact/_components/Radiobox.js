"use client";
import styles from "./field.module.css";

export default function Radiobox({
  label,
  name,
  value,
  defaultChecked = false,
  className,
}) {
  const id = `${name}-${value}`;
  return (
    <label
      htmlFor={id}
      className={`${styles.checkboxRow} ${className || ""} cursor-pointer`}
    >
      {/* 라디오: peer로 상태 전달 */}
      <input
        id={id}
        type="radio"
        name={name}
        value={value}
        defaultChecked={defaultChecked}
        className="peer sr-only"
      />

      {/* 시각 블록: peer-checked로 스타일 토글 */}
      <span
        className={[
          "block w-full text-center",
          "text-[32px] md:text-[24px]",
          "rounded-[10px] border border-1",
          "py-[20px] px-[15px] justify-center",
          "transition-colors",
          // 체크 상태 스타일
          "peer-checked:bg-main peer-checked:border-main",
        ].join(" ")}
      >
        {label}
      </span>
    </label>
  );
}
