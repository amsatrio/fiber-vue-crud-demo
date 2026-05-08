<script setup lang="ts"></script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink> |
      <RouterLink to="/counter">Counter</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped></style>
