const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {},
		masonry: {
			1: "1",
			2: "2",
			3: "3",
			4: "4",
		},
	},
	daisyui: {
		themes: ["light"],
	},
	plugins: [
		require("daisyui"),
		plugin(function ({ matchUtilities, addUtilities, theme }) {
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
					transition: "all 300ms ease-in-out",
				},
			});
		}),
	],
};
