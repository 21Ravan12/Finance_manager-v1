# Finance Manager

Finance Manager is a web application designed to help users manage their finances effectively. It allows users to track their income and expenses, manage upcoming bills, set financial goals, link accounts, and analyze financial data through various reports.

## Project Structure

The project is divided into two main parts: the client-side application and the server-side API.

### Client-Side (Vue.js)

The client-side application is built using Vue.js and is located in the `finance-manager` directory. It includes the following key components:

- **MainTemplate.vue**: The main dashboard component that displays various financial data and allows users to interact with the application.
- **LoginForm.vue**: Component for user login.
- **SignUpForm.vue**: Component for user registration.
- **OnboardingStepOne.vue**: Component for onboarding new users.
- **RefreshPasswordSendCodeForm.vue**: Component for sending password reset code.
- **RefreshPasswordVerifyCodeForm.vue**: Component for verifying password reset code.
- **UpdatePasswordForm.vue**: Component for updating the password.

### Server-Side (Node.js and Express)

The server-side API is built using Node.js and Express and is located in the `server` directory. It includes the following key components:

- **authController.js**: Handles user authentication and registration.
- **billsController.js**: Manages upcoming bills.
- **financialGoalsController.js**: Manages financial goals.
- **financialPlansController.js**: Manages financial plans.
- **financialTipsController.js**: Manages financial tips.
- **investmentsController.js**: Manages investments.
- **linkedAccountsController.js**: Manages linked accounts.
- **transactionsController.js**: Manages transactions.

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:
   ```sh
   git clone https://github.com/21Ravan12/Finance_manager.git
   ```

2. Navigate to the project directory:
   ```sh
   cd Finance_manager
   ```

3. Install dependencies for both client and server:
   ```sh
   npm install
   ```

4. Start the client-side application:
   ```sh
   npm run serve
   ```

5. Start the server-side API:
   ```sh
   npm start
   ```

## Future Improvements

This project is currently fully functional; however, there are no in-code comments. Future updates will include improved documentation, better code structure, and additional features. If you are contributing or making modifications, please consider adding relevant comments to improve readability and maintainability.

Feel free to update the project with any additional features or improvements you see fit!
