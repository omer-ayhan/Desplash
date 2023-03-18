const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./public/**/*.{js,ts,jsx,tsx}",
		"./styles/**/*.{js,ts,jsx,tsx}",
		"./layouts/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				"primary-main": "#111",
				"primary-secondary": "#767676",
			},
		},
		masonry: {
			1: "1",
			2: "2",
			3: "3",
			4: "4",
		},
	},
	daisyui: {
		themes: [
			"light",
			{
				desplash: {
					main: "#111",
					secondary: "#767676",
				},
			},
		],
	},
	plugins: [
		plugin(function ({ matchUtilities, addBase, addUtilities, theme }) {
			addBase({
				"body > *": {
					color: theme("colors.main"),
				},
				h1: {
					fontSize: theme("fontSize.4xl"),
				},

				h2: {
					fontSize: theme("fontSize.3xl"),
				},

				h3: {
					fontSize: theme("fontSize.2xl"),
				},

				h4: {
					fontSize: theme("fontSize.xl"),
				},

				p: {
					fontSize: theme("fontSize.lg"),
				},
				a: {
					fontSize: theme("fontSize.md"),
				},
			});

			matchUtilities(
				{
					"masonry-col": (value) => ({
						"column-count": value,
					}),
				},
				{ values: theme("masonry") }
			);

			matchUtilities(
				{
					"masonry-gap": (value) => ({
						"column-gap": value,
					}),
				},
				{ values: theme("gap") }
			);

			addUtilities({
				".transition-default": {
					transition: "all 250ms ease-in-out",
				},
				".transition-bezier": {
					transition: "all 200ms cubic-bezier(0.24, 0.22, 0.015, 1.56) 0s",
				},
				".scrollbar-hide": {
					"scrollbar-width": "none",
					"&::-webkit-scrollbar": {
						display: "none",
					},
				},

				".vignette": {
					"box-shadow": "0 0 200px rgba(0,0,0,0.7) inset",
				},
			});
		}),
	],
};
