<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="text-gray-500 text-sm font-medium">{{ label }}</div>
    <div class="mt-2 text-3xl font-bold text-gray-900">{{ value }}</div>
    <div :class="['mt-2 text-sm', change >= 0 ? 'text-green-600' : 'text-red-600']">
      {{ change >= 0 ? '+' : '' }}{{ change }}% {{ period }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  label: string
  value: string
  change: number
  period: string
}>()
</script>
