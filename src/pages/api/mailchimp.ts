import type { NextApiRequest, NextApiResponse } from "next"
import md5 from "md5"
import { isString } from "utils/guards"
import { emailRegEx, phoneRegEx, numRegEx } from "utils/form-validations"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { email, fullname, numkids, phone, church, country } = req.body

  if (!email || !fullname || !numkids || !phone || !church || !country) {
    return res.status(400).json({ error: "Missing required fields." })
  }
  const isEmailValid = new RegExp(emailRegEx)
  if (!isString(email) || !isEmailValid.test(email)) {
    return res.status(400).json({ error: "Invalid email." })
  }
  const isPhoneValid = new RegExp(phoneRegEx)
  if (!isPhoneValid.test(phone)) {
    return res.status(400).json({ error: "Invalid phone." })
  }
  const isNumValid = new RegExp(numRegEx)
  if (!isNumValid.test(numkids)) {
    return res.status(400).json({ error: "Invalid numkids." })
  }

  try {
    const LIST_ID = process.env.MAILCHIMP_LIST_ID
    const API_KEY = process.env.MAILCHIMP_API_KEY
    const DATACENTER = API_KEY ? API_KEY.split("-")[1] : "us7"
    const emailHash = md5(email)

    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members/${emailHash}`
    await fetch(url, {
      method: "PUT",
      mode: "cors",
      cache: "default",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `apikey ${API_KEY}`
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        status_if_new: "subscribed",
        merge_fields: {
          FULLNAME: fullname,
          NUMKIDS: numkids,
          PHONE: phone,
          CHURCH: church,
          COUNTRY: country
        }
      })
    })

    return res.send({ status: "success" })
  } catch (error) {
    // If error due to email already in list then return success response
    // rather than an error (the user doesn't need to know).
    if (error.title === "Member Exists") {
      return res.send({ status: "success" })
    }
    return res.status(500).json({
      status: "error",
      error: error.message || error.toString()
    })
  }
}
