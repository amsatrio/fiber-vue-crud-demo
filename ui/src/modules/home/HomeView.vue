<script setup lang="js">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="home-page">
    <h1>Welcome to the Vue App</h1>
    <p>This is a TypeScript-powered home page.</p>
    
    <nav>
      <RouterLink to="/counter" class="nav-link">
        Go to Counter Page
      </RouterLink>
    </nav>
  </main>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
  font-family: sans-serif;
}

.nav-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background-color: #35495e;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: opacity 0.2s;
}

.nav-link:hover {
  opacity: 0.9;
}
</style>