<script setup lang="js">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main>
    <h1>Welcome to the Vue App</h1>
    <p>This is a TypeScript-powered home page.</p>
    
    <div class="card button-list w-96">
      <router-link to="/" class="btn btn-primary"> home </router-link>
      <router-link to="/counter" class="btn btn-primary">counter</router-link>
      <router-link to="/hospital" class="btn btn-primary">hospital</router-link>
    </div>
  </main>
</template>

<style scoped>
.button-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>