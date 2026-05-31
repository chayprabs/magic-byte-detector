/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "#fafafa",
        ink: "#171717",
        muted: "#525252",
        accent: "#2563eb",
        warn: "#b45309",
        danger: "#b91c1c",
      },
    },
  },
  plugins: [],
};
