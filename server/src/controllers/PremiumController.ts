import { Request, Response } from 'express'
import { GoogleSpreadsheet } from 'google-spreadsheet'
import { StatusCodes } from 'http-status-codes'
import nodemailer from 'nodemailer'
import Stripe from 'stripe'
import { v4 as uuidv4 } from 'uuid'

import { getEmailTemplate } from '../emailTemplate'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
  apiVersion: '2022-08-01',
})

const getSheet = async () => {
  const doc = new GoogleSpreadsheet(process.env.GSHEET_ID)

  await doc.useServiceAccountAuth({
    // env var values are copied from service account credentials generated by google
    // see "Authentication" section in docs for more info
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ?? '',
    private_key: (process.env.GOOGLE_PRIVATE_KEY ?? '').replace(/\\n/g, '\n'),
  })

  await doc.loadInfo()

  return doc.sheetsByIndex[0]
}

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

    // Insert license key into database
    const gsheet = await getSheet()
    await gsheet.addRow({
      licenseKey,
    })

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
      subject: `Left on Read: Gold Unlocked!`,
      html: getEmailTemplate(licenseKey), // TODO: Update this content...
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
  const { licenseKey, registrationId } = req.body

  const sheet = await getSheet()
  const rows = await sheet.getRows()

  const foundRow = rows.find((row) => row.licenseKey === licenseKey)

  if (!foundRow) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      isActivated: false,
      message: 'This is an invalid license key.',
    })
  }

  if (
    foundRow.registrationId !== '' &&
    foundRow.registrationId !== undefined &&
    foundRow.registrationId !== registrationId
  ) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      isActivated: false,
      message: 'This license key has already been registered.',
    })
  }

  foundRow.registrationId = registrationId
  await foundRow.save()

  return res.status(StatusCodes.OK).json({
    isActivated: true,
    message: 'License key activated!',
  })
}
