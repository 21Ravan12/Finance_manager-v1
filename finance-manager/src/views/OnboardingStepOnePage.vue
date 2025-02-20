<template>
    <div class="page-capasitor-onboarding">
      <OnboardingStepOne />
    </div>
  </template>
  
  <script>
  import OnboardingStepOne from '../components/OnboardingStepOne.vue'
  import '@/assets/styles/onboarding-style.css';

  export default {
    components: {
      OnboardingStepOne
    }
  };
  </script>