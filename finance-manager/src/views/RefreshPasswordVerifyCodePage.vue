<template>
    <div class="page-capasitor-auth">
      <RefreshPasswordVerifyCodeForm />
    </div>
  </template>
  
  <script>
  import RefreshPasswordVerifyCodeForm from '../components/RefreshPasswordVerifyCodeForm.vue'
  import '@/assets/styles/auth-style.css';
  
  export default {
    components: {
      RefreshPasswordVerifyCodeForm
    }
  };
  </script>

  