module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"], // Adjust based on your file structure

  theme: {
    extend: {
      colors: {
        btnColor: "#62BD4F",
        fontColor: "#383838",
        linkColor: "#218FDA",
        "gkRedColor": "#C4161B",
        "bgColor": "#F3F3F3",
        "paraColor": "#686868",
        "darkColor": "#060606"
      },

      fontFamily: {
        HelveticaNeueBold: ["HelveticaNeueBold"],
        HelveticaNeueMedium: ["HelveticaNeueMedium"],
        HelveticaNeueRegular: ["HelveticaNeueRegular"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/line-clamp")],
};
