
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5001;

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static('public')); // Serves frontend files from 'public' folder

// Financial Data Store (In INR ₹)
let financialData = {
    balance: 245800.50,
    income: 85000.00,
    expenses: 32400.20,
    savingsGoal: 150000.00,
    savingsCurrent: 98000.00,
    transactions: [
        { id: 1, title: 'Monthly Salary', category: 'Income', amount: 75000.00, date: '2026-10-01', type: 'income' },
        { id: 2, title: 'Grocery Shopping', category: 'Groceries', amount: 4500.50, date: '2026-10-03', type: 'expense' },
        { id: 3, title: 'Electricity & Gas Bill', category: 'Utilities', amount: 2850.20, date: '2026-10-05', type: 'expense' },
        { id: 4, title: 'Freelance Project', category: 'Income', amount: 10000.00, date: '2026-10-07', type: 'income' },
        { id: 5, title: 'OTT Subscriptions', category: 'Entertainment', amount: 699.00, date: '2026-10-08', type: 'expense' }
    ]
};

// GET: Retrieve summary & transactions
app.get('/api/finance', (req, res) => {
    res.json(financialData);
});

// POST: Add a new transaction
app.post('/api/transactions', (req, res) => {
    const { title, category, amount, type } = req.body;

    if (!title || !category || !amount || !type) {
        return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    const numericAmount = parseFloat(amount);

    const newTransaction = {
        id: financialData.transactions.length + 1,
        title,
        category,
        amount: numericAmount,
        date: new Date().toISOString().split('T')[0],
        type
    };

    // Recalculate totals
    if (type === 'income') {
        financialData.income += numericAmount;
        financialData.balance += numericAmount;
    } else {
        financialData.expenses += numericAmount;
        financialData.balance -= numericAmount;
    }

    financialData.transactions.unshift(newTransaction); // Add to top of list

    res.status(201).json({
        message: 'Transaction added successfully',
        financialData
    });
});

// POST: Update Savings Goal & Contribution
app.post('/api/savings', (req, res) => {
    const { savingsGoal, addSavings } = req.body;

    if (savingsGoal !== undefined && savingsGoal !== '') {
        financialData.savingsGoal = parseFloat(savingsGoal);
    }

    if (addSavings !== undefined && addSavings !== '') {
        const deposit = parseFloat(addSavings);
        financialData.savingsCurrent += deposit;
        financialData.balance -= deposit; // Deduct savings deposit from main balance
    }

    res.json({
        message: 'Savings updated successfully',
        financialData
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend running at http://localhost:${PORT}`);
});