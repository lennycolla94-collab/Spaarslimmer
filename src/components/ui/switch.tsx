import * as React from "react"

export interface SwitchProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
  disabled?: boolean
  name?: string
  id?: string
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className = '', checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={() => {
          if (!disabled) {
            const newValue = !checked
            onCheckedChange?.(newValue)
          }
        }}
        disabled={disabled}
        className={`inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? 'bg-slate-900' : 'bg-slate-200'
        } ${className}`}
        role="switch"
        aria-checked={checked}
        {...props}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow-lg transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-1'
          }`}
        />
      </button>
    )
  }
)
Switch.displayName = "Switch"

export { Switch }
