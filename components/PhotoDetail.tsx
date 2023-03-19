import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCamera } from "react-icons/fi";
import { useQuery } from "react-query";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";
import { BsCalendar, BsShieldCheck } from "react-icons/bs";
import { IoMdShareAlt } from "react-icons/io";
import { HiOutlineLocationMarker } from "react-icons/hi";

import { PhotoDetailType } from "@/types/photos";
import { cn } from "@/services/local";
import { useDisclosure } from "@/hooks";
import { Button } from "./Button";
import { NextImage } from "./NextImage";

interface PhotoDetailProps {
	id: string;
	placeholderData: PhotoDetailType;
	children?: JSX.Element;
	noFetch?: boolean;
}

export function PhotoDetail({
	placeholderData,
	id,
	children,
	noFetch = false,
}: PhotoDetailProps) {
	const { isOpen: isZoom, toggle } = useDisclosure();

	const { data, isLoading } = useQuery<PhotoDetailType>(
		`photo-detail-${id}`,
		async () => {
			if (noFetch) return placeholderData;
			const { data } = await axios.get(`/api/photos/${id}`);
			return data;
		}
	);

	const resData = data || placeholderData;

	const {
		user,
		urls,
		alt_description,
		width,
		height,
		created_at,
		premium,
		blur_hash,
		exif,
		location,
		topics,
		downloads,
		views,
		tags,
	} = resData;

	const publishDate = new Intl.DateTimeFormat("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	}).format(new Date(created_at));

	const downloadImg = (url: string, desc: string) => {
		const a = document.createElement("a");

		a.href = url;
		a.download = desc;
		a.click();
	};

	return (
		<>
			<div className="p-3 md:px-6  bg-white w-full flex gap-3 flex-col md:flex-row items-center justify-between">
				<Link
					href={`/@${user.username}`}
					className="w-full  flex gap-2 items-center">
					<Image
						src={user.profile_image.medium}
						width={33}
						height={33}
						alt={user.name}
						className="rounded-full"
					/>

					<div className="text-white/80 hover:text-white">
						<p className="text-primary-main text-sm font-medium capitalize">
							{user.name}
						</p>
						<p className="text-primary-secondary font-light text-sm hover:text-primary-main transition-default">
							{user.username}
						</p>
					</div>
				</Link>
				<div className="w-full flex gap-2 items-center justify-between md:justify-end">
					<Button className="px-2 py-2 text-xl bg-white hover:border-primary-secondary">
						<AiFillHeart
							className=" text-primary-secondary rounded-md hover:text-primary-main transition-default cursor-pointer"
							title="Add To Favorites"
						/>
					</Button>
					<Button
						className="!py-2 text-sm"
						onClick={() => downloadImg(urls.raw, alt_description || user.name)}
						disabled={premium}>
						Download
					</Button>
				</div>
			</div>

			<NextImage
				className={cn(
					"mx-auto w-full h-auto cursor-zoom-in",
					width > height ? "max-w-5xl" : "max-3xl md:max-w-md",
					isLoading ? "invisible" : ""
				)}
				isLandscape={width > height}
				style={{
					zoom: isZoom ? 2 : 1,
				}}
				onClick={toggle}
				src={urls.full}
				width="0"
				height="0"
				sizes="100vw"
				placeholder="blur"
				blurDataURL={`data:image/jpg;base64,${blur_hash}`}
				alt={alt_description || user.name}
			/>

			<div className="px-3 md:px-6 py-5 grid gap-5 grid-cols-1 md:grid-cols-[300px_minmax(0,1fr)_100px] lg:grid-cols-[300px_minmax(0,1fr)_300px]">
				<div className="grid grid-cols-1 md:grid-cols-2">
					<div>
						<p className="text-primary-secondary text-sm">Views</p>
						<p className="text-md text-primary-main font-medium">
							{views ?? "--"}
						</p>
					</div>
					<div>
						<p className="text-primary-secondary text-sm">Downloads</p>
						<p className="text-md text-primary-main font-medium">
							{downloads ?? "--"}
						</p>
					</div>
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2">
					<div>
						<p className="text-primary-secondary text-sm">Featured in</p>
						<p className="text-md text-primary-main font-medium">
							{topics?.length
								? topics.map((topic) => topic.title).join(", ")
								: "--"}
						</p>
					</div>
					<div>
						<p className="text-primary-secondary text-sm">Dimensions</p>
						<p className="text-md text-primary-main font-medium">
							{width} X {height}
						</p>
					</div>
				</div>

				<div>
					<Button
						className="ml-auto text-sm !px-3 transition-default"
						iconLeft={<IoMdShareAlt className="text-xl text-inherit" />}>
						Share
					</Button>
				</div>
				<div>
					{(location.country || location.city || location.name) && (
						<p className="text-sm text-primary-secondary flex gap-2 items-center">
							<HiOutlineLocationMarker className="inline-block" />
							{location.name || `${location.city}, ${location.country}`}
						</p>
					)}
					<p className="text-sm my-2 text-primary-secondary flex gap-2 items-center">
						<BsCalendar className="inline-block" /> Published on {publishDate}
					</p>
					{(exif.name || exif.make || exif.model) && (
						<p className="text-sm my-2 text-primary-secondary flex gap-2 items-center">
							<FiCamera className="inline-block" />
							{exif.name || `${exif.make} ${exif.model}`}
						</p>
					)}
					<p className="text-sm text-primary-secondary flex gap-2 items-center">
						<BsShieldCheck className="inline-block" />{" "}
						{premium ? "License: Premium" : "License: Free"}
					</p>
				</div>
				<div className="md:col-span-2">
					<p className="text-md text-primary-main font-medium">
						{alt_description}
					</p>
				</div>
			</div>
			{children}
			<div className="p-3 pb-5 md:px-6 mx-auto w-[85%] mt-10">
				<h4 className="mb-4">Related Photos</h4>
				<div className="flex gap-3 items-center flex-wrap">
					{tags.map((tag) => (
						<Link
							href={`/s/photos/${tag.title}`}
							key={tag.title}
							className="bg-gray-200 text-primary-secondary hover:bg-gray-300 hover:text-primary-main p-2 text-sm capitalize transition-default !duration-200">
							{tag.title}
						</Link>
					))}
				</div>
			</div>
		</>
	);
}
