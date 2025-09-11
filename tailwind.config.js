/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class", // 미디어 쿼리 대신 클래스 기반 다크 모드
  theme: {
    extend: {},
  },
  plugins: [],
}