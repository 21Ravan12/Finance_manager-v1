const Joi = require('joi');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;

const transactionsRegister = async (req, res) => {
    const { token, date, category, amount, type } = req.body;

    const schema = Joi.object({
        token: Joi.string().required(),
        date: Joi.string().isoDate().required(),
        category: Joi.string().required(),
        amount: Joi.number().positive().required(),
        type: Joi.string().valid('income', 'expense').required(), 
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user_email = decoded.email;

        const userResult = await db.query('SELECT id FROM users WHERE email = $1', [user_email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user_id = userResult.rows[0].id;

        const result = await db.query(
            `INSERT INTO transactions (user_id, date, category, amount, type)
            VALUES ($1, $2, $3, $4, $5) RETURNING id;`,
            [user_id, date, category, amount, type]
        );

        res.status(201).json({ message: "Transactions data saved successfully!", id: result.rows[0].id });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const transactionsUpdate = async (req, res) => {
    const { token, date, category, amount, type } = req.body;

    const schema = Joi.object({
        token: Joi.string().required(),
        date: Joi.string().isoDate().required(),
        category: Joi.string().required(),
        amount: Joi.number().positive().required(),
        type: Joi.string().valid('income', 'expense').required(), 
    });

    const { error } = schema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user_email = decoded.email;

        const userResult = await db.query('SELECT id FROM users WHERE email = $1', [user_email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user_id = userResult.rows[0].id;

        const existingData = await db.query(
            'SELECT id FROM transactions WHERE user_id = $1',
            [user_id]
        );

        if (existingData.rows.length === 0) {
            return res.status(404).json({ message: 'Transaction data not found for this user.' });
        }

        await db.query(
            `UPDATE transactions 
            SET date = $1, category = $2, amount = $3, type = $4
            WHERE user_id = $5`,
            [date, category, amount, type, user_id]
        );

        res.status(200).json({ message: "Transaction data updated successfully!" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const getTransactionsData = async (req, res) => {
    const { token } = req.params; 

    const schema = Joi.object({
        token: Joi.string().required(),
    });

    const { error } = schema.validate(req.params); 
    if (error) return res.status(400).json({ message: error.details[0].message });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user_email = decoded.email;
        const userResult = await db.query('SELECT id FROM users WHERE email = $1', [user_email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user_id = userResult.rows[0].id;

        const financialData = await db.query(
            'SELECT * FROM transactions WHERE user_id = $1',
            [user_id]
        );

        if (financialData.rows.length === 0) {
            return res.status(404).json({ message: 'No transaction data found for this user.' });
        }

        res.status(200).json(financialData.rows); 
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

module.exports = { transactionsRegister, transactionsUpdate, getTransactionsData };
