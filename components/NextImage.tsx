import Image from "next/image";

import { useState } from "react";

import { cn } from "@/services/local";

interface NextImageProps extends React.ComponentProps<typeof Image> {
	isLandscape: boolean;
	loaderClass?: string;
}

export function NextImage({
	isLandscape,
	loaderClass,
	...rest
}: NextImageProps) {
	const [isLoaded, setIsLoaded] = useState(false);

	return (
		<>
			<div
				className={cn(
					"mx-auto bg-gray-300 w-full  cursor-zoom-in",
					isLandscape ? "max-w-5xl h-[450px]" : "max-3xl md:max-w-md h-[900px]",
					isLoaded ? "hidden" : "animate-pulse",
					loaderClass
				)}
			/>

			<Image
				{...rest}
				onLoadStart={() => setIsLoaded(false)}
				onLoadingComplete={() => setIsLoaded(true)}
			/>
		</>
	);
}
