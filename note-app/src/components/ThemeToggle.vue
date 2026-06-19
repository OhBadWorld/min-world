<script setup>
import { useDark } from '../composables/useDark.js'

const { isDark, toggle } = useDark()
</script>

<template>
  <button
    type="button"
    class="w-full px-3 py-1.5 rounded-md text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center justify-center gap-2"
    :title="isDark ? '切换到亮色模式' : '切换到暗色模式'"
    @click="toggle"
  >
    <span class="text-base leading-none">{{ isDark ? '🌙' : '☀️' }}</span>
    <span>{{ isDark ? '暗色模式' : '亮色模式' }}</span>
  </button>
</template>
