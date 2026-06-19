<script>
export const noteMeta = {
  title: '卡片组件',
  group: 'Tailwind',
  order: 1,
}
</script>

<script setup>
import DemoBlock from '../../components/DemoBlock.vue'
</script>

<template>
  <article class="px-8 py-10 max-w-3xl mx-auto">
    <div class="text-xs text-indigo-500 dark:text-indigo-400 font-medium">
      TAILWIND
    </div>
    <h1 class="mt-1 text-2xl font-semibold text-gray-800 dark:text-gray-100">
      卡片组件
    </h1>
    <p class="mt-3 text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
      使用 Tailwind 的原子化类快速搭建卡片样式：圆角、边框、阴影、悬浮过渡，
      不用自己写一行 CSS。
    </p>

    <DemoBlock
      name="CardDemo"
      title="基础卡片"
      description="鼠标悬浮时阴影增强；按钮使用 hover 状态切换背景色。"
    />
  </article>
</template>
