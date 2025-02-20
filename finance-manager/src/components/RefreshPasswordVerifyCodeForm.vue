  <template>
    <div class="auth-form">
      <h2>Verify code</h2>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="code">Code:</label>
          <input v-model="code" type="code" id="code" required />
        </div>
        <button type="submit" class="submit-btn">Verify</button>
      </form>
  
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
          const response = await axios.post('http://localhost:3002/api/resfresh_password/verify_code', {
            code: this.code,
            token: this.token 
          });
          console.log(response.data);
          this.$router.push('/updatePasswordPage'); 
        } catch (error) {
          this.errorMessage = error.response?.data?.message || 'An error occurred during verify-code!';
          console.error('Verify code error:', error.response?.data);
        }
      }
    }
  };
  </script>
  
  