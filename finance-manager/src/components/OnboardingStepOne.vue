<template>
    <div class="page-capasitor-onboarding">
      <div class="onboarding-container">
        <h2 class="onboarding-title">{{ currentStep.title }}</h2>
        
        <form @submit.prevent="nextStep" class="onboarding-form">
          
          <div v-if="step === 1">
            <div class="form-group">
              <label for="income-source" class="form-label">What is your income source?</label>
              <select v-model="incomeSource" id="income-source" class="form-select" required>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investment">Investment</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
  
          <div v-if="step === 2">
            <div class="form-group">
              <label for="monthly-income" class="form-label">What is your average monthly income?</label>
              <input type="number" v-model="monthlyIncome" id="monthly-income" class="form-input" placeholder="Enter your income" required />
            </div>
            <div class="form-group">
              <label for="budget-limit" class="form-label">Do you have a monthly spending limit?</label>
              <select v-model="hasBudgetLimit" id="budget-limit" class="form-select" required>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <div v-if="hasBudgetLimit === 'true'">
                <label for="budget-amount" class="form-label">How much?</label>
                <input type="number" v-model="budgetAmount" id="budget-amount" class="form-input" placeholder="Enter your limit" required/>
              </div>
            </div>
            <div class="form-group">
              <label for="expense-tracking" class="form-label">How important is tracking your expenses?</label>
              <input type="range" v-model="expenseTrackingImportance" min="1" max="5" step="1" id="expense-tracking" />
            </div>
          </div>

          <!--
          <div v-if="step === 3">
          <div class="form-group">
            <label class="form-label">What are your main expense categories?</label>
            <div class="checkbox-group">
              <label v-for="category in expenseCategories" :key="category" class="checkbox-label">
                {{ category }}
          
                <input
                  v-if="isSelected(category)"
                  type="date"
                  v-model="getCategory(category).date"
                  class="category-input-dat"
                  required
                />
          
                <input
                  v-if="isSelected(category)"
                  type="number"
                  v-model="getCategory(category).number"
                  class="category-input-num"
                  placeholder="Enter details"
                  required
                />
          
                <input
                  type="checkbox"
                  @change="toggleCategory(category)"
                  :checked="isSelected(category)"
                  class="checkbox-input"
                />
              </label>
            </div>
          </div>
        </div>
  
           
          <div v-if="step === 4">
            <div class="form-group">
              <label for="financial-goal" class="form-label">Would you like to set a financial goal?</label>
              <select v-model="wantsFinancialGoal" id="financial-goal" class="form-select" required>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
              <div v-if="wantsFinancialGoal === 'true'">
                <label for="goal-description" class="form-label">Define your goal</label>
                <input type="text" v-model="goalDescription" id="goal-description" class="form-input" placeholder="For example, 'Save $10,000 to buy a car'" required/>
              </div>
            </div>
          </div>
          -->

          <div v-if="step === 3">
            <p>Thank you! You can now track your income and expenses, manage your budget, and reach your financial goals!</p>
          </div>
  
          <div class="button-group">
            <button type="button" v-if="step > 1" @click="prevStep" class="prev-button">← Back</button>
            <button type="submit" class="submit-button">{{ step === steps.length ? 'Finish' : 'Next →' }}</button>
          </div>
        </form>
  
      </div>
    </div>
</template>

  
  <script>
  import axios from 'axios'; 
  import '@/assets/styles/onboarding-style.css';
  
  export default {
    data() {
      return {
        step: 1,
        incomeSource: '',
        monthlyIncome: '',
        hasBudgetLimit: false,
        budgetAmount: null,
        expenseTrackingImportance: 3,
        errorMessage: '',
        steps: [
            { id: 1, title: "📌 1st Step: Income Source" },
            { id: 2, title: "📌 2nd Step: Monthly Income and Spending Habits" },
            { id: 3, title: "📌 3th Step: Final Touches and Completion" }
        ]
      };
    },
  
    computed: {
      currentStep() {
        return this.steps.find(s => s.id === this.step);
      },
      token() {
        return this.$store.state.token; 
      }
    },
    methods: {
      async nextStep() {
        if (this.step < this.steps.length) {
          this.step++;
        } else {
          this.errorMessage = '';  
          try {
            const response = await axios.post('http://localhost:3002/api/financial_plans_register', {
              token: this.token, 
              income_source: this.incomeSource,
              monthly_income: this.monthlyIncome,
              has_budget_limit: this.hasBudgetLimit, 
              budget_amount: this.budgetAmount,
              expense_tracking_importance: this.expenseTrackingImportance,
            });
  
            console.log(response.data);
            this.$router.push('/mainPage'); 
          } catch (error) {
            this.errorMessage = error.response?.data?.message || 'An error occurred!';
            console.error('Validation error:', error.response?.data);
          }
        }
      },
      
      prevStep() {
        if (this.step > 1) {
          this.step--;
        }
      },

      isSelected(category) {
        return this.selectedCategories.some(item => item.category === category);
      },
  
      getCategory(category) {
        return this.selectedCategories.find(item => item.category === category) || {};
      },
  
      toggleCategory(category) {
        const index = this.selectedCategories.findIndex(item => item.category === category);
  
        if (index === -1) {
          this.selectedCategories.push({ category, date: "", number: 0 });
        } else {
          this.selectedCategories.splice(index, 1);
        }
      }
  }
    
  };
</script>

  
  