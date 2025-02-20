import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import SignUpPage from '../views/SignUpPage.vue'
import SignUpVerifyCodePage from '../views/SignUpVerifyCodePage.vue'
import RefreshPasswordSendCodePage from '../views/RefreshPasswordSendCodePage.vue'
import RefreshPasswordVerifyCodePage from '../views/RefreshPasswordVerifyCodePage.vue'
import UpdatePasswordPage from '../views/UpdatePasswordPage.vue'
import MainPage from '../views/MainPage.vue'
import OnboardingStepOne from '../views/OnboardingStepOnePage.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpPage
  },
  {
    path: '/signUpVerifyCode',
    name: 'SignUpVerifyCode',
    component: SignUpVerifyCodePage
  },
  {
    path: '/refreshPasswordSendCodePage',
    name: 'RefreshPasswordSendCodePage',
    component: RefreshPasswordSendCodePage
  },
  {
    path: '/refreshPasswordVerifyCodePage',
    name: 'RefreshPasswordVerifyCodePage',
    component: RefreshPasswordVerifyCodePage
  },
  {
    path: '/updatePasswordPage',
    name: 'UpdatePasswordPage',
    component: UpdatePasswordPage
  },
  {
    path: '/mainPage',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/onboardingStepOne',
    name: 'OnboardingStepOne',
    component: OnboardingStepOne
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
