import * as React from "react"
import { useRouter } from "next/router"
import { useForm } from "react-hook-form"

import { useAuth } from "utils/use-auth"
import { emailRegEx } from "utils/form-validations"
import { isString } from "utils/guards"

import Input from "components/input"
import ContinueForm from "components/continue-form"

type SignInInputs = {
  email: string
}

const Signin = () => {
  const router = useRouter()
  const { sendSignInLink, signInWithGoogle } = useAuth()
  const [isNewUser, setIsNewUser] = React.useState(false)
  const { register, handleSubmit, formState } = useForm<SignInInputs>({ criteriaMode: "all" })
  const { errors, isSubmitting, isSubmitSuccessful } = formState
  const next = router.query?.next ?? ""

  const onSubmit = handleSubmit(({ email }) => {
    if (isString(next)) {
      return sendSignInLink(email, next)
    }
    sendSignInLink(email, "/")
  })

  const handleProvider = () => {
    signInWithGoogle().then((newUser) => {
      if (newUser === true) {
        setIsNewUser(true)
      }
    })
  }

  if (isNewUser) {
    return <ContinueForm />
  }

  if (isSubmitSuccessful) {
    return (
      <>
        <h3>check your email</h3>
      </>
    )
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <Input
          ref={register({
            pattern: {
              value: emailRegEx,
              message: "Must be valid email address"
            },
            required: "Email is required"
          })}
          errs={errors.email?.message}
          name="email"
          label="Email"
        />
        <button
          className="block p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-20"
          type="submit"
          disabled={isSubmitting || isSubmitSuccessful}
        >
          Send email link
        </button>
      </form>
      <div>—or—</div>
      <button onClick={handleProvider}>Sign in with Google</button>
    </>
  )
}

export default Signin
