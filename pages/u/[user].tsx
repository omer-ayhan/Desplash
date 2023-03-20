import React, { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import {
	AiOutlineInstagram,
	AiOutlineLink,
	AiOutlineTwitter,
} from "react-icons/ai";
import { HiOutlineLocationMarker, HiPhotograph } from "react-icons/hi";
import { BiWorld } from "react-icons/bi";

import { UserDetailType } from "@/types/user";

import { Popover } from "@/components/Popover";
import { PhotoType } from "@/types/photos";
import { useInfiniteQuery } from "react-query";
import { ImageButton } from "@/components/ImageButton";
import { IoMdClose } from "react-icons/io";
import { PhotoDetail } from "@/components/PhotoDetail";
import { RelatedPhotos } from "@/components/RelatedPhotos";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Modal from "react-responsive-modal";
import { Button } from "@/components/Button";
import { useInView } from "react-intersection-observer";
import { useDisclosure } from "@/hooks";
import { Divider } from "@/components/Divider";

interface ProfilePageProps {
	userDetails: UserDetailType;
	userPhotosInitial: {
		photos: PhotoType[];
		nextId: number | null;
		prevId: number | null;
	};
}

export default function ProfilePage({
	userDetails,
	userPhotosInitial,
}: ProfilePageProps) {
	const { ref, inView } = useInView();

	const router = useRouter();
	const { isOpen, close, open } = useDisclosure();
	const [latestId, setLatestId] = React.useState<string[]>([]);
	const [currentPhoto, setCurrentPhoto] = React.useState<PhotoType | null>(
		null
	);
	const username = (router.query.user as string).replace("@", "");

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
		[`user-${router.query.user}}`],
		async ({ pageParam = 1, signal }) => {
			if (!pageParam)
				return {
					photos: [],
					nextId: null,
					prevId: null,
				};
			const { data: photoRes } = await axios.get<{
				photos: PhotoType[];
				nextId: number | null;
				prevId: number | null;
			}>(`/api/users/${username}/photos?per_page=12&page=${pageParam}`, {
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
				pages: [userPhotosInitial],
			},
			getNextPageParam: (lastPage) => lastPage.nextId,
			onSuccess: (data) => {
				setLatestId(data.pages.flatMap((page) => page.photos).map((p) => p.id));
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
					{`${userDetails.name} (@${userDetails.username}) • Desplash Community`}
				</title>
			</Head>
			<section className="mt-12 px-5 pb-5 mx-auto max-w-2xl flex flex-col md:flex-row items-center  md:items-start gap-4">
				<Image
					className="rounded-full"
					src={`${userDetails.profile_image.large}&dpr=2&auto=format&fit=crop&w=150&h=150&q=60&crop=faces&bg=fff`}
					width={150}
					height={150}
					alt={userDetails.name || userDetails.username}
					quality={100}
				/>
				<div className="flex flex-col gap-3">
					<h1 className="text-3xl font-bold">{userDetails.name}</h1>
					<p className="text-md my-2">
						{userDetails.bio ||
							`Download free, beautiful high-quality photos curated by ${userDetails.name}.`}
					</p>
					<Link
						href={{
							pathname: "/s/photos/[search]",
							query: { search: userDetails.location },
						}}
						className="text-md text-primary-secondary flex gap-1 items-center hover:text-primary-main transition-default">
						<HiOutlineLocationMarker className="inline-block text-inherit" />
						{userDetails.location}
					</Link>

					<Popover
						iconStart={<AiOutlineLink className="inline-block" />}
						label={`Connect With ${userDetails.name}`}
						buttonClass="!p-0"
						popoverClass="max-w-xs">
						<ul className="py-2">
							{userDetails.instagram_username && (
								<li className="hover:bg-gray-100 transition-default link-default">
									<a
										href={`https://www.instagram.com/${userDetails.instagram_username}`}
										className="flex items-center gap-2 p-2"
										target="_blank">
										<AiOutlineInstagram className="text-lg" /> Instagram
									</a>
								</li>
							)}
							{userDetails.twitter_username && (
								<li className="hover:bg-gray-100 transition-default link-default">
									<a
										href={`https://www.twitter.com/${userDetails.twitter_username}`}
										className="flex items-center gap-2 p-2"
										target="_blank">
										<AiOutlineTwitter className="text-lg" /> Twitter
									</a>
								</li>
							)}
							{userDetails.portfolio_url && (
								<li className="hover:bg-gray-100 transition-default link-default">
									<a
										href={userDetails.portfolio_url}
										className="flex items-center gap-2 p-2"
										target="_blank">
										<BiWorld className="text-lg" />
										<span className="truncate">
											{userDetails.portfolio_url}
										</span>
									</a>
								</li>
							)}
						</ul>
					</Popover>

					{!!userDetails.tags.custom.length && (
						<>
							<p className="text-md">Interests</p>

							<div className="flex gap-2 flex-wrap items-center">
								{userDetails.tags.custom.map(({ title }) => (
									<Link
										key={`tag-${title}`}
										href={`/s/photos/${title}`}
										className="px-2 py-1 capitalize text-primary-secondary text-md lg:text-sm bg-gray-200 hover:bg-gray-300 hover:text-primary-main transition-default">
										{title}
									</Link>
								))}
							</div>
						</>
					)}
				</div>
			</section>
			<section className="w-screen sticky top-[4rem] bg-white z-40">
				<button
					type="button"
					className="mx-5 max-w-min pb-2 flex items-center font-medium gap-1 border-b-2
				whitespace-nowrap border-primary-main">
					<HiPhotograph className="text-xl" />

					<p className="text-md">Photos {userDetails.total_photos}</p>
				</button>
				<Divider className="absolute w-full bottom-0" />
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
								<React.Fragment key={`${page.nextId}-?${page.prevId}`}>
									{page.photos.map((data, i) => (
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
														pathname: `/u/[user]`,
														query: {
															user: router.query.user,
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
										`/u/${router.query.user}`,
										`/u/${router.query.user}`,
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
															pathname: `/u/[user]`,
															query: {
																user: router.query.user,
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
			{status === "success" && hasNextPage && (
				<div ref={ref}>
					<Button
						className="mx-auto my-5"
						onClick={handleFetchPage}
						loading={isFetchingNextPage}>
						Load More
					</Button>
				</div>
			)}
		</>
	);
}

export async function getServerSideProps({ query }: GetServerSidePropsContext) {
	const { user } = query as { user: string };

	const username = user.replace("@", "");

	const [{ data: userDetails }, { data: userPhotosInitial, headers }] =
		await Promise.all([
			await axios.get<UserDetailType>(
				`https://unsplash.com/napi/users/${username}`
			),
			await axios.get<PhotoType[]>(
				`https://unsplash.com/napi/users/${username}/photos?per_page=20&order_by=latest&page=1&xp=search-quality-boosting%3Acontrol`
			),
		]);

	const linkHeader = headers.link;
	const hasNextLink = linkHeader?.includes('rel="next"');
	const pageParam = Number(1);

	return {
		props: {
			userDetails,
			userPhotosInitial: {
				photos: userPhotosInitial,
				nextId: hasNextLink ? pageParam + 1 : null,
				prevId: pageParam > 1 ? pageParam - 1 : pageParam === 1 ? 1 : null,
			},
		},
	};
}
