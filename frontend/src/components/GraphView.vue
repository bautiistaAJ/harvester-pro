<template>
  <div class="card">
    <h3 class="text-lg font-semibold text-white mb-4">Grafo de red</h3>

    <div v-if="hasGraph" class="mt-4">
      <div ref="graphContainer" class="graph-container w-full rounded-lg overflow-hidden"></div>
      <div class="mt-2 text-xs text-gray-500 text-center">
        Scroll para ampliar | Arrastra para mover | Clic en nodo para resaltar
      </div>
    </div>

    <div v-else class="text-center py-8 text-gray-500">
      <p>Sin datos de grafo</p>
      <p class="text-xs mt-1">Ejecuta un escaneo para ver relaciones de red</p>
    </div>

    <Teleport to="body">
      <transition name="tooltip-fade">
        <div
          v-if="tooltip.visible"
          class="fixed z-[200] pointer-events-none"
          :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
        >
          <div class="bg-gray-900 border border-cyan-500/50 rounded-lg px-3 py-2 shadow-lg shadow-cyan-500/20 max-w-xs">
            <div class="text-cyan-400 font-bold text-sm">{{ tooltip.data?.label }}</div>
            <div class="text-gray-400 text-xs mt-1">{{ tooltip.data?.type }}</div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import * as d3 from 'd3'

const props = defineProps({
  hostnames: { type: Array, default: () => [] },
  ips: { type: Array, default: () => [] },
  emails: { type: Array, default: () => [] },
  target: { type: String, default: '' }
})

const graphContainer = ref(null)
let svg = null
let simulation = null
const tooltip = ref({ visible: false, x: 0, y: 0, data: null })

const hasGraph = computed(() => props.hostnames.length > 0 || props.ips.length > 0)

const graphData = computed(() => {
  const nodes = []
  const links = []
  const nodeMap = {}

  if (props.target) {
    nodes.push({ id: props.target, label: props.target, type: 'domain' })
    nodeMap[props.target] = true
  }

  const ipSet = new Set()
  props.hostnames.forEach(h => {
    const parts = h.value.split('.')
    const parent = parts.slice(-2).join('.')
    if (!nodeMap[h.value]) {
      nodes.push({ id: h.value, label: h.value, type: 'hostname' })
      nodeMap[h.value] = true
    }
    if (props.target && !links.find(l => l.source === props.target && l.target === h.value)) {
      links.push({ source: props.target, target: h.value })
    }
    if (h.details?.ip) ipSet.add(h.details.ip)
  })

  props.ips.forEach(ip => {
    if (!nodeMap[ip.value]) {
      nodes.push({ id: ip.value, label: ip.value, type: 'ip' })
      nodeMap[ip.value] = true
    }
  })

  return { nodes, links }
})

function renderGraph() {
  if (!graphContainer.value || !hasGraph.value) return

  const container = graphContainer.value
  const width = container.clientWidth
  const height = container.clientHeight || 400

  d3.select(container).selectAll('*').remove()

  svg = d3.select(container)
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet')
    .style('width', '100%')
    .style('height', '100%')

  const g = svg.append('g')
  const zoom = d3.zoom().scaleExtent([0.1, 4]).on('zoom', (e) => g.attr('transform', e.transform))
  svg.call(zoom)

  const color = { domain: '#ff00ff', hostname: '#00ffcc', ip: '#00ffff' }
  const radius = { domain: 14, hostname: 8, ip: 6 }

  simulation = d3.forceSimulation(graphData.value.nodes)
    .force('link', d3.forceLink(graphData.value.links).distance(100).strength(0.5))
    .force('charge', d3.forceManyBody().strength(-300))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(20))

  const link = g.append('g').selectAll('line').data(graphData.value.links).enter()
    .append('line').attr('stroke', '#00ffcc33').attr('stroke-width', 1.5)

  const node = g.append('g').selectAll('circle').data(graphData.value.nodes).enter()
    .append('circle')
    .attr('r', d => radius[d.type] || 6)
    .attr('fill', d => color[d.type] || '#666')
    .attr('stroke', d => color[d.type] || '#666')
    .attr('stroke-width', 2)
    .attr('fill-opacity', 0.6)
    .style('cursor', 'pointer')
    .call(d3.drag()
      .on('start', (e, d) => { if (!e.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y })
      .on('drag', (e, d) => { d.fx = e.x; d.fy = e.y })
      .on('end', (e, d) => { if (!e.active) simulation.alphaTarget(0); d.fx = null; d.fy = null }))
    .on('mouseover', (e, d) => {
      d3.select(e.target).transition().duration(200).attr('r', (radius[d.type] || 6) * 1.5)
      tooltip.value = { visible: true, x: e.pageX + 15, y: e.pageY - 10, data: d }
    })
    .on('mousemove', (e) => { tooltip.value.x = e.pageX + 15; tooltip.value.y = e.pageY - 10 })
    .on('mouseout', (e, d) => {
      d3.select(e.target).transition().duration(200).attr('r', radius[d.type] || 6)
      tooltip.value.visible = false
    })

  const label = g.append('g').selectAll('text').data(graphData.value.nodes).enter()
    .append('text').attr('dx', 12).attr('dy', 4)
    .style('font-size', '10px').style('fill', '#e0e0e0').style('pointer-events', 'none')
    .style('paint-order', 'stroke').style('stroke', '#000').style('stroke-width', '3px').style('stroke-linejoin', 'round')
    .text(d => d.label.length > 30 ? d.label.slice(0, 30) + '...' : d.label)

  simulation.on('tick', () => {
    link.attr('x1', d => d.source.x).attr('y1', d => d.source.y).attr('x2', d => d.target.x).attr('y2', d => d.target.y)
    node.attr('cx', d => d.x).attr('cy', d => d.y)
    label.attr('x', d => d.x).attr('y', d => d.y)
  })
}

watch(hasGraph, (v) => { if (v) nextTick(renderGraph) })
onMounted(() => { if (hasGraph.value) renderGraph() })
onUnmounted(() => { if (simulation) simulation.stop() })
</script>

<style scoped>
.graph-container {
  height: 400px; min-height: 300px;
  background: radial-gradient(ellipse at center, #0a1628 0%, #050a10 100%);
  border: 1px solid #00ffcc22;
}
.tooltip-fade-enter-active { transition: opacity 0.15s ease-out; }
.tooltip-fade-leave-active { transition: opacity 0.1s ease-in; }
.tooltip-fade-enter-from, .tooltip-fade-leave-to { opacity: 0; }
</style>