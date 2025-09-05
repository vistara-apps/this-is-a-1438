/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          500: 'hsl(210, 80%, 50%)',
          600: 'hsl(210, 80%, 45%)',
          700: 'hsl(210, 80%, 40%)',
        },
        accent: 'hsl(130, 60%, 50%)',
        danger: 'hsl(0, 70%, 50%)',
        warning: 'hsl(30, 90%, 50%)',
        surface: 'hsl(0, 0%, 100%)',
        bg: 'hsl(210, 30%, 96%)',
        'text-primary': 'hsl(210, 30%, 20%)',
        'text-secondary': 'hsl(210, 30%, 40%)',
        purple: {
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        }
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
      },
      spacing: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'card': '0 8px 24px hsla(0, 0%, 0%, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.22,1,0.36,1)',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.22,1,0.36,1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}