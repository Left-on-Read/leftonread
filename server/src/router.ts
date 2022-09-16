import express from 'express'
import multer from 'multer'

import * as ContactsController from './controllers/ContactsController'
import * as HelpController from './controllers/HelpController'
import * as PremiumController from './controllers/PremiumController'

const upload = multer({ dest: './uploads' })

export const LorRouter = express.Router()

LorRouter.post(
  '/help',
  upload.single('logFile'),
  HelpController.handleHelpRequest
)

LorRouter.post(
  '/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  PremiumController.handleStripeWebhookEvent
)

LorRouter.post('/contact', ContactsController.addContact)

LorRouter.post('/activate', PremiumController.verifyLicenseKey)
