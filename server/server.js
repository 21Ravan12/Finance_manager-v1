require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const financialPlansRoutes = require('./routes/financialPlansRoutes');
const billsRoutes = require('./routes/billsRoutes');
const financialGoalsRoutes = require('./routes/financialGoalsRoutes');
const financialTipsRoutes = require('./routes/financialTipsRoutes');
const investmentsRoutes = require('./routes/investmentsRoutes');
const linkedAccountsRoutes = require('./routes/linkedAccountsRoutes');
const transactionsRoutes = require('./routes/transactionsRoutes');


const app = express();
const port = 3002;

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', authRoutes);
app.use('/api', financialPlansRoutes);
app.use('/api', billsRoutes);
app.use('/api', financialGoalsRoutes);
app.use('/api', financialTipsRoutes);
app.use('/api', investmentsRoutes);
app.use('/api', linkedAccountsRoutes);
app.use('/api', transactionsRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
