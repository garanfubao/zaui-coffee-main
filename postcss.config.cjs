const tailwindcss = require("tailwindcss");

module.exports = {
  plugins: [
    require("postcss-aspect-ratio-polyfill"),
    tailwindcss("./tailwind.config.cjs"),
    require("autoprefixer"),
  ],
};
