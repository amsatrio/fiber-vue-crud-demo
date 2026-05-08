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
      <button @click="store.increment">
        Add 1
      </button>
      
      <button @click="store.count--">
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

button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
}

button:hover {
  background-color: #35495e;
}
</style>