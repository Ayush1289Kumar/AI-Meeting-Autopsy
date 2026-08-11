import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#0f1117",
        card: "#1e1f2e",
        "card-hover": "#252636",
        border: "#2a2b3d",
        muted: "#8b8d9e",
        brand: "#4f7cff",
        success: "#34d399",
        warning: "#fbbf24",
        danger: "#ef4444",
        ai: "#a78bfa",
        orange: "#fb923c",
      },
      borderRadius: {
        card: "12px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
