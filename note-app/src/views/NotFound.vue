<script setup>
import { RouterLink, useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-6 text-center"
  >
    <div
      class="text-[120px] font-bold leading-none text-indigo-500 dark:text-indigo-400 select-none"
    >
      404
    </div>
    <h1 class="mt-2 text-2xl font-semibold text-gray-800 dark:text-gray-100">
      页面走丢了
    </h1>
    <p class="mt-3 text-sm text-gray-500 dark:text-gray-400 max-w-md">
      没有找到路径
      <code
        class="px-1.5 py-0.5 mx-1 rounded bg-gray-100 dark:bg-gray-800 text-rose-600 dark:text-rose-400 text-[13px]"
      >
        {{ route.fullPath }}
      </code>
      对应的笔记。它可能已被移动、重命名，或还没来得及写出来。
    </p>

    <div class="mt-8 flex items-center gap-3">
      <RouterLink
        to="/"
        class="px-4 py-2 rounded-md bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition shadow-sm"
      >
        回到首页
      </RouterLink>
      <button
        type="button"
        class="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        @click="$router.back()"
      >
        返回上一页
      </button>
    </div>
  </div>
</template>
