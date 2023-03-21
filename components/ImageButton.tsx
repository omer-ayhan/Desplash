import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AiFillHeart } from "react-icons/ai";
import { FiArrowDown } from "react-icons/fi";
import { FaChevronDown } from "react-icons/fa";
import { useAtomValue, useSetAtom } from "jotai";

import { cn, downloadFile } from "@/services/local";
import { PhotoType } from "@/types/photos";
import { loginModalAtom, userAtom } from "@/services/local/store";
import { favoritesTable } from "@/services/local/db.config";
import { queryClient } from "@/pages/_app";

import { Button, Popover } from "@/ui";

interface ImageButtonProps {
	data: PhotoType;
	onClick?: () => void;
	width?: number;
	height?: number;
	className?: string;
}
export function ImageButton({
	data,
	width = 800,
	height = 900,
	className,
	onClick,
}: ImageButtonProps) {
	const { id, urls, alt_description, user, premium } = data;

	const currUser = useAtomValue(userAtom);
	const setModal = useSetAtom(loginModalAtom);

	const [isLiked, SetIsLiked] = useState(false);

	const checkLiked = async () => {
		try {
			if (!currUser?.uid) {
				SetIsLiked(false);
				return;
			}
			const liked = await favoritesTable.get({
				id: data.id,
			});

			SetIsLiked(!!liked?.id);
		} catch (error) {
			SetIsLiked(false);
		}
	};

	useEffect(() => {
		checkLiked();
	}, []);

	const handleLike = async () => {
		try {
			if (!currUser?.uid) {
				setModal({
					isOpen: true,
					img: urls.regular,
				});

				throw new Error("You must be logged in to like a photo");
			}
			const favExists = await favoritesTable.get({
				id: data.id,
			});

			if (favExists) {
				await favoritesTable.delete(favExists.id);
				SetIsLiked(false);
				return;
			}

			const favRes = await favoritesTable.add({
				...data,
				uid: currUser.uid,
			});

			SetIsLiked(true);

			console.log(favRes);
		} catch (error) {
			console.log(error);
		} finally {
			queryClient.clear();
			queryClient.invalidateQueries("favorites");
		}
	};

	return (
		<div
			key={id}
			className={cn(
				"my-5 md:mt-0 md:mb-3 group relative p-0 break-inside-avoid-column",
				className
			)}
			title={alt_description}>
			<div className="w-full p-2 bg-white md:hidden flex gap-2 items-center">
				<Link href={`/u/@${user.username}`}>
					<Image
						src={user.profile_image.medium}
						width={33}
						height={33}
						alt={user.name}
						className="rounded-full"
					/>
				</Link>

				<Link href={`/u/@${user.username}`}>
					<div className="text-white/80 hover:text-white">
						<p className="text-primary-main text-sm font-medium capitalize">
							{user.name}
						</p>
						<p className="text-primary-secondary font-light text-sm hover:text-primary-main transition-default">
							@{user.username}
						</p>
					</div>
				</Link>
			</div>

			<Image
				key={id}
				className="cursor-zoom-in"
				onClick={onClick}
				src={urls.regular}
				width={width}
				height={height}
				alt={alt_description || user.name}
				placeholder="blur"
				blurDataURL={urls.regular}
			/>

			<div className="p-3 w-full flex md:hidden gap-2 items-center justify-between md:justify-end">
				<Button
					onClick={handleLike}
					className={cn(
						"!px-3 py-2 text-xl transition-default rounded-md cursor-pointer",
						isLiked
							? "border-none bg-red-500 text-white"
							: "text-primary-secondary bg-white hover:text-primary-main"
					)}
					title="Add To Favorites">
					<AiFillHeart size={18} />
				</Button>
				<div className="flex items-stretch">
					<Button
						className="!py-2 text-sm border-gray-300 !border-r-white rounded-r-none"
						onClick={() => downloadFile(urls.raw, alt_description || user.name)}
						disabled={premium}>
						Download Free
					</Button>
					<Popover
						buttonClass="border !border-gray-300 h-full rounded-l-none transition-default"
						popoverClass="w-60 right-0 py-2 !bg-primary-main !border-primary-main text-white rounded-md shadow-md"
						iconStart={<FaChevronDown className="transition-default" />}
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

			<div
				onClick={onClick}
				className="md:group-hover:vignette absolute bottom-0 left-0 w-full h-full transition-default cursor-zoom-in -z-50 md:z-30"
			/>

			<AiFillHeart
				onClick={handleLike}
				className={cn(
					"hidden md:block p-2 w-11 invisible group-hover:visible absolute top-4 right-4 rounded-md cursor-pointer z-40 transition-default",
					isLiked
						? "border-none bg-red-500 text-white"
						: "text-primary-secondary bg-white hover:text-primary-main"
				)}
				title="Add To Favorites"
				size={34}
			/>
			{!premium && (
				<button
					type="button"
					onClick={() => downloadFile(urls.full, user.username)}
					className="hidden md:block !py-2 !px-2 invisible group-hover:visible absolute bottom-4 right-4 text-primary-secondary bg-white rounded-md hover:text-primary-main z-40">
					<FiArrowDown className="" size={22} />
				</button>
			)}
			<Link
				href={`/u/@${user.username}`}
				className="hidden md:flex invisible group-hover:visible  gap-2 items-center  absolute bottom-4 left-4 z-40">
				<Image
					src={user.profile_image.medium}
					width={35}
					height={35}
					alt={user.name}
					className="rounded-full"
				/>
				<p className="text-sm text-white/80 hover:text-white">{user.name}</p>
			</Link>
		</div>
	);
}
