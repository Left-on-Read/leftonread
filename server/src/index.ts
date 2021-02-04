import express from 'express'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import morgan from 'morgan'

import router from './router'

const app = express()
app.use(bodyParser.json())
app.use(morgan('dev')) // TODO(teddy): Toggle output based on env

const mongoURI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/lorserver'

mongoose.connect(
  mongoURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) {
      console.error(err)
    } else {
      console.log(`Connected to database: ${mongoURI}`)
    }
  }
)

app.use(router)

const port = process.env.PORT || 9000

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
