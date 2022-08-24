import express from 'express'
import multer from 'multer'

import * as HelpController from './controllers/HelpController'

const upload = multer({ dest: './uploads' })

export const LorRouter = express.Router()

LorRouter.post(
  '/help',
  upload.single('logFile'),
  HelpController.handleHelpRequest
)
