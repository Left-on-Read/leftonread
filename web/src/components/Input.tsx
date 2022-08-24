import Theme, { belowBreakpoint } from '../theme'

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
      css={{
        padding: '8px 12px',
        fontWeight: 300,
        borderRadius: '10px',
        color: 'black',
        border: `1px solid ${Theme.secondary.main}`,
        fontFamily: 'Roboto',
        outline: 'none',
        backgroundColor: '#F1F1F1',
        transition: 'border-color 200ms',
        '&:focus': {
          borderWidth: `2px`,
          borderColor: Theme.secondary.main,
        },
        '&:hover': {
          borderColor: Theme.secondary.main,
        },
        [belowBreakpoint.md]: {
          padding: '8px 8px',
        },
      }}
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
