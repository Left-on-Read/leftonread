import express from 'express'
import bodyParser from 'body-parser'

import router from './router'

const app = express()
app.use(bodyParser.json())

const port = process.env.PORT || 9000

app.use(router)

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`)
})
