import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        primary: "var(--primary)",
        'primary-text': "var(--primary-text)",
        'secondary-text': "var(--secondary-text)",
        'primary-container': "var(--primary-container)",
        'secondary-container': "var(--secondary-container)",
      },
    },
  },
  safelist: [
    "bg-violet-900",
    "text-violet-900",
    "stroke-violet-900",
    "border-violet-900",
    "bg-amber-600",
    "text-amber-600",
    "stroke-amber-600",
    "border-amber-600",
    "bg-blue-500",
    "text-blue-500",
    "stroke-blue-500",
    "border-blue-500",
  ],
  plugins: [],
} satisfies Config;
