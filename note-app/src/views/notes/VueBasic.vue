<script>
// 笔记元信息：供 router/Sidebar/Home 自动读取
export const noteMeta = {
  title: 'Vue 响应式基础',
  group: 'Vue',
  order: 1,
}
</script>

<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
</script>

<template>
  <article class="px-8 py-10 max-w-3xl mx-auto">
    <div class="text-xs text-indigo-500 dark:text-indigo-400 font-medium">VUE</div>
    <h1 class="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-100">
      Vue 响应式基础
    </h1>
    <p class="mt-3 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
      Vue 3 通过
      <code class="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-rose-600 dark:text-rose-400 text-[13px]">ref()</code>
      创建响应式状态。模板中直接访问会自动拆包；在
      <code class="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-rose-600 dark:text-rose-400 text-[13px]">&lt;script setup&gt;</code>
      中需要通过
      <code class="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-rose-600 dark:text-rose-400 text-[13px]">.value</code>
      读写。
    </p>

    <DemoBlock
      name="CounterDemo"
      title="计数器"
      description="点击按钮自增；当 count > 0 时出现重置按钮（v-if）。"
    />
  </article>
</template>
