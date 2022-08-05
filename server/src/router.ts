import express from 'express'
import multer from 'multer'

import * as ContactController from './controllers/HelpController'

const upload = multer({ dest: './uploads' })

export const LorRouter = express.Router()

LorRouter.post(
  '/help',
  upload.single('logFile'),
  ContactController.handleHelpRequest
)
