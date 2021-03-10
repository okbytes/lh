import { useAuth } from "utils/use-auth"
import Link from "components/link"
import AuthCheck from "components/auth-check"

const Home = () => {
  const { user, signout } = useAuth()

  return (
    <>
      <h1>Home</h1>
      <AuthCheck>
        <div>{user?.email} - you're signed in</div>
        <button onClick={() => signout()}>signout</button>
      </AuthCheck>
      <div>
        <Link href="/example">example</Link>
      </div>
    </>
  )
}

export default Home
