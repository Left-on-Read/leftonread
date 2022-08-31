import * as Sentry from '@sentry/node'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import morgan from 'morgan'

import { LorRouter } from './router'

dotenv.config()

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5,
  enabled: process.env.NODE_ENV !== 'development',
})

const app: Express = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use((req, res, next) => {
  if (req.originalUrl.includes('stripe')) {
    next()
  } else {
    bodyParser.json()(req, res, next)
  }
})

app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/', (req: Request, res: Response) => {
  res.send('Left on Read Server')
})

app.use('/api', LorRouter)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
