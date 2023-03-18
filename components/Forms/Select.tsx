import { useDetectOutside, useDisclosure } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

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
				className={`relative z-10 flex items-center p-2 text-md text-gray-medium font-light bg-white border border-transparent rounded-md outline-none transition-default 
        disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-medium
        ${buttonClass} ${isOpen ? activeButtonClass : ""}`}
				disabled={disabled}>
				{iconStart}
				<span className="mx-1">
					{options.find(({ value }) => value === selected)?.label}
				</span>
				{iconEnd || (
					<FiChevronDown
						size={20}
						className={`ml-auto text-end transition-default ${
							isOpen
								? "transform rotate-180 text-primary-main"
								: "text-gray-medium"
						}`}
					/>
				)}
			</button>

			<ul
				className={`${
					isOpen ? "visible opacity-100 top-10" : "invisible opacity-0 top-28"
				} absolute left-0 z-20 w-56 py-2 mt-2 overflow-hidden bg-white rounded-md shadow-lg transition-default ${popupClass}`}>
				{options.map(({ value, label }, i) => (
					<li
						key={`${value}.!!.${i}`}
						onClick={() => {
							setSelected(value);
							onChange?.(value);
							close();
						}}
						className="block px-4 py-3 text-md text-gray-medium capitalize transition-colors duration-200 transform hover:bg-primary-main cursor-pointer hover:text-white">
						{label}
					</li>
				))}
			</ul>
		</div>
	);
}
