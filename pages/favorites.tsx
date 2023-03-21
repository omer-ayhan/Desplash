import { DexieError } from "dexie";
import { useAtomValue } from "jotai";
import { useRouter } from "next/router";
import { useState } from "react";
import { useInfiniteQuery } from "react-query";

import { favoritesTable } from "@/services/local/db.config";
import { userAtom } from "@/services/local/store";
import { PhotoType } from "@/types/photos";

import AuthLayout from "@/layouts/AuthLayout";
import { MasonryImages } from "@/components/MasonryImages";

export default function Favorites() {
	const router = useRouter();
	const user = useAtomValue(userAtom);

	const [latestId, setLatestId] = useState<string[]>([]);

	const {
		data: photos,
		hasNextPage,
		fetchNextPage,
		isFetchingNextPage,
		error,
		status,
	} = useInfiniteQuery<
		{
			photos: (PhotoType & { uid: string })[];
			nextId: number | null;
			prevId: number | null;
		},
		DexieError
	>(
		"favorites",
		async ({ pageParam }) => {
			const db = await favoritesTable.where("uid").equals(user?.uid).toArray();

			const slicedPhotos = db.slice(
				pageParam ? pageParam * 10 : 0,
				pageParam ? (pageParam + 1) * 10 : 10
			);
			if (slicedPhotos.length === 0)
				return {
					photos: [],
					nextId: null,
					prevId: null,
				};

			return {
				photos: slicedPhotos.filter((photo) => !latestId.includes(photo.id)),
				nextId: pageParam ? pageParam + 1 : 1,
				prevId: pageParam ? pageParam - 1 : null,
			};
		},
		{
			getNextPageParam: (lastPage) => {
				return lastPage.nextId;
			},
			onSuccess: (data) => {
				setLatestId(data.pages.flatMap((page) => page.photos).map((p) => p.id));
			},
		}
	);

	const modalClose = () => {
		router.replace(`/favorites`, `/favorites`, {
			shallow: true,
		});
	};

	const handleImageClick = (id: string) => {
		router.push(
			{
				pathname: `/favorites`,
			},
			`/photos/${id}`,
			{
				shallow: true,
			}
		);
	};

	return (
		<AuthLayout>
			<section className="my-4">
				<h1 className="text-center text-4xl font-medium">Your Favorites</h1>
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
				headTitle="Favorites"
			/>
		</AuthLayout>
	);
}
