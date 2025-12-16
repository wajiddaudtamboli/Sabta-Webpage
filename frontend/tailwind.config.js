/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brandBg: "#232323",
        brandAccent: "#F89A1C",
      },
      
    },
  },
  plugins: [],
};
