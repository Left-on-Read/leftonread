import { Request, Response } from 'express'
import { Email } from '../models/emailModel'

const basicEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const notifyMe = async (req: Request, res: Response) => {
  const { email } = req.body

  if (!email) {
    res.status(400).json({
      message: 'Invalid request - missing email.',
    })
    return
  }

  if (!basicEmailRegex.test(email)) {
    res.status(400).json({
      message: 'Invalid request - bad email.',
    })
    return
  }

  await Email.build({ email }).save()

  res.status(201).json({
    message: `Successfully signed ${email} up.`,
  })
}
