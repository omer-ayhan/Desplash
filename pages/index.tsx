import Head from "next/head";
import { Fragment, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiOutlineSearch } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import axios, { AxiosError } from "axios";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import { Modal } from "react-responsive-modal";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { PhotoType } from "@/types/photos";

import { Input } from "@/components/Forms";
import { Button } from "@/components/Button";
import { ImageButton } from "@/components/ImageButton";
import { useDisclosure } from "@/hooks";
import { PhotoDetail } from "@/components/PhotoDetail";
import { RelatedPhotos } from "@/components/RelatedPhotos";

export default function Home({ randomPhoto }: { randomPhoto: PhotoType }) {
	const { ref, inView } = useInView();
	const router = useRouter();
	const { isOpen, close, open } = useDisclosure();
	const [latestId, setLatestId] = useState<string[]>([]);
	const [currentPhoto, setCurrentPhoto] = useState<PhotoType | null>(null);

	const {
		status,
		data: photos,
		error,
		isFetchingNextPage,
		fetchNextPage,
		hasNextPage,
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

	const handleFetchPage = () => hasNextPage && fetchNextPage();

	useEffect(() => {
		if (inView) {
			handleFetchPage();
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
						id="search-home"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								router.push(`/s/photos/${e.currentTarget.value}`);
							}
						}}
						className="flex-1"
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
				<section className="my-10 mx-auto max-w-6xl masonry-col-2 lg:masonry-col-3 masonry-gap-3 transition-default">
					{status === "loading" ? (
						<p>Loading...</p>
					) : status === "error" ? (
						<span>Error: {error.message} </span>
					) : (
						status === "success" && (
							<>
								{photos.pages.map((page) => (
									<Fragment key={`${page.nextId}-?${page.prevId}`}>
										{page.data.map((data, i) => (
											<ImageButton
												className="break-inside-avoid"
												key={data.id}
												data={data}
												onClick={() => {
													setCurrentPhoto({
														...data,
														index: i,
													});
													router.replace(
														router.pathname,
														`/photos/${data.id}`,
														{
															shallow: true,
														}
													);
													open();
												}}
											/>
										))}
									</Fragment>
								))}
								<Modal
									classNames={{
										modal:
											"!my-10 md:!my-5 !mx-0 lg:!mx-5 !p-0 relative overflow-x-hidden !overflow-y-auto !w-screen md:!max-w-3xl lg:!max-w-5xl xl:!max-w-[calc(100%-10rem)] rounded-md",
										closeButton: "hidden",
										closeIcon: "hidden",
									}}
									center
									open={isOpen}
									onClose={() => {
										setCurrentPhoto(null);
										router.replace(router.pathname, "/", {
											shallow: true,
										});
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
														router.replace(
															router.pathname,
															`/photos/${photo.id}`,
															{
																shallow: true,
															}
														);
														setCurrentPhoto(photo);
													}}
												/>
											</PhotoDetail>
											<button
												type="button"
												className="hidden md:block fixed top-1/2 left-7 text-white/80 hover:text-white disabled:text-white/60"
												onClick={() => {
													const photoArr = photos.pages.flatMap(
														(page) => page.data
													)[currentPhoto.index - 1];
													setCurrentPhoto({
														...photoArr,
														index: currentPhoto.index - 1,
													});
												}}
												disabled={currentPhoto.index === 0}>
												<FaChevronLeft
													className="text-inherit  transition-default"
													size={30}
												/>
											</button>
											<button
												type="button"
												className="hidden md:block fixed top-1/2 right-7 text-white/80 hover:text-white disabled:text-white/60"
												onClick={() => {
													const photoArr = photos.pages.flatMap(
														(page) => page.data
													)[currentPhoto.index + 1];
													setCurrentPhoto({
														...photoArr,
														index: currentPhoto.index + 1,
													});
													console.log(photoArr);
												}}>
												<FaChevronRight
													className="text-inherit transition-default"
													size={30}
												/>
											</button>
										</>
									)}
								</Modal>
							</>
						)
					)}
				</section>
				{status === "success" && hasNextPage && (
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
		"https://unsplash.com/napi/photos/random"
	);

	return {
		props: {
			randomPhoto,
		},
	};
}
