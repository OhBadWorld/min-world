import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../views/NotFound.vue'

// 自动收集 src/views/notes 下的所有笔记页（eager）
//   - module.default  → 组件
//   - module.noteMeta → { title, group, order, path? }
// 新增笔记：在 views/notes/ 下放一个 .vue 文件并 export const noteMeta = {...}
//          路由 / 侧边栏 / 首页会自动出现，无需改任何注册代码。
const modules = import.meta.glob('../views/notes/*.vue', { eager: true })

// PascalCase → kebab-case，例如 VueBasic → vue-basic
function toKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

const noteRoutes = []
for (const filePath in modules) {
  const mod = modules[filePath]
  const meta = mod.noteMeta || {}
  const fileName = filePath.match(/\/([^/]+)\.vue$/)?.[1] || 'Unknown'
  const kebab = toKebab(fileName)

  noteRoutes.push({
    path: meta.path || `/notes/${kebab}`,
    name: kebab,
    component: mod.default,
    meta: {
      title: meta.title || fileName,
      group: meta.group || 'Misc',
      order: meta.order ?? 99,
    },
  })
}

// 同组内按 order 升序，未指定 order 排在最后
noteRoutes.sort((a, b) => {
  if (a.meta.group !== b.meta.group) return 0
  return a.meta.order - b.meta.order
})

if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info(
    '[router] notes auto-registered:',
    noteRoutes.map((r) => `${r.meta.group}/${r.meta.title} → ${r.path}`),
  )
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
    meta: { title: '首页' },
  },
  ...noteRoutes,
  // 404 兜底：必须放在最后
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { title: '404' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
