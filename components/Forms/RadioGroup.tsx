import { Primitives } from "@/types/general";

interface RadioProps {
	defaultVal?: Primitives;
	containerClass?: string;
	labelClass?: string;
	titleClass?: string;
	options: {
		value: Primitives;
		label: string;
		disabled?: boolean;
	}[];
	onChange?: (name: string, value: Primitives) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	label?: string;
	name: string;
	title?: string;
	disableAll?: boolean;
	className?: string;
}

export function RadioGroup({
	defaultVal,
	name,
	titleClass = "",
	containerClass = "",
	labelClass = "",
	className = "",
	options,
	onChange,
	label,
	onBlur,
	title,
	disableAll,
	...rest
}: RadioProps) {
	return (
		<div title={title} className={className}>
			{label && (
				<p className="mb-4 font-medium text-black text-lg capitalize">
					{label}
				</p>
			)}
			<div className={`flex gap-5 ${containerClass}`}>
				{options.map(({ label, value, disabled }, i) => (
					<label
						key={`${i}.!.${i}`}
						className={`flex text-lg text-gray-medium items-center gap-2 cursor-pointer transition-default ${labelClass}`}>
						<input
							type="radio"
							name={name}
							className="peer appearance-none m-0 w-6 h-6 border-2 checked:border-primary-main border-gray-medium text-gray-medium relative grid place-content-center rounded-full 
              before:w-6 before:h-6 before:bg-primary-main before:scale-0 before:checked:scale-100 before:border-0
               before:transition-default before:transform before:origin-center before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full
               disabled:text-gray-medium disabled:cursor-not-allowed disabled:border-gray-medium
               disabled:before:bg-gray-medium disabled:cursor-not-allowed disabled:before:scale-0
               "
							onChange={() => onChange?.(name, value)}
							onBlur={onBlur}
							defaultChecked={defaultVal === value}
							disabled={disableAll || disabled}
							{...rest}
						/>
						<span className="peer-checked:text-primary-main peer-disabled:text-gray-medium">
							{label}
						</span>
					</label>
				))}
			</div>
		</div>
	);
}
