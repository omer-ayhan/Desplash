import Head from "next/head";
import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { IoMdClose } from "react-icons/io";
import axios, { AxiosError } from "axios";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import { Modal } from "react-responsive-modal";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

import { PhotoType } from "@/types/photos";

import { Button } from "@/components/Button";
import { ImageButton } from "@/components/ImageButton";
import { useDisclosure } from "@/hooks";
import { PhotoDetail } from "@/components/PhotoDetail";
import { RelatedPhotos } from "@/components/RelatedPhotos";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

export default function SearchPhoto({
	initialData,
}: {
	initialData: {
		photos: PhotoType[];
		meta: {
			keyword: string;
			title: string;
			description: null | string;
			index: boolean;
		};
		related: {
			title: string;
		}[];
		nextId: number | null;
		prevId: number | null;
	};
}) {
	const { ref, inView } = useInView();
	const router = useRouter();
	const { isOpen, close, open } = useDisclosure();
	const [latestId, setLatestId] = React.useState<string[]>([]);
	const [currentPhoto, setCurrentPhoto] = React.useState<PhotoType | null>(
		null
	);

	const formatTitle = (title: string) => {
		let decoded = decodeURIComponent(title);
		let words = decoded.split(" ");
		let capitalized = words
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
			.join(" ");
		return capitalized;
	};

	const {
		status,
		data: photos,
		error,
		isFetchingNextPage,
		fetchNextPage,
	} = useInfiniteQuery<
		{
			photos: PhotoType[];
			nextId: number | null;
			prevId: number | null;
		},
		AxiosError
	>(
		[`search-${router.query.search}}`],
		async ({ pageParam = 1, signal }) => {
			const { data: photoRes } = await axios.get<{
				photos: PhotoType[];
				meta: {
					keyword: string;
					title: string;
					description: null | string;
					index: boolean;
				};
				nextId: number | null;
				prevId: number | null;
			}>(`/api/search?per_page=12&page=${pageParam}&q=${router.query.search}`, {
				signal,
			});

			return {
				nextId: photoRes.nextId,
				prevId: photoRes.prevId,
				photos: photoRes.photos.filter((photo) => !latestId.includes(photo.id)),
			};
		},
		{
			initialData: {
				pageParams: [1],
				pages: [
					{
						photos: initialData.photos,
						nextId: initialData.nextId,
						prevId: initialData.prevId,
					},
				],
			},
			getNextPageParam: (lastPage) => lastPage.nextId,
			onSuccess: (data) => {
				setLatestId(data.pages.flatMap((page) => page.photos).map((p) => p.id));
			},
		}
	);

	const handleFetchPage = () => fetchNextPage();

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
						initialData.meta.title ||
						`${
							(router.query.search as string).charAt(0).toUpperCase() +
							(router.query.search as string).slice(1).toLowerCase()
						} Photos`}
				</title>
			</Head>
			<div>
				<section className="mt-32 pb-5 mx-auto max-w-6xl relative   w-screen  bg-blend-darken overflow-hidden">
					<h2 className="capitalize font-medium">{router.query.search}</h2>
					<div className="flex items-center gap-3 flex-wrap">
						{initialData.related.map((related) => (
							<Link
								className="p-3 px-5 border border-gay-300 text-primary-secondary text-sm 
								hover:border-primary-secondary hover:text-primary-main
								font-medium capitalize rounded-md transition-default"
								href={`/s/photos/${related.title.replace(/ /gi, "-")}`}
								key={related.title}>
								{related.title}
							</Link>
						))}
					</div>
				</section>
				<section className="mb-10 mx-auto max-w-6xl masonry-col-3 masonry-gap-3 transition-default">
					{status === "loading" ? (
						<p>Loading...</p>
					) : status === "error" ? (
						<span>Error: {error.message} </span>
					) : (
						status === "success" && (
							<>
								{photos.pages.map((page) => (
									<React.Fragment key={`${page.nextId}-?${page.prevId}`}>
										{page.photos.map((data, i) => (
											<ImageButton
												key={data.id}
												data={data}
												onClick={() => {
													setCurrentPhoto({
														...data,
														index: i,
													});
													router.push(
														{
															pathname: `/s/photos/[search]`,
															query: {
																search: router.query.search,
															},
														},
														`/photos/${data.id}`,
														{
															shallow: true,
														}
													);
													open();
												}}
											/>
										))}
									</React.Fragment>
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
										router.replace(
											`/s/photos/${router.query.search}`,
											`/s/photos/${router.query.search}`,
											{
												shallow: true,
											}
										);
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
														router.push(
															{
																pathname: `/s/photos/[search]`,
																query: {
																	search: router.query.search,
																},
															},
															`/photos/${currentPhoto.id}`,
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
														(page) => page.photos
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
														(page) => page.photos
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
				{status === "success" && (
					<div ref={ref}>
						<Button
							className="mx-auto my-5"
							onClick={handleFetchPage}
							loading={isFetchingNextPage}>
							Load More
						</Button>
					</div>
				)}
			</div>
		</>
	);
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
	const { search } = query;
	const { data, headers } = await axios.get(
		`https://unsplash.com/napi/search?query=${search}&per_page=12&page=1&xp=search-quality-boosting%3Acontrol`
	);

	const linkHeader = headers.link;
	const hasNextLink = linkHeader?.includes('rel="next"');
	const pageParam = 1;

	return {
		props: {
			initialData: {
				photos: data.photos.results,
				meta: data.meta,
				nextId: hasNextLink ? pageParam + 1 : null,
				prevId: pageParam > 1 ? pageParam - 1 : pageParam === 1 ? 1 : null,
				related: data.related_searches,
			},
		},
	};
}
