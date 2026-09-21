import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
})

export default {
  scan(data) {
    return api.post('/scan', data)
  },
  getResults(id) {
    return api.get(`/results/${id}`)
  },
  getSources() {
    return api.get('/sources')
  },
  getRuns() {
    return api.get('/runs')
  },
  cancelRun(id) {
    return api.post(`/cancel/${id}`)
  }
}