import React from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

import { PhotoType } from "@/types/photos";
import { Button } from "@/ui";

export default function NotFound({ randomPhoto }: { randomPhoto: PhotoType }) {
	return (
		<section className="relative w-screen h-screen grid place-content-center">
			<div className="bg-primary-main/90 absolute w-full h-full top-0 left-0 -z-30" />
			<div className="flex flex-col items-center">
				<div className="flex flex-wrap justify-center gap-3">
					<ul className="flex text-6xl lg:text-7xl font-bold text-white">
						<li className="animate-blink text-inherit text-shadow-1">P</li>
						<li className="animate-blink text-inherit text-shadow-1">a</li>
						<li className="animate-blink text-inherit text-shadow-1">g</li>
						<li className="animate-transparent-opaque text-inherit text-shadow-1">
							e
						</li>
					</ul>
					<ul className="flex text-6xl lg:text-7xl font-bold text-white">
						<li className="animate-blink text-inherit text-shadow-1">N</li>
						<li className="animate-blink text-inherit text-shadow-1">o</li>
						<li className="animate-blink text-inherit text-shadow-1">t</li>
					</ul>
					<ul className="flex text-6xl lg:text-7xl font-bold text-white">
						<li className="animate-blink text-inherit text-shadow-1">F</li>
						<li className="animate-blink text-inherit text-shadow-1">o</li>
						<li className="animate-slow-blink text-inherit text-shadow-1">u</li>
						<li className="animate-blink text-inherit text-shadow-1">n</li>
						<li className="animate-blink text-inherit text-shadow-1">d</li>
					</ul>
				</div>
				<p className="my-5 text-white text-center">
					Hmm, the page you were looking for doesn’t seem to exist anymore.
				</p>
				<Link href="/">
					<Button className="bg-white !border-white !text-primary-main !py-3">
						Back to Desplash
					</Button>
				</Link>
			</div>

			<p className="absolute bottom-5 left-5 text-xs text-white">
				Photo by{" "}
				<Link
					href={`/u/@${randomPhoto.user.username}`}
					className="text-xs text-white/50 hover:text-white transition-default">
					@{randomPhoto.user.name}
				</Link>
			</p>
			<p className="absolute bottom-5 right-5 text-xs text-white">404</p>

			<Image
				src={randomPhoto.urls.full}
				fill
				alt={randomPhoto.alt_description}
				className="object-cover -z-50"
			/>
		</section>
	);
}

export async function getStaticProps() {
	const { data: randomPhoto } = await axios.get(
		"https://unsplash.com/napi/photos/random"
	);

	return {
		props: {
			randomPhoto,
			revalidate: 60 * 24,
		},
	};
}
