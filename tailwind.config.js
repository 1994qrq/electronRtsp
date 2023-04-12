/** @type {import(‘tailwindcss’).Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'weather-primary': '#ffffff',
        'weather-secondary': '#004E71',
        cj_bg: '#3c7bfb',
        btn_color: 'rgb(64,158,255)',
        green_bg: '#166e37',
        red_bg: '#b91c1c',
        bottom_bg: '#16a34a'
      }
    },
    fontFamily: {
      Roboto: ['Roboto, sans-serif']
    },
    container: {
      padding: '2rem',
      center: true
    },
    screens: {
      sm: '640px',
      md: '768px'
    }
  },
  plugins: []
}
