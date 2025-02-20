<template>
  <div class="auth-form">
    <h2>Verify code</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="code">Verification Code:</label>
        <input v-model="code" type="text" id="code" required />
      </div>
      <button type="submit" class="submit-btn">Verify</button>
    </form>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import '@/assets/styles/auth-style.css'; 

export default {
  data() {
    return {
      code: '',
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
      this.errorMessage = '';
      try {
        const response = await axios.post('http://localhost:3002/api/sign_up/verify_code', {
          code: this.code,
          token: this.token 
        });
        console.log(response.data);
        this.$router.push('/onboardingStepOne');
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'An error occurred during verify-code!';
        console.error('Verify code error:', error.response?.data);
      }
    }
  }
};
</script>

  