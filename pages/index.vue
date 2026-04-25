<template>
  <div class="space-y-8">
    <!-- Page header -->
    <div>
      <h2 class="text-3xl font-bold text-gray-900">Dashboard</h2>
      <p class="mt-2 text-gray-600">Portfolio overview and performance metrics</p>
    </div>

    <!-- Summary cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-500 text-sm font-medium">Total Assets</div>
        <div class="mt-2 text-3xl font-bold text-gray-900">$0.00</div>
        <div class="mt-2 text-green-600 text-sm">+0.0% today</div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-500 text-sm font-medium">Total Return</div>
        <div class="mt-2 text-3xl font-bold text-gray-900">0.0%</div>
        <div class="mt-2 text-green-600 text-sm">YTD</div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-500 text-sm font-medium">Accounts</div>
        <div class="mt-2 text-3xl font-bold text-gray-900">0</div>
        <div class="mt-2 text-gray-600 text-sm">Active</div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <div class="text-gray-500 text-sm font-medium">Instruments</div>
        <div class="mt-2 text-3xl font-bold text-gray-900">0</div>
        <div class="mt-2 text-gray-600 text-sm">Holdings</div>
      </div>
    </div>

    <!-- Charts placeholder -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Asset Allocation</h3>
        <div class="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          Chart placeholder
        </div>
      </div>

      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Performance</h3>
        <div class="h-64 bg-gray-100 rounded flex items-center justify-center text-gray-400">
          Chart placeholder
        </div>
      </div>
    </div>

    <!-- Recent activity -->
    <div class="bg-white rounded-lg shadow p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
      <div class="text-center py-8 text-gray-500">
        No transactions yet
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
