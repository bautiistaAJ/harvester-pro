import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api.js'

export const useSearchStore = defineStore('search', () => {
  const isLoading = ref(false)
  const currentRunId = ref(null)
  const results = ref(null)
  const error = ref(null)
  const logs = ref([])
  const sources = ref([])

  const allHostnames = computed(() =>
    results.value?.results?.filter(r => r.type === 'hostname') || []
  )

  const allEmails = computed(() =>
    results.value?.results?.filter(r => r.type === 'email') || []
  )

  const allIps = computed(() =>
    results.value?.results?.filter(r => r.type === 'ip') || []
  )

  const allAsns = computed(() =>
    results.value?.results?.filter(r => r.type === 'asn') || []
  )

  const allUrls = computed(() =>
    results.value?.results?.filter(r => r.type === 'url') || []
  )

  const allPeople = computed(() =>
    results.value?.results?.filter(r => r.type === 'person') || []
  )

  const allBreaches = computed(() =>
    results.value?.results?.filter(r => r.type === 'breach') || []
  )

  const allShodan = computed(() =>
    results.value?.results?.filter(r => r.type === 'shodan-host') || []
  )

  const hasResults = computed(() =>
    results.value && results.value.results && results.value.results.length > 0
  )

  const resultCounts = computed(() => ({
    hostnames: allHostnames.value.length,
    emails: allEmails.value.length,
    ips: allIps.value.length,
    asns: allAsns.value.length,
    urls: allUrls.value.length,
    people: allPeople.value.length,
    breaches: allBreaches.value.length,
    shodan: allShodan.value.length,
    total: results.value?.results?.length || 0
  }))

  let pollTimer = null

  async function fetchSources() {
    try {
      const response = await api.getSources()
      sources.value = response.data
    } catch (e) {
      console.error('Failed to fetch sources:', e)
    }
  }

  async function scan(params) {
    isLoading.value = true
    error.value = null
    results.value = null
    logs.value = []

    try {
      const response = await api.scan(params)
      currentRunId.value = response.data.run_id
      logs.value.push(`Scan started: ${response.data.run_id}`)
      startPolling()
    } catch (e) {
      error.value = e.response?.data?.error || e.message
      isLoading.value = false
    }
  }

  function startPolling() {
    stopPolling()
    pollTimer = setInterval(async () => {
      if (!currentRunId.value) return
      try {
        const response = await api.getResults(currentRunId.value)
        results.value = response.data

        if (response.data.log) {
          logs.value = response.data.log.split('\n').filter(l => l.trim())
        }

        if (response.data.status === 'completed' || response.data.status === 'failed' || response.data.status === 'cancelled') {
          isLoading.value = false
          stopPolling()
          if (response.data.status === 'failed') {
            error.value = response.data.error || 'Scan failed'
          }
        }
      } catch (e) {
        console.error('Poll error:', e)
      }
    }, 2000)
  }

  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer)
      pollTimer = null
    }
  }

  async function cancelScan() {
    if (!currentRunId.value) return
    try {
      await api.cancelRun(currentRunId.value)
      isLoading.value = false
      stopPolling()
      logs.value.push('Scan cancelled')
    } catch (e) {
      console.error('Cancel error:', e)
    }
  }

  function reset() {
    isLoading.value = false
    currentRunId.value = null
    results.value = null
    error.value = null
    logs.value = []
    stopPolling()
  }

  return {
    isLoading, currentRunId, results, error, logs, sources,
    allHostnames, allEmails, allIps, allAsns, allUrls, allPeople, allBreaches, allShodan,
    hasResults, resultCounts,
    fetchSources, scan, cancelScan, reset
  }
})