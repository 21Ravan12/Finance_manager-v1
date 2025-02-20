<template>
  <div class="auth-form">
    <h2>Log in</h2>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <button type="submit" class="submit-btn">Login</button>
    </form>
    <p class="auth-link">Forgot your password? <router-link to="/refreshPasswordSendCodePage">Reset it here</router-link></p>
    <p class="auth-link">Don't have an account? <router-link to="/signup">Sign up</router-link></p>

  </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';
import '@/assets/styles/auth-style.css';

export default {
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    };
  },
  methods: {
  ...mapActions(['login']), 

  async handleSubmit() {
  try {
    const response = await axios.post('http://localhost:3002/api/log_in', {
      email: this.email,
      password: this.password
    });

    const token = response.data.token; 
    if (token) {
      this.login(token);
      console.log("Token saved in Vuex:", token);
      this.$router.push('/mainPage');
    } else {
      this.errorMessage = "Login failed: No token received!";
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message);

    if (error.response) {
      if (error.response.status === 401) {
        this.errorMessage = "Incorrect email or password!";
      } else if (error.response.status === 500) {
        this.errorMessage = "Server error! Please try again later.";
      } else {
        this.errorMessage = error.response.data.message || "Login failed!";
      }
    } else {
      this.errorMessage = "Network error! Please check your internet connection.";
    }
  }
}

  }
};
</script>
