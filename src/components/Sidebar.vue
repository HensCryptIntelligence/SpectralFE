<template>
  <aside 
    class="sidebar" 
    :class="{ active: isOpen }"
    role="navigation" 
    aria-label="Main navigation"
  >
    <div class="sidebar-top">
      <div class="brand">SPECTRAL</div>
      <nav class="nav">
        <NuxtLink to="/dashboard" class="nav-link-wrapper">
          <button 
            class="nav-item" 
            :class="{ active: isActive('/dashboard') }"
            data-target="dashboard" 
            aria-label="Dashboard"
            @click="setActiveMenu('dashboard')"
          >
            <span class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="7" height="9" x="3" y="3" rx="1"/>
                <rect width="7" height="5" x="14" y="3" rx="1"/>
                <rect width="7" height="9" x="14" y="12" rx="1"/>
                <rect width="7" height="5" x="3" y="16" rx="1"/>
              </svg>
            </span>
            <span class="label">Dashboard</span>
          </button>
        </NuxtLink>

        <NuxtLink to="/tracker" class="nav-link-wrapper">
          <button 
            class="nav-item" 
            :class="{ active: isActive('/tracker') }"
            data-target="tracker" 
            aria-label="Tracker"
            @click="setActiveMenu('tracker')"
          >
            <span class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/>
                <path d="M17 3h2a2 2 0 0 1 2 2v2"/>
                <path d="M21 17v2a2 2 0 0 1-2 2h-2"/>
                <path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                <circle cx="12" cy="12" r="3"/>
                <path d="m16 16-1.9-1.9"/>
              </svg>
            </span>
            <span class="label">Tracker</span>
          </button>
        </NuxtLink>

        <NuxtLink to="/calculate" class="nav-link-wrapper">
          <button 
            class="nav-item" 
            :class="{ active: isActive('/calculate') }"
            data-target="calculate" 
            aria-label="Calculate"
            @click="setActiveMenu('calculate')"
          >
            <span class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M17 12h-2l-2 5-2-10-2 5H7"/>
              </svg>
            </span>
            <span class="label">Calculate</span>
          </button>
        </NuxtLink>
      </nav>
    </div>

    <div class="sidebar-bottom">
      <button 
        class="logout-btn" 
        aria-label="Log out"
        @click="handleLogout"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m16 17 5-5-5-5"/>
          <path d="M21 12H9"/>
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        </svg>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from '#app'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['toggle'])

const route = useRoute()
const router = useRouter()

const isActive = (path) => {
  return route.path === path
}

const setActiveMenu = (menu) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('activeMenu', menu)
    
    // Close sidebar on mobile after selection
    if (window.innerWidth <= 768) {
      emit('toggle')
    }
  }
}

const handleLogout = () => {
  if (confirm('Are you sure you want to log out?')) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('sidebarOpen')
      localStorage.removeItem('activeMenu')
    }
    
    // Redirect to logout - adjust path as needed
    router.push('/auth/logout')
  }
}
</script>

<style scoped>
/* Sidebar */
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: linear-gradient(180deg, var(--dark-tertiary) 0%, var(--dark-primary) 100%);
  border-radius: 0 var(--radius-xl) var(--radius-xl) 0;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 4px 0 24px rgba(0, 0, 0, 0.4);
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  z-index: 50;
  transition: transform var(--transition-base);
}

/* Brand */
.brand {
  font-weight: 800;
  color: var(--cyan-primary);
  font-size: 22px;
  padding-bottom: 8px;
  letter-spacing: -0.5px;
}

/* Navigation */
.nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 24px;
  overflow-y: auto;
  overflow-x: hidden;
  max-height: calc(100vh - 200px);
  padding-right: 4px;
}

.nav-link-wrapper {
  text-decoration: none;
}

.nav::-webkit-scrollbar {
  width: 4px;
}

.nav::-webkit-scrollbar-track {
  background: transparent;
}

.nav::-webkit-scrollbar-thumb {
  background: var(--gray-medium);
  border-radius: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--gray-light);
  border: none;
  cursor: pointer;
  width: 100%;
  transition: all var(--transition-fast);
  text-align: left;
  font-family: var(--font-family);
  font-size: 15px;
}

.nav-item:hover {
  background: rgba(0, 255, 160, 0.08);
  color: var(--cyan-primary);
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(135deg, rgba(0, 255, 160, 0.15), rgba(0, 255, 160, 0.08));
  color: var(--cyan-primary);
}

.nav-item .icon-wrapper {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.nav-item svg {
  width: 20px;
  height: 20px;
  stroke: currentColor;
  transition: transform var(--transition-fast);
}

.nav-item:hover svg {
  transform: scale(1.1);
}

.nav-item.active svg {
  stroke: var(--cyan-primary);
}

.nav-item .label {
  font-weight: 600;
  font-size: 15px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Sidebar Bottom */
.sidebar-bottom {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.logout-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 255, 160, 0.08);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.logout-btn svg {
  width: 20px;
  height: 20px;
  stroke: var(--gray-light);
  transition: stroke var(--transition-fast);
}

.logout-btn:hover {
  background: var(--red-accent);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(231, 0, 0, 0.3);
}

.logout-btn:hover svg {
  stroke: var(--white);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
  }

  .sidebar.active {
    transform: translateX(0);
    border-radius: 0 var(--radius-xl) var(--radius-xl) 0;
  }
}

@media (max-width: 480px) {
  .nav-item {
    padding: 10px 12px;
  }
}
</style>