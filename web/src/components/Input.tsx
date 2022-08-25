export default function Input({
  placeholder,
  className,
  value,
  onChange,
  disabled,
  ...props
}: {
  placeholder?: string
  className?: string
  value: string
  onChange?: (arg0: string) => void
  disabled?: boolean
}) {
  return (
    <input
      className={className}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        if (onChange) {
          onChange(e.target.value)
        }
      }}
      disabled={disabled}
      {...props}
    />
  )
}
