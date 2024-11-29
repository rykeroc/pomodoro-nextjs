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
  plugins: [],
} satisfies Config;
