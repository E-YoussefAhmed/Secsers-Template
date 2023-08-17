/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-primary":
          "linear-gradient(90.14deg, #0D0628 6.25%, #130C30 34.05%, #140C33 62.42%, #170C40 82.57%, #1A0D4D 99.85%);",
        "gradient-secondary":
          "linear-gradient(217.51deg, #0F082A 0%, #180C47 100%)",
        sidebar: "linear-gradient(181.94deg, #0E0343 1.99%, #13064E 89.49%)",
        navbar:
          "linear-gradient(90deg, #0F0344 0.59%, #0B0137 25.27%, #0A012F 53.75%, #080125 68.24%, #06011F 80.15%, #06011F 90.51%, #05001A 97.75%)",
        "input-primary":
          "linear-gradient(90deg, #190D4B 0%, #190D4B 28.99%, #190D4B 60.76%, #190D4B 100%)",
      },
      colors: {
        primary: "#E94B19",
        // secondary: "#E94B19",
        "input-secondary": "#0D0729",
        partial: "#4A58D6",
        completed: "#32C21A",
        pending: "#ffc107",
        processing: "#ff5c00",
        canceled: "#dc3545",
      },
      boxShadow: {
        main: "0px 4px 17px -1px #00000080",
      },
    },
  },
  plugins: [],
};
