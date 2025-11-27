<!-- frontend/src/layouts/default.vue -->

<template>
  <div class="app">
    <!-- Sidebar Overlay -->
    <div 
      class="sidebar-overlay" 
      :class="{ active: isSidebarOpen }"
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar Component -->
    <Sidebar 
      :is-open="isSidebarOpen"
      @toggle="toggleSidebar"
    />

    <main class="main">
      <div class="main-inner">
        <!-- HeaderBar Component -->
        <HeaderBar @toggle-menu="toggleSidebar" />

        <div class="content">
          <slot />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isSidebarOpen = ref(false)

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
  if (typeof window !== 'undefined') {
    localStorage.setItem('sidebarOpen', isSidebarOpen.value)
  }
}

onMounted(() => {
  // Load sidebar state from localStorage
  if (typeof window !== 'undefined') {
    const sidebarState = localStorage.getItem('sidebarOpen')
    if (window.innerWidth <= 768 && sidebarState === 'true') {
      isSidebarOpen.value = true
    }

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        isSidebarOpen.value = false
      }
    })

    let resizeHandler

    onMounted(() => {
      resizeHandler = () => { 
        if (window.innerWidth > 768) { isSidebarOpen.value = false }
      }
      window.addEventListener('resize', resizeHandler)
    })

    onUnmounted(() => {
      window.removeEventListener('resize', resizeHandler)
    })


    // Mencegah kembali ke halaman sebelumnya
    // history.pushState(null, "", location.href)
    // window.onpopstate = function () {
    //   history.pushState(null, "", location.href)
    // }
  }
})
</script>

<style>
:root {
  --cyan-primary: #00FFA0;
  --white: #FFFFFF;
  --dark-primary: #0A0E27;
  --dark-secondary: #0D1117;
  --dark-tertiary: #161B22;
  --gray-medium: #8B949E;
  --red-accent: #E70000;
  --pink-light: #47e7d7;
  --pink-medium: #50ecdd;
  --black: #010409;
  --gray-light: #C9D1D9;
  
  /* Sidebar */
  --sidebar-width: 260px;
  --sidebar-collapsed: 70px;
  
  /* Typography */
  --font-family: "Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-size-base: 15px;
  
  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 18px;
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-base: 0.3s ease;
}

/* Reset */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  background: var(--dark-secondary);
  color: var(--white);
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Custom Scrollbar - Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--cyan-primary) var(--dark-tertiary);
}

/* Custom Scrollbar - Webkit (Chrome, Safari, Edge) */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-button {
  display: none;
  height: 0;
  width: 0;
}

::-webkit-scrollbar-track {
  background: var(--dark-tertiary);
  border-radius: 0;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--cyan-primary) 0%, var(--pink-medium) 100%);
  border-radius: 0;
  border: none;
  transition: all var(--transition-base);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--pink-medium) 0%, var(--cyan-primary) 100%);
  box-shadow: 0 0 12px rgba(0, 255, 160, 0.6);
}

::-webkit-scrollbar-thumb:active {
  background: var(--cyan-primary);
  box-shadow: 0 0 20px rgba(0, 255, 160, 1);
}

::-webkit-scrollbar-corner {
  background: var(--dark-tertiary);
}

/* Scrollbar horizontal (loading bar style) */
::-webkit-scrollbar:horizontal {
  height: 6px;
}

::-webkit-scrollbar-thumb:horizontal {
  background: linear-gradient(90deg, var(--cyan-primary) 0%, var(--pink-medium) 100%);
}

/* Scrollbar untuk area spesifik (opsional) */
.table-container::-webkit-scrollbar-thumb {
  background: linear-gradient(90deg, var(--cyan-primary) 0%, var(--pink-light) 100%);
}

.sidebar::-webkit-scrollbar {
  width: 5px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(0, 255, 160, 0.4);
  border-radius: 0;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 255, 160, 0.7);
}

/* App Container */
.app {
  min-height: 100vh;
  display: flex;
  position: relative;
}

/* Sidebar Overlay (Mobile) */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 40;
  opacity: 0;
  transition: opacity var(--transition-base);
}

.sidebar-overlay.active {
  display: block;
  opacity: 1;
}

/* Main Content */
.main {
  margin-left: 270px;
  padding: 20px;
  flex: 1;
  min-height: 100vh;
  transition: margin-left var(--transition-base);
  width: calc(100% - 295px);
}

.main-inner {
  max-width: 1400px;
  margin: 0 auto;
}

/* Content Area */
.content {
  min-height: 445px;
  background-color: var(--dark-tertiary);
  border-radius: var(--radius-lg);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .main {
    margin-left: 0;
    width: 100%;
  }
}

@media (max-width: 480px) {
  .app {
    font-size: 14px;
  }

  .content {
    padding: 12px;
  }
}
</style>