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
import { GetServerSidePropsContext } from "next";

export default function Home({
	initialValue,
}: {
	initialValue: {
		data: PhotoType[];
		nextId: number | null;
		prevId: number | null;
		heroValue: {
			cover_photo: PhotoType;
			title: string;
			description: string;
			slugs: string;
			id: string;
		};
	};
}) {
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
	} = useInfiniteQuery<
		{
			data: PhotoType[];
			nextId: number | null;
			prevId: number | null;
		},
		AxiosError
	>(
		`topics-${router.query.topic}`,
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
			}>(`/api/topics/${router.query.topic}?per_page=12&page=${pageParam}`, {
				signal,
			});

			return {
				...photoRes,
				data: photoRes.data.filter((p) => !latestId.includes(p.id)),
			};
		},
		{
			initialData: {
				pageParams: [1],
				pages: [
					{
						data: initialValue.data,
						nextId: initialValue.nextId,
						prevId: initialValue.prevId,
					},
				],
			},
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
						(initialValue.heroValue.title &&
							`${initialValue.heroValue.title} | Desplash`) ||
						"Desplash"}
				</title>

				{initialValue.heroValue.description && (
					<meta
						name="description"
						content={initialValue.heroValue.description}
					/>
				)}
			</Head>
			<div>
				<section className="relative grid gap-5 place-content-center  w-screen h-[700px] bg-blend-darken overflow-hidden">
					<Image
						src={initialValue.heroValue.cover_photo.urls.full}
						fill
						className="-z-50 object-cover"
						alt={initialValue.heroValue.cover_photo.alt_description}
					/>
					<div className="-z-40 absolute w-full h-full bg-primary-main/30" />

					<h1 className="text-center text-5xl font-medium text-white">
						{initialValue.heroValue.title}
					</h1>
					<p className="mx-auto max-w-md text-center text-white text-lg">
						{initialValue.heroValue.description}
					</p>
					<p className="absolute bottom-5 left-5 text-sm text-white/80">
						Photo by{" "}
						<Link
							href="/"
							className="text-white/90 hover:text-white transition-default">
							{initialValue.heroValue.cover_photo.user.name}
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
									<Fragment key={`${page.nextId}-?${page.prevId}`}>
										{page.data.map((data, i) => (
											<ImageButton
												key={data.id}
												className="break-inside-avoid"
												data={data}
												onClick={() => {
													setCurrentPhoto({
														...data,
														index: i,
													});
													router.push(
														{
															pathname: `/topics/[topic]`,
															query: {
																topic: router.query.topic,
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
										router.replace(
											`/topics/${router.query.topic}`,
											`/topics/${router.query.topic}`,
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
																pathname: `/topics/[topic]`,
																query: {
																	topic: router.query.topic,
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

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
	const { topic } = query;

	// Get data from your database
	const { data, headers } = await axios.get(
		`https://unsplash.com/napi/topics/${topic}/photos?per_page=12&page=1&xp=search-quality-boosting%3Acontrol`
	);

	const { data: heroValue } = await axios.get(
		`https://unsplash.com/napi/topics/${topic}`
	);

	const linkHeader = headers.link;
	const hasNextLink = linkHeader?.includes('rel="next"');
	const pageParam = Number(1);

	return {
		props: {
			initialValue: {
				data,
				nextId: hasNextLink ? pageParam + 1 : null,
				prevId: pageParam > 1 ? pageParam - 1 : pageParam === 1 ? 1 : null,
				heroValue: heroValue,
			},
		},
	};
}
