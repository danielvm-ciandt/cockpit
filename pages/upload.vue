<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div>
      <h2 class="text-3xl font-bold text-gray-900">Upload Data</h2>
      <p class="mt-2 text-gray-600">Import portfolio data from Excel or CSV</p>
    </div>

    <!-- Upload form -->
    <div class="bg-white rounded-lg shadow p-8">
      <div class="max-w-md">
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition cursor-pointer">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <p class="mt-4 text-lg font-medium text-gray-900">Drop file here</p>
          <p class="mt-2 text-sm text-gray-600">or click to select</p>
          <input type="file" class="hidden" accept=".xlsx,.xls,.csv" />
        </div>

        <div class="mt-6 space-y-3">
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Excel (.xlsx, .xls)
          </div>
          <div class="flex items-center gap-2 text-sm text-gray-600">
            <svg class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            CSV (.csv)
          </div>
        </div>

        <button class="w-full mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
          Upload
        </button>
      </div>
    </div>

    <!-- Upload history -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Uploads</h3>
      <div class="text-center py-8 text-gray-500">
        No uploads yet
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
