/** @type {import('tailwindcss').Config} */

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '400px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1220px',
      '2xl': '1220px',
      '3xl': '1220px',
    },
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        background: 'var(--background)',
        accent: 'var(--accent)',
        lighterAccent: 'var(--lighter-accent)',
        layer: 'var(--layer)',
        focus: 'var(--focus)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
      },
      backgroundImage: {
        banner: "url('/jsm_resources_banner.svg')",
      },
      animation: {
        'accordion-up': 'accordion-up 0.2s ease-out',
        bounce200: 'bounce 1s infinite 200ms',
        bounce400: 'bounce 1s infinite 400ms',
      },
    },
  },
  plugins: [],
}
