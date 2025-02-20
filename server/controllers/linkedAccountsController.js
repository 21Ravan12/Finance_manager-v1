const jwt = require('jsonwebtoken');
const Joi = require('joi');
const db = require('../config/db');

const JWT_SECRET = process.env.JWT_SECRET;

const linkedAccountsRegister = async (req, res) => {
    const { token, name, status } = req.body;

    const schema = Joi.object({
        token: Joi.string().required(),
        name: Joi.string().required(),
        status: Joi.string().valid('active', 'inactive').required(),
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
            `INSERT INTO linked_accounts (user_id, name, status) 
            VALUES ($1, $2, $3) RETURNING id;`,
            [user_id, name, status]
        );

        res.status(201).json({ message: "Linked account registered successfully!", id: result.rows[0].id });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const linkedAccountsDelete = async (req, res) => {
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
            'SELECT id FROM linked_accounts WHERE id = $1 AND user_id = $2', 
            [id, user_id]
        );

        if (billResult.rows.length === 0) {
            return res.status(403).json({ message: "You don't have permission to delete this bill." });
        }

        await db.query('DELETE FROM linked_accounts WHERE id = $1 AND user_id = $2', [id, user_id]);

        res.status(200).json({ message: "Goal deleted successfully!" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const linkedAccountsUpdate = async (req, res) => {
    const { token, name, status } = req.body;

    const schema = Joi.object({
        token: Joi.string().required(),
        name: Joi.string().required(),
        status: Joi.string().valid('active', 'inactive').required(),
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
            'SELECT id FROM linked_accounts WHERE user_id = $1',
            [user_id]
        );
        if (existingData.rows.length === 0) {
            return res.status(404).json({ message: 'Linked account not found for this user.' });
        }

        await db.query(
            `UPDATE linked_accounts 
            SET name = $1, status = $2 
            WHERE user_id = $3`,
            [name, status, user_id]
        );

        res.status(200).json({ message: "Linked account updated successfully!" });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

const getLinkedAccountsData = async (req, res) => {
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

        const linkedAccountsData = await db.query(
            'SELECT * FROM linked_accounts WHERE user_id = $1',
            [user_id]
        );

        if (linkedAccountsData.rows.length === 0) {
            return res.status(200).json([]); 
        }

        res.status(200).json(linkedAccountsData.rows); 
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ message: "Database error." });
    }
};

module.exports = { linkedAccountsRegister, linkedAccountsUpdate, getLinkedAccountsData, linkedAccountsDelete };
