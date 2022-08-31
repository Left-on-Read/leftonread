import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import nodemailer from 'nodemailer'
import Stripe from 'stripe'
import { v4 as uuidv4 } from 'uuid'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2022-08-01',
})

export const handleStripeWebhookEvent = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']

  let event: Stripe.Event

  try {
    if (!sig) {
      throw new Error('missing sig')
    }

    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ''
    )
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(`❌ Error message: ${err.message}`)
    }
    return res.status(StatusCodes.BAD_REQUEST).send(`Webhook Error: ${err}`)
  }

  if (event.type === 'payment_intent.succeeded') {
    const stripeObject: Stripe.PaymentIntent = event.data
      .object as Stripe.PaymentIntent

    const customerEmail = stripeObject.charges?.data[0].billing_details.email

    if (!customerEmail) {
      throw new Error('Missing customer email')
    }

    //  Generate license key,
    const licenseKey = `LOR-${uuidv4()}`

    // TODO: Insert license key into database
    // db.insert(licenseKey)

    // Compose email with License Key
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL || '',
        pass: process.env.EMAIL_PASSWORD || '',
      },
    })

    const mailOptions = {
      from: process.env.EMAIL, // TODO: Perhaps update this email?
      to: customerEmail,
      subject: `Left on Read Premium License Key`,
      html: licenseKey, // TODO: Update this content...
    }

    // Send the email
    await transporter.sendMail(mailOptions, function (err) {
      if (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err)
      }
    })
  }

  return res.status(StatusCodes.OK).send()
}

export const verifyLicenseKey = async (req: Request, res: Response) => {
  // TODO: Add a db check for the license key
  // const { licenseKey, deviceId } = req.body
  // const isValid = db.check(licenseKey);

  // TODO: Update the db so that this license key is used with this device id
  // db.update(licenseKey, deviceId)

  const isActivated = 1 === 1

  //   return res.status(StatusCodes.BAD_REQUEST).json({
  //     message: 'This license key has already been activated on another device.',
  //   })

  return res.status(StatusCodes.OK).json({
    isActivated,
  })
}
