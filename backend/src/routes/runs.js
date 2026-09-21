import { Router } from 'express'

const router = Router()

const THEHARVESTER_URL = process.env.THEHARVESTER_URL || 'http://localhost:5000'
const THEHARVESTER_API_KEY = process.env.THEHARVESTER_API_KEY || ''

router.get('/', async (req, res) => {
  try {
    const response = await fetch(`${THEHARVESTER_URL}/api/v1/runs`, {
      headers: {
        'X-API-Key': THEHARVESTER_API_KEY
      }
    })

    if (!response.ok) {
      const error = await response.text()
      return res.status(response.status).json({ error })
    }

    const data = await response.json()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router