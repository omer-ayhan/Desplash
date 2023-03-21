import { cn } from "@/services/local";

interface AvatarProps {
	src?: string | null;
	className?: string;
	alt: string;
	size?: number;
}

export function Avatar({ alt, className, src, size }: AvatarProps) {
	return (
		<div
			className={cn(
				"w-10 h-10 bg-primary-secondary grid place-content-center rounded-full overflow-hidden",

				className
			)}
			style={{ width: size, height: size }}>
			{src ? (
				<img src={src} alt={alt} className="w-full h-full object-cover" />
			) : (
				<p
					className="text-lg font-medium text-white"
					{...(size && {
						style: {
							fontSize: size ? size / 2 : 20,
						},
					})}>
					{alt?.charAt(0).toUpperCase()}
				</p>
			)}
		</div>
	);
}
