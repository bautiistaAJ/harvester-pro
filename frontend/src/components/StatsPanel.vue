<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-white mb-4">Statistics</h3>

    <div class="grid grid-cols-2 gap-3 mb-4">
      <div class="bg-gray-800 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-cyan-400">{{ counts.hostnames }}</div>
        <div class="text-xs text-gray-500">Subdomains</div>
      </div>
      <div class="bg-gray-800 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-green-400">{{ counts.emails }}</div>
        <div class="text-xs text-gray-500">Emails</div>
      </div>
      <div class="bg-gray-800 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-purple-400">{{ counts.ips }}</div>
        <div class="text-xs text-gray-500">IPs</div>
      </div>
      <div class="bg-gray-800 rounded-lg p-3 text-center">
        <div class="text-2xl font-bold text-amber-400">{{ counts.total }}</div>
        <div class="text-xs text-gray-500">Total</div>
      </div>
    </div>

    <div v-if="sources.length" class="mt-4">
      <h4 class="text-sm font-medium text-gray-400 mb-2">Sources Used</h4>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="src in sources"
          :key="src"
          class="px-2 py-0.5 bg-gray-800 text-xs text-gray-400 rounded"
        >
          {{ src }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  counts: { type: Object, default: () => ({ hostnames: 0, emails: 0, ips: 0, total: 0 }) },
  sources: { type: Array, default: () => [] }
})
</script>