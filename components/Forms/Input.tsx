import { InputHTMLAttributes, ReactElement } from "react";
import { IconType } from "react-icons";
import { Tooltip } from "./Tooltip";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
	id?: string;
	label?: string;
	className?: string;
	labelClass?: string;
	inputClass?: string;
	error?: string;
	touched?: boolean;
	icon?: ReactElement<IconType>;
	infoIcon?: ReactElement<IconType>;
	info?: string;
}

export function Input({
	id,
	label,
	className = "",
	labelClass,
	inputClass,
	touched,
	error,
	icon,
	info,
	infoIcon,
	...rest
}: InputProps) {
	const hasError = !!error;
	return (
		<div className={`relative ${className}`}>
			{label && (
				<label
					className={`block text-black text-lg ${labelClass}`}
					htmlFor={id}>
					{label}
				</label>
			)}
			<input
				className={`relative w-full ${icon ? "!pl-8" : ""} p-3 border ${
					hasError
						? "focus:border-red-500 border-red-500"
						: "focus:border-gray-300"
				} outline-none rounded-[5px] transition-default transition-colors ${inputClass}`}
				id={id}
				{...rest}
			/>
			{icon && (
				<label
					htmlFor={id}
					className="absolute top-1/2 -translate-y-1/2 left-2">
					{icon}
				</label>
			)}

			{info && (
				<Tooltip
					className={`!absolute -translate-y-1/2 right-2 ${
						hasError && touched ? "top-[calc(50%-12px)]" : "top-1/2"
					}`}
					text={info}>
					{infoIcon || "icon"}
				</Tooltip>
			)}
			{touched && hasError && <p className="text-red-500 text-md">{error}</p>}
		</div>
	);
}
