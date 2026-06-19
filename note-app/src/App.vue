<script setup>
import Sidebar from './components/Sidebar.vue'
import TopBar from './components/TopBar.vue'
</script>

<template>
  <div class="min-h-screen flex">
    <Sidebar />
    <main class="flex-1 min-w-0 flex flex-col">
      <TopBar />
      <div class="flex-1 min-w-0">
        <RouterView />
      </div>
    </main>
  </div>
</template>
