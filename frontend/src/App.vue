<template>
  <div class="min-h-screen bg-gray-950">
    <nav class="bg-gray-900 border-b border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <div class="text-2xl">🔍</div>
            <router-link to="/" class="text-xl font-bold text-white hover:text-primary-400 transition-colors">
              TheHarvester <span class="text-primary-400">Pro</span>
            </router-link>
          </div>
          <div class="flex items-center space-x-4">
            <router-link to="/" class="text-gray-400 hover:text-white transition-colors">
              Escanear
            </router-link>
            <router-link to="/history" class="text-gray-400 hover:text-white transition-colors">
              Historial
            </router-link>
            <div class="text-xs text-gray-600">v1.0.0</div>
          </div>
        </div>
      </div>
    </nav>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>