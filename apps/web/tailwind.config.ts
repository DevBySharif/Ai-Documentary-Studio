import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        surface: {
          50: "#f8f9fa",
          100: "#1e1e2e",
          200: "#2a2a3d",
          300: "#363650",
          400: "#42425e",
          500: "#52527a",
        },
        accent: {
          DEFAULT: "#6366f1",
          hover: "#5457e5",
          light: "#818cf8",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
    },
  },
  plugins: [],
} satisfies Config;
