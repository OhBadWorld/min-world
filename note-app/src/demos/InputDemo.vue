<script setup>
import { ref, computed } from 'vue'

const name = ref('')
const greeting = computed(() =>
  name.value ? `你好，${name.value}！👋` : '请输入你的名字...'
)
</script>

<template>
  <div class="space-y-3 max-w-md">
    <input
      v-model="name"
      type="text"
      placeholder="输入名字..."
      class="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-500/30 transition"
    />
    <p class="text-gray-700 dark:text-gray-300">{{ greeting }}</p>
  </div>
</template>
