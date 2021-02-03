import express from 'express'

const router = express.Router()

router.get('/', (_, res) => {
  res.send('Left on Read Server')
})

export default router
