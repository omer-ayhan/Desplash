import { cn, downloadFile } from "@/services/local";
import { PhotoType } from "@/types/photos";
import Image from "next/image";
import Link from "next/link";
import { AiFillHeart, AiOutlineArrowDown } from "react-icons/ai";
import { BiDownArrowAlt } from "react-icons/bi";
import { FiArrowDown } from "react-icons/fi";
import { Button } from "./Button";

interface ImageButtonProps {
	data: PhotoType;
	onClick?: () => void;
	width?: number;
	height?: number;
	className?: string;
}
export function ImageButton({
	data: { id, urls, alt_description, user, premium },
	width = 400,
	height = 500,
	className,
	onClick,
}: ImageButtonProps) {
	return (
		<div
			key={id}
			className={cn(
				"group relative mb-3 p-0 break-inside-avoid-column",
				className
			)}
			title={alt_description}>
			<Image
				key={id}
				// onClick={onClick}
				className="cursor-zoom-in"
				src={urls.regular}
				width={width}
				height={height}
				alt={alt_description || user.name}
				placeholder="blur"
				blurDataURL={urls.regular}
			/>
			<div
				onClick={onClick}
				className="group-hover:vignette absolute bottom-0 left-0 w-full h-full transition-default cursor-zoom-in"
			/>

			<AiFillHeart
				className="p-2 w-11 invisible group-hover:visible absolute top-4 right-4 text-primary-secondary bg-white rounded-md hover:text-primary-main"
				title="Add To Favorites"
				size={34}
			/>
			{!premium && (
				<button
					type="button"
					onClick={() => downloadFile(urls.full, user.username)}
					className="!py-1 !px-2 invisible group-hover:visible absolute bottom-4 right-4 text-primary-secondary bg-white rounded-md hover:text-primary-main">
					<FiArrowDown className="" size={22} />
				</button>
			)}
			<Link
				href={`/@${user.username}`}
				className="invisible group-hover:visible flex gap-2 items-center  absolute bottom-4 left-4">
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
