import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#050816",
        card: "#080b1c",
        "card-hover": "#0d1430",
        border: "#1b2540",
        muted: "#9aa3c4",
        // primary — electric violet/purple
        brand: "#8b5cf6",
        // secondary — neon blue
        blue: "#3d8bff",
        // accent + AI — cyan
        accent: "#22d3ee",
        ai: "#22d3ee",
        // semantic — emerald / warm yellow / soft red / orange
        success: "#10b981",
        warning: "#f5b94b",
        danger: "#f87171",
        orange: "#fbb064",
      },
      borderRadius: {
        card: "12px",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        aurora: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.6" },
          "50%": { transform: "translate(24px, -18px) scale(1.15)", opacity: "0.9" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        aurora: "aurora 14s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        shimmer: "shimmer 3.2s linear infinite",
        "spin-slow": "spin-slow 9s linear infinite",
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
