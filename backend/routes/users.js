var express = require('express');
var router = express.Router();
const { registerUser, loginUser } = require('../db/dboperations');

// Regisztráció API
router.post('/register', async function(req, res, next) {
    const { email, password, nev, telefon } = req.body;  // Alapértelmezett paraméterek a regisztrációhoz

    try {
        await registerUser(email, password, nev, telefon);  // Regisztrációs adatokat kezelő függvény
        res.status(200).json({ success: true, message: 'Sikeres regisztráció' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Bejelentkezés API
router.post('/login', async function(req, res, next) {
    const { email, password } = req.body;

    try {
        const success = await loginUser(email, password);
        if (success) {
            res.status(200).json({ success: true, message: 'Sikeres belépés' });
        } else {
            res.status(401).json({ success: false, message: 'Hibás email vagy jelszó' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
