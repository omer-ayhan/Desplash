export const getEndpoint = (endpoint: string) =>
	process.env.NEXT_PUBLIC_API_URL + endpoint;

export const cn = (...args: (string | undefined)[]) =>
	args.filter(Boolean).join(" ");
