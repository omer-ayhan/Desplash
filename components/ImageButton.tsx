import { PhotoType } from "@/types/photos";
import Image from "next/image";
import Link from "next/link";
import { AiFillHeart, AiOutlineArrowDown } from "react-icons/ai";

interface ImageButtonProps {
	data: PhotoType;
	onClick?: () => void;
}
export function ImageButton({
	data: { links, id, urls, alt_description, user, premium },
	onClick,
}: ImageButtonProps) {
	return (
		<button
			key={id}
			onClick={onClick}
			className="group relative mb-3 p-0 break-inside-avoid-column cursor-zoom-in"
			title={alt_description}>
			<Image
				key={id}
				src={urls.regular}
				width={400}
				height={500}
				alt={alt_description || user.name}
				placeholder="blur"
				blurDataURL={urls.regular}
			/>
			<div className="group-hover:vignette absolute bottom-0 left-0 w-full h-full transition-default" />

			<AiFillHeart
				className="p-2 w-11 invisible group-hover:visible absolute top-4 right-4 text-primary-secondary bg-white rounded-md hover:text-primary-main"
				title="Add To Favorites"
				size={34}
			/>
			{!premium && (
				<a href={links.download} download>
					<AiOutlineArrowDown
						className="invisible group-hover:visible p-2 w-11 absolute bottom-4 right-4 text-primary-secondary bg-white rounded-md hover:text-primary-main"
						size={34}
					/>
				</a>
			)}
			<div className="invisible group-hover:visible flex gap-2 items-center  absolute bottom-4 left-4">
				<Image
					src={user.profile_image.medium}
					width={35}
					height={35}
					alt={user.name}
					className="rounded-full"
				/>
				<Link href="/" className="text-sm text-white/80 hover:text-white">
					{user.name}
				</Link>
			</div>
		</button>
	);
}
