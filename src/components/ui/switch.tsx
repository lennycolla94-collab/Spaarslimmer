import * as React from "react"

export interface SwitchProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
  }

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = '', checked, onCheckedChange, onChange, ...props }, ref) => {
    return (
      <button
        type="button"
        onClick={() => {
          const newValue = !checked
          onCheckedChange?.(newValue)
        }}
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
