<template>
    <div class="page-capasitor-auth">
      <RefreshPasswordSendCodeForm />
    </div>
  </template>
  
  <script>
  import RefreshPasswordSendCodeForm from '../components/RefreshPasswordSendCodeForm.vue';
  import '@/assets/styles/auth-style.css';
  
  export default {
    components: {
      RefreshPasswordSendCodeForm
    }
  };
  </script>

  