<script>
export const noteMeta = {
  title: '表单双向绑定',
  group: 'Vue',
  order: 2,
}
</script>

<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
</script>

<template>
  <article class="px-8 py-10 max-w-3xl mx-auto">
    <div class="text-xs text-indigo-500 dark:text-indigo-400 font-medium">VUE</div>
    <h1 class="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-100">
      表单双向绑定
    </h1>
    <p class="mt-3 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
      <code class="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-rose-600 dark:text-rose-400 text-[13px]">v-model</code>
      在原生表单元素上等价于
      <code class="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-rose-600 dark:text-rose-400 text-[13px]">:value + @input</code>
      的语法糖；配合
      <code class="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-rose-600 dark:text-rose-400 text-[13px]">computed</code>
      可派生只读响应式数据。
    </p>

    <DemoBlock
      name="InputDemo"
      title="输入与派生"
      description="输入名字，下方文案根据输入值实时变化。"
    />
  </article>
</template>
