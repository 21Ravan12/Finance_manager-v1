<template>
    <div class="auth-form">
      <h2>Update Password</h2>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="password">New Password:</label>
          <input v-model="password" type="password" id="password" required />
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirm Password:</label>
          <input v-model="confirmPassword" type="confirm-password" id="confirm-password" required />
        </div>
        <button type="submit" class="submit-btn">Update Password</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import '@/assets/styles/auth-style.css';
  
  export default {
    data() {
      return {
        password: '',
        confirmPassword: '',
        errorMessage: ''
      };
    },
    computed: {
      token() {
        return this.$store.state.token;
      }
    },
    methods: {
      async handleSubmit() {
        if (this.password !== this.confirmPassword) {
          this.errorMessage = "Passwords do not match!";
          return;
        }
  
        try {
          const response = await axios.post('http://localhost:3002/api/resfresh_password/update_password', {
            password: this.password,
            token: this.token 
          });
  
          console.log(response.data);
          alert("Password updated successfully!");
          this.$router.push('/dashboard');
        } catch (error) {
          console.error('Update error:', error.response?.data || error.message);
          this.errorMessage = "Password update failed!";
        }
      }
    }
  };
  </script>
  
  