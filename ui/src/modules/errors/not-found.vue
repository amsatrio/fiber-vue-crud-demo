<template>
  <div class="not-found">
    <h1>404</h1>
    <h2>Page Not Found</h2>
    <p>Oops! The page you're looking for doesn't exist.</p>
    <router-link to="/" class="btn">Go Back Home</router-link>
  </div>
</template>

<style scoped>
.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  text-align: center;
  font-family: sans-serif;
}

h1 {
  font-size: 6rem;
  margin: 0;
  color: #42b883;
}

h2 {
  font-size: 2rem;
  margin-top: 0.5rem;
  color: #35495e;
}

p {
  color: #666;
  margin-bottom: 1.5rem;
}

.btn {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  background-color: #42b883;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  font-weight: bold;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #33a06f;
}
</style>