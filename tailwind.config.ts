import type { Config } from "tailwindcss";
import path from "path";

const config: Config = {
  content: [
    path.join(__dirname, "src/**/*.{js,ts,jsx,tsx,mdx}"),
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        viettel: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          500: '#EE0033',
          600: '#D80027',
          700: '#BA0024',
          800: '#94001D',
          900: '#730017',
          red: '#EE0033',
          darkRed: '#BA0024',
        },
        darkBg: "#0B111E",
        darkCard: "#162032",
        darkBorder: "#23324A",
        primaryBlue: "#1E60E2",
        primaryLight: "#3B82F6",
        primaryDark: "#1446A0",
        terminalBg: "#05080F",
        terminalBorder: "#1E293B",
      },
    },
  },
  plugins: [],
};
export default config;

