import * as React from "react"
import router from "next/router"
import type { UserCredential, UserInfo } from "@firebase/auth-types"
import firebase from "utils/firebase"
import { isString } from "utils/guards"
import qs from "utils/qs"
import analytics from "utils/analytics"

const auth = firebase.auth()

interface AuthContext {
  user: UserInfo | null
  signout: () => Promise<void>
  sendSignInLink: (email: string, next: string | null) => Promise<void>
  handleSignInLink: () => Promise<boolean | undefined>
  signInWithGoogle: () => Promise<boolean | undefined>
}

const authContext = React.createContext<AuthContext>(null!)

interface ProvideAuthProps {
  children: React.ReactNode
}

export const ProvideAuth = ({ children }: ProvideAuthProps) => {
  const auth = useAuthProvider()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => React.useContext(authContext)

function useAuthProvider() {
  const [user, setUser] = React.useState<UserInfo | null>(null)

  // Connect analytics session to user
  useIdentifyUser(user)

  // Handle response from authentication functions
  const handleAuth = async (response: UserCredential) => {
    const { user, additionalUserInfo } = response
    // Ensure Firebase is actually ready before we continue
    await waitOnFirebase()
    // Update user in state
    setUser(user)
    // handle new user
    if (additionalUserInfo?.isNewUser) {
      return true
    }
    const next = qs("next")
    if (isString(next)) {
      return router.replace(next)
    }
    router.replace("/")
  }

  const sendSignInLink = async (email: string, next: string | null) => {
    const hasReturnUrl = next ? `?next=${next}` : ""
    const actionCode = {
      url: `${window.location.origin}/cont${hasReturnUrl}`,
      handleCodeInApp: true
    }
    return auth.sendSignInLinkToEmail(email, actionCode).then(() => {
      window.localStorage.setItem("emailForSignIn", email)
    })
  }

  const handleSignInLink = async () => {
    if (auth.isSignInWithEmailLink(window.location.href)) {
      var email = window.localStorage.getItem("emailForSignIn")
      if (!email) {
        email = window.prompt("Please provide your email for confirmation")
      }
      if (!isString(email)) {
        throw new Error("Invalid email")
      }
      return auth.signInWithEmailLink(email, window.location.href).then(handleAuth)
    }
  }

  const signInWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider()
    return firebase.auth().signInWithPopup(provider).then(handleAuth)
  }

  const signout = async () => {
    return auth.signOut()
  }

  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })
    return () => unsubscribe()
  }, [])

  return {
    user,
    signout,
    sendSignInLink,
    handleSignInLink,
    signInWithGoogle
  }
}

// Connect analytics session to current user.uid
function useIdentifyUser(user: UserInfo | null) {
  React.useEffect(() => {
    if (user) {
      analytics.identify(user.uid)
    }
  }, [user])
}

// Waits on Firebase user to be initialized before resolving promise
const waitOnFirebase = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        resolve(user) // Resolve promise when we have a user
        unsubscribe() // Prevent from firing again
      }
    })
  })
}
