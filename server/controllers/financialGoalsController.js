const Joi = require('joi');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;

const financialGoalsRegister = async (req, res) => {
    const { token, name, description } = req.body;

    const schema = Joi.object({
        token: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
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
            `INSERT INTO financial_goals (user_id, name, description)
            VALUES ($1, $2, $3) RETURNING id;`,
            [user_id, name, description]
        );

        res.status(201).json({ message: "Goal saved successfully!", id: result.rows[0].id });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const financialGoalsDelete = async (req, res) => {
    const { token, id } = req.body;

    console.log(token, id);
    const schema = Joi.object({
        token: Joi.string().required(),
        id: Joi.number().integer().required(), 
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

        const billResult = await db.query(
            'SELECT id FROM financial_goals WHERE id = $1 AND user_id = $2', 
            [id, user_id]
        );

        if (billResult.rows.length === 0) {
            return res.status(403).json({ message: "You don't have permission to delete this bill." });
        }

        await db.query('DELETE FROM financial_goals WHERE id = $1 AND user_id = $2', [id, user_id]);

        res.status(200).json({ message: "Goal deleted successfully!" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const financialGoalsUpdate = async (req, res) => {
    const { token, name, description, progress, target_amount } = req.body;

    const schema = Joi.object({
        token: Joi.string().required(),
        name: Joi.string().required(),
        description: Joi.string().required(),
        progress: Joi.string().required(),
        target_amount: Joi.number().positive().required(),
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
            'SELECT id FROM financial_goals WHERE user_id = $1',
            [user_id]
        );

        if (existingData.rows.length === 0) {
            return res.status(404).json({ message: 'Financial data not found for this user.' });
        }

        await db.query(
            `UPDATE financial_goals
            SET name = $1, description = $2, progress = $3, target_amount = $4
            WHERE user_id = $5`,
            [name, description, progress, target_amount, user_id]
        );

        res.status(200).json({ message: "Financial data updated successfully!" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const getFinancialGoalsData = async (req, res) => {
    const { token } = req.params; 

    const schema = Joi.object({
        token: Joi.string().required(),
    });

    const { error } = schema.validate(req.params);
    if (error) return res.status(400).json({ message: "Invalid token format." });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user_email = decoded.email;

        const userResult = await db.query('SELECT id FROM users WHERE email = $1', [user_email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const user_id = userResult.rows[0].id;

        const financialData = await db.query(
            'SELECT * FROM financial_goals WHERE user_id = $1',
            [user_id]
        );

        if (financialData.rows.length === 0) {
            return res.status(200).json([]); 
        }

        res.status(200).json(financialData.rows); 

    } catch (err) {
        console.error("Error fetching financial goals:", err);
        res.status(500).json({ message: "Internal server error." });
    }
};


module.exports = { financialGoalsRegister, financialGoalsUpdate, getFinancialGoalsData, financialGoalsDelete };
