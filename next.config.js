/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,

	images: {
		domains: [
			"unsplash.com",
			"source.unsplash.com",
			"images.unsplash.com",
			"plus.unsplash.com",
		],
	},
};

module.exports = nextConfig;
