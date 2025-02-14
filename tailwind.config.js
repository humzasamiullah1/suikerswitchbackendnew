module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Tailwind will scan these files
  ],
  theme: {
    extend: {
      colors: {
        btnColor: "#62BD4F",
        fontColor: "#383838",
        linkColor: "#218FDA",
        "gkRedColor": "#C4161B",
        "bgColor": "#F3F3F3",
        "paraColor": "#686868"
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
