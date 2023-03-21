import React from "react";
import { AxiosError } from "axios";
import { ImageButton } from "@/components/ImageButton";
import { PhotoDetail } from "@/components/PhotoDetail";
import { RelatedPhotos } from "@/components/RelatedPhotos";
import { useDisclosure } from "@/hooks";
import AuthLayout from "@/layouts/AuthLayout";
import { favoritesTable } from "@/services/local/db.config";
import { userAtom } from "@/services/local/store";
import { PhotoType } from "@/types/photos";
import { Button } from "@/ui";
import { DexieError } from "dexie";
import { useAtom, useAtomValue } from "jotai";
import Head from "next/head";
import router, { Router, useRouter } from "next/router";
import { Fragment, useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useInView } from "react-intersection-observer";
import { InfiniteData, useInfiniteQuery, useQuery } from "react-query";
import Modal from "react-responsive-modal";
import photos from "@/pages/api/photos";
import { cn } from "@/services/local";

interface MasonryImagesProps {
	status: "loading" | "error" | "success" | "idle";
	error: AxiosError | DexieError | null;
	photos?: InfiniteData<{
		photos: PhotoType[];
		nextId: number | null;
		prevId: number | null;
	}>;
	hasNextPage?: boolean;
	fetchNextPage: () => Promise<unknown>;
	onImageClick: (id: string) => void;
	onModalClose: () => void;
	isFetchingNextPage: boolean;
	headTitle: string;
	className?: string;
}

export function MasonryImages({
	error,
	status,
	photos,
	fetchNextPage,
	onModalClose,
	onImageClick,
	hasNextPage,
	isFetchingNextPage,
	headTitle,
	className,
}: MasonryImagesProps) {
	const { ref, inView } = useInView();
	const { isOpen, close, open } = useDisclosure();

	const [currentPhoto, setCurrentPhoto] = useState<PhotoType | null>(null);

	const handleFetchPage = () => hasNextPage && fetchNextPage();

	useEffect(() => {
		if (inView) {
			handleFetchPage();
		}
	}, [inView]);
	return (
		<>
			<Head>
				<title>{currentPhoto?.alt_description || headTitle}</title>
			</Head>
			<section
				className={cn(
					"mb-10 mx-auto max-w-6xl masonry-col-3 masonry-gap-3 transition-default",
					className
				)}>
				{status === "loading" ? (
					<p>Loading...</p>
				) : status === "error" ? (
					<span>Error: {error?.message} </span>
				) : (
					status === "success" && (
						<>
							{photos?.pages.map((page) => (
								<Fragment key={`${page.nextId}-?${page.prevId}`}>
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
												onImageClick(data.id);
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
									onModalClose();
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
													onImageClick(currentPhoto.id);
													setCurrentPhoto(photo);
												}}
											/>
										</PhotoDetail>
										<button
											type="button"
											className="hidden md:block fixed top-1/2 left-7 text-white/80 hover:text-white disabled:text-white/60"
											onClick={() => {
												const photoArr = photos?.pages.flatMap(
													(page) => page.photos
												)[currentPhoto.index - 1];
												if (photoArr)
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
												const photoArr = photos?.pages.flatMap(
													(page) => page.photos
												)[currentPhoto.index + 1];
												if (photoArr)
													setCurrentPhoto({
														...photoArr,
														index: currentPhoto.index + 1,
													});
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
