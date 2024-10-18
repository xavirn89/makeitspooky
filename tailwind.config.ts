import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sections/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        glowFlicker: {
          '0%, 100%': { 
            textShadow: '0 0 2px #aaa, 0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor', 
            opacity: '1' 
          },
          '10%': { 
            textShadow: '0 0 5px #000, 0 0 10px currentColor, 0 0 20px currentColor, 0 0 40px currentColor', 
            opacity: '0.7' 
          },
          '20%, 50%': { 
            textShadow: '0 0 7px #000, 0 0 15px currentColor, 0 0 25px currentColor, 0 0 50px currentColor', 
            opacity: '0.5' 
          },
          '40%': { 
            textShadow: '0 0 2px #aaa, 0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor', 
            opacity: '0.2' 
          },
          '60%': { 
            textShadow: '0 0 10px #000, 0 0 20px currentColor, 0 0 40px currentColor', 
            opacity: '1' 
          },
          '70%': { 
            textShadow: '0 0 2px #000, 0 0 5px currentColor, 0 0 10px currentColor, 0 0 20px currentColor', 
            opacity: '0.3' 
          },
          '80%': { 
            textShadow: '0 0 5px #aaa, 0 0 10px currentColor, 0 0 20px currentColor', 
            opacity: '0.6' 
          },
          '90%': { 
            textShadow: '0 0 7px #000, 0 0 15px currentColor, 0 0 25px currentColor', 
            opacity: '0.9' 
          },
        },
        slideOutLeft: {
          '0%, 5%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(-100%)', opacity: '0' },
        },
        slideOutRight: {
          '0%, 5%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' },
        },
      },
      animation: {
        glowFlicker: 'glowFlicker 7s infinite alternate ease-in-out',

        // Sin delay
        slideOutLeft_0delay: 'slideOutLeft 3s ease-out forwards',
        slideOutRight_0delay: 'slideOutRight 3s ease-out forwards',

        // Con 0.5s de delay
        slideOutLeft_05delay: 'slideOutLeft 3s ease-out 0.5s forwards',
        slideOutRight_05delay: 'slideOutRight 3s ease-out 0.5s forwards',

        // Con 1s de delay
        slideOutLeft_1delay: 'slideOutLeft 3s ease-out 1s forwards',
        slideOutRight_1delay: 'slideOutRight 3s ease-out 1s forwards',
      },
    },
  },
  plugins: [],
};

export default config;
