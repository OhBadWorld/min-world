# note-app 项目实现报告

> 一个仿 Element Plus 风格的 Vue 3 笔记站点：每篇笔记同屏呈现"实时运行的组件 + 可复制的源码"。
>
> 从立项到上线，全程在一次结对编程会话中完成。

- **项目目录**：`/Users/yuangong1/智慧树文件/公司项目/临时demo/min-world/note-app`
- **生产链接**：[https://note-app-gilt-rho.vercel.app](https://note-app-gilt-rho.vercel.app)
- **方案文档**：[note-project-plan.md](./note-project-plan.md)

---

## 1. 技术栈

| 类别 | 选型 | 备注 |
| --- | --- | --- |
| 构建工具 | **Vite v8.0.16** | + `@vitejs/plugin-vue` v6 |
| 框架 | **Vue 3.5.34**（JavaScript） | 不引入 TypeScript |
| 样式 | **Tailwind CSS v4.3.1** | 通过 `@tailwindcss/vite` 零配置插件 |
| 代码高亮 | **Shiki v4.2.0** | 多主题（github-light / github-dark）+ CSS 变量切换 |
| 路由 | **vue-router v5.1.0** | History 模式 |
| 包管理 | **pnpm v11.8.0** | 通过 corepack 启用 |
| 运行环境 | **Node.js v22.19.0** | 全程 nvm 强制锁定 |
| 部署 | **Vercel CLI v54.14.2** | 团队 `tomxis-projects` |

---

## 2. 实现里程碑

### Step 1 · 项目方案文档

输出 [note-project-plan.md](./note-project-plan.md)：项目简介、技术栈、核心功能（实时渲染 + 同屏源码 + 高亮 + 折叠 + 复制）、项目结构、依赖清单、开发步骤、待确认事项。

> 关键决策：先成文再动工，确保选型/取舍可被复盘。

### Step 2 · 脚手架初始化

```bash
nvm use 22.19.0          # 强制 Node 版本
corepack enable          # 启用 pnpm
pnpm create vite note-app --template vue
```

记忆中固化规则：**每次调用终端前 `node -v`，不是 22.19.0 就先 `nvm use 22.19.0`**。

启动 dev server：
```bash
pnpm dev    # http://localhost:5174 （5173 被占用）
```

### Step 3 · Tailwind v4 + 核心组件 DemoBlock

```bash
pnpm add -D tailwindcss @tailwindcss/vite
pnpm add shiki
```

**[vite.config.js](./note-app/vite.config.js)**：注册 `tailwindcss()` 插件。

**[src/style.css](./note-app/src/style.css)**：仅一行 `@import "tailwindcss";`，告别 `tailwind.config.js`。

**[src/components/DemoBlock.vue](./note-app/src/components/DemoBlock.vue)** 核心组件：
- 默认插槽承载实时组件
- shiki 异步 `codeToHtml` 生成高亮（兜底为 `<pre>` 转义）
- 复制按钮（`navigator.clipboard` + textarea fallback）
- 折叠/展开（max-height + opacity 过渡）

源码传入采用 Vite 的 `?raw` 后缀，确保"展示的代码"和"渲染的组件"严格一致。

### Step 4 · 路由 + Sidebar + 多笔记页面

```bash
pnpm add vue-router
```

**[router/index.js](./note-app/src/router/index.js)** 用 `meta.group + meta.title` 描述每个路由的"分组"和"标题"，让 UI 数据化驱动。

**[Sidebar.vue](./note-app/src/components/Sidebar.vue)** 通过 `router.options.routes` 自动派生分组导航，新增路由零样板。

**[Home.vue](./note-app/src/views/Home.vue)** 同样消费 `router.options.routes`，自动渲染笔记速览卡片。

落地三篇示范笔记：`VueBasic` / `FormBinding` / `TailwindCard`。

> 踩坑：先创建文件再 `pnpm add vue-router` 触发了 Vite 依赖预构建报错，等 `optimized dependencies changed. reloading` 自愈即可。

### Step 5 · 404 路由

新增 [NotFound.vue](./note-app/src/views/NotFound.vue) + 在 router 末尾追加：

```js
{ path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound, meta: { title: '404' } }
```

注意 catch-all 必须放最后；不带 `meta.group` 所以**不会出现在 Sidebar / 首页**。

### Step 6 · 暗色模式（Tailwind v4 dark 变体）

**[style.css](./note-app/src/style.css)** 启用 v4 自定义变体（与 v3 的 `darkMode: 'class'` 配置不同）：

```css
@custom-variant dark (&:where(.dark, .dark *));
html.dark body { background: #0f1115; color: #e5e7eb; }

/* shiki 多主题 CSS 变量切换：无需重新渲染代码块 */
.shiki, .shiki span { color: var(--shiki-light); background-color: var(--shiki-light-bg); }
html.dark .shiki, html.dark .shiki span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
}
```

**[useDark.js](./note-app/src/composables/useDark.js)**：模块顶层一次性初始化（localStorage 优先，否则跟随 `prefers-color-scheme`），`watch` 切换 `documentElement.classList`。

**[ThemeToggle.vue](./note-app/src/components/ThemeToggle.vue)**：🌙/☀️ 切换按钮，嵌入 Sidebar 底部。

**[DemoBlock.vue](./note-app/src/components/DemoBlock.vue)** shiki 改用 multi-theme 模式：

```js
themes: { light: 'github-light', dark: 'github-dark' },
defaultColor: false,    // 关键：输出 css 变量样式
```

最后批量为所有页面/Demo 补 `dark:` 变体。

### Step 7 · demos 自动注册（`import.meta.glob` 第一次出场）

**[src/demos/index.js](./note-app/src/demos/index.js)** 一次性扫描目录，同时拿到组件和 `?raw` 源码：

```js
const components = import.meta.glob('./*.vue', { eager: true })
const sources = import.meta.glob('./*.vue', {
  eager: true,
  query: '?raw',
  import: 'default',
})
// 拼成 { CounterDemo: { component, source }, ... }
```

**DemoBlock** 增加 `name` prop，自动从字典里查 `component` + `source`，于是笔记页里每个 Demo 调用从 6 行缩到 1 行：

```vue
<DemoBlock name="CounterDemo" title="计数器" description="..." />
```

### Step 8 · 路由 + 笔记页自动注册

每篇笔记 SFC 增加 `<script>` 块导出元数据（与 `<script setup>` 共存合法）：

```vue
<script>
export const noteMeta = { title: 'Vue 响应式基础', group: 'Vue', order: 1 }
</script>
```

**[router/index.js](./note-app/src/router/index.js)** 改造为 glob 自动派生：

```js
const modules = import.meta.glob('../views/notes/*.vue', { eager: true })
// 文件名 PascalCase → kebab-case → /notes/xxx
// noteMeta.title/group/order → route.meta
// 同组内按 order 升序
```

**新增一篇笔记的零样板流程**（最终形态）：
1. 在 `src/demos/MyDemo.vue` 写交互；
2. 在 `src/views/notes/MyTopic.vue` 顶部写 `noteMeta`，模板里 `<DemoBlock name="MyDemo" />`；
3. **完工**——路由、Sidebar、首页、搜索结果全部自动出现。

### Step 9 · 顶部 TopBar（面包屑 + 全局搜索）

**[TopBar.vue](./note-app/src/components/TopBar.vue)** 单组件承担两件事：

**面包屑**：从 `route.meta.group + meta.title` 派生路径
- `/` → 首页
- `/notes/vue-basic` → 首页 / Vue / Vue 响应式基础
- `/不存在` → 首页 / 404

**全局搜索**：
- 数据源：`router.options.routes.filter(r => r.meta?.group)`，与自动注册联动
- 模糊匹配标题或分组（小写包含），最多 8 条
- 键盘交互：`↑↓` 选择 / `Enter` 跳转 / `Esc` 清空 / 全局 `/` 聚焦
- 路由切换后自动清空、关闭

挂在 [App.vue](./note-app/src/App.vue) 主区顶部（`sticky top-0 z-20` + `backdrop-blur`）。

### Step 10 · Vercel 部署

```bash
npm install -g vercel    # pnpm 全局 bin 没在 PATH，改用 npm 安装
vercel login             # OAuth 设备授权流
```

**[vercel.json](./note-app/vercel.json)** 关键配置（History 模式必备）：

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

否则直接访问 `/notes/vue-basic` 会 404。

```bash
vercel --prod --yes      # 云端 build 7s + 上线 18s
```

验证：
| 路径 | 状态 |
| --- | --- |
| `/` | 200 ✅ |
| `/notes/vue-basic` | 200 ✅ |
| `/notes/tailwind-card` | 200 ✅ |

---

## 3. 项目结构

```
note-app/
├── public/
├── src/
│   ├── components/
│   │   ├── DemoBlock.vue       # 核心：实时渲染 + 高亮源码 + 折叠 + 复制
│   │   ├── Sidebar.vue         # 自动派生分组导航
│   │   ├── TopBar.vue          # 面包屑 + 全局搜索
│   │   └── ThemeToggle.vue     # 🌙/☀️
│   ├── composables/
│   │   └── useDark.js          # 暗色模式状态 + 持久化
│   ├── demos/
│   │   ├── index.js            # import.meta.glob 自动注册组件 + 源码
│   │   ├── CounterDemo.vue
│   │   ├── InputDemo.vue
│   │   └── CardDemo.vue
│   ├── router/
│   │   └── index.js            # import.meta.glob 自动派生路由
│   ├── views/
│   │   ├── Home.vue
│   │   ├── NotFound.vue
│   │   └── notes/
│   │       ├── VueBasic.vue       # 顶部 export const noteMeta
│   │       ├── FormBinding.vue
│   │       └── TailwindCard.vue
│   ├── App.vue                 # Sidebar + TopBar + RouterView
│   ├── main.js
│   └── style.css               # @import "tailwindcss" + @custom-variant dark
├── vercel.json                 # SPA fallback rewrites
├── vite.config.js
└── package.json
```

---

## 4. 关键设计决策

| 决策 | 取舍 | 理由 |
| --- | --- | --- |
| Tailwind v4 用 `@tailwindcss/vite` 零配置 | 不写 `tailwind.config.js` | v4 提供 `@import "tailwindcss"` + `@custom-variant`，更轻 |
| Shiki 用 multi-theme + CSS 变量 | 不为切换重新渲染 | 切主题瞬间生效，无闪烁 |
| 路由元数据驱动 UI | meta.group + meta.title | Sidebar / Home / TopBar 搜索零样板，新增笔记自动出现 |
| 笔记 SFC 共存 `<script>` + `<script setup>` | 元数据走 named export | 保留 setup 开发体验，又能在路由层同步拿到 meta |
| `import.meta.glob` 双扫描 | 一次拿组件，一次拿 `?raw` 源码 | 比写一个 .meta.js 文件更省事 |
| `useDark` 模块顶层初始化 | 不放进 onMounted | 首屏前完成主题应用，避免暗→亮闪烁 |
| Vercel 部署加 `vercel.json` rewrites | 不改成 hash 模式 | 保持干净 URL，刷新子路径不 404 |

---

## 5. 自动化能力总览

注册一次，三处联动：

```
src/views/notes/MyTopic.vue
        │
        ├─ noteMeta.{title, group, order}
        │
        ▼
router/index.js  (import.meta.glob)
        │
        ├──► /notes/my-topic 路由
        │
        ▼
router.options.routes
        │
        ├──► Sidebar 分组导航     （filter by meta.group）
        ├──► Home 速览卡片         （filter by meta.group）
        └──► TopBar 全局搜索       （filter by meta.group）
```

```
src/demos/MyDemo.vue
        │
        ▼
src/demos/index.js  (import.meta.glob × 2)
        │
        └──► <DemoBlock name="MyDemo" />  自动注入 component + source
```

---

## 6. 踩坑记录

| 现象 | 原因 | 解法 |
| --- | --- | --- |
| `pnpm: command not found` | 系统未装 pnpm | `corepack enable && corepack prepare pnpm@latest --activate` |
| Node 版本不符（v14.16.0） | nvm 默认版本旧 | 固化规则：每次调用终端前 `nvm use 22.19.0` |
| `Failed to resolve import "vue-router"` | 先建文件再装包，Vite 预构建滞后 | 等待 Vite 自动 `optimized dependencies changed. reloading` |
| `pnpm add -g vercel` 失败 | pnpm 全局 bin 不在 PATH | 改用 `npm install -g vercel` |
| 部署后刷新 `/notes/xxx` 404 | History 模式没有 SPA fallback | 添加 `vercel.json` 的 rewrites 规则 |
| `tail \| head` 卡终端 | 缓冲区延迟 | 直接读完整输出，或后台跑 |

---

## 7. 后续可选优化

- [ ] 用 `build.rollupOptions.output.manualChunks` 把 shiki 语言按需 lazy load，缓解 wasm/cpp/emacs-lisp chunk 过大警告
- [ ] `vercel domains add` 绑定自定义域名
- [ ] `<DemoBlock>` 名字约定：`Foo.vue` 自动配 `FooDemo.vue`，连 `name` prop 都省了
- [ ] 引入 markdown 渲染（如 `unplugin-vue-markdown`），用 `.md` 写笔记正文
- [ ] 加单元测试（Vitest）+ E2E（Playwright）
- [ ] CI/CD：GitHub Actions push → Vercel 自动部署

---

## 8. 时间线

| 阶段 | 完成项 |
| --- | --- |
| ① 方案 | note-project-plan.md |
| ② 骨架 | Vite + Vue 3 项目跑通 |
| ③ 内容 | Tailwind v4 + DemoBlock + Shiki |
| ④ 结构 | vue-router + Sidebar + 笔记页 |
| ⑤ 容错 | 404 路由 |
| ⑥ 体验 | 暗色模式 + 持久化 + shiki 多主题 |
| ⑦ 自动化 A | demos 自动注册 |
| ⑧ 自动化 B | 笔记页 + 路由自动注册 |
| ⑨ 增强 | TopBar 面包屑 + 全局搜索 + `/` 快捷键 |
| ⑩ 上线 | Vercel 生产部署 + SPA fallback |

---

> 报告生成时间：2026-06-19
