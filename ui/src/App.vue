<script setup lang="ts"></script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/counter">Counter</RouterLink>
    </nav>
  </header>
  <main>
    <router-view></router-view>
  </main>  
</template>

<style scoped></style>
