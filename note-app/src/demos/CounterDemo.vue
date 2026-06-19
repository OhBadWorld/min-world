<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <div class="flex items-center gap-3">
    <button
      class="px-4 py-2 rounded-md bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 active:bg-indigo-700 transition shadow-sm"
      @click="count++"
    >
      点我 +1
    </button>
    <span class="text-gray-700 dark:text-gray-300">
      当前计数：<b class="text-indigo-600 dark:text-indigo-400">{{ count }}</b>
    </span>
    <button
      v-if="count > 0"
      class="px-3 py-1.5 text-xs rounded border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
      @click="count = 0"
    >
      重置
    </button>
  </div>
</template>
