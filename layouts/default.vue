<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-6 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span class="text-white font-bold text-sm">C</span>
            </div>
            <h1 class="text-xl font-bold text-gray-900">Portfolio Cockpit</h1>
          </div>
          <div class="flex gap-6">
            <NuxtLink to="/" class="text-gray-600 hover:text-gray-900">Dashboard</NuxtLink>
            <NuxtLink to="/accounts" class="text-gray-600 hover:text-gray-900">Accounts</NuxtLink>
            <NuxtLink to="/upload" class="text-gray-600 hover:text-gray-900">Upload</NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto px-6 py-8">
      <slot />
    </main>
  </div>
</template>

<style scoped>
</style>
