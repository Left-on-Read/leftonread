import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express, { Express, Request, Response } from 'express'
import morgan from 'morgan'

import { LorRouter } from './router'

dotenv.config()

const app: Express = express()
const port = process.env.PORT || 8080

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.get('/', (req: Request, res: Response) => {
  res.send('Left on Read Server')
})

app.use('/api', LorRouter)

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${port}`)
})
