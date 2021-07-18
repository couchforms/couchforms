module.exports = {
  purge: {
    content: [
      "./pages/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
    ],
    options: {
      safelist: [
        "text-pink-700",
        "bg-pink-50",
        "text-purple-700",
        "bg-purple-50",
        "text-green-700",
        "bg-green-50",
      ],
    },
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: { opacity: ["disabled"] },
  },
  plugins: [require("@tailwindcss/forms")],
};
