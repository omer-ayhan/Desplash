export const getEndpoint = (endpoint: string) =>
	process.env.NEXT_PUBLIC_API_URL + endpoint;

export const cn = (...args: (string | boolean | undefined)[]) =>
	args.filter((arg) => typeof arg === "string" && arg.length > 0).join(" ");

export const downloadFile = (url: string, filename: string) => {
	fetch(url)
		.then((response) => response.blob())
		.then((blob) => {
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			document.body.appendChild(a);
			a.click();
			a.remove();
		});
};
