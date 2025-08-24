module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--zmp-primary-color)",
        gray: "#767A7F",
        divider: "#E9EBED",
        green: "#288F4E",
        background: "#ffffff",
        skeleton: "rgba(0, 0, 0, 0.1)",
        brand: "#E0A000",
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    },
  },
};
