import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import streamsRouter from './routes/streams'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/streams', streamsRouter)

app.get('/', (req, res) => {
  res.json({ message: 'Sustenido API rodando!' })
})

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})