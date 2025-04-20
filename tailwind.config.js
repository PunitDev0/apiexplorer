/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx,jsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Custom primary colors
        primary: "#18181B",
        accent: "#F28C38",
        black: "#000000",

        // Custom gradient and accent colors
        "explorer-blue": {
          50: "#e6f0ff",
          100: "#cce0ff",
          200: "#99c2ff",
          300: "#66a3ff",
          400: "#3385ff",
          500: "#0066ff", // Base color for buttons/gradients
          600: "#0052cc",
          700: "#003d99",
          800: "#002966", // Darker shade for hover
          900: "#001433",
          950: "#000f1a",
        },
        "explorer-purple": {
          300: "#c084fc",
          500: "#9333ea", // Used in gradient ball
          900: "#4c1d95",
        },
        "explorer-green": {
          300: "#86efac", // Used for success badges, POST
          500: "#22c55e",
          900: "#14532d",
        },
        "explorer-amber": {
          300: "#fcd34d", // Used for PUT, settings
          500: "#f59e0b",
          900: "#78350f",
        },
        "explorer-red": {
          300: "#f87171", // Used for DELETE, error badges
          500: "#ef4444",
          900: "#7f1d1d",
        },
        "explorer-indigo": {
          300: "#a5b4fc", // Used for history, clock
          500: "#6366f1",
          900: "#312e81",
        },

        // Default Tailwind colors (overridden or extended)
        blue: {
          400: "#60a5fa",
          600: "#2563eb",
        },
        green: {
          400: "#4ade80",
          600: "#16a34a",
        },
        orange: {
          400: "#fb923c",
          600: "#ea580c",
        },
        purple: {
          400: "#c084fc",
          600: "#9333ea",
        },

        // HSL-based theme colors (ensure these are defined in your CSS variables)
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};