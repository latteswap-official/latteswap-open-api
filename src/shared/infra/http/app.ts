import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { v1Router } from './api/v1'

const origin = {
  origin: '*',
}

const app = express()

app.use(cors(origin))
app.use(compression())
app.use(helmet())
app.use(morgan('combined'))

app.use('/api/v1', v1Router)

const port = process.env.PORT || 3002

app.listen(port, () => {
  console.log(`[App]: Listening on port ${port}`)
})
