import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ink — warm near-black surfaces
        ink: {
          900: "#0A0A0B",
          800: "#0F0F11",
          700: "#161619",
          600: "#1D1D21",
          500: "#26262B",
          line: "#2C2C33",
        },
        // Volt — signature electric lime (brand energy)
        volt: {
          DEFAULT: "#CDFF47",
          dim: "#A6D636",
          deep: "#5E7A12",
        },
        // Ember — heat / effort accent
        ember: {
          DEFAULT: "#FF5436",
          dim: "#C73E26",
        },
        bone: {
          DEFAULT: "#F4F4EF",
          muted: "#9A9A93",
          faint: "#5E5E60",
        },
      },
      fontFamily: {
        display: ["var(--font-syne)"],
        sans: ["var(--font-inter)"],
        mono: ["var(--font-jetbrains)"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      backgroundImage: {
        "volt-glow":
          "radial-gradient(circle at 50% 0%, rgba(205,255,71,0.15) 0%, transparent 60%)",
      },
      boxShadow: {
        volt: "0 0 0 1px rgba(205,255,71,0.4), 0 8px 40px -8px rgba(205,255,71,0.25)",
        "volt-sm": "0 0 24px -6px rgba(205,255,71,0.4)",
        lift: "0 24px 60px -20px rgba(0,0,0,0.7)",
      },
      animation: {
        "marquee": "marquee 30s linear infinite",
        "float": "float 7s ease-in-out infinite",
        "scan": "scan 3s ease-in-out infinite",
        "pulse-ring": "pulseRing 2.4s cubic-bezier(0.4,0,0.6,1) infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        scan: {
          "0%, 100%": { opacity: "0.3", transform: "translateY(0)" },
          "50%": { opacity: "1", transform: "translateY(6px)" },
        },
        pulseRing: {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%, 100%": { transform: "scale(1.6)", opacity: "0" },
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
      },
    },
  },
  plugins: [],
};

export default config;
