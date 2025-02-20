const bcrypt = require('bcryptjs');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { sendCodeEmail } = require('../config/mailer');
const crypto = require('crypto');  

const JWT_SECRET = process.env.JWT_SECRET

const registerUser = async (req, res) => {
  const { email, password, name, birthyear } = req.body;

  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    name: Joi.string().min(2).required(),
    birthyear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  db.query('SELECT * FROM users WHERE email = $1', [email], async (err, results) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (results.length > 0) return res.status(400).json({ message: 'Email already exists.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const randomCode = crypto.randomInt(100000, 999999);  
    const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60; 

    const token = jwt.sign(
      { email, password: hashedPassword, name, birthyear, code: randomCode, exp: expiresAt },
      JWT_SECRET
    );

    await sendCodeEmail(email, randomCode);
    res.status(200).json({ message: "Verification code sent!", token });
  });
};

const registerUserVerifyCode = async (req, res) => {
  const { code, token } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.code !== Number(code)) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    db.query('INSERT INTO users (name, email, password, birthyear) VALUES ($1, $2, $3, $4)',
      [decoded.name, decoded.email, decoded.password, decoded.birthyear], (err) => {
        if (err) return res.status(500).json({ message: 'Error adding user.' });

        res.status(201).json({ message: 'User registered successfully.' });
      });

  } catch (err) {
    return res.status(401).json({ message: 'Token expired or invalid.' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = $1', [email], async (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: 'Database error.' });
    }

    if (results.rows.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const user = results.rows[0]; 

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  });
};


const updatePasswordSendCode = async (req, res) => {
  const { email } = req.body;
  
  db.query('SELECT * FROM users WHERE email = $1', [email], async (err, results) => {
    if (err || results.length === 0) return res.status(400).json({ message: 'Email not registered.' });
    
    const randomCode = crypto.randomInt(100000, 999999); 
    const expiresAt = Math.floor(Date.now() / 1000) + 15 * 60; 

    const token = jwt.sign(
      { email, code: randomCode, exp: expiresAt },
      process.env.JWT_SECRET
    );

    await sendCodeEmail(email, randomCode);
    res.status(200).json({ message: 'Password reset code sent!', token });
  });
};

const updatePasswordVerifyCode = async (req, res) => {
  const { code, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.code !== Number(code)) {
      return res.status(400).json({ message: 'Invalid verification code.' });
    }

    res.status(200).json({ message: 'Code verified!', token });

  } catch (err) {
    return res.status(401).json({ message: 'Token expired or invalid.' });
  }
};

const updatePassword = async (req, res) => {
  const { password, token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, decoded.email], (err, result) => {
      if (err || result.affectedRows === 0) return res.status(404).json({ message: 'User not found.' });

      res.status(200).json({ message: 'Password updated successfully!' });
    });

  } catch (err) {
    return res.status(401).json({ message: 'Token expired or invalid.' });
  }
};


module.exports = { registerUser, registerUserVerifyCode, loginUser, updatePasswordSendCode, updatePasswordVerifyCode, updatePassword };
