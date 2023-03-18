import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
	AiFillHeart,
	AiOutlineArrowDown,
	AiOutlineSearch,
} from "react-icons/ai";
import axios from "axios";
import { useInfiniteQuery } from "react-query";

import { PhotoType } from "@/types/photos";

import { getEndpoint } from "@/services/local";
import { Input } from "@/components/Forms";

export default function Home({}: { photos: PhotoType[] }) {
	const {
		data: photos,
		isLoading,
		status,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery<PhotoType[]>(
		"infiniteCharacters",
		async ({ pageParam = 10 }) => {
			const { data } = await axios(
				getEndpoint(`/photos?per_page=${pageParam}`),
				{
					headers: {
						Authorization: `Client-ID wtOtTo8_YfuQm3qH39jhkriCbFgsBSoW-ct-zuL_eow`,
					},
				}
			);
			return data;
		}
	);

	return (
		<div className="h-screen">
			<section className="relative grid gap-5 place-content-center  w-screen h-3/4 bg-blend-darken overflow-hidden">
				<Image
					src="https://source.unsplash.com/random/1920x1080"
					fill
					className="-z-50 object-cover "
					alt="Hero Image"
				/>
				<div className="-z-40 absolute w-full h-full bg-primary-main/30" />

				<h1 className="text-center text-5xl font-medium text-white">
					Desplash
				</h1>
				<p className="mx-auto max-w-md text-center text-white text-lg">
					Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et porro
					tenetur aliquid suscipit itaque ut, quos cumque sed alias officiis.
				</p>

				<Input
					className="flex-1 "
					icon={<AiOutlineSearch size={20} className="text-gray-500 " />}
					inputClass="w-[900px] py-3 text-primary-main placeholder:text-gray-500 text-main bg-white border-transparent focus:ring-4 focus:ring-2 focus:ring-main focus:ring-opacity-50"
					placeholder="Search your desired photos"
					type="text"
					name="search"
				/>
				<p className="absolute bottom-5 left-5 text-sm text-white/80">
					Photo by{" "}
					<Link
						href="/"
						className="text-white/90 hover:text-white transition-default">
						Tino Rischawy
					</Link>
				</p>
			</section>

			<section className=" my-10 mx-auto max-w-6xl masonry-col-3 masonry-gap-3">
				{photos?.pages
					.flat()
					.map(({ links, id, urls, alt_description, user }) => (
						<button
							key={id}
							className="group relative mb-3 p-0"
							title={alt_description}>
							<Image
								key={id}
								src={urls.regular}
								width={400}
								height={500}
								alt={alt_description || user.name}
								placeholder="blur"
								blurDataURL={urls.thumb}
							/>
							<div className="group-hover:vignette absolute bottom-0 left-0 w-full h-full transition-default" />

							<AiFillHeart
								className="p-2 w-11 invisible group-hover:visible absolute top-4 right-4 text-primary-secondary bg-white rounded-md hover:text-primary-main"
								title="Add To Favorites"
								size={34}
							/>
							<a href={links.download} download>
								<AiOutlineArrowDown
									className="invisible group-hover:visible p-2 w-11 absolute bottom-4 right-4 text-primary-secondary bg-white rounded-md hover:text-primary-main"
									size={34}
								/>
							</a>
							<div className="invisible group-hover:visible flex gap-2 items-center  absolute bottom-4 left-4">
								<Image
									src={user.profile_image.medium}
									width={35}
									height={35}
									alt={user.name}
									className="rounded-full"
								/>
								<Link
									href="/"
									className="text-sm text-white/80 hover:text-white">
									{user.name}
								</Link>
							</div>
						</button>
					))}
			</section>
		</div>
	);
}

export async function getServerSideProps() {
	const { data: photos } = await axios.get(getEndpoint("/photos"), {
		headers: {
			Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS}`,
		},
	});

	return {
		props: {
			photos,
		},
	};
}
