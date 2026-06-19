// 自动收集 ./demos 目录下的所有 *.vue：
//   - components: 组件本身（用于实时渲染）
//   - sources:    组件源码字符串（用于代码展示，等价于手写 ?raw）
// 这样新增一个 demo 文件，无需在任何笔记页里写 import。
const components = import.meta.glob('./*.vue', { eager: true })
const sources = import.meta.glob('./*.vue', {
  eager: true,
  query: '?raw',
  import: 'default',
})

function getName(path) {
  const m = path.match(/\.\/(.+)\.vue$/)
  return m ? m[1] : path
}

export const demos = {}
for (const path in components) {
  const name = getName(path)
  demos[name] = {
    component: components[path].default || components[path],
    source: sources[path] || '',
  }
}

// 在控制台暴露 demo 名单，方便排查"找不到 demo"
if (import.meta.env.DEV) {
  // eslint-disable-next-line no-console
  console.info('[demos] registered:', Object.keys(demos))
}

export function getDemo(name) {
  const d = demos[name]
  if (!d && import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.warn(
      `[demos] "${name}" not found. Available: ${Object.keys(demos).join(', ')}`,
    )
  }
  return d || { component: null, source: '' }
}
