<template>
  <div class="space-y-6">
    <h2 class="text-xl font-bold text-white">Historial de escaneos</h2>

    <div v-if="runs.length === 0" class="card text-center py-12 text-gray-500">
      <p>Aún no hay escaneos</p>
      <p class="text-sm mt-1">Ejecuta un escaneo para ver el historial</p>
    </div>

    <div v-else class="space-y-3">
      <div
        v-for="run in runs"
        :key="run.run_id"
        class="card flex items-center justify-between hover:border-gray-700 transition-colors"
      >
        <div>
          <div class="text-white font-medium">{{ run.target }}</div>
          <div class="text-xs text-gray-500 mt-1">
            {{ run.status }} | {{ run.result_count }} resultados | {{ formatDate(run.created_at) }}
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <span
            class="px-2 py-0.5 text-xs rounded-full"
            :class="{
              'bg-green-900 text-green-400': run.status === 'completed',
              'bg-yellow-900 text-yellow-400': run.status === 'running',
              'bg-red-900 text-red-400': run.status === 'failed',
              'bg-gray-800 text-gray-400': run.status === 'queued'
            }"
          >
            {{ run.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api.js'

const runs = ref([])

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleString()
}

onMounted(async () => {
  try {
    const response = await api.getRuns()
    runs.value = response.data || []
  } catch (e) {
    console.error('Failed to load runs:', e)
  }
})
</script>
