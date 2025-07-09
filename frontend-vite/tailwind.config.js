// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['Inter', ...defaultTheme.fontFamily.sans],
      heading: ['Poppins', 'sans-serif'],
    },
    extend: {
      colors: {
        // Text
        'text-primary': '#1E1E1E',
        'text-dark': '#F5F5F5',
        'text-muted': '#6B7280',

        // Backgrounds
        'background-primary': '#FFFFFF',
        'background-muted': '#F9FAFB',
        'background-dark': '#0F172A',
        'background-darkSecondary': '#1E293B',

        // Brand Colors
        'primary': '#0070F3',         // Blue
        'primary-light': '#60A5FA',   // Lighter blue
        'accent': '#FF7F00',          // Orange
        'accent-light': '#FDBA74',

        // UI
        'secondary': '#334155',
        'secondary-light': '#CBD5E1',
      },
      borderRadius: {
        button: '0.5rem',
        card: '1rem',
      },
      boxShadow: {
        button: '0 2px 8px rgba(0, 0, 0, 0.1)',
        card: '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      scale: {
        102: '1.02',
        105: '1.05',
      },
    },
  },
  plugins: [
    function ({ addBase, theme }) {
      addBase({
        ':root': {
          '--text-primary': theme('colors.text-primary'),
          '--text-dark': theme('colors.text-dark'),
          '--text-muted': theme('colors.text-muted'),

          '--background-primary': theme('colors.background-primary'),
          '--background-muted': theme('colors.background-muted'),
          '--background-dark': theme('colors.background-dark'),
          '--background-darkSecondary': theme('colors.background-darkSecondary'),

          '--primary': theme('colors.primary'),
          '--primary-light': theme('colors.primary-light'),
          '--accent': theme('colors.accent'),
          '--accent-light': theme('colors.accent-light'),

          '--secondary': theme('colors.secondary'),
          '--secondary-light': theme('colors.secondary-light'),
        },
      })
    },
  ],
}
