import { Router } from 'express'

const router = Router()

const THEHARVESTER_URL = process.env.THEHARVESTER_URL || 'http://localhost:5000'
const THEHARVESTER_API_KEY = process.env.THEHARVESTER_API_KEY || ''

router.post('/', async (req, res) => {
  try {
    const { target, sources, limit, dns_resolve, dns_brute, shodan, screenshot, proxy } = req.body

    if (!target || !sources || sources.length === 0) {
      return res.status(400).json({ error: 'Target and at least one source required' })
    }

    const params = {
      target,
      sources,
      limit: limit || 500,
      dns_resolve: dns_resolve || false,
      dns_brute: dns_brute || false,
      shodan: shodan || false,
      screenshot: screenshot || false,
      proxies: proxy || false,
      source_workers: 5,
      deadline_seconds: 1800
    }

    const response = await fetch(`${THEHARVESTER_URL}/api/v1/runs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': THEHARVESTER_API_KEY
      },
      body: JSON.stringify(params)
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