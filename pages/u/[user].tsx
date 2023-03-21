import React from "react";
import axios, { AxiosError } from "axios";
import { GetServerSidePropsContext } from "next";
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
import { useInfiniteQuery } from "react-query";

import { UserDetailType } from "@/types/user";

import { Popover } from "@/ui/Popover";
import { PhotoType } from "@/types/photos";

import { Divider } from "@/ui";
import { MasonryImages } from "@/components/MasonryImages";

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
	const router = useRouter();
	const [latestId, setLatestId] = React.useState<string[]>([]);
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

	const modalClose = () => {
		router.replace(`/u/${router.query.user}`, `/u/${router.query.user}`, {
			shallow: true,
		});
	};

	const handleImageClick = (id: string) => {
		router.push(
			{
				pathname: `/u/[user]`,
				query: {
					user: router.query.user,
				},
			},
			`/photos/${id}`,
			{
				shallow: true,
			}
		);
	};

	return (
		<>
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
					{userDetails.location && (
						<Link
							href={{
								pathname: "/s/photos/[search]",
								query: { search: userDetails.location },
							}}
							className="text-md text-primary-secondary flex gap-1 items-center hover:text-primary-main transition-default">
							<HiOutlineLocationMarker className="inline-block text-inherit" />
							{userDetails.location}
						</Link>
					)}

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
				headTitle={`${userDetails.name} (@${userDetails.username}) • Desplash Community`}
			/>
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
