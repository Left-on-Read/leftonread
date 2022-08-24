import Theme, { belowBreakpoint } from '../theme'

export default function Button({
  type,
  label,
  onClick,
  className,
  disabled,
  secondary,
  ...props
}: {
  type?: 'submit' | 'button' | 'reset'
  label: React.ReactNode
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  className?: string
  disabled?: boolean
  secondary?: boolean
}) {
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      css={{
        backgroundColor: Theme[secondary ? 'secondary' : 'primary'].main,
        padding: '16px 32px',
        fontSize: '26px',
        fontWeight: 300,
        borderRadius: '10px',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'Roboto',
        boxShadow: `0px 6px 4px ${Theme.semantics.shadow}`,
        outline: 'none',
        transition: 'background-color 200ms',
        [belowBreakpoint.sm]: {
          padding: '12px 26px',
          fontSize: '22px',
        },
        '&:hover': {
          backgroundColor: Theme[secondary ? 'secondary' : 'primary'].hover,
        },
      }}
      disabled={disabled}
      {...props}
    >
      {label}
    </button>
  )
}
