import { useEffect, useRef, useState } from "react";
import { MdOutlineArrowDropDown } from "react-icons/md";

import { useDetectOutside, useDisclosure } from "@/hooks";

interface SelectProps {
	options: {
		value: string;
		label: string;
	}[];
	defaultVal?: string;
	disabled?: boolean;
	onChange?: (value: string) => void;
	className?: string;
	buttonClass?: string;
	activeButtonClass?: string;
	popupClass?: string;
	value?: string;
	iconStart?: JSX.Element;
	iconEnd?: JSX.Element;
}

export function Select({
	options,
	onChange,
	defaultVal,
	value,
	className = "",
	buttonClass = "",
	activeButtonClass = "",
	popupClass = "",
	iconStart,
	iconEnd,
	disabled,
}: SelectProps) {
	const { isOpen, toggle, close } = useDisclosure();
	const [selected, setSelected] = useState(defaultVal || options[0].value);
	const ref = useRef<HTMLDivElement>(null);

	useDetectOutside<HTMLDivElement>({
		ref,
		cb: close,
	});

	useEffect(() => {
		if (value) setSelected(value);
	}, [value]);

	return (
		<div ref={ref} className={`relative flex justify-start ${className}`}>
			<button
				type="button"
				onClick={toggle}
				className={`relative z-10 flex gap-1 items-center py-2 text-md text-primary-secondary bg-white border border-transparent rounded-md outline-none  
        disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-primary-secondary
        ${buttonClass} ${isOpen ? activeButtonClass : ""}`}
				disabled={disabled}>
				{iconStart}
				{options.find(({ value }) => value === selected)?.label}
				{iconEnd || (
					<MdOutlineArrowDropDown
						size={20}
						className={`ml-auto text-end transition-default ${
							isOpen ? "text-primary-main" : "text-primary-secondary"
						}`}
					/>
				)}
			</button>

			<ul
				className={`${
					isOpen ? "scale-100 opacity-100" : " scale-0 opacity-0"
				} absolute top-10 left-0 z-20 min-w-min border border-gray-300 w-56 py-2 mt-2 bg-white rounded-md shadow-xl transition-bezier overflow-hidden ${popupClass}`}>
				{options.map(({ value, label }, i) => (
					<li
						key={`${value}.!!.${i}`}
						onClick={() => {
							setSelected(value);
							onChange?.(value);
							close();
						}}
						className="block px-4 py-3 text-md text-primary-secondary capitalize transition-colors duration-200 transform hover:bg-primary-secondary/10 cursor-pointer">
						{label}
					</li>
				))}
			</ul>
		</div>
	);
}
