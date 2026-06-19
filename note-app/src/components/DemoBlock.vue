<script setup>
import { ref, shallowRef, computed, watch, onMounted } from 'vue'
import { codeToHtml } from 'shiki'
import { getDemo } from '../demos'

const props = defineProps({
  // 方式 A：按名字自动从 src/demos 字典里注入组件 + 源码
  name: { type: String, default: '' },
  // 方式 B：手动传源码字符串（与默认插槽配合）
  source: { type: String, default: '' },
  // 代码语言：vue / javascript / html / css ...
  lang: { type: String, default: 'vue' },
  // 标题（可选）
  title: { type: String, default: '' },
  // 描述（可选）
  description: { type: String, default: '' },
})

// 通过 name 自动解析
const registered = computed(() => (props.name ? getDemo(props.name) : null))
const resolvedComponent = computed(() => registered.value?.component || null)
const resolvedSource = computed(
  () => props.source || registered.value?.source || '',
)

const expanded = ref(false)
const copied = ref(false)
const highlightedHtml = shallowRef('')

// 异步生成高亮 HTML：使用 shiki 多主题，根据 html.dark 切换
async function renderHighlight() {
  const code = resolvedSource.value
  if (!code) {
    highlightedHtml.value = ''
    return
  }
  try {
    highlightedHtml.value = await codeToHtml(code, {
      lang: props.lang,
      themes: { light: 'github-light', dark: 'github-dark' },
      defaultColor: false,
    })
  } catch (e) {
    // 兜底：直接转义后用 <pre> 展示
    const escaped = code
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
    highlightedHtml.value = `<pre class="shiki"><code>${escaped}</code></pre>`
    // eslint-disable-next-line no-console
    console.warn('[DemoBlock] shiki highlight failed:', e)
  }
}

onMounted(renderHighlight)
watch(() => [resolvedSource.value, props.lang], renderHighlight)

async function copyCode() {
  const code = resolvedSource.value
  try {
    await navigator.clipboard.writeText(code)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  } catch (e) {
    // 兼容旧浏览器
    const ta = document.createElement('textarea')
    ta.value = code
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    document.body.removeChild(ta)
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  }
}

function toggle() {
  expanded.value = !expanded.value
}
</script>

<template>
  <section
    class="demo-block my-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm overflow-hidden"
  >
    <header
      v-if="title || description"
      class="px-5 py-3 border-b border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/50"
    >
      <h3
        v-if="title"
        class="text-base font-medium text-gray-800 dark:text-gray-100"
      >
        {{ title }}
      </h3>
      <p
        v-if="description"
        class="mt-1 text-sm text-gray-500 dark:text-gray-400"
      >
        {{ description }}
      </p>
    </header>

    <div class="demo-preview px-6 py-6">
      <slot>
        <component :is="resolvedComponent" v-if="resolvedComponent" />
        <div
          v-else
          class="text-sm text-rose-500 dark:text-rose-400"
        >
          <template v-if="name">未找到 demo：{{ name }}</template>
          <template v-else>未提供 demo 内容（请传 name 或 default slot）</template>
        </div>
      </slot>
    </div>

    <div
      class="demo-source border-t border-gray-100 dark:border-gray-800 transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden"
      :class="expanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'"
    >
      <div class="relative bg-[#fafafa] dark:bg-[#0d1117]">
        <button
          type="button"
          class="absolute top-2 right-2 z-10 px-2.5 py-1 text-xs rounded border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition shadow-sm"
          @click="copyCode"
        >
          {{ copied ? '已复制' : '复制代码' }}
        </button>
        <div class="demo-code overflow-auto" v-html="highlightedHtml"></div>
      </div>
    </div>

    <button
      type="button"
      class="w-full py-2 text-xs text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 border-t border-gray-100 dark:border-gray-800 transition flex items-center justify-center gap-1"
      @click="toggle"
    >
      <span>{{ expanded ? '收起代码' : '展开代码' }}</span>
      <svg
        class="w-3 h-3 transition-transform duration-300"
        :class="expanded ? 'rotate-180' : ''"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 011.08 1.04l-4.25 4.39a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z"
          clip-rule="evenodd"
        />
      </svg>
    </button>
  </section>
</template>
