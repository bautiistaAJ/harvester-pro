<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-white">Data Sources</h3>
      <div class="flex space-x-2">
        <button @click="selectAll" class="text-xs text-primary-400 hover:text-primary-300">Select All</button>
        <span class="text-gray-600">|</span>
        <button @click="selectNone" class="text-xs text-gray-500 hover:text-gray-400">None</button>
      </div>
    </div>

    <input
      v-model="search"
      type="text"
      class="input-field mb-3"
      placeholder="Search sources..."
    />

    <div class="max-h-64 overflow-y-auto space-y-1">
      <div v-for="(sources, category) in filteredSources" :key="category" class="mb-3">
        <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">{{ category }}</div>
        <label
          v-for="source in sources"
          :key="source"
          class="flex items-center space-x-2 text-sm text-gray-300 hover:text-white cursor-pointer py-0.5"
        >
          <input
            type="checkbox"
            :value="source"
            v-model="selectedSources"
            class="rounded"
          />
          <span>{{ source }}</span>
        </label>
      </div>
    </div>

    <div class="mt-3 text-xs text-gray-500">
      {{ selectedSources.length }} sources selected
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const emit = defineEmits(['update:sources'])

const props = defineProps({
  availableSources: { type: Array, default: () => [] }
})

const search = ref('')
const selectedSources = ref(['crtsh', 'rapiddns', 'bing', 'duckduckgo', 'otx', 'urlscan'])

const allSources = {
  'Search Engines': ['baidu', 'bing', 'duckduckgo', 'yahoo', 'mojeek', 'brave'],
  'Certificate Transparency': ['crtsh', 'certspotter', 'crt-name'],
  'DNS': ['dnsdumpster', 'hackertarget', 'rapiddns', 'commoncrawl', 'robtex', 'subdomaincenter'],
  'Threat Intel': ['otx', 'virustotal', 'dehashed', 'intelx', 'leakix', 'hibp'],
  'Scan Data': ['censys', 'shodan', 'shodanInternetDB', 'urlscan', 'fofa', 'zoomeye', 'criminalip'],
  'Code': ['github-code', 'gitlab'],
  'Email Intel': ['hunter', 'tomba', 'rocketreach'],
  'Mobile': ['bevigil', 'hudsonrock'],
  'Other': ['waybackarchive', 'builtwith', 'sourcegraph', 'arquivo']
}

const filteredSources = computed(() => {
  if (!search.value) return allSources
  const q = search.value.toLowerCase()
  const result = {}
  for (const [cat, sources] of Object.entries(allSources)) {
    const filtered = sources.filter(s => s.includes(q))
    if (filtered.length) result[cat] = filtered
  }
  return result
})

function selectAll() {
  selectedSources.value = Object.values(allSources).flat()
}

function selectNone() {
  selectedSources.value = []
}

watch(selectedSources, (val) => {
  emit('update:sources', val)
}, { immediate: true })
</script>