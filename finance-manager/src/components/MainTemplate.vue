<template>
  <div class="dashboard">
    <nav class="navbar">
      <h2>Finance Manager</h2>
      <div class="card balance-card">
        <h3>Total Balance</h3>
        <p>${{ totalBalance.toFixed(2) }}</p>
      </div>
          
      <div class="card budget">
        <h3>Budget Management</h3>
        <p>Budget Limit: ${{ budgetLimit }}</p>
        <p>Current Spending: ${{ currentSpending }}</p>
      </div>
    </nav>

    <div class="dashboard-container">
      <div class="card charts">
        <h3>{{ currentStep.title }}</h3>
        <canvas ref="chart" v-show="step === 1"></canvas>

        <div ref="bills" v-show="step === 2" class="bills-container">
          <h4 class="bills-title">📅 Upcoming Bills</h4>
        
          <div class="bill-form">
            <input type="date" v-model="newBill.date" class="bill-input" placeholder="Select Date" required />
            <input type="text" v-model="newBill.category" class="bill-input" placeholder="Category" required />
            <input type="number" v-model="newBill.number" class="bill-input" placeholder="Amount" required />
            <button class="bills-button" @click="addBill">➕ Add</button>
          </div>
        
          <ul v-if="upcomingBills.length > 0" class="bills-list">
            <li v-for="(bill) in upcomingBills" :key="bill.id" class="bill-item">
              <div class="bill-details">
                <span class="bill-date">{{ bill.date }}</span>
                <span class="bill-category">{{ bill.category }}</span>
              </div>
              <span class="bill-amount">💰 {{ bill.amount }}</span>
              <span class="bill-markAsPaid" @click="markAsPaid(bill.id,bill.amount)">Paid</span>
              <span class="bill-remove" @click="removeBill(bill.id)">❌</span>
            </li>
          </ul>
        
          <p v-else class="empty-message">No upcoming bills. Add your first bill!</p>
        </div>

        
        <div v-show="step === 3" class="investments-container">

          <h4 class="investments-title">Investments & Assets</h4>
        
          <div class="investment-form">
            <input type="text" v-model="newInvestment.name" class="investment-input" placeholder="Investment Name" required />
            <input type="number" v-model="newInvestment.value" class="investment-input" placeholder="Value" required />
            <select v-model="newInvestment.type" class="investment-input" required>
                    <option value="income">Income</option>
                    <option value="expense">Expense</option>
            </select>
            <button class="investment-button" @click="addInvestment">➕ Add</button>
          </div>
        
        
          <ul class="investments-list">
            <li v-for="(investment) in investments" :key="investment.id" class="investment-item">
              <div class="investment-name">{{ investment.name }}</div>
              <div class="investment-value">💰 Value: ${{ investment.value || '0.00' }}</div>
              <div class="investment-type">📂 Type: {{ investment.type || 'N/A' }}</div>
              <span class="investment-remove" @click="removeInvestment(investment.id)">❌</span>
            </li>
          </ul>
        </div>
        

        <div v-show="step === 4" class="ReportsAnalysis-container">
            <h4 class="reports-title">Financial Reports & Analysis</h4>
            <!-- 
            <div class="chart-container">
                <h5>Income vs Expenses (Last 12 months)</h5>
                <canvas id="income-expense-chart"></canvas>
            </div>
        
            <div class="chart-container">
                <h5>Investment Performance (Last 12 months)</h5>
                <canvas id="investment-performance-chart"></canvas>
            </div>
        
            <div class="monthly-report">
                <h5>Monthly Profit/Loss Report</h5>
                <ul>
                    <li v-for="month in months" :key="month.name">
                        <div>{{ month.name }}:</div>
                        <div>{{ month.profitLoss }}</div>
                    </li>
                </ul>
            </div>
        
            <div class="date-filter">
                <label for="start-date">Start Date:</label>
                <input type="date" v-model="filter.startDate">
                
                <label for="end-date">End Date:</label>
                <input type="date" v-model="filter.endDate">
                
                <button @click="applyDateFilter">Apply Filter</button>
            </div>
        
            <div class="advanced-analysis">
                <h5>Advanced Analysis</h5>
                <button @click="generateAdvancedReport">Generate Report</button>
            </div>
        
            <div class="goal-tracker">
                <h5>Your Financial Goals Tracker</h5>
                <ul>
                    <li v-for="goal in financialGoals" :key="goal.id">
                        <div>{{ goal.name }}: {{ goal.progress }}% Achieved</div>
                    </li>
                </ul>
            </div>
        
            <div class="financial-tips">
                <h5>Financial Tips & Alerts</h5>
                <ul>
                    <li v-for="tip in financialTips" :key="tip.id">{{ tip.message }}</li>
                </ul>
            </div>-->
        </div>


        <div v-show="step === 5" class="FinancialGoals-container">
            <h4 class="goals-title">Your Financial Goals</h4>
        
            <div class="goal-form">
                <input type="text" v-model="newGoal.name" class="goal-input" placeholder="Goal Name" required />
                <textarea v-model="newGoal.description" class="goal-input" placeholder="Goal Description" required></textarea>
                <button class="goal-button" @click="addGoal">➕ Add Goal</button>
            </div>
        
            <div class="goals-list">
                <div v-for="(goal) in financialGoals" :key="goal.id" class="goal-item">
                    <div class="goal-info">
                        <h5 class="goal-name">{{ goal.name }}</h5>
                        <p class="goal-description">{{ goal.description }}</p>
                    </div>
                    <span class="goal-remove" @click="removeGoal(goal.id)">❌</span>
                </div>
            </div>
        
            <p v-if="financialGoals.length === 0" class="empty-message">No financial goals set yet. Start setting your goals to track your progress!</p>
        </div>
        
        
        <div v-show="step === 6" class="LinkedAccounts-container">
            <h4 class="linked-accounts-title">Linked Accounts</h4>
        
            <div class="account-form">
                <input type="text" v-model="newAccount.name" class="account-input" placeholder="Account Name" required />
                <select v-model="newAccount.status" class="account-input">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
                <button class="account-button" @click="addAccount">➕ Add</button>
            </div>
        
            <ul class="linked-accounts-list">
                <li v-for="(account) in linkedAccounts" :key="account.id" class="linked-account-item">
                    <div class="account-name">{{ account.name }}</div>
                    <div class="account-status" :class="{'active': account.status === 'active', 'inactive': account.status === 'inactive'}">
                        {{ account.status }}
                    </div>
                    <span class="account-remove" @click="removeAccount(account.id)">❌</span>
                </li>
            </ul>
        
            <p v-if="linkedAccounts.length === 0" class="empty-message">
                No linked accounts set yet. Start linking your accounts to track them!
            </p>
        </div>
        
        
        <div v-show="step === 7" class="RecentTransactions-container">
            <h4 class="recent-transactions-title">Recent Transactions</h4>
            
            <p v-if="recentTransactions.length === 0" class="empty-message">No transactions set yet. Start setting your goals to track your progress!</p>
            
            <ul v-else class="transactions-list">
                <li v-for="transaction in recentTransactions" :key="transaction.id" class="transaction-item">
                    <div class="transaction-details">
                        <div class="transaction-name">{{ transaction.name }}</div>
                        <div class="transaction-date">{{ transaction.date }}</div>
                    </div>
                    <div class="transaction-amount" :class="{'positive': transaction.amount >= 0, 'negative': transaction.amount < 0}">
                        ${{ transaction.amount }}
                    </div>
                </li>
            </ul>
        </div>

      </div>

      <div class="dashboard-grid">
        <div class="card reminders" @click="openPage(1)">
          <h3>Income & Expense Tracking</h3>
        </div>

        <div class="card reminders" @click="openPage(2)">
          <h3>Upcoming Bills & Debts</h3>
        </div>
        
        <div class="card investments" @click="openPage(3)">
          <h3>Investments & Assets</h3>
        </div>

        <div class="card goals" @click="openPage(5)">
          <h3>Financial Goals</h3>
        </div>
        
        <div class="card linked-accounts" @click="openPage(6)">
          <h3>Linked Accounts</h3>
        </div>
        
        <div class="card transactions" @click="openPage(7)">
          <h3>Recent Transactions</h3>
        </div>
                
        <div class="card reports" @click="openPage(4)">
          <h3>Reports & Analysis</h3>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import axios from 'axios';
import Chart from 'chart.js/auto';
import '@/assets/styles/main-style.css';
import '@/assets/styles/financial-goals-style.css';
import '@/assets/styles/investments-style.css';
import '@/assets/styles/linked-accounts-style.css';
import '@/assets/styles/recent-transactions-style.css';
import '@/assets/styles/reports-analysis-style.css';
import '@/assets/styles/upcoming-bills-style.css';


export default {
  data() {
    return {
      totalBalance: 0,
      recentTransactions: [],
      incomeTotal: 0,
      expenseTotal: 0,
      budgetLimit: 1000,
      currentSpending: 0,
      newBill: { date: "", category: "", number: "" },
      financialGoals: [],
      upcomingBills: [],
      investments: [],
      newInvestment: { name: "", value: "", type: "" },
      newGoal: { name: "", description: "", progress: "" },
      newAccount: { name: "", status: "" },
      goals: [],
      linkedAccounts: [],
      chart: null,
      step: 1,
      months: [],
      filter: { startDate: "", endDate: "" },
      financialTips: [],
      steps: [
        { id: 1, title: "Income & Expense Tracking" },
        { id: 2, title: "" },
        { id: 3, title: "" },
        { id: 4, title: "" },
        { id: 5, title: "" },
        { id: 6, title: "" },
        { id: 7, title: "" }
      ]
    };
  },
  async created() {
    try {
        const financialResponse = await axios.get(`http://localhost:3002/api/financial_plans_get/${this.$store.state.token}`);
        const financialData = financialResponse.data;
        console.log("Financial Plan:", financialData);

        this.totalBalance = Number(financialData.monthly_income - financialData.expense ?? 0);
        this.currentSpending = financialData.expense ?? 0;
        this.incomeTotal =  Number(financialData.monthly_income ?? 0);
        this.expenseTotal = financialData.expense ?? 47;
        this.budgetLimit = financialData.has_budget_limit ? financialData.budget_amount : 0;
        this.chart = null;

        this.$nextTick(() => {
            this.renderChart();
        });

        const billsResponse = await axios.get(`http://localhost:3002/api/upcoming_bills_get/${this.$store.state.token}`);
        const billsData = billsResponse.data;
        console.log("Upcoming Bills:", billsData);

        if (Array.isArray(billsData)) {
            this.upcomingBills = billsData.map(bill => ({
                due_date: bill.due_date,
                category: bill.category,
                amount: bill.amount,
                id: bill.id 
            }));
        }

        const investmentsResponse = await axios.get(`http://localhost:3002/api/investments_get/${this.$store.state.token}`);
        const investmentsData = investmentsResponse.data;
        console.log("Upcoming Investments:", investmentsData);
        
        if (Array.isArray(investmentsData)) {
            this.investments = investmentsData.map(investment => ({
                name: investment.name,  
                value: investment.value,
                type: investment.type,
                id: investment.id
            }));
        }

        const financialGoalsResponse = await axios.get(
        `http://localhost:3002/api/financial_goals_get/${this.$store.state.token}`
        );

        const financialGoalsData = financialGoalsResponse.data;
        console.log("Upcoming Goals:", financialGoalsData);

        if (Array.isArray(financialGoalsData)) {
          this.financialGoals = financialGoalsData.map(goal => ({
            name: goal.name, 
            description: goal.description,
            id: goal.id
        }));
        } else {
          console.warn("Expected data did not arrive in array format:", financialGoalsData);
        }

        const linkedAccountsResponse = await axios.get(
        `http://localhost:3002/api/linked_accounts_get/${this.$store.state.token}`
        );

        const linkedAccountsData = linkedAccountsResponse.data;
        console.log("Accounts:", linkedAccountsData);

        if (Array.isArray(linkedAccountsData)) {
          this.linkedAccounts = linkedAccountsData.map(account => ({
            name: account.name, 
            status: account.status,
            id: account.id
        }));
        } else {
          console.warn("Expected data did not arrive in array format:", linkedAccountsData);
        }
        
        const transactionsResponse = await axios.get(
        `http://localhost:3002/api/transactions_get/${this.$store.state.token}`
        );

        const transactionsData = transactionsResponse.data;
        console.log("Transactions:", transactionsData);

        if (Array.isArray(transactionsData)) {
          this.recentTransactions = transactionsData.map(transaction => ({
            name: transaction.name, 
            date: transaction.date,
            amount: transaction.amount
        }));
        } else {
          console.warn("Expected data did not arrive in array format:", transactionsData);
        }

    } catch (error) {
        console.error('Error fetching financial data:', error.response?.data || error.message);
    }
},

  computed: {
    currentStep() {
      return this.steps.find(s => s.id === this.step);
    }
  },
  methods: {

    openPage(number) {
      this.step = number;
      if (number === 1) {
        this.renderChart();
      }
    },

    renderIncomeExpenseChart() {
      const ctx = document.getElementById("income-expense-chart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          datasets: [{
            label: "Income",
            data: [1000, 1200, 1100, 1400, 1600, 1800, 1750, 2000, 1950, 2100, 2200, 2300],
            borderColor: "green",
            fill: false
          }, {
            label: "Expenses",
            data: [900, 950, 980, 1050, 1100, 1150, 1200, 1300, 1350, 1400, 1500, 1550],
            borderColor: "red",
            fill: false
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    },

    renderInvestmentChart() {
      const ctx = document.getElementById("investment-performance-chart").getContext("2d");
      new Chart(ctx, {
        type: "bar",
        data: {
          labels: this.investments.map(inv => inv.name),
          datasets: [{
            label: "Investment Value",
            data: this.investments.map(inv => inv.value),
            backgroundColor: "blue"
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      });
    },

    applyDateFilter() {
      console.log("Filtering data from", this.filter.startDate, "to", this.filter.endDate);
    },

    generateAdvancedReport() {
      console.log("Generating advanced report...");
      alert("Advanced financial report generated!");
    },

    renderChart() {
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = this.$refs.chart.getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Income', 'Expenses'],
          datasets: [{
            label: 'Financial Overview',
            data: [this.incomeTotal, this.expenseTotal],
            backgroundColor: ['green', 'red']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false
        }
      });
    },

    async addBill() {
    if (!this.newBill.date || !this.newBill.category || !this.newBill.number) {
      alert("Please fill in all fields!");
      return;
      }
    if (this.newBill.date && this.newBill.category && this.newBill.number) {
        try {
            const response = await axios.post('http://localhost:3002/api/upcoming_bills_register', {
                token: this.$store.state.token, 
                due_date: this.newBill.date,
                category: this.newBill.category,
                amount: this.newBill.number 
            });

            const data = { 
                due_date: this.newBill.date, 
                category: this.newBill.category, 
                amount: this.newBill.number,
                id: response.data.id
            };

            this.upcomingBills.push(data); 
            this.newBill = { date: "", category: "", number: "" }; 
            console.log("the target succesfuly added:", response.data);
        } catch (error) {
          console.error("An error occurred while adding the target:", error);
        }
    }
    },

    async removeBill(id) {
      console.log(id);
        try {
          await axios.delete('http://localhost:3002/api/upcoming_bills_delete', {
            data: {
                token: this.$store.state.token, 
                id: id, 
            }
          });
           
          this.upcomingBills = this.upcomingBills.filter(bill => bill.id !== id);
        } catch (error) {
          console.error("An error occurred while removing the target:", error);
        }
    },

    async markAsPaid(id, amount) {
      console.log(id);
      try {
        const dueDate = new Date().toISOString(); 
        const status = 'paid'; 
    
        await axios.post('http://localhost:3002/api/upcoming_bills_update', {
            token: this.$store.state.token,
            due_date: dueDate,
            status: status,
            id: id,
        });
    
        await axios.post('http://localhost:3002/api/transactions_register', {
            token: this.$store.state.token,
            date: dueDate,
            category: "bills",
            amount: amount,
            type: "expense",
        });
    
        amount = Number(this.incomeTotal-this.totalBalance)+Number(amount);
        await axios.post('http://localhost:3002/api/financial_plans_update', {
            token: this.$store.state.token,
            expense: amount,
        });
    
        if (typeof this.totalBalance === 'number' && !isNaN(amount)) {
          this.totalBalance = Number(this.incomeTotal-amount);
          this.currentSpending = amount;
        } else {
          throw new Error("Invalid totalBalance or amount value.");
        }
    
      } catch (error) {
        console.error("An error occurred while processing the payment:", error);
        alert(`Error: ${error.message}`);
      }
    },

    async addInvestment() {
    if (!this.newInvestment.name || !this.newInvestment.value || !this.newInvestment.type) {
      alert("Please fill in all fields!");
      return;
      }
    if (this.newInvestment.name || this.newInvestment.value || this.newInvestment.type) {
        try {
            const response = await axios.post('http://localhost:3002/api/investments_register', {
                token: this.$store.state.token, 
                name: this.newInvestment.name,
                value: this.newInvestment.value,
                type: this.newInvestment.type
            });

            const data = { 
                name: this.newInvestment.name,
                value: this.newInvestment.value,
                type: this.newInvestment.type,
                id: response.data.id
            };

            this.investments.push(data); 
            this.newInvestment = { name: "", value: "", type: "" };
        } catch (error) {
          console.error("An error occurred while adding the target:", error);
        }
    }
    },

    async removeInvestment(id) {
      console.log(id);
        try {
          await axios.delete('http://localhost:3002/api/investments_delete', {
            data: {
                token: this.$store.state.token, 
                id: id, 
            }
          });
           
          this.investments = this.investments.filter(investment => investment.id !== id);
        } catch (error) {
          console.error("An error occurred while removing the target:", error);
        }
    },

    async addGoal() {
    if ( !this.newGoal.name || !this.newGoal.description ) {
      alert("Please fill in all fields!");
      return;
      }
    if ( this.newGoal.name || this.newGoal.description ) {
        try {
            const response = await axios.post('http://localhost:3002/api/financial_goals_register', {
                token: this.$store.state.token, 
                name: this.newGoal.name,
                description: this.newGoal.description
            });

            const data = { 
                name: this.newGoal.name,
                description: this.newGoal.description,
                id: response.data.id
            };

            this.financialGoals.push(data); 
            this.newGoal = { name: "", description: "" };
        } catch (error) {
          console.error("An error occurred while adding the target:", error);
        }
     }
    },

    async removeGoal(id) {
      console.log(id);
        try {
          await axios.delete('http://localhost:3002/api/financial_goals_delete', {
            data: {
                token: this.$store.state.token, 
                id: id, 
            }
          });
           
          this.financialGoals = this.financialGoals.filter(goal => goal.id !== id);
        } catch (error) {
          console.error("An error occurred while removing the target:", error);
        }
    },

    async addAccount() {
      if (!this.newAccount.name || !this.newAccount.status) {
        alert("Please fill in all fields!");
        return;
      }
      if (this.newAccount.name || this.newAccount.status) {
        try {
            const response = await axios.post('http://localhost:3002/api/linked_accounts_register', {
                token: this.$store.state.token, 
                name: this.newAccount.name,
                status: this.newAccount.status
            });

            const data = { 
                name: this.newAccount.name,
                status: this.newAccount.status,
                id: response.data.id
            };

            this.linkedAccounts.push(data);
            this.newAccount = { name: "", status: "active" };
        } catch (error) {
          console.error("An error occurred while adding the account:", error);
        }
     }
    },

    async removeAccount(id) {
      console.log(id);
        try {
          await axios.delete('http://localhost:3002/api/linked_accounts_delete', {
            data: {
                token: this.$store.state.token, 
                id: id, 
            }
          });
           
          this.linkedAccounts = this.linkedAccounts.filter(account => account.id !== id);
        } catch (error) {
          console.error("Error occurred while removing the account:", error);
        }
    }
}
};
</script>
