import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import scanRoutes from './routes/scan.js'
import resultsRoutes from './routes/results.js'
import sourcesRoutes from './routes/sources.js'
import runsRoutes from './routes/runs.js'
import cancelRoutes from './routes/cancel.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

const THEHARVESTER_URL = process.env.THEHARVESTER_URL || 'http://localhost:5000'
const THEHARVESTER_API_KEY = process.env.THEHARVESTER_API_KEY || ''

app.use('/api/scan', scanRoutes)
app.use('/api/results', resultsRoutes)
app.use('/api/sources', sourcesRoutes)
app.use('/api/runs', runsRoutes)
app.use('/api/cancel', cancelRoutes)

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', theharvester: THEHARVESTER_URL })
})

app.listen(PORT, () => {
  console.log(`[server] TheHarvester Pro backend running on http://localhost:${PORT}`)
  console.log(`[server] Proxying to ${THEHARVESTER_URL}`)
  if (!THEHARVESTER_API_KEY) {
    console.log('[warn] THEHARVESTER_API_KEY not set')
  }
})