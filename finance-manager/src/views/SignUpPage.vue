  <template>
    <div class="page-capasitor-auth">
      <SignUpForm />
    </div>
  </template>
  
  <script>
  import SignUpForm from '../components/SignUpForm.vue'
  import '@/assets/styles/auth-style.css';
  
  export default {
    components: {
      SignUpForm
    }
  };
  </script>
  