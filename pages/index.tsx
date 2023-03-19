import Head from "next/head";
import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineSearch } from "react-icons/ai";
import axios, { AxiosError } from "axios";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import { Modal } from "react-responsive-modal";
import { IoMdClose } from "react-icons/io";

import { PhotoType } from "@/types/photos";

import { Input } from "@/components/Forms";
import { Button } from "@/components/Button";
import { ImageButton } from "@/components/ImageButton";
import { useDisclosure } from "@/hooks";
import { PhotoDetail } from "@/components/PhotoDetail";
import { RelatedPhotos } from "@/components/RelatedPhotos";

export default function Home({ randomPhoto }: { randomPhoto: PhotoType }) {
	const { ref, inView } = useInView();
	const { isOpen, close, open } = useDisclosure();
	const [latestId, setLatestId] = React.useState<string[]>([]);
	const [currentPhoto, setCurrentPhoto] = React.useState<PhotoType | null>(
		null
	);

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
		<>
			<Head>
				<title>
					{currentPhoto?.alt_description ||
						"Best Free Photos & Images | Desplash"}
				</title>
			</Head>
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
										{page.data.map((data) => (
											<ImageButton
												key={data.id}
												data={data}
												onClick={() => {
													setCurrentPhoto(data);
													open();
												}}
											/>
										))}
									</React.Fragment>
								))}
								<Modal
									classNames={{
										modal:
											"!my-10 md:!my-5 !mx-0 lg:!mx-5 !p-6 relative overflow-x-hidden !overflow-y-auto !w-screen md:!max-w-3xl lg:!max-w-5xl xl:!max-w-[calc(100%-10rem)] rounded-md",
										closeButton: "hidden",
										closeIcon: "hidden",
									}}
									center
									open={isOpen}
									onClose={() => {
										setCurrentPhoto(null);
										close();
									}}>
									{currentPhoto && (
										<>
											<IoMdClose
												className="fixed top-2 left-2 text-white/80 hover:text-white transition-default cursor-pointer"
												onClick={close}
												size={25}
											/>

											<PhotoDetail
												id={currentPhoto.id}
												placeholderData={{
													...currentPhoto,
													views: null,
													downloads: null,
													topics: [],
													location: {},
													exif: {},
													tags: [],
												}}>
												<RelatedPhotos
													id={currentPhoto.id}
													onPhotoClick={(photo) => {
														setCurrentPhoto(photo);
													}}
												/>
											</PhotoDetail>
										</>
									)}
								</Modal>
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
		</>
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
