const Joi = require('joi');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;

const investmentsRegister = async (req, res) => {
    const { token, name, value, type} = req.body;

    const schema = Joi.object({
        token: Joi.string().required(),
        name: Joi.string().required(),
        value: Joi.number().positive().required(),
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
            `INSERT INTO investments (user_id, name, value, type)
            VALUES ($1, $2, $3, $4) RETURNING id;`,
            [user_id, name, value, type]
        );

        res.status(201).json({ message: "investments data saved successfully!", id: result.rows[0].id });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const investmentsDelete = async (req, res) => {
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
            'SELECT id FROM investments WHERE id = $1 AND user_id = $2', 
            [id, user_id]
        );

        if (billResult.rows.length === 0) {
            return res.status(403).json({ message: "You don't have permission to delete this investment." });
        }

        await db.query('DELETE FROM investments WHERE id = $1 AND user_id = $2', [id, user_id]);

        res.status(200).json({ message: "investment deleted successfully!" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const investmentsUpdate = async (req, res) => {
    const { token, investments_date, name, value, type } = req.body;

    const schema = Joi.object({
        token: Joi.string().required(),
        investments_date: Joi.string().isoDate().required(),
        name: Joi.string().required(),
        value: Joi.number().positive().required(),
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
            'SELECT id FROM investments WHERE user_id = $1',
            [user_id]
        );

        if (existingData.rows.length === 0) {
            return res.status(404).json({ message: 'investment data not found for this user.' });
        }

        await db.query(
            `UPDATE investments 
            SET investments_date = $1, name = $2, value = $3, type = $4
            WHERE user_id = $5`,
            [investments_date, name, value, type, user_id]
        );

        res.status(200).json({ message: "investment data updated successfully!" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const getinvestmentsData = async (req, res) => {
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
            'SELECT * FROM investments WHERE user_id = $1',
            [user_id]
        );

        if (financialData.rows.length === 0) {
            return res.status(404).json({ message: 'No investment data found for this user.' });
        }

        res.status(200).json(financialData.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

module.exports = { investmentsRegister, investmentsUpdate, getinvestmentsData, investmentsDelete };
