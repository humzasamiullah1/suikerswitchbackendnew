module.exports = {
    content: [
      "./src/**/*.{html,js,jsx,ts,tsx}", // Tailwind will scan these files
    ],
    theme: {
      extend: {
        colors: {
          "btnColor": "#62BD4F",
          "fontColor": "#383838",
          "linkColor": "#218FDA"
        },

        fontFamily: {
          'HelveticaNeueBold': ['HelveticaNeueBold'],
          'HelveticaNeueMedium': ['HelveticaNeueMedium'],
          'HelveticaNeueRegular': ['HelveticaNeueRegular']
        },
      },
    },
    plugins: [],
  }
  