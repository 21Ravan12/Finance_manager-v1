<template>
    <div class="auth-form">
      <h2>Send Reset Code</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="email">Email:</label>
          <input v-model="email" type="email" id="email" required />
        </div>
        <button type="submit" class="submit-btn">Send Code</button>
      </form>
      <p class="auth-link">Do you remember your password? <router-link to="/">Log in</router-link></p>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import { mapActions } from 'vuex';
  import '@/assets/styles/auth-style.css';
  
  export default {
    data() {
      return {
        email: ''
      };
    },
    methods: {
      ...mapActions(['login']), 

      async handleSubmit() {
        try {
          const response = await axios.post('http://localhost:3002/api/resfresh_password/send_code', {
            email: this.email
          });

          const token = response.data.token; 
        if (token) {
          this.login(token); 
          console.log("Token saved in Vuex:", token);
          this.$router.push('/refreshPasswordVerifyCodePage'); 
        } else {
          this.errorMessage = "Sign-up failed: No token received!";
        }
        } catch (error) {
          console.error('Error sending reset code:', error.response?.data || error.message);
        }
      }
    }
  };
  </script>
  