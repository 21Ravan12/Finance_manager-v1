<template>
  <div class="auth-form">
    <h2>Sign Up</h2>
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="name">Full Name:</label>
        <input v-model="name" type="text" id="name" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input v-model="email" type="email" id="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input v-model="password" type="password" id="password" required />
      </div>
      <div class="form-group">
        <label for="birthyear">Birthyear:</label>
        <input v-model="birthyear" type="birthyear" id="birthyear" required />
      </div>
      <button type="submit" class="submit-btn">Sign Up</button>
    </form>
    <p class="auth-link">Already have an account? <router-link to="/">Login</router-link></p>

  </div>
</template>

<script>
import axios from 'axios';
import { mapActions } from 'vuex';
import '@/assets/styles/auth-style.css'; 

export default {
  data() {
    return {
      name: '',
      email: '',
      password: '',
      birthyear: '',
      errorMessage: ''
    };
  },
  methods: {
    ...mapActions(['login']),

    async handleSubmit() {
      this.errorMessage = '';  
      try {
        const response = await axios.post('http://localhost:3002/api/sign_up/send_code', {
          name: this.name,
          email: this.email,
          password: this.password,
          birthyear: this.birthyear
        });

        const token = response.data.token; 
        if (token) {
          this.login(token);
          console.log("Token saved in Vuex:", token);
          this.$router.push('/signUpVerifyCode');
        } else {
          this.errorMessage = "Sign-up failed: No token received!";
        }
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'An error occurred during sign-up!';
        console.error('Sign-up error:', error.response?.data);
      }
    }
  }
};
</script>
