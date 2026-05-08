<script setup lang="ts">
import { useCounterStore } from './stores'

// Initialize the store
const store = useCounterStore()
</script>

<template>
  <div class="counter-container">
    <h1>Pinia Counter</h1>
    
    <div class="display">
      <p>Current Count: <strong>{{ store.count }}</strong></p>
      <p>Double Count: <strong>{{ store.doubleCount }}</strong></p>
    </div>

    <div class="actions">
      <button class="btn btn-primary" @click="store.increment">
        Add 1
      </button>
      
      <button class="btn btn-primary" @click="store.count--">
        Subtract 1
      </button>
    </div>
  </div>
</template>

<style scoped>
.counter-container {
  padding: 2rem;
  text-align: center;
  font-family: sans-serif;
}

.display {
  font-size: 1.2rem;
  margin-bottom: 1rem;
}

</style>