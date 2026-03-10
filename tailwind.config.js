/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // FONT FAMILY
      fontFamily: {
        sans: ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New', 'monospace'],
        display: ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
        extrabold: 800,
      },
      colors: {
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
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
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
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Custom colors - Premium Dark + Monochrome Accent
        dark: {
          bg: 'rgb(var(--theme-dark-bg) / <alpha-value>)',
          secondary: 'rgb(var(--theme-dark-secondary) / <alpha-value>)',
          hover: 'rgb(var(--theme-dark-hover) / <alpha-value>)',
        },
        gold: {
          DEFAULT: 'rgb(var(--theme-accent) / <alpha-value>)',
          hover: 'rgb(var(--theme-accent-hover) / <alpha-value>)',
          light: 'rgb(var(--theme-accent-soft) / <alpha-value>)',
        },
        light: {
          DEFAULT: 'rgb(var(--theme-light) / <alpha-value>)',
          muted: 'rgb(var(--theme-light-muted) / <alpha-value>)',
        },
        alpha: {
          orange: "rgb(var(--theme-accent) / <alpha-value>)",
          "orange-light": "rgb(var(--theme-accent-soft) / <alpha-value>)",
          dark: "rgb(var(--theme-dark-bg) / <alpha-value>)",
          card: "rgb(var(--theme-dark-secondary) / <alpha-value>)",
        },
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        glow: "0 0 20px rgb(var(--theme-accent) / 0.28)",
        "glow-lg": "0 0 40px rgb(var(--theme-accent) / 0.38)",
        gold: "0 0 30px rgb(var(--theme-accent) / 0.18)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, rgb(var(--theme-dark-bg)) 0%, rgb(var(--theme-dark-secondary)) 100%)',
        'gradient-gold': 'linear-gradient(135deg, rgb(var(--theme-accent)) 0%, rgb(var(--theme-accent-hover)) 100%)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
