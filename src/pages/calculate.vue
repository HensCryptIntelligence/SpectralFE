<template>
  <div class="dashboard-container">
    <h2>Calculate Content</h2>
    <p>This is the calculate page content area.</p>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
}

.dashboard-container h2 {
  color: var(--white);
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 12px;
}

.dashboard-container p {
  color: var(--gray-light);
  font-size: 15px;
}
</style>