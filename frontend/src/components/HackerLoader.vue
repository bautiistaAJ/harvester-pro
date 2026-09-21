<template>
  <Teleport to="body">
    <transition name="hacker-fade" @after-leave="emit('done')">
      <div v-if="shouldShow" class="hacker-loader">
        <div class="scanlines" />
        <div class="crt-flicker" />
        <div class="matrix-rain">
          <div
            v-for="(col, i) in matrixColumns"
            :key="i"
            class="matrix-column"
            :style="{ left: col.left, animationDelay: col.delay, animationDuration: col.duration }"
          >{{ col.chars }}</div>
        </div>

        <div class="relative z-10 w-full max-w-3xl mx-auto">
          <div class="flex items-center justify-between mb-6">
            <div>
              <div class="hacker-title" data-text="ENUMERATING TARGET...">ENUMERATING TARGET...</div>
              <div class="text-xs mt-1" style="color: #00ffcc88;">TARGET: {{ target }}</div>
            </div>
            <div class="text-right">
              <div class="text-xs" style="color: #ff00ffaa;">TIME {{ formattedTime }}</div>
            </div>
          </div>

          <div class="progress-outer mb-6">
            <div class="progress-inner" :style="{ width: `${Math.max(progress, 0)}%` }" />
            <div class="progress-text">{{ Math.round(Math.max(progress, 0)) }}%</div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div class="text-xs mb-2 uppercase tracking-widest" style="color: #ff00ff88;">// sources_active</div>
              <div v-for="(src, i) in activeSources" :key="'src-' + i" class="text-xs mb-1" style="color: #00ffcc99;">
                [{{ src.status }}] {{ src.name }}
              </div>
            </div>
            <div>
              <div class="text-xs mb-2 uppercase tracking-widest" style="color: #ff00ff88;">// findings</div>
              <div v-if="findings.length === 0" class="text-xs" style="color: #00ffcc55;">Scanning...</div>
              <div v-for="(f, i) in findings" :key="'find-' + i" class="text-xs mb-1" style="color: #00ffffaa;">
                [{{ f.type }}] {{ f.value }}
              </div>
            </div>
          </div>

          <div class="flex items-center justify-between pt-3" style="border-top: 1px solid #00ffcc22;">
            <div class="text-xs" style="color: #00ffcc66;">THEHARVESTER-PRO v1.0.0 // PASSIVE RECON</div>
            <button class="cancel-btn" @click="emit('cancel')">ABORT [ESC]</button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  target: { type: String, default: '' },
  logs: { type: Array, default: () => [] },
  isLoading: { type: Boolean, default: false },
  sources: { type: Array, default: () => [] }
})

const emit = defineEmits(['cancel', 'done'])

const shouldShow = ref(false)
let hideTimer = null
const elapsedSeconds = ref(0)
let elapsedTimer = null

const formattedTime = computed(() => {
  const m = String(Math.floor(elapsedSeconds.value / 60)).padStart(2, '0')
  const s = String(elapsedSeconds.value % 60).padStart(2, '0')
  return `${m}:${s}`
})

const activeSources = computed(() => {
  return props.sources.slice(0, 8).map(s => ({
    name: s,
    status: elapsedSeconds.value > props.sources.indexOf(s) * 2 ? 'DONE' : 'SCAN'
  }))
})

const findings = computed(() => {
  return props.logs.slice(-6).map(l => {
    const parts = l.split(' ')
    return { type: parts[0] || 'info', value: parts.slice(1).join(' ') || l }
  })
})

const progress = computed(() => {
  if (!props.isLoading && elapsedSeconds.value > 0) return 100
  return Math.min(elapsedSeconds.value * 2, 95)
})

const matrixColumns = Array.from({ length: 20 }, (_, i) => ({
  left: `${(i / 20) * 100}%`,
  delay: `${Math.random() * 5}s`,
  duration: `${3 + Math.random() * 4}s`,
  chars: Array.from({ length: 15 }, () => String.fromCharCode(0x30A0 + Math.random() * 96)).join('\n')
}))

watch(() => props.isLoading, (active) => {
  if (active) {
    shouldShow.value = true
    elapsedSeconds.value = 0
    elapsedTimer = setInterval(() => elapsedSeconds.value++, 1000)
  } else {
    clearInterval(elapsedTimer)
    hideTimer = setTimeout(() => shouldShow.value = false, 3000)
  }
}, { immediate: true })

const handleKeydown = (e) => {
  if (e.key === 'Escape' && props.isLoading) emit('cancel')
}

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => {
  clearInterval(elapsedTimer)
  clearTimeout(hideTimer)
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
.hacker-loader {
  position: fixed; inset: 0; z-index: 100; overflow: hidden;
  background: #0a0a0f; font-family: 'Courier New', monospace; color: #00ffcc;
  display: flex; align-items: center; justify-content: center; padding: 2rem;
}
.scanlines { position: absolute; inset: 0; pointer-events: none; z-index: 10;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,204,0.03) 2px, rgba(0,255,204,0.03) 4px);
  animation: scanline-scroll 8s linear infinite; }
@keyframes scanline-scroll { 0% { background-position: 0 0; } 100% { background-position: 0 100px; } }
.crt-flicker { position: absolute; inset: 0; pointer-events: none; z-index: 9; animation: flicker 0.15s infinite; opacity: 0; }
@keyframes flicker { 0% { opacity: 0; } 5% { opacity: 0.02; background: rgba(255,255,255,0.02); } 10% { opacity: 0; } 92% { opacity: 0; } 93% { opacity: 0.04; } 100% { opacity: 0; } }
.hacker-title { font-size: 1.5rem; font-weight: bold; color: #00ffcc; text-shadow: 0 0 10px #00ffcc88; position: relative; display: inline-block; animation: glitch-skew 4s infinite linear alternate-reverse; }
.hacker-title::before, .hacker-title::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: hidden; }
.hacker-title::before { color: #ff00ff; z-index: -1; animation: glitch-before 3s infinite linear alternate-reverse; clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%); }
.hacker-title::after { color: #00ffff; z-index: -2; animation: glitch-after 2s infinite linear alternate-reverse; clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%); }
@keyframes glitch-before { 0% { transform: translate(0); } 20% { transform: translate(-3px, 2px); } 40% { transform: translate(3px, -1px); } 60% { transform: translate(-1px, 1px); } 80% { transform: translate(2px, -2px); } 100% { transform: translate(0); } }
@keyframes glitch-after { 0% { transform: translate(0); } 20% { transform: translate(2px, -3px); } 40% { transform: translate(-2px, 2px); } 60% { transform: translate(1px, -1px); } 80% { transform: translate(-3px, 3px); } 100% { transform: translate(0); } }
@keyframes glitch-skew { 0% { transform: skew(0deg); } 2% { transform: skew(2deg); } 4% { transform: skew(-1deg); } 6% { transform: skew(0deg); } 100% { transform: skew(0deg); } }
.progress-outer { width: 100%; height: 28px; background: #111118; border: 1px solid #00ffcc44; border-radius: 4px; overflow: hidden; position: relative; box-shadow: 0 0 8px #00ffcc22, inset 0 0 8px #00000088; }
.progress-inner { height: 100%; background: linear-gradient(90deg, #00ffcc, #ff00ff, #00ffff); background-size: 200% 100%; animation: progress-gradient 3s ease infinite; transition: width 0.5s ease-out; position: relative; box-shadow: 0 0 15px #00ffcc66; }
.progress-inner::after { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(0,0,0,0.15) 5px, rgba(0,0,0,0.15) 10px); }
@keyframes progress-gradient { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.progress-text { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 0.75rem; font-weight: bold; color: #0a0a0f; text-shadow: 0 0 4px #00ffcc88; z-index: 2; }
.cancel-btn { background: transparent; border: 1px solid #ff004088; color: #ff0040; padding: 0.5rem 1rem; font-family: inherit; font-size: 0.75rem; cursor: pointer; transition: all 0.2s; text-transform: uppercase; letter-spacing: 2px; }
.cancel-btn:hover { background: #ff004022; border-color: #ff0040; text-shadow: 0 0 8px #ff004088; box-shadow: 0 0 15px #ff004033; }
.matrix-rain { position: absolute; inset: 0; overflow: hidden; pointer-events: none; z-index: 0; opacity: 0.08; }
.matrix-column { position: absolute; top: -100%; font-size: 0.6rem; color: #00ff41; white-space: pre; line-height: 1.2; animation: rain-fall linear infinite; }
@keyframes rain-fall { 0% { transform: translateY(-100%); } 100% { transform: translateY(200%); } }
.hacker-fade-enter-active { transition: opacity 0.3s ease-out; }
.hacker-fade-leave-active { transition: opacity 0.8s ease-in; }
.hacker-fade-enter-from, .hacker-fade-leave-to { opacity: 0; }
</style>