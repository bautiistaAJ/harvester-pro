<template>
  <div class="relative">
    <button
      @click="showMenu = !showMenu"
      class="btn-secondary text-sm"
      :disabled="!hasData"
    >
      Exportar ▾
    </button>

    <transition name="fade">
      <div v-if="showMenu" class="absolute right-0 mt-2 w-40 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
        <button @click="exportJSON" class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">JSON</button>
        <button @click="exportCSV" class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">CSV</button>
        <button @click="exportTXT" class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700">TXT</button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  results: { type: Object, default: null },
  target: { type: String, default: 'unknown' }
})

const showMenu = ref(false)

const hasData = computed(() => props.results && props.results.results && props.results.results.length > 0)

function download(content, filename, type) {
  const blob = new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
  showMenu.value = false
}

function exportJSON() {
  download(JSON.stringify(props.results, null, 2), `theharvester-${props.target}.json`, 'application/json')
}

function exportCSV() {
  const headers = ['type', 'value', 'sources']
  const rows = (props.results?.results || []).map(r => [r.type, r.value, r.sources.join(';')])
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
  download(csv, `theharvester-${props.target}.csv`, 'text/csv')
}

function exportTXT() {
  const lines = (props.results?.results || []).map(r => `[${r.type}] ${r.value} (${r.sources.join(', ')})`)
  download(lines.join('\n'), `theharvester-${props.target}.txt`, 'text/plain')
}
</script>