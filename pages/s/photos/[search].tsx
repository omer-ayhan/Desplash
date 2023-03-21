import React from "react";
import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import axios, { AxiosError } from "axios";
import { useInfiniteQuery } from "react-query";

import { PhotoType } from "@/types/photos";

import { MasonryImages } from "@/components/MasonryImages";

interface SerchPageProps {
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
}

export default function SearchPhoto({ initialData }: SerchPageProps) {
	const router = useRouter();
	const [latestId, setLatestId] = React.useState<string[]>([]);

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
		[`search-${router.query.search}}`],
		async ({ pageParam = 1, signal }) => {
			if (!pageParam)
				return {
					photos: [],
					nextId: null,
					prevId: null,
					meta: {},
				};

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

	const modalClose = () => {
		router.replace(
			`/s/photos/${router.query.search}`,
			`/s/photos/${router.query.search}`,
			{
				shallow: true,
			}
		);
	};

	const handleImageClick = (id: string) => {
		router.push(
			{
				pathname: `/s/photos/[search]`,
				query: {
					search: router.query.search,
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
			<section className="pt-1 pb-5 mx-auto max-w-6xl relative   w-screen  bg-blend-darken overflow-hidden">
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
			<MasonryImages
				error={error}
				fetchNextPage={fetchNextPage}
				hasNextPage={hasNextPage}
				isFetchingNextPage={isFetchingNextPage}
				photos={photos}
				status={status}
				onModalClose={modalClose}
				onImageClick={handleImageClick}
				headTitle={
					initialData.meta.title ||
					`${
						(router.query.search as string).charAt(0).toUpperCase() +
						(router.query.search as string).slice(1).toLowerCase()
					} Photos`
				}
			/>
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
