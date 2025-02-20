const Joi = require('joi');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;

const financialTipsRegister = async (req, res) => {
    const { token, message } = req.body;

    const schema = Joi.object({
        token: Joi.string().required(),
        message: Joi.string().required(),
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
            `INSERT INTO financial_tips (user_id, message)
            VALUES ($1, $2) RETURNING id;`,
            [user_id, message]
        );

        res.status(201).json({ message: "financial_tips data saved successfully!", id: result.rows[0].id });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const financialTipsUpdate = async (req, res) => {
    const { token, message } = req.body;

    const schema = Joi.object({
        token: Joi.string().required(),
        message: Joi.string().required(),
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
            'SELECT id FROM financial_tips WHERE user_id = $1',
            [user_id]
        );

        if (existingData.rows.length === 0) {
            return res.status(404).json({ message: 'financial_tip data not found for this user.' });
        }

        await db.query(
            `UPDATE financial_tips 
            SET message = $1
            WHERE user_id = $2`, 
            [message, user_id]
        );

        res.status(200).json({ message: "financial_tip data updated successfully!" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const getfinancialTipsData = async (req, res) => {
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
            'SELECT * FROM financial_tips WHERE user_id = $1', 
            [user_id]
        );

        if (financialData.rows.length === 0) {
            return res.status(404).json({ message: 'No financial_tip data found for this user.' });
        }

        res.status(200).json(financialData.rows); 
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

module.exports = { financialTipsRegister, financialTipsUpdate, getfinancialTipsData };
