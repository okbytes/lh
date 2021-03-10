import * as React from "react"
import { useRouter } from "next/router"
import { useAuth } from "utils/use-auth"
import { useForm } from "react-hook-form"
import { phoneRegEx, numRegEx } from "utils/form-validations"
import { isString } from "utils/guards"
import Input from "components/input"

type ContinueFormInputs = {
  email: string
  fullname: string
  numkids: string
  phone: string
  church: string
  country: string
}

const ContinueForm = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { register, handleSubmit, formState } = useForm<ContinueFormInputs>({
    criteriaMode: "all"
  })
  const { errors, isSubmitting, isSubmitSuccessful } = formState
  const next = router.query?.next ?? ""

  const onSubmit = handleSubmit(async (data) => {
    const { email, fullname, numkids, phone, church, country } = data
    const userEmail = user?.email ?? email
    try {
      await fetch("/api/mailchimp", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: userEmail, fullname, numkids, phone, church, country })
      })
      if (isString(next)) {
        return router.replace(next)
      }
      router.replace("/")
    } catch (error) {
      console.error(error)
    }
  })

  return (
    <>
      <label className="block font-semibold">Email</label>
      <p className="mb-2">{user?.email ?? "error loading email"}</p>
      <form onSubmit={onSubmit}>
        <Input
          ref={register({ required: "Full name is required" })}
          errs={errors.fullname?.message}
          name="fullname"
          label="Full name"
        />
        <Input
          ref={register({
            pattern: {
              value: phoneRegEx,
              message: "Must be valid phone number"
            },
            required: "Phone is required"
          })}
          errs={errors.phone?.message}
          name="phone"
          label="Phone"
        />
        <Input
          defaultValue={0}
          ref={register({
            pattern: { value: numRegEx, message: "Must be a number" },
            required: "Number of children is required",
            min: {
              value: 0,
              message: "Cannot be less than zero"
            }
          })}
          errs={errors.numkids?.message}
          name="numkids"
          label="Number of children"
        />
        <Input
          ref={register({ required: "Church/Institution is required" })}
          errs={errors.church?.message}
          name="church"
          label="Church/Institution"
        />
        <Input
          ref={register({ required: "Country is required" })}
          errs={errors.country?.message}
          name="country"
          label="Country"
        />

        <button
          className="block p-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-20"
          type="submit"
          disabled={isSubmitting || isSubmitSuccessful}
        >
          Continue
        </button>
      </form>
    </>
  )
}

export default ContinueForm
