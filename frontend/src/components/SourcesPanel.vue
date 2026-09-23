<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-semibold text-white">Fuentes de datos</h3>
      <div class="flex space-x-2">
        <button @click="selectAll" class="text-xs text-primary-400 hover:text-primary-300">Seleccionar todo</button>
        <span class="text-gray-600">|</span>
        <button @click="selectNone" class="text-xs text-gray-500 hover:text-gray-400">Ninguno</button>
      </div>
    </div>

    <input
      v-model="search"
      type="text"
      class="input-field mb-3"
      placeholder="Buscar fuente..."
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
      {{ selectedSources.length }} fuente(s) seleccionada(s)
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const emit = defineEmits(['update:sources'])

const props = defineProps({
  availableSources: { type: Array, default: () => [] }
})

const search = ref('')
const selectedSources = ref([])
const catalog = ref([])

const FALLBACK_SOURCES = ['crtsh', 'rapiddns', 'duckduckgo', 'otx', 'urlscan']

function categoryOf(name) {
  const c = String(name).toLowerCase()
  if (['crtsh','certspotter','crt-name'].includes(c)) return 'Certificate Transparency'
  if (['dnsdumpster','hackertarget','rapiddns','commoncrawl','robtex','subdomaincenter','subdomainapi','subdomainfinderc99'].includes(c)) return 'DNS'
  if (['baidu','duckduckgo','yahoo','mojeek','brave'].includes(c)) return 'Search Engines'
  if (['otx','virustotal','dehashed','intelx','leakix','hibpverified','haveibeenpwned','hudsonrock','hunter','tomba','rocketreach','hunterhow','leaklookup','sherlockeye','waybackarchive','builtwith','sourcegraph','arquivo','apis-guru','fullhunt','netlas','dymo','securityscorecard','securitytrails','whoisxml','windvane','projectdiscovery','pentesttools','criminalip','onyphe','jsmon','bufferoverun'].includes(c)) {
    if (['otx','virustotal','dehashed','intelx','leakix','hibpverified','haveibeenpwned','hudsonrock','hunter','tomba','rocketreach','hunterhow','leaklookup','sherlockeye'].includes(c)) return 'Threat Intel'
    if (['censys','shodan','shodaninternetdb','urlscan','fofa','zoomeye','criminalip','securityscorecard','securitytrails'].includes(c)) return 'Scan Data'
    if (['github-code','gitlab'].includes(c)) return 'Code'
    if (['hunter','tomba','rocketreach','hunterhow','leaklookup','sherlockeye'].includes(c)) return 'Email Intel'
    if (['bevigil','hudsonrock'].includes(c)) return 'Mobile'
    return 'Other'
  }
  if (['hibpverified'].includes(c)) return 'Threat Intel'
  if (['censys','shodan','shodaninternetdb','urlscan','fofa','zoomeye','criminalip','securitytrails','securityscorecard'].includes(c)) return 'Scan Data'
  return 'Other'
}

const catalogSources = computed(() => {
  if (!catalog.value.length) return []
  return catalog.value.filter(s => s.name && s.activity)
})

const filteredSources = computed(() => {
  const grouped = {}
  for (const s of catalogSources.value) {
    const cat = categoryOf(s.name)
    if (!grouped[cat]) grouped[cat] = []
    grouped[cat].push(s.name)
  }
  if (!search.value) return grouped
  const q = search.value.toLowerCase()
  const result = {}
  for (const [cat, sources] of Object.entries(grouped)) {
    const filtered = sources.filter(s => s.toLowerCase().includes(q))
    if (filtered.length) result[cat] = filtered
  }
  return result
})

const defaultSources = computed(() => {
  const all = catalogSources.value.map(s => s.name)
  const safe = all.filter(n => !['bing','hibp','hibpverified','haveibeenpwned'].includes(n.toLowerCase()))
  if (safe.includes('crtsh') && safe.includes('rapiddns') && safe.includes('duckduckgo')) {
    return ['crtsh', 'rapiddns', 'duckduckgo']
  }
  if (safe.length >= 3) return safe.slice(0, 3)
  return FALLBACK_SOURCES
})

function selectAll() {
  selectedSources.value = catalogSources.value.map(s => s.name)
}

function selectNone() {
  selectedSources.value = []
}

function loadCatalog() {
  if (props.availableSources && props.availableSources.length) {
    catalog.value = props.availableSources
  }
  if (!selectedSources.value.length) {
    selectedSources.value = defaultSources.value
  }
}

watch(selectedSources, (val) => {
  emit('update:sources', val)
}, { immediate: true })

watch(() => props.availableSources, (newVal) => {
  if (newVal && newVal.length) {
    catalog.value = newVal
    if (!selectedSources.value.length) {
      selectedSources.value = defaultSources.value
    }
  }
}, { immediate: true })

onMounted(loadCatalog)
</script>
