import * as postmark from "postmark"

interface Event {
  name: string
  email: string
  subject?: string
  message: string
  referer: string
  // http?: {
  //   headers: Record<string, string>
  //   method: "POST" | "GET" | "PUT" | "DELETE"
  //   path?: string
  // }
  // todo: how the hell do we get these headers
}

export const main = async ({ name, email, subject, message, referer }: Event) => {
  const POSTMARK_SENDER = process.env.POSTMARK_SENDER
  if (!POSTMARK_SENDER) {
    throw new Error("Missing required environment variables.")
  }
  // IMPORTANT TODO: verify noreply/mailbot@wvgg.co as valid sender

  if (!message || !email) {
    throw new Error("Missing required parameters")
  }

  const whitelist = JSON.parse(process.env.WHITELIST) as Record<string, string>
  if (typeof whitelist !== "object") {
    throw new Error("Invalid whitelist.")
  }
  const recipientDomain = Object.keys(whitelist).find((validDomain) => referer.includes(validDomain))
  const recipient = whitelist[recipientDomain]
  if (!recipient) {
    throw new Error("Domain is not whitelisted.")
  }
  console.log("recipient", recipient)

  const client = new postmark.ServerClient(process.env.POSTMARK_API_KEY!)

  const result = await client.sendEmail({
    From: POSTMARK_SENDER,
    ReplyTo: `${name} <${email}>`,
    To: recipient,
    Subject: ["website feedback", subject].join(": "),
    TextBody: message,
    MessageStream: "outbound",
  })

  return result
}
