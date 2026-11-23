import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F3FAF0",
          100: "#E4F6DF",
          200: "#C9EDBF",
          300: "#A7DF97",
          400: "#83CF6A",
          500: "#65C240", // Brand Primary Green
          600: "#52A631",
          700: "#3F8226",
          800: "#346721",
          900: "#2B561B",
          950: "#14310B",
        },
        darkText: "#222222",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
