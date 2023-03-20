import { useDetectOutside, useDisclosure } from "@/hooks";
import { cn } from "@/services/local";
import React, { useRef } from "react";

interface PopoverProps {
	popoverClass?: string;
	children: JSX.Element | JSX.Element[];
	label?: string | JSX.Element;
	iconStart?: JSX.Element;
	iconEnd?: JSX.Element;
	buttonClass?: string;
	className?: string;
	disabled?: boolean;
}

export function Popover({
	popoverClass = "",
	label,
	iconStart,
	iconEnd,
	children,
	buttonClass,
	className,
	disabled = false,
}: PopoverProps) {
	const { isOpen, toggle, close } = useDisclosure();
	const ref = useRef<HTMLDivElement>(null);

	useDetectOutside<HTMLDivElement>({
		ref,
		cb: close,
	});

	return (
		<div ref={ref} className={cn("relative", className)}>
			<button
				type="button"
				className={cn(
					"p-2 px-3 text-primary-secondary flex gap-1 items-center hover:border-gray-300 hover:text-primary-main rounded-md transition-default",
					disabled
						? "cursor-not-allowed disabled:opacity-50"
						: "cursor-pointer",
					buttonClass
				)}
				onClick={toggle}
				disabled={disabled}>
				{iconStart}
				{label}
				{iconEnd}
			</button>
			<div
				className={cn(
					isOpen ? "scale-100 opacity-100" : " scale-0 opacity-0",
					"absolute top-10 z-50 border border-gray-300 bg-white rounded-md shadow-xl transition-bezier overflow-hidden",
					popoverClass
				)}>
				{children}
			</div>
		</div>
	);
}
