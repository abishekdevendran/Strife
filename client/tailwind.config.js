/** @type {import('tailwindcss').Config} */
module.exports = {
	daisyui: {
		themes: ['pastel', 'dark', 'valentine', 'night'],
	},
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			fontFamily: {
				poppins: ['var(--font-poppins)', 'sans-serif'],
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('daisyui'),
	],
};
