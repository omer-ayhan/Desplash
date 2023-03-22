import Head from "next/head";
import { useState } from "react";
import Image from "next/image";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import axios, { AxiosError } from "axios";
import { useInfiniteQuery } from "react-query";

import { PhotoType } from "@/types/photos";

import { MasonryImages } from "@/components/MasonryImages";

interface HomePageProps {
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
}

export default function Home({ initialValue }: HomePageProps) {
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
		`topics-${router.query.topic}`,
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
			}>(`/api/topics/${router.query.topic}?per_page=12&page=${pageParam}`, {
				signal,
			});

			return {
				...photoRes,
				photos: photoRes.data.filter((p) => !latestId.includes(p.id)),
			};
		},
		{
			initialData: {
				pageParams: [1],
				pages: [
					{
						photos: initialValue.data,
						nextId: initialValue.nextId,
						prevId: initialValue.prevId,
					},
				],
			},
			getNextPageParam: (lastPage) => lastPage.nextId,
			onSuccess: (data) => {
				setLatestId(data.pages.flatMap((page) => page.photos).map((p) => p.id));
			},
		}
	);

	const modalClose = () => {
		router.replace(
			`/topics/${router.query.topic}`,
			`/topics/${router.query.topic}`,
			{
				shallow: true,
			}
		);
	};

	const handleImageClick = (id: string) => {
		router.push(
			{
				pathname: `/topics/[topic]`,
				query: {
					topic: router.query.topic,
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
			<Head>
				{initialValue.heroValue.description && (
					<meta
						name="description"
						content={initialValue.heroValue.description}
					/>
				)}
			</Head>
			<section className="relative grid gap-5 place-content-center  w-screen h-[700px] bg-blend-darken overflow-hidden">
				<Image
					src={initialValue.heroValue.cover_photo.urls.full}
					fill
					className="-z-50 object-cover"
					alt={initialValue.heroValue.cover_photo.alt_description}
					priority
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
				headTitle={
					(initialValue.heroValue.title &&
						`${initialValue.heroValue.title} | Desplash`) ||
					"Desplash"
				}
			/>
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
