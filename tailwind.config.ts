import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
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
