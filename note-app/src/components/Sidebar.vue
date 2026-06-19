<script setup>
import { computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import ThemeToggle from './ThemeToggle.vue'

const router = useRouter()

const groups = computed(() => {
  const map = new Map()
  router.options.routes.forEach((r) => {
    if (!r.meta?.group) return
    if (!map.has(r.meta.group)) map.set(r.meta.group, [])
    map.get(r.meta.group).push({
      path: r.path,
      title: r.meta.title || r.name,
    })
  })
  return Array.from(map.entries()).map(([name, items]) => ({ name, items }))
})
</script>

<template>
  <aside
    class="w-60 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 h-screen sticky top-0 overflow-y-auto flex flex-col"
  >
    <div class="px-5 py-5 border-b border-gray-100 dark:border-gray-800">
      <RouterLink to="/" class="block">
        <div class="text-lg font-semibold text-gray-800 dark:text-gray-100">
          📒 笔记本
        </div>
        <div class="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
          代码 + 实时效果
        </div>
      </RouterLink>
    </div>

    <nav class="px-3 py-4 space-y-5 flex-1">
      <RouterLink
        to="/"
        class="block px-3 py-2 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        active-class="bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 font-medium"
      >
        首页
      </RouterLink>

      <div v-for="g in groups" :key="g.name">
        <div
          class="px-3 mb-1.5 text-xs font-medium uppercase tracking-wider text-gray-400 dark:text-gray-500"
        >
          {{ g.name }}
        </div>
        <div class="space-y-0.5">
          <RouterLink
            v-for="item in g.items"
            :key="item.path"
            :to="item.path"
            class="block px-3 py-1.5 text-sm rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
            active-class="bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-500/25 font-medium"
          >
            {{ item.title }}
          </RouterLink>
        </div>
      </div>
    </nav>

    <div class="px-3 py-3 border-t border-gray-100 dark:border-gray-800">
      <ThemeToggle />
    </div>
  </aside>
</template>
