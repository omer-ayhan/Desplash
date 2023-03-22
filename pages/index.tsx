import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineSearch } from "react-icons/ai";
import axios, { AxiosError } from "axios";
import { useInfiniteQuery } from "react-query";

import { PhotoType } from "@/types/photos";

import { MasonryImages } from "@/components/MasonryImages";
import { Input } from "@/ui";

export default function Home({ randomPhoto }: { randomPhoto: PhotoType }) {
	const router = useRouter();
	const [latestId, setLatestId] = useState<string[]>([]);

	const {
		status,
		data: photos,
		error,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
	} = useInfiniteQuery<
		{
			photos: PhotoType[];
			nextId: number | null;
			prevId: number | null;
		},
		AxiosError
	>(
		["photos"],
		async ({ pageParam = 1, signal }) => {
			if (!pageParam) {
				return {
					photos: [],
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
				photos: photoRes.data.filter((p) => !latestId.includes(p.id)),
			};
		},
		{
			getNextPageParam: (lastPage) => lastPage.nextId,
			onSuccess: (data) => {
				setLatestId(data.pages.flatMap((page) => page.photos).map((p) => p.id));
			},
		}
	);

	const modalClose = () => {
		router.replace(router.pathname, "/", {
			shallow: true,
		});
	};

	const handleImageClick = (id: string) => {
		router.push(router.pathname, `/photos/${id}`, {
			shallow: true,
		});
	};

	return (
		<>
			<section className="px-4 relative grid gap-5 place-content-center  w-screen h-[700px] bg-blend-darken overflow-hidden">
				<Image
					src={randomPhoto.urls.full}
					fill
					className="-z-50 object-cover"
					alt={randomPhoto.alt_description}
					priority
				/>
				<div className="-z-40 absolute w-full h-full bg-primary-main/30" />

				<h1 className="text-center text-5xl font-medium text-white">
					Desplash
				</h1>
				<p className="mx-auto max-w-md text-center text-white text-lg">
					The internet’s source for visuals. Powered by creators everywhere.
				</p>

				<Input
					id="search-home"
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							router.push(`/s/photos/${e.currentTarget.value}`);
						}
					}}
					className="flex-1"
					icon={<AiOutlineSearch size={20} className="text-gray-500 " />}
					inputClass="md:w-[500px] lg:w-[700px] xl:w-[1000px] py-3 text-primary-main placeholder:text-gray-500 text-main bg-white border-transparent focus:ring-4 focus:ring-2 focus:ring-main focus:ring-opacity-50"
					placeholder="Search your desired photos"
					type="text"
					name="search-home"
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
			<MasonryImages
				className="my-10"
				error={error}
				fetchNextPage={fetchNextPage}
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				photos={photos}
				status={status}
				onModalClose={modalClose}
				onImageClick={handleImageClick}
				headTitle="Best Free Photos & Images | Desplash"
			/>
		</>
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
