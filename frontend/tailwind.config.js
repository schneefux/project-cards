module.exports = {
  theme: {
    linearGradients: theme => ({
      colors: {
        ...theme('colors'),
        'primary-to-light': [
          theme('colors.primary.500'),
          theme('colors.primary.400')
        ],
        'primary-to-dark': [
          theme('colors.primary.500'),
          theme('colors.primary.600')
        ],
        'dark-to-secondary': [
          theme('colors.secondary.600'),
          theme('colors.secondary.500')
        ],
        'secondary-to-dark': [
          theme('colors.secondary.500'),
          theme('colors.secondary.600')
        ]
      }
    }),
    extend: {
      colors: {
        secondary: {
          100: '#FFEEE9',
          200: '#FFD5C8',
          300: '#FFBCA7',
          400: '#FF8964',
          500: '#FF5722',
          600: '#D1310C',
          700: '#B51E0A',
          800: '#780606',
          900: '#370101'
        },
        primary: {
          100: '#E6F7F8',
          200: '#BFEBED',
          300: '#99DEE1',
          400: '#4DC6CB',
          500: '#00ADB5',
          600: '#009CA3',
          700: '#00686D',
          800: '#004E51',
          900: '#003436'
        }
      }
    }
  },
  variants: {},
  plugins: [require('tailwindcss-gradients')()]
}
