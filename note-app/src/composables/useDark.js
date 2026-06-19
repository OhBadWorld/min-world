import { ref, watch } from 'vue'

const STORAGE_KEY = 'note-app-theme'
const isDark = ref(false)

function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
}

// 模块顶层一次性初始化：优先读 localStorage，其次跟随系统偏好
const saved = localStorage.getItem(STORAGE_KEY)
if (saved === 'dark') {
  isDark.value = true
} else if (saved === 'light') {
  isDark.value = false
} else {
  isDark.value =
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
}
applyTheme(isDark.value)

watch(isDark, (v) => {
  applyTheme(v)
  localStorage.setItem(STORAGE_KEY, v ? 'dark' : 'light')
})

export function useDark() {
  return {
    isDark,
    toggle: () => {
      isDark.value = !isDark.value
    },
  }
}
