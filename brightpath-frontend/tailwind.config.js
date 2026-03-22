/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bp: {
          bg: "var(--bg)",
          surface: "var(--surface)",
          border: "var(--border)",
          primary: "var(--primary)",
          text: "var(--text)",
          muted: "var(--muted)",
        },
      },
      fontFamily: {
        sans: ['"Segoe UI"', '"Helvetica Neue"', "Arial", "sans-serif"],
      },
      boxShadow: {
        panel: "0 8px 24px rgba(31, 41, 51, 0.08)",
      },
    },
  },
  plugins: [],
};
