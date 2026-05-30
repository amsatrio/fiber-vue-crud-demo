<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2>{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h2>
      <p class="subtitle">{{ isLogin ? 'Login to manage your dashboard' : 'Register to get started' }}</p>

      <form @submit.prevent="handleSubmit">
        <div class="form-group" v-if="!isLogin">
          <label>Full Name</label>
          <input type="text" v-model="form.name" placeholder="John Doe" required />
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" v-model="form.email" placeholder="email@example.com" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input type="password" v-model="form.password" placeholder="••••••••" required />
        </div>

        <button type="submit" class="btn-primary">
          {{ isLogin ? 'Sign In' : 'Sign Up' }}
        </button>
      </form>

      <div class="divider">
        <span>OR</span>
      </div>

      <button @click="loginWithGoogle" class="btn-google">
        <img src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_\"G\"_Logo.svg" alt="Google" />
        Continue with Google
      </button>

      <p class="toggle-text">
        {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
        <span @click="isLogin = !isLogin">{{ isLogin ? 'Sign Up' : 'Log In' }}</span>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';

const isLogin = ref(true);
const form = reactive({
  name: '',
  email: '',
  password: ''
});

const handleSubmit = () => {
  console.log('Form submitted:', form);
  // Handle standard login/register logic here
};

const loginWithGoogle = () => {
  // Redirect to backend OAuth route
  window.location.href = 'http://localhost:3000/auth/google';
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f3f4f6;
  font-family: sans-serif;
}
.auth-card {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}
.form-group { text-align: left; margin-bottom: 1rem; }
label { display: block; font-size: 0.875rem; font-weight: 600; margin-bottom: 0.25rem; }
input { width: 100%; padding: 0.75rem; border: 1px solid #d1d5db; border-radius: 6px; box-sizing: border-box; }
.btn-primary { 
  width: 100%; padding: 0.75rem; background-color: #4f46e5; color: white; 
  border: none; border-radius: 6px; font-weight: 600; cursor: pointer; margin-top: 1rem;
}
.divider { margin: 1.5rem 0; border-bottom: 1px solid #e5e7eb; position: relative; }
.divider span { 
  position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
  background: white; padding: 0 0.5rem; color: #9ca3af; font-size: 0.75rem; 
}
.btn-google {
  width: 100%; padding: 0.75rem; background: white; border: 1px solid #d1d5db;
  border-radius: 6px; display: flex; align-items: center; justify-content: center;
  gap: 0.5rem; cursor: pointer; font-weight: 500; transition: background 0.2s;
}
.btn-google:hover { background: #f9fafb; }
.btn-google img { width: 18px; }
.toggle-text { margin-top: 1.5rem; font-size: 0.875rem; color: #4b5563; }
.toggle-text span { color: #4f46e5; cursor: pointer; font-weight: 600; }
</style>
