<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-white mb-4">Target Domain</h3>
    <div class="flex space-x-3">
      <input
        v-model="domain"
        type="text"
        class="input-field flex-1"
        placeholder="example.com"
        @keyup.enter="startScan"
      />
      <button
        class="btn-primary"
        :disabled="!domain || isLoading"
        @click="startScan"
      >
        {{ isLoading ? 'Scanning...' : 'Scan' }}
      </button>
    </div>

    <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
      <label class="flex items-center space-x-2 text-sm text-gray-400">
        <input type="checkbox" v-model="options.dns_resolve" class="rounded" />
        <span>DNS Resolve</span>
      </label>
      <label class="flex items-center space-x-2 text-sm text-gray-400">
        <input type="checkbox" v-model="options.dns_brute" class="rounded" />
        <span>DNS Brute</span>
      </label>
      <label class="flex items-center space-x-2 text-sm text-gray-400">
        <input type="checkbox" v-model="options.shodan" class="rounded" />
        <span>Shodan</span>
      </label>
      <label class="flex items-center space-x-2 text-sm text-gray-400">
        <input type="checkbox" v-model="options.screenshot" class="rounded" />
        <span>Screenshots</span>
      </label>
    </div>

    <div class="mt-3">
      <label class="text-sm text-gray-400">Limit per source:</label>
      <input v-model.number="options.limit" type="number" min="0" max="5000" class="input-field w-32 ml-2" />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const emit = defineEmits(['scan'])

const props = defineProps({
  isLoading: Boolean
})

const domain = ref('')
const options = reactive({
  dns_resolve: true,
  dns_brute: false,
  shodan: false,
  screenshot: false,
  limit: 500
})

function startScan() {
  if (!domain.value) return
  emit('scan', { domain: domain.value, ...options })
}
</script>