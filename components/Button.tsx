import { ButtonHTMLAttributes } from "react";
import { Spinner } from "./Spinner";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode;
	loading?: boolean;
	iconLeft?: React.ReactNode;
	iconRight?: React.ReactNode;
	ref?: React.Ref<HTMLButtonElement>;
}

export function Button({
	children,
	className,
	loading,
	disabled,
	iconLeft,
	iconRight,
	ref,
	...rest
}: ButtonProps) {
	return (
		<button
			ref={ref}
			type="button"
			className={`max-w-xs flex items-center gap-2 justify-center py-2 px-5 disabled:pointer-events-none disabled:opacity-60 text-primary-secondary text-md font-medium bg-white border border-gray-300 hover:text-primary-main hover:border-primary-secondary  rounded-md transition-default ${className}`}
			disabled={disabled || loading}
			{...rest}>
			{loading ? <Spinner className="w-5 h-5 mr-2" /> : iconLeft}
			{children}
			{iconRight}
		</button>
	);
}