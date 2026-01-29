/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Pretendard', 'Inter', 'sans-serif'],
                heading: ['Outfit', 'sans-serif'],
            },
            colors: {
                lime: {
                    300: '#bef264',
                    400: '#a3e635',
                    500: '#84cc16',
                },
                dark: {
                    900: '#0a0a0a',
                    800: '#171717',
                    700: '#262626',
                }
            },
            animation: {
                'spin-slow': 'spin 8s linear infinite',
                'marquee': 'marquee 25s linear infinite',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                }
            }
        },
    },
    plugins: [],
}
