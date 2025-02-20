const Joi = require('joi');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;

const financialPlansRegister = async (req, res) => {
    const { token, income_source, monthly_income, has_budget_limit, budget_amount, expense_tracking_importance } = req.body;

    const schema = Joi.object({
        token: Joi.string().required(),
        income_source: Joi.string().required(),
        monthly_income: Joi.number().positive().required(), 
        has_budget_limit: Joi.boolean().required(),
        budget_amount: Joi.number().positive().required(),
        expense_tracking_importance: Joi.number().positive().required(),
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
            `INSERT INTO financial_plans (user_id, income_source, monthly_income, has_budget_limit, budget_amount, expense_tracking_importance)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING id;`, 
            [user_id, income_source, monthly_income, has_budget_limit, budget_amount, expense_tracking_importance]
        );

        res.status(201).json({ message: "Financial data saved successfully!", id: result.rows[0].id });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const financialPlansUpdate = async (req, res) => {
    const { token, expense } = req.body;
    console.log( token, expense );
    const schema = Joi.object({
        token: Joi.string().required(),
        expense: Joi.number().positive().required(), 
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
            'SELECT id FROM financial_plans WHERE user_id = $1',
            [user_id]
        );

        if (existingData.rows.length === 0) {
            return res.status(404).json({ message: 'Financial data not found for this user.' });
        }

        await db.query(
            `UPDATE financial_plans 
            SET expense = $1 WHERE user_id = $2`,
            [expense, user_id]
        );

        res.status(200).json({ message: "Financial data updated successfully!" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error.", error: err.message });
    }
};


const getFinancialPlansData = async (req, res) => {
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
            'SELECT * FROM financial_plans WHERE user_id = $1', 
            [user_id]
        );

        if (financialData.rows.length === 0) {
            return res.status(404).json({ message: 'Financial data not found for this user.' });
        }

        res.status(200).json(financialData.rows[0]); 
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

module.exports = { financialPlansRegister, financialPlansUpdate, getFinancialPlansData };
