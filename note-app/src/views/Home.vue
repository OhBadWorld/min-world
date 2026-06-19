<script setup>
import { useRouter, RouterLink } from 'vue-router'

const router = useRouter()

const notes = router.options.routes
  .filter((r) => r.meta?.group)
  .map((r) => ({
    path: r.path,
    title: r.meta.title,
    group: r.meta.group,
  }))
</script>

<template>
  <div class="px-8 py-10 max-w-4xl mx-auto">
    <h1 class="text-3xl font-semibold text-gray-800 dark:text-gray-100">
      欢迎来到我的笔记本 📒
    </h1>
    <p class="mt-2 text-gray-500 dark:text-gray-400">
      基于 Vite + Vue 3 + Tailwind CSS，仿 Element Plus 的代码示例展示风格。
      每篇笔记同时呈现
      <span class="text-gray-700 dark:text-gray-200 font-medium">实时运行的组件</span>
      与
      <span class="text-gray-700 dark:text-gray-200 font-medium">可复制的源码</span>。
    </p>

    <h2 class="mt-10 mb-4 text-lg font-medium text-gray-700 dark:text-gray-200">
      笔记速览
    </h2>
    <div class="grid sm:grid-cols-2 gap-4">
      <RouterLink
        v-for="n in notes"
        :key="n.path"
        :to="n.path"
        class="block p-5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-indigo-400 dark:hover:border-indigo-400 hover:shadow-md transition"
      >
        <div
          class="text-xs text-indigo-500 dark:text-indigo-400 font-medium mb-1"
        >
          {{ n.group }}
        </div>
        <div class="text-base font-semibold text-gray-800 dark:text-gray-100">
          {{ n.title }}
        </div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-2">
          → 进入查看
        </div>
      </RouterLink>
    </div>
  </div>
</template>
