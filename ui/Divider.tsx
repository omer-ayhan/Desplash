interface DividerProps {
	children?: string;
	textClass?: string;
	className?: string;
}

export function Divider({ children, textClass, className }: DividerProps) {
	const hasChildren = children && typeof children === "string";
	return (
		<div className={`flex items-center ${className}`}>
			<hr
				className={`flex-grow border-t-1 border-primary-main/20 ${
					hasChildren ? "mr-4" : ""
				}`}
			/>
			{hasChildren && (
				<>
					<span className={`text-gray-500 font-medium text-lg ${textClass}`}>
						{children}
					</span>
					<hr className="flex-grow border-t-2 border-primary-main/20 ml-4" />
				</>
			)}
		</div>
	);
}
