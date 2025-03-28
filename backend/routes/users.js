var express = require('express');
var router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../db/dboperations');
const verifyToken = require('../middleware/verifyToken'); // veryfyToken middleware importálása

const { updateUserProfile } = require('../db/dboperations');

// Regisztráció API
router.post('/register', async function(req, res, next) {
  const { email, password, nev, telefon } = req.body;

  try {
      await registerUser(email, password, nev, telefon);
      res.status(200).json({ success: true, message: 'Sikeres regisztráció' });
  } catch (error) {
      console.error('Registration error:', error.message);  // Hibák naplózása
      res.status(500).json({ success: false, message: error.message });
  }
});

const jwt = require('jsonwebtoken'); // Jwt importálása

// Bejelentkezés API
router.post('/login', async function(req, res, next) {
  const { email, password } = req.body;

  try {
      const user = await loginUser(email, password);  // Ellenőrzi a felhasználói adatokat
      if (user) {
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // JWT generálása
          res.status(200).json({ success: true, token }); // token visszaküldése
      } else {
          res.status(401).json({ success: false, message: 'Hibás email vagy jelszó' });
      }

  } catch (error) {
      res.status(500).json({ success: false, message: error.message });
  }
});

// Profil frissítése API
router.post('/updateProfile', async function(req, res, next) {
    const { email, name, phone } = req.body;
  
  
    try {
        const success = await updateUserProfile(email, name, phone);  // Email elküldése a frissítéshez
        if (success) {
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false, message: 'Nem sikerült a profil frissítése' });
        }
    } catch (error) {
        console.error('Error during profile update:', error);  // hibakezelés
        res.status(500).json({ success: false, message: error.message });
    }
  });

router.get('/profile', verifyToken, async function(req, res, next) { 

    const userId = req.userId; // User ID lekérése a middleware segítségével
    try {
        const userProfile = await getUserProfile(userId); // User profil lekérése
        if (userProfile) {
            res.status(200).json({ success: true, profile: userProfile });
        } else {
            res.status(404).json({ success: false, message: 'Profile not found' });
        }
    } catch (error) {
        console.error('Error fetching profile:', error); // Hibakezelés
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
