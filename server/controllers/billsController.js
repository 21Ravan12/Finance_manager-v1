const Joi = require('joi');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;

const upcomingBillsRegister = async (req, res) => {
    const { token, due_date, category, amount} = req.body;

    console.log(token, due_date, category, amount);
    const schema = Joi.object({
        token: Joi.string().required(),
        due_date: Joi.string().required(),
        category: Joi.string().required(),
        amount: Joi.number().positive().required()
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
            `INSERT INTO upcoming_bills (user_id, due_date, category, amount)
            VALUES ($1, $2, $3, $4) RETURNING id;`,
            [user_id, due_date, category, amount]
        );

        res.status(201).json({ message: "Financial data saved successfully!", id: result.rows[0].id });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const upcomingBillsDelete = async (req, res) => {
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
            'SELECT id FROM upcoming_bills WHERE id = $1 AND user_id = $2', 
            [id, user_id]
        );

        if (billResult.rows.length === 0) {
            return res.status(403).json({ message: "You don't have permission to delete this bill." });
        }

        await db.query('DELETE FROM upcoming_bills WHERE id = $1 AND user_id = $2', [id, user_id]);

        res.status(200).json({ message: "Bill deleted successfully!" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const upcomingBillsUpdate = async (req, res) => {
    const { token, id, due_date, status='pending' } = req.body;

    const schema = Joi.object({
        token: Joi.string().required(),
        id: Joi.number().integer().required(), 
        due_date: Joi.string().isoDate().required(),
        status: Joi.string().valid("pending", "paid").required(),
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
            'SELECT id FROM upcoming_bills WHERE user_id = $1',
            [user_id]
        );

        if (existingData.rows.length === 0) {
            return res.status(404).json({ message: 'Financial data not found for this user.' });
        }

        await db.query(
            `UPDATE upcoming_bills 
            SET due_date = $1, status = $2
            WHERE user_id = $3 AND id = $4`,
            [due_date, status, user_id,id]
        );

        res.status(200).json({ message: "Financial data updated successfully!" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const getUpcomingBillsData = async (req, res) => {
    const { token } = req.params; 
    
    const schema = Joi.object({
        token: Joi.string().required(),
    });

    const { error } = schema.validate({ token }); 
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
            'SELECT * FROM upcoming_bills WHERE user_id = $1',
            [user_id]
        );

        if (financialData.rows.length === 0) {
            return res.status(404).json({ message: 'Financial data not found for this user.' });
        }

        res.status(200).json(financialData.rows); 
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};


module.exports = { upcomingBillsRegister, upcomingBillsUpdate, getUpcomingBillsData, upcomingBillsDelete };
