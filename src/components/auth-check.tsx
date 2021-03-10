import { useRouter } from "next/router"
import { useAuth } from "utils/use-auth"
import Link from "components/link"

interface AuthCheckProps {
  children?: React.ReactNode
}

const AuthCheck = ({ children }: AuthCheckProps) => {
  const router = useRouter()
  const { user } = useAuth()

  if (user) {
    return <>{children ? children : null}</>
  }

  return (
    <Link
      href={{
        pathname: "/signin",
        query: { next: router.pathname }
      }}
    >
      Sign in
    </Link>
  )
}

export default AuthCheck
