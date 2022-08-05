import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import nodemailer from 'nodemailer'

export const handleHelpRequest = (req: Request, res: Response) => {
  const { email, reason, content } = req.body

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL || '',
      pass: process.env.EMAIL_PASSWORD || '',
    },
  })

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: `[${reason}] Return to ${email}`,
    html: content,
    attachments: [
      {
        filename: req.file?.originalname || '',
        path: req.file?.path || '',
      },
    ],
  }

  transporter.sendMail(mailOptions, function (err) {
    if (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(err)
    } else {
      return res.status(StatusCodes.OK).send()
    }
  })
}
