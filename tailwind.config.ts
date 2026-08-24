import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#070B10",
        "canvas-elevated": "#0E151D",
        card: "rgba(23, 34, 45, 0.55)",
        "card-hover": "rgba(23, 34, 45, 0.8)",
        border: "rgba(148, 163, 184, 0.09)",
        "border-strong": "rgba(148, 163, 184, 0.20)",
        muted: "#8792A2",
        brand: "#3B82F6",
        "brand-2": "#8B5CF6",
        success: "#22C55E",
        warning: "#F59E0B",
        danger: "#EF4444",
        ai: "#A78BFA",
        cyan: "#22D3EE",
        orange: "#FB923C",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #3B82F6 0%, #7C6EF6 55%, #A78BFA 100%)",
        "brand-gradient-soft": "linear-gradient(135deg, rgba(59,130,246,0.14) 0%, rgba(139,92,246,0.09) 100%)",
        "radial-glow": "radial-gradient(circle at center, rgba(59,130,246,0.22), transparent 70%)",
      },
      borderRadius: {
        card: "18px",
        pill: "999px",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
        "glow-brand": "0 0 40px rgba(59,130,246,0.22)",
        "glow-soft": "0 0 20px rgba(59,130,246,0.10)",
      },
      keyframes: {
        drift: {
          "0%, 100%": { transform: "translate(0px, 0px) scale(1)" },
          "50%": { transform: "translate(30px, -20px) scale(1.05)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        drift: "drift 14s ease-in-out infinite",
        "drift-slow": "drift 22s ease-in-out infinite",
        "fade-up": "fade-up 0.5s ease-out both",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
