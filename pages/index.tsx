import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
	AiFillHeart,
	AiOutlineArrowDown,
	AiOutlineSearch,
} from "react-icons/ai";
import axios, { AxiosError } from "axios";
import { useInfiniteQuery, useQuery } from "react-query";

import { PhotoType } from "@/types/photos";

import { getEndpoint } from "@/services/local";
import { Input } from "@/components/Forms";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/Button";

export default function Home({ randomPhoto }: { randomPhoto: PhotoType }) {
	const [latestId, setLatestId] = React.useState<string[]>([]);
	const { ref, inView } = useInView();

	const {
		status,
		data: photos,
		error,
		isFetchingNextPage,
		fetchNextPage,
	} = useInfiniteQuery<
		{
			data: PhotoType[];
			nextId: number | null;
			prevId: number | null;
		},
		AxiosError
	>(
		["photos"],
		async ({ pageParam = 1, signal }) => {
			if (!pageParam) {
				return {
					data: [],
					nextId: null,
					prevId: null,
				};
			}
			const { data: photoRes } = await axios.get<{
				data: PhotoType[];
				nextId: number | null;
				prevId: number | null;
			}>(`/api/photos?per_page=12&page=${pageParam}`, {
				signal,
			});

			return {
				...photoRes,
				data: photoRes.data.filter((p) => !latestId.includes(p.id)),
			};
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextId,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
			retry: false,
			retryOnMount: false,
			onSuccess: (data) => {
				setLatestId(data.pages.flatMap((page) => page.data).map((p) => p.id));
			},
		}
	);

	useEffect(() => {
		if (inView) {
			fetchNextPage();
		}
	}, [inView]);

	return (
		<div>
			<section className="relative grid gap-5 place-content-center  w-screen h-[700px] bg-blend-darken overflow-hidden">
				<Image
					src={randomPhoto.urls.full}
					fill
					className="-z-50 object-cover"
					alt={randomPhoto.alt_description}
				/>
				<div className="-z-40 absolute w-full h-full bg-primary-main/30" />

				<h1 className="text-center text-5xl font-medium text-white">
					Desplash
				</h1>
				<p className="mx-auto max-w-md text-center text-white text-lg">
					The internet’s source for visuals. Powered by creators everywhere.
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
						{randomPhoto.user.name}
					</Link>
				</p>
			</section>
			<section className="my-10 mx-auto max-w-6xl masonry-col-3 masonry-gap-3 transition-default">
				{status === "loading" ? (
					<p>Loading...</p>
				) : status === "error" ? (
					<span>Error: {error.message} </span>
				) : (
					status === "success" && (
						<>
							{photos.pages.map((page) => (
								<React.Fragment key={`${page.nextId}-?${page.prevId}`}>
									{page.data.map(
										({ links, id, urls, alt_description, user }, i) => (
											<button
												key={id}
												className="group relative mb-3 p-0 break-inside-avoid-column"
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
												{!urls.regular.includes("plus.unsplash") && (
													<a href={links.download} download>
														<AiOutlineArrowDown
															className="invisible group-hover:visible p-2 w-11 absolute bottom-4 right-4 text-primary-secondary bg-white rounded-md hover:text-primary-main"
															size={34}
														/>
													</a>
												)}
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
										)
									)}
								</React.Fragment>
							))}
						</>
					)
				)}
			</section>
			{status === "success" && (
				<div ref={ref}>
					<Button
						className="mx-auto my-5"
						onClick={() => fetchNextPage()}
						loading={isFetchingNextPage}>
						Load More
					</Button>
				</div>
			)}
		</div>
	);
}

export async function getServerSideProps() {
	const { data: randomPhoto } = await axios.get(
		// getEndpoint("https://unsplash.com/napi/photos/random"),
		"https://unsplash.com/napi/photos/random"
		// {
		// 	headers: {
		// 		Authorization: `Client-ID ${process.env.UNSPLASH_ACCESS}`,
		// 	},
		// }
	);

	return {
		props: {
			randomPhoto,
		},
	};
}
