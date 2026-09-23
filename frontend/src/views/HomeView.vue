<template>
  <div class="space-y-6">
    <DomainPanel :is-loading="searchStore.isLoading" @scan="handleScan" />
    <SourcesPanel :availableSources="searchStore.sources" @update:sources="selectedSources = $event" />

    <HackerLoader
      v-if="showLoader"
      :target="currentTarget"
      :logs="searchStore.logs"
      :is-loading="searchStore.isLoading"
      :sources="selectedSources"
      @cancel="searchStore.cancelScan()"
      @done="showLoader = false"
    />

    <transition name="fade">
      <div v-if="searchStore.error" class="card border-red-800 bg-red-900/20">
        <div class="text-red-400">{{ searchStore.error }}</div>
      </div>
    </transition>

    <transition name="fade">
      <div v-if="searchStore.hasResults" class="space-y-6">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-white">
            Results for "{{ searchStore.results.target }}"
          </h2>
          <ExportButton :results="searchStore.results" :target="searchStore.results.target" />
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div class="lg:col-span-3">
            <ResultsView
              :hostnames="searchStore.allHostnames"
              :emails="searchStore.allEmails"
              :ips="searchStore.allIps"
              :asns="searchStore.allAsns"
              :urls="searchStore.allUrls"
              :shodan="searchStore.allShodan"
            />
          </div>
          <div class="lg:col-span-1 space-y-4">
            <StatsPanel
              :counts="searchStore.resultCounts"
              :sources="searchStore.results.sources || []"
            />
            <GraphView
              :hostnames="searchStore.allHostnames"
              :ips="searchStore.allIps"
              :target="searchStore.results.target"
            />
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSearchStore } from '../stores/search.js'
import DomainPanel from '../components/DomainPanel.vue'
import SourcesPanel from '../components/SourcesPanel.vue'
import ResultsView from '../components/ResultsView.vue'
import StatsPanel from '../components/StatsPanel.vue'
import GraphView from '../components/GraphView.vue'
import HackerLoader from '../components/HackerLoader.vue'
import ExportButton from '../components/ExportButton.vue'

const searchStore = useSearchStore()
const showLoader = ref(false)
const currentTarget = ref('')
const selectedSources = ref([])

onMounted(() => {
  searchStore.fetchSources()
})

function handleScan(params) {
  currentTarget.value = params.domain
  searchStore.scan({
    target: params.domain,
    sources: selectedSources.value.length ? selectedSources.value : ['crtsh', 'rapiddns', 'duckduckgo'],
    limit: params.limit || 500,
    dns_resolve: params.dns_resolve,
    dns_brute: params.dns_brute,
    shodan: params.shodan,
    screenshot: params.screenshot
  })
  showLoader.value = true
}
</script>