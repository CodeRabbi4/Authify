import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import authRouter  from './routes/authRoutes.js'
import userRouter from './routes/userRoutes.js'

const app = express()
const port = 4000
const allowedOrigins = ["http://localhost:5173"]
connectDB();
app.use(cors({origin:allowedOrigins, credentials:true}))
app.use(cookieParser())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Api is working')
})
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})