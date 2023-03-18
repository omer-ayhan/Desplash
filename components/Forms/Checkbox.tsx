interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  checkboxClass?: string
  labelClass?: string
  error?: string
  touched?: boolean
}

export function Checkbox({
  label,
  id,
  className,
  checkboxClass,
  labelClass,
  error,
  touched,
  ...rest
}: CheckboxProps) {
  const hasError = !!error

  return (
    <div className={`flex gap-2 items-center ${className}`}>
      <input
        className={`peer relative appearance-none m-0 w-6 h-6 border-2 text-gray-medium grid cursor-pointer place-content-center rounded-md 
        disabled:text-gray-medium disabled:cursor-not-allowed disabled:border-gray-medium transition-default
        checked:border-primary-main
        before:checked:scale-100 before:w-3 before:h-3 before:rounded-md before:transition-transform before:transform before:origin-center before:scale-0 before:bg-primary-main before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2
        ${hasError && touched ? 'border-red-500' : 'border-gray-medium'}
        ${checkboxClass}
        `}
        type="checkbox"
        id={id}
        {...rest}
      />
      {label && (
        <label
          htmlFor={id}
          className={`peer-checked:text-primary-main text-gray-medium text-lg cursor-pointer ${labelClass}`}
        >
          {label}
        </label>
      )}
    </div>
  )
}
