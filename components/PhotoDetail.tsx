import { MouseEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCamera } from "react-icons/fi";
import { useQuery } from "react-query";
import { AiFillHeart } from "react-icons/ai";
import axios from "axios";
import { BsCalendar, BsShieldCheck } from "react-icons/bs";
import { IoMdShareAlt } from "react-icons/io";
import { HiOutlineLocationMarker } from "react-icons/hi";
import {
	FaChevronDown,
	FaEnvelope,
	FaFacebook,
	FaPinterest,
	FaTwitter,
} from "react-icons/fa";

import { PhotoDetailType } from "@/types/photos";
import { useDisclosure } from "@/hooks";
import { cn, downloadFile } from "@/services/local";

import { Button, Divider, Popover } from "@/ui";
import { NextImage } from "./NextImage";
import { useMainStore } from "@/services/local/store";

interface PhotoDetailProps {
	id: string;
	placeholderData: PhotoDetailType;
	children?: JSX.Element;
	noFetch?: boolean;
	className?: string;
}

export function PhotoDetail({
	placeholderData,
	id,
	children,
	noFetch = false,
	className,
}: PhotoDetailProps) {
	const { isOpen: isZoom, toggle } = useDisclosure();
	const [isCopied, setIsCopied] = useState(false);
	const { currUser, setModal } = useMainStore((store) => ({
		currUser: store.user,
		setModal: store.setLoginModal,
	}));

	const { data, isLoading } = useQuery<PhotoDetailType>(
		`photo-detail-${id}`,
		async () => {
			if (noFetch) return placeholderData;
			const { data } = await axios.get(`/api/photos/${id}`);
			return data;
		}
	);

	const handleLike = () => {
		if (!currUser?.uid) {
			setModal({
				isOpen: true,
				img: urls.regular,
			});
		} else {
			console.log("liked");
		}
	};

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

	const handleCopy = (e: MouseEvent<HTMLButtonElement>) => {
		navigator.clipboard.writeText(urls.full);
		setIsCopied(true);
		setTimeout(() => setIsCopied(false), 400);
	};

	return (
		<>
			<div
				className={cn(
					"p-3 md:px-6  bg-white w-full flex gap-3 flex-col md:flex-row items-center justify-between",
					className
				)}>
				<Link
					href={`/u/@${user.username}`}
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
					<Button
						onClick={handleLike}
						className="px-2 py-2 text-xl text-primary-secondary hover:text-primary-main bg-white transition-default rounded-md cursor-pointer"
						title="Add To Favorites">
						<AiFillHeart />
					</Button>
					<div className="flex items-stretch">
						<Button
							className="!py-2 text-sm bg-green-400 hover:bg-green-500 !border-transparent !border-r-white !text-white rounded-r-none"
							onClick={() =>
								downloadFile(urls.raw, alt_description || user.name)
							}
							disabled={premium}>
							Download Free
						</Button>
						<Popover
							buttonClass="bg-green-400 hover:bg-green-500 h-full rounded-l-none transition-default
							"
							popoverClass="w-60 right-0 py-2 !bg-primary-main !border-primary-main text-white rounded-md shadow-md"
							iconStart={
								<FaChevronDown className="text-white transition-default" />
							}
							disabled={premium}>
							<ul className="w-full">
								<li
									className="text-end text-sm px-3 py-2  hover:bg-primary-secondary/50 transition-default cursor-pointer"
									onClick={() =>
										downloadFile(urls.small, alt_description || user.name)
									}>
									Small <span className="text-md">(640 x 960)</span>
								</li>
								<li
									className="text-end text-sm px-3 py-2  hover:bg-primary-secondary/50 transition-default cursor-pointer"
									onClick={() =>
										downloadFile(urls.regular, alt_description || user.name)
									}>
									Medium <span className="text-md">(1920 x 2880)</span>
								</li>
								<li
									className="text-end text-sm px-3 py-2  hover:bg-primary-secondary/50 transition-default cursor-pointer"
									onClick={() =>
										downloadFile(urls.full, alt_description || user.name)
									}>
									Large <span className="text-md">(2400 x 3600)</span>
								</li>
								<li
									className="text-end text-sm px-3 py-2  hover:bg-primary-secondary/50 transition-default cursor-pointer"
									onClick={() =>
										downloadFile(urls.raw, alt_description || user.name)
									}>
									Original Size <span className="text-md">(5760 x 8640)</span>
								</li>
							</ul>
						</Popover>
					</div>
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
				<div className="flex justify-end">
					<Popover
						className="pr-2"
						buttonClass="ml-auto text-sm !px-3 transition-default border hover:border-primary-secondary rounded-md"
						label="Share"
						iconStart={<IoMdShareAlt className="text-xl text-inherit" />}>
						<ul>
							<li className="py-2 px-3 text-primary-secondary hover:text-primary-main hover:bg-gray-200 transition-default">
								<a
									href={`https://www.facebook.com/sharer/sharer.php?u=${urls.full}`}
									target="_blank"
									rel="noreferrer"
									className="flex gap-2 items-center text-sm font-medium text-inherit">
									<FaFacebook className="text-xl text-blue-600" />
									Facebook
								</a>
							</li>
							<li className="py-2 px-3 text-primary-secondary hover:text-primary-main hover:bg-gray-200 transition-default">
								<a
									href={`https://www.twitter.com/intent/tweet?url=${urls.full}`}
									target="_blank"
									rel="noreferrer"
									className="flex gap-2 items-center text-sm font-medium text-inherit">
									<FaTwitter className="text-xl text-blue-300" />
									Twitter
								</a>
							</li>
							<li className="py-2 px-3 text-primary-secondary hover:text-primary-main hover:bg-gray-200 transition-default">
								<a
									href={`https://www.pinterest.com/pin/create/button/?url=${urls.full}`}
									target="_blank"
									rel="noreferrer"
									className="flex gap-2 items-center text-sm font-medium text-inherit">
									<FaPinterest className="text-xl text-red-600" />
									Pinterest
								</a>
							</li>
							<li className="py-2 px-3 text-primary-secondary hover:text-primary-main hover:bg-gray-200 transition-default">
								<a
									href={`mailto:?subject=${
										alt_description || `Photo By ${user.name}`
									}&body=${urls.full}`}
									target="_blank"
									rel="noreferrer"
									className="flex gap-2 items-center text-sm font-medium text-inherit">
									<FaEnvelope className="text-xl text-primary-secondary" />
									Mail
								</a>
							</li>
							<Divider />
							<li className="py-2 px-3 text-primary-secondary hover:text-primary-main hover:bg-gray-200 transition-default">
								<button
									type="button"
									onClick={handleCopy}
									className="flex gap-2 items-center text-sm font-medium text-inherit">
									<FaPinterest className="text-xl text-red-600" />
									{isCopied ? "Copied" : "Copy link"}
								</button>
							</li>
						</ul>
					</Popover>
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
			{!!tags?.length && (
				<div className="p-3 pb-5 md:px-6 mx-auto w-[85%] mt-10">
					<h4 className="mb-4">Related Tags</h4>
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
			)}
		</>
	);
}
