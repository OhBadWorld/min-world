<script setup>
const card = {
  title: 'Tailwind CSS',
  desc: '原子化 CSS 框架，开箱即用，配合 Vite 极速开发体验。',
  tag: '推荐',
}
</script>

<template>
  <div
    class="max-w-sm rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition p-5"
  >
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {{ card.title }}
      </h3>
      <span
        class="px-2 py-0.5 text-xs rounded-full bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
      >
        {{ card.tag }}
      </span>
    </div>
    <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
      {{ card.desc }}
    </p>
    <button
      class="mt-4 px-3 py-1.5 text-sm rounded-md bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-white transition"
    >
      查看详情
    </button>
  </div>
</template>
