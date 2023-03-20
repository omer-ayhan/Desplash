import axios from "axios";

import { RegisterForm } from "@/components/RegisterForm";
import { PhotoType } from "@/types/photos";
import Image from "next/image";
import Link from "next/link";

export default function Join({ randomPhoto }: { randomPhoto: PhotoType }) {
	// days ago
	const photoDate = new Intl.RelativeTimeFormat("en", {
		numeric: "auto",
	}).format(
		Math.round(
			new Date().getDate() - new Date(randomPhoto.created_at).getDate()
		),

		"day"
	);

	return (
		<div className="overflow-hidden h-screen grid grid-cols-1 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)]">
			<section className="relative ">
				<Image
					src={randomPhoto.urls.full}
					fill
					alt={randomPhoto.alt_description}
					className="object-cover -z-20"
				/>

				<div className="absolute top-0 left-0 w-full h-full bg-black/40 -z-10" />

				<div className="p-4 lg:p-10 h-full flex flex-col justify-between">
					<h1 className="text-3xl font-bold text-white">Desplash</h1>

					<div>
						<h1 className="text-white text-4xl lg:text-5xl font-semibold">
							Creation starts here
						</h1>
						<p className="my-3 text-white text-xl lg:text-2xl">
							Access 4,922,719 free, high-resolution photos you can’t find
							anywhere else
						</p>
					</div>

					<p className="hidden lg:block text-sm text-white">
						Uploaded {photoDate} by{" "}
						<Link
							className="text-white/70 hover:text-white transition-default"
							href={{
								pathname: "/u/[user]",
								query: { user: randomPhoto.user.username },
							}}>
							{randomPhoto.user.name}
						</Link>
					</p>
				</div>
			</section>
			<section>
				<RegisterForm />
			</section>
		</div>
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
