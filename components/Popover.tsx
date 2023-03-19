import { useDetectOutside, useDisclosure } from "@/hooks";
import { cn } from "@/services/local";
import React, { useRef } from "react";

interface PopoverProps {
	popoverClass?: string;
	children: JSX.Element | JSX.Element[];
	label: string;
	iconStart?: JSX.Element;
	iconEnd?: JSX.Element;
	buttonClass?: string;
}

export function Popover({
	popoverClass = "",
	label,
	iconStart,
	iconEnd,
	children,
	buttonClass,
}: PopoverProps) {
	const { isOpen, toggle, close } = useDisclosure();
	const ref = useRef<HTMLDivElement>(null);

	useDetectOutside<HTMLDivElement>({
		ref,
		cb: close,
	});

	return (
		<div ref={ref} className="relative">
			<button
				type="button"
				className={cn(
					"p-2 px-3 text-primary-secondary flex gap-1 items-center hover:border-gray-300 hover:text-primary-main rounded-md transition-default",
					buttonClass
				)}
				onClick={toggle}>
				{iconStart}
				{label}
				{iconEnd}
			</button>
			<div
				className={cn(
					isOpen ? "scale-100 opacity-100" : " scale-0 opacity-0",
					"absolute top-10 left-0 z-50 border border-gray-300 bg-white rounded-md shadow-xl transition-bezier overflow-hidden",
					popoverClass
				)}>
				{children}
			</div>
		</div>
	);
}
