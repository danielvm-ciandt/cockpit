<template>
  <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer" @click="$refs.input?.click()" @drop.prevent="handleDrop" @dragover.prevent>
    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
    <p class="mt-4 text-lg font-medium text-gray-900">Drop file here or click to select</p>
    <p class="mt-2 text-sm text-gray-600">Supported: Excel (.xlsx, .xls), CSV (.csv)</p>
    <input ref="input" type="file" class="hidden" accept=".xlsx,.xls,.csv" @change="handleChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  upload: [file: File]
}>()

const input = ref<HTMLInputElement>()

const handleChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (files?.[0]) {
    emit('upload', files[0])
  }
}

const handleDrop = (e: DragEvent) => {
  const files = e.dataTransfer?.files
  if (files?.[0]) {
    emit('upload', files[0])
  }
}
</script>
