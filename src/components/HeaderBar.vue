<template>
  <header class="topbar">
    <div class="title-wrap">
      <button 
        class="menu-toggle" 
        aria-label="Toggle menu" 
        :aria-expanded="false"
        @click="$emit('toggle-menu')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <h1 class="title">{{ pageTitle }}</h1>
    </div>

    <div class="user">
      <div class="user-text">USER</div>
      <img class="avatar" src="https://i.pravatar.cc/40" alt="Customer avatar">
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from '#app'

defineEmits(['toggle-menu'])

const route = useRoute()

const pageTitle = computed(() => {
  const path = route.path
  if (path === '/dashboard') return 'Dashboard'
  if (path === '/tracker') return 'Tracker'
  if (path === '/calculate') return 'Calculate'
  return 'DEFAULT'
})
</script>

<style scoped>
/* Topbar */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  border-radius: var(--radius-md);
}

.title-wrap {
  display: flex;
  align-items: center;
  gap: 16px;
}

.menu-toggle {
  display: none;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 255, 160, 0.08);
  border-radius: var(--radius-sm);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.menu-toggle svg {
  width: 24px;
  height: 24px;
  stroke: var(--cyan-primary);
}

.menu-toggle:hover {
  background: rgba(0, 255, 160, 0.15);
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: var(--white);
  letter-spacing: -0.5px;
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-text {
  font-size: 16px;
  font-weight: 700;
  color: var(--gray-light);
  letter-spacing: 0.5px;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--cyan-primary);
}

/* Mobile Styles */
@media (max-width: 768px) {
  .menu-toggle {
    display: flex;
  }

  .topbar {
    padding: 12px 16px;
  }

  .title {
    font-size: 20px;
  }

  .user-text {
    display: none;
  }
}

@media (max-width: 480px) {
  .title {
    font-size: 18px;
  }
}
</style>