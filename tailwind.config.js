const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
		"./public/**/*.{js,ts,jsx,tsx}",
		"./styles/**/*.{js,ts,jsx,tsx}",
		"./layouts/**/*.{js,ts,jsx,tsx}",
		"./ui/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				"primary-main": "#111",
				"primary-secondary": "#767676",
			},
			fontSize: {
				md: "1rem",
				"7xl": "5rem",
				"8xl": "6rem",
				"9xl": "7rem",
			},
		},
		masonry: {
			1: "1",
			2: "2",
			3: "3",
			4: "4",
		},
		animation: {
			"slow-blink":
				"blink 10s linear infinite both, slowBlink 1.3s linear 1s infinite",
			"transparent-opaque":
				"blink 10s linear infinite both, transparentToOpaque 5ms ease-in-out 4s infinite alternate both",
			blink: "blink 6s linear infinite both",
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
					color: theme("colors.primary-main"),
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

			matchUtilities(
				{
					"text-shadow": (value) => ({
						"text-shadow": value,
					}),
				},
				{
					values: {
						1: "0 0 0.2em",
						2: "0 0 0.4em",
						2.5: "0 0 0.5em",
						3: "0 0 0.6em",
						3.5: "0 0 0.7em",
						4: "0 0 0.8em",
						4.5: "0 0 0.9em",
						5: "0 0 1em",
						6: "0 0 1.2em",
					},
				}
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

				".link-default": {
					color: theme("colors.primary-secondary"),
					"&:hover": {
						color: theme("colors.primary-main"),
					},
					transition: "all 250ms ease-in-out",
				},

				".vignette": {
					"box-shadow": "0 0 200px rgba(0,0,0,0.7) inset",
				},
			});
		}),
		require("@tailwindcss/line-clamp"),
	],
};
