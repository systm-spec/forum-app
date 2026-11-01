/** @type {import("prettier").Config} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindStylesheet: "./app/globals.css",
  tabWidth: 4,
  useTabs: true,
  trailingComma: "all",
};

export default config;
