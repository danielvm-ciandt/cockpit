<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-3xl font-bold text-gray-900">Accounts</h2>
        <p class="mt-2 text-gray-600">Manage and monitor your accounts</p>
      </div>
      <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
        + New Account
      </button>
    </div>

    <!-- Accounts table -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Account Name</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Balance</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Return %</th>
            <th class="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr class="border-b hover:bg-gray-50">
            <td colspan="5" class="px-6 py-8 text-center text-gray-500">
              No accounts yet. Upload a file to get started.
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
