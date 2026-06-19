<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'

const route = useRoute()
const router = useRouter()

// ========== 面包屑：根据当前路由 meta 派生 ==========
const crumbs = computed(() => {
  const list = [{ label: '首页', to: '/' }]
  if (route.path === '/') return list
  const m = route.meta || {}
  if (m.group) list.push({ label: m.group })
  list.push({ label: m.title || String(route.name || route.path) })
  return list
})

// ========== 搜索：从已注册路由派生候选 ==========
const allNotes = router.options.routes
  .filter((r) => r.meta?.group) // 只搜笔记，排除 home / 404
  .map((r) => ({
    path: r.path,
    title: r.meta.title,
    group: r.meta.group,
  }))

const query = ref('')
const open = ref(false)
const activeIndex = ref(0)
const inputRef = ref(null)

const matches = computed(() => {
  const q = query.value.trim().toLowerCase()
  if (!q) return []
  return allNotes
    .filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.group.toLowerCase().includes(q),
    )
    .slice(0, 8)
})

watch(matches, () => {
  activeIndex.value = 0
})

function go(item) {
  if (!item) return
  router.push(item.path)
  query.value = ''
  open.value = false
  inputRef.value?.blur()
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    query.value = ''
    open.value = false
    inputRef.value?.blur()
    return
  }
  if (!matches.value.length) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % matches.value.length
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    activeIndex.value =
      (activeIndex.value - 1 + matches.value.length) % matches.value.length
  } else if (e.key === 'Enter') {
    e.preventDefault()
    go(matches.value[activeIndex.value])
  }
}

function onBlur() {
  // 延迟关闭，避免 mousedown 还没触发就被卸载
  setTimeout(() => {
    open.value = false
  }, 150)
}

// 路由切换后清空搜索
watch(
  () => route.path,
  () => {
    query.value = ''
    open.value = false
  },
)

// 全局快捷键 "/" 聚焦搜索框
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
      e.preventDefault()
      nextTick(() => inputRef.value?.focus())
    }
  })
}
</script>

<template>
  <header
    class="sticky top-0 z-20 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur"
  >
    <div class="flex items-center justify-between px-6 py-3 gap-4">
      <!-- 面包屑 -->
      <ol class="flex items-center text-sm min-w-0 overflow-hidden">
        <li
          v-for="(c, i) in crumbs"
          :key="i"
          class="flex items-center shrink-0"
        >
          <RouterLink
            v-if="c.to"
            :to="c.to"
            class="text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
          >
            {{ c.label }}
          </RouterLink>
          <span
            v-else
            :class="
              i === crumbs.length - 1
                ? 'text-gray-800 dark:text-gray-100 font-medium'
                : 'text-gray-500 dark:text-gray-400'
            "
            class="truncate max-w-[18rem]"
          >
            {{ c.label }}
          </span>
          <svg
            v-if="i < crumbs.length - 1"
            class="w-3.5 h-3.5 mx-1.5 text-gray-300 dark:text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
              clip-rule="evenodd"
            />
          </svg>
        </li>
      </ol>

      <!-- 搜索 -->
      <div class="relative w-72 shrink-0">
        <div class="relative">
          <svg
            class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clip-rule="evenodd"
            />
          </svg>
          <input
            ref="inputRef"
            v-model="query"
            type="text"
            placeholder="搜索笔记..."
            class="w-full pl-8 pr-12 py-1.5 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 dark:focus:border-indigo-500 transition"
            @focus="open = true"
            @blur="onBlur"
            @keydown="onKeydown"
          />
          <kbd
            v-if="!query"
            class="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600"
          >/</kbd>
        </div>

        <!-- 下拉结果 -->
        <ul
          v-if="open && matches.length"
          class="absolute right-0 top-full mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg overflow-hidden py-1 z-30"
        >
          <li
            v-for="(m, i) in matches"
            :key="m.path"
            :class="
              i === activeIndex
                ? 'bg-indigo-50 dark:bg-indigo-500/15'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800'
            "
            class="px-3 py-2 cursor-pointer transition"
            @mousedown.prevent="go(m)"
            @mouseenter="activeIndex = i"
          >
            <div class="text-[10px] text-indigo-500 dark:text-indigo-400 font-medium uppercase tracking-wider">
              {{ m.group }}
            </div>
            <div class="text-sm text-gray-800 dark:text-gray-100">
              {{ m.title }}
            </div>
          </li>
        </ul>
        <div
          v-else-if="open && query"
          class="absolute right-0 top-full mt-1 w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg px-3 py-3 text-sm text-gray-400 dark:text-gray-500 z-30"
        >
          无匹配结果
        </div>
      </div>
    </div>
  </header>
</template>
