# 笔记记录项目方案文档

## 一、项目简介

本项目是一个面向开发者的**笔记记录工具**，核心特色是支持**代码预览 + 代码运行效果实时展示**，类似 [Element Plus](https://element-plus.org/) 官方文档中组件示例那样：左侧（或上方）展示效果，下方折叠区域可展开查看源码，并支持复制代码。

适用场景：
- 个人前端学习笔记
- 组件 Demo 收藏与复盘
- 团队内部 UI 组件示例展示

---

## 二、技术栈

| 类别 | 选型 | 说明 |
| --- | --- | --- |
| 构建工具 | **Vite** | 极速冷启动 + HMR 热更新 |
| 前端框架 | **Vue 3** | 使用 Composition API（`<script setup>` 写法） |
| 样式方案 | **Tailwind CSS** | 原子化 CSS，快速搭建 UI |
| 开发语言 | **JavaScript**（不使用 TypeScript） | 降低心智负担，专注笔记内容 |
| 包管理 | pnpm（推荐） / npm | 任选其一 |

> 说明：刻意不引入 TypeScript，保持项目轻量、上手即写。

---

## 三、核心功能

### 1. 笔记列表与分类
- 左侧侧边栏按分类展示笔记
- 点击进入对应笔记详情页

### 2. 代码 + 效果同屏展示（核心功能）
仿 Element Plus 的 Demo Block 体验：

```
┌─────────────────────────────────┐
│  [实时渲染区]                    │  ← 真实运行的 Vue 组件效果
│  按钮、表单、卡片等等             │
├─────────────────────────────────┤
│  ▽ 展开代码（点击折叠/展开）      │
│  <template> ...                 │  ← 高亮显示的源码
│  <script setup> ...             │
│  <style> ...                    │
└─────────────────────────────────┘
```

具体能力：
- ✅ **实时预览**：示例组件直接挂载渲染，所见即所得
- ✅ **源码展示**：与渲染区使用同一份源码，二者完全一致
- ✅ **代码高亮**：使用 `highlight.js` 或 `shiki` 进行语法高亮
- ✅ **一键复制**：右上角"复制"按钮，复制源码到剪贴板
- ✅ **折叠展开**：默认折叠，点击展开查看代码

### 3. Markdown 笔记支持
- 笔记正文使用 Markdown 编写
- 支持在 Markdown 中嵌入"Demo Block"

### 4. 暗色模式（可选）
- Tailwind 内置 dark 模式切换

---

## 四、关键实现思路

### 4.1 Demo Block 组件设计

封装一个 `<DemoBlock>` 组件，接收两部分内容：

```vue
<DemoBlock>
  <!-- 默认插槽：实际渲染的组件 -->
  <MyButtonDemo />

  <!-- source 插槽：原始代码字符串 -->
  <template #source>
    <pre><code>...</code></pre>
  </template>
</DemoBlock>
```

### 4.2 源码自动注入方案

避免手写两份代码（一份运行、一份展示），有两种思路：

**方案 A：Vite 自定义插件**
- 编写 Vite 插件，在编译时把 `.vue` 示例文件的原始内容作为字符串注入
- 使用 `?raw` 后缀直接 import 源码字符串：
  ```js
  import DemoComp from './demos/Button.vue'
  import DemoSource from './demos/Button.vue?raw'
  ```

**方案 B：Markdown 驱动**（更接近 Element Plus 文档）
- 使用 `vite-plugin-md` 或 `unplugin-vue-markdown`
- 在 .md 文件中直接写 ` ```vue demo ... ``` `
- 通过自定义 markdown-it 插件，将代码块编译成"可执行 + 可展示"的双形态

> 推荐 **方案 A**：实现简单，目录结构清晰，无需引入 Markdown 编译器。

### 4.3 代码高亮
- 选型：`shiki`（VSCode 同款主题，效果最佳）或 `highlight.js`（轻量）
- 推荐 `shiki`

### 4.4 复制功能
- 使用浏览器原生 `navigator.clipboard.writeText()` API

---

## 五、项目结构（规划）

```
note-app/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── DemoBlock.vue        # 核心：代码+效果展示组件
│   │   ├── CodeHighlight.vue    # 代码高亮封装
│   │   └── Sidebar.vue          # 笔记侧边栏
│   ├── demos/                   # 存放所有示例 .vue 文件
│   │   ├── ButtonDemo.vue
│   │   ├── FormDemo.vue
│   │   └── ...
│   ├── notes/                   # 笔记页面
│   │   ├── vue-basic.vue
│   │   └── tailwind-tips.vue
│   ├── router/
│   │   └── index.js
│   ├── App.vue
│   ├── main.js
│   └── style.css                # Tailwind 入口
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── package.json
```

---

## 六、依赖清单（预估）

```json
{
  "dependencies": {
    "vue": "^3.4.0",
    "vue-router": "^4.3.0",
    "shiki": "^1.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "@vitejs/plugin-vue": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

> 备注：如需 Markdown 支持，再追加 `unplugin-vue-markdown` 等。

---

## 七、开发步骤建议

1. `pnpm create vite` 初始化 Vue 3 + JavaScript 模板
2. 接入 Tailwind CSS 并配置 `tailwind.config.js`
3. 配置 `vue-router`，搭建主框架（Sidebar + 内容区）
4. 实现 `DemoBlock` 组件（先实现基础折叠/展开 + 代码高亮 + 复制）
5. 通过 `?raw` 引入示例源码，验证"代码与渲染一致"
6. 编写第一篇 Demo 笔记，完整跑通流程
7. 完善样式 / 暗色模式 / 路由细节

---

## 八、待确认事项

在正式开始创建项目前，需要你确认以下几点：

1. **项目目录名**：建议命名为 `note-app` 还是其他？
2. **包管理器**：使用 `pnpm` / `npm` / `yarn`？
3. **路由方式**：Hash 模式 还是 History 模式？
4. **代码高亮库**：`shiki`（推荐）还是 `highlight.js`？
5. **是否需要 Markdown 支持**：还是仅用 .vue 文件组织笔记？
6. **是否需要暗色模式**？
7. **源码展示方案**：方案 A（`?raw` 引入）还是方案 B（Markdown 驱动）？

---

> 文档版本：v1.0  
> 待你确认后，再正式初始化项目目录。
