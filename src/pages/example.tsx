import Link from "next/link"
import AuthCheck from "components/auth-check"

const Example = () => {
  return (
    <div>
      <div>Example</div>

      <AuthCheck />
      <div>
        <Link href="/">Home</Link>
      </div>
    </div>
  )
}

export default Example
