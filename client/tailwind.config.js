export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#00E396', // Neon Green
                secondary: '#775DD0', // Purple
                accent: '#FF4560', // Red
                dark: '#1B1E23',
                // darker: '#131519',
                // light: '#E0E0E0',
                surface: '#202A36',
                // text: '#E0E0E0', 
                // muted: '#A0A0A0'
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
