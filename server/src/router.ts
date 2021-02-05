import express from 'express'
import * as EmailController from './controllers/emailController'

const router = express.Router()

router.get('/', (_, res) => {
  res.send('Left on Read API')
})

router.route('/notify').post(EmailController.notifyMe)

export default router
