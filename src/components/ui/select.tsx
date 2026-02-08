import * as React from "react"
import { ChevronDown } from "lucide-react"

const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className = '', ...props }, ref) => (
    <div className="relative w-full">
      <select
        ref={ref}
        className={`appearance-none w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 pr-10 ${className}`}
        {...props}
      />
      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 opacity-50 pointer-events-none" />
    </div>
  )
)
Select.displayName = "Select"

const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = '', ...props }, ref) => (
  <button
    ref={ref}
    className={`inline-flex items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full h-9 ${className}`}
    {...props}
  >
    <span className="flex-1 text-left" />
    <ChevronDown className="h-4 w-4 opacity-50" />
  </button>
))
SelectTrigger.displayName = "SelectTrigger"

const SelectContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border border-slate-200 bg-white shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${className}`}
    {...props}
  />
))
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: string }
>(({ className = '', ...props }, ref) => (
  <div
    ref={ref}
    className={`relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-slate-100 focus:text-slate-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-slate-100 ${className}`}
    {...props}
  />
))
SelectItem.displayName = "SelectItem"

const SelectValue = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className = '', ...props }, ref) => (
  <span ref={ref} className={className} {...props} />
))
SelectValue.displayName = "SelectValue"

export { Select, SelectTrigger, SelectContent, SelectItem, SelectValue }
