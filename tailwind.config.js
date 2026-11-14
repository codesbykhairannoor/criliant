/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        criliant: {
          // Brand Primary (Electric Cobalt)
          primary: "#2563EB",
          "primary-hover": "#1D4ED8",
          "primary-light": "#EFF6FF",
          // Accent Spark
          spark: "#38BDF8",
          "spark-dark": "#0284C7",
          // Dark Foundation (Obsidian Navy)
          obsidian: "#090D16",
          surface: {
            dark: "#0F172A",
            darker: "#0B0F19",
            card: "#131D31",
            light: "#FFFFFF",
            canvas: "#F8FAFC",
          },
          border: {
            dark: "#1E293B",
            darker: "#152033",
            light: "#E2E8F0",
            subtle: "#EFF3F4",
          },
        },
      },
      letterSpacing: {
        tightest: "-0.03em",
        tighter: "-0.02em",
        tight: "-0.012em",
      },
    },
  },
  plugins: [],
};
