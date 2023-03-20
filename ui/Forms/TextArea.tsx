interface TextAreaProps
	extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	className?: string;
	textAreaClass?: string;
	error?: string;
	touched?: boolean;
}

export function TextArea({
	className,
	textAreaClass,
	error,
	touched,
	...rest
}: TextAreaProps) {
	const hasError = !!error;

	return (
		<div className={`w-full flex gap-3 flex-col justify-end ${className}`}>
			<textarea
				className={`w-full min-h-[100px] h-full p-3 border rounded-md text-black outline-none focus:border-primary-main transition-default transition-colors ${textAreaClass}
        ${
					hasError
						? "focus:border-red-500 border-red-500"
						: "focus:border-primary-main border-gray-light"
				}
        `}
				{...rest}
			/>
			{touched && hasError && <p className="text-red-500 text-md">{error}</p>}
		</div>
	);
}
