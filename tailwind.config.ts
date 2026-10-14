import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#eefbfb",
          100: "#d2f4f4",
          300: "#7ee0df",
          500: "#1aa9a8",
          600: "#138685",
          700: "#0f6b6a",
          900: "#0a4443",
        },
        coral: {
          50: "#fff3ed",
          100: "#ffe2d1",
          300: "#ffad80",
          500: "#ff6b35",
          600: "#e2531f",
          700: "#b8411a",
        },
        sand: {
          50: "#fdfbf6",
          100: "#f7f1e6",
          200: "#efe4cf",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
