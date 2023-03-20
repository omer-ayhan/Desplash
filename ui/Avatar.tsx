interface AvatarProps {
	src?: string | null;
	className?: string;
	alt: string;
}

export function Avatar({ alt, className, src }: AvatarProps) {
	return (
		<div
			className={`w-10 h-10 bg-primary-secondary grid place-content-center rounded-full overflow-hidden ${className}`}>
			{src ? (
				<img src={src} alt={alt} className="w-full h-full object-cover" />
			) : (
				<p className="text-lg font-medium text-white">
					{alt?.charAt(0).toUpperCase()}
				</p>
			)}
		</div>
	);
}
