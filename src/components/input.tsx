import * as React from "react"
import cn from "clsx"

type Props = {
  errs: string | undefined
  label: string
  name: string
  defaultValue?: string | number
}

const Input = React.forwardRef<HTMLInputElement, Props>(({ errs, label, name, ...rest }, ref) => {
  return (
    <>
      <label className="block font-semibold mb-1" htmlFor={name}>
        {label}
      </label>
      <input
        ref={ref}
        name={name}
        id={name}
        type="text"
        aria-invalid={errs ? "true" : "false"}
        className={cn({ "mb-2": !errs, "mb-0.5 border border-red-500": errs })}
        {...rest}
      />
      <span className={cn({ "block mb-2 text-red-500": errs })} role="alert">
        {errs}
      </span>
    </>
  )
})
export default Input
