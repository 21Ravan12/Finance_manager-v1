  <template>
    <div class="page-capasitor-auth">
      <SignUpVerifyCodeForm />
    </div>
  </template>
  
  <script>
  import SignUpVerifyCodeForm from '../components/SignUpVerifyCodeForm.vue'
  import '@/assets/styles/auth-style.css';
  
  export default {
    components: {
      SignUpVerifyCodeForm
    }
  };
  </script>
  