<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-white mb-4">Results</h3>

    <div class="flex flex-wrap gap-2 mb-4">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        @click="activeTab = tab.key"
        class="px-3 py-1.5 text-sm rounded-lg transition-colors"
        :class="activeTab === tab.key ? 'bg-primary-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'"
      >
        {{ tab.label }} ({{ tab.count }})
      </button>
    </div>

    <div v-if="activeTab === 'hostnames'" class="space-y-1 max-h-96 overflow-y-auto">
      <div v-for="(item, i) in hostnames" :key="i" class="flex items-center justify-between py-1.5 px-3 bg-gray-800 rounded text-sm">
        <span class="text-cyan-400 font-mono">{{ item.value }}</span>
        <span class="text-xs text-gray-500">{{ item.sources.join(', ') }}</span>
      </div>
      <div v-if="hostnames.length === 0" class="text-gray-500 text-sm text-center py-4">No hostnames found</div>
    </div>

    <div v-if="activeTab === 'emails'" class="space-y-1 max-h-96 overflow-y-auto">
      <div v-for="(item, i) in emails" :key="i" class="flex items-center justify-between py-1.5 px-3 bg-gray-800 rounded text-sm">
        <span class="text-green-400 font-mono">{{ item.value }}</span>
        <span class="text-xs text-gray-500">{{ item.sources.join(', ') }}</span>
      </div>
      <div v-if="emails.length === 0" class="text-gray-500 text-sm text-center py-4">No emails found</div>
    </div>

    <div v-if="activeTab === 'ips'" class="space-y-1 max-h-96 overflow-y-auto">
      <div v-for="(item, i) in ips" :key="i" class="flex items-center justify-between py-1.5 px-3 bg-gray-800 rounded text-sm">
        <span class="text-purple-400 font-mono">{{ item.value }}</span>
        <span class="text-xs text-gray-500">{{ item.sources.join(', ') }}</span>
      </div>
      <div v-if="ips.length === 0" class="text-gray-500 text-sm text-center py-4">No IPs found</div>
    </div>

    <div v-if="activeTab === 'asns'" class="space-y-1 max-h-96 overflow-y-auto">
      <div v-for="(item, i) in asns" :key="i" class="flex items-center justify-between py-1.5 px-3 bg-gray-800 rounded text-sm">
        <span class="text-amber-400 font-mono">{{ item.value }}</span>
        <span class="text-xs text-gray-500">{{ item.sources.join(', ') }}</span>
      </div>
      <div v-if="asns.length === 0" class="text-gray-500 text-sm text-center py-4">No ASNs found</div>
    </div>

    <div v-if="activeTab === 'urls'" class="space-y-1 max-h-96 overflow-y-auto">
      <div v-for="(item, i) in urls" :key="i" class="flex items-center justify-between py-1.5 px-3 bg-gray-800 rounded text-sm">
        <span class="text-pink-400 font-mono text-xs break-all">{{ item.value }}</span>
        <span class="text-xs text-gray-500 shrink-0 ml-2">{{ item.sources.join(', ') }}</span>
      </div>
      <div v-if="urls.length === 0" class="text-gray-500 text-sm text-center py-4">No URLs found</div>
    </div>

    <div v-if="activeTab === 'shodan'" class="space-y-2 max-h-96 overflow-y-auto">
      <div v-for="(item, i) in shodan" :key="i" class="p-3 bg-gray-800 rounded text-sm">
        <div class="text-red-400 font-mono font-bold">{{ item.value }}</div>
        <div v-if="item.details" class="mt-1 text-xs text-gray-400">
          <div v-if="item.details.asn">ASN: {{ item.details.asn }}</div>
          <div v-if="item.details.organization">Org: {{ item.details.organization }}</div>
          <div v-if="item.details.services">
            <div v-for="(svc, j) in item.details.services" :key="j" class="ml-2">
              Port {{ svc.port }}/{{ svc.transport }} - {{ svc.product || 'unknown' }}
            </div>
          </div>
        </div>
      </div>
      <div v-if="shodan.length === 0" class="text-gray-500 text-sm text-center py-4">No Shodan data</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  hostnames: { type: Array, default: () => [] },
  emails: { type: Array, default: () => [] },
  ips: { type: Array, default: () => [] },
  asns: { type: Array, default: () => [] },
  urls: { type: Array, default: () => [] },
  shodan: { type: Array, default: () => [] }
})

const activeTab = ref('hostnames')

const tabs = computed(() => [
  { key: 'hostnames', label: 'Subdomains', count: props.hostnames.length },
  { key: 'emails', label: 'Emails', count: props.emails.length },
  { key: 'ips', label: 'IPs', count: props.ips.length },
  { key: 'asns', label: 'ASNs', count: props.asns.length },
  { key: 'urls', label: 'URLs', count: props.urls.length },
  { key: 'shodan', label: 'Shodan', count: props.shodan.length }
])
</script>