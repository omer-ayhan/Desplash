interface TooltipProps {
	children: React.ReactNode;
	text: React.ReactNode;
	className?: string;
}

export function Tooltip({ children, text, className }: TooltipProps) {
	return (
		<div className={`tooltip ${className}`}>
			{children}
			<span className="tooltip-text">{text}</span>
		</div>
	);
}
