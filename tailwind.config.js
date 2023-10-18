/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      shadow1:
        "0px 7px 14px rgba(0, 0, 0, .05), 0px 0px 3.12708px rgba(0, 0, 0, .0798), 0px 0px .931014px rgba(0, 0, 0, .1702)",
      shadow2: "0 0 0 1px #4a47b1",
    },
  },
  plugins: [],
};
