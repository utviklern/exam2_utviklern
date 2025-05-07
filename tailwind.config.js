/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        red: "#FF385C",     
        green: "#96DB85",         
        greenDark: "#7EB36D",    
        background: "#FCFFFD",     
        card: "#E6E6E6",           
        primaryText: "#333333",            
        blue: "#0040FF",            
        placeholder: "#666666",     
      },
    },
  },
  plugins: [],
};
