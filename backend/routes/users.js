var express = require('express');
var router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../db/dboperations');
const verifyToken = require('../middleware/verifyToken'); // Import verifyToken

const { updateUserProfile } = require('../db/dboperations');

// Regisztráció API
router.post('/register', async function(req, res, next) {
  const { email, password, nev, telefon } = req.body;

  try {
      console.log('Received registration request with:', req.body);  // Logoljuk, mi érkezett
      await registerUser(email, password, nev, telefon);
      res.status(200).json({ success: true, message: 'Sikeres regisztráció' });
  } catch (error) {
      console.error('Registration error:', error.message);  // Hibák naplózása
      res.status(500).json({ success: false, message: error.message });
  }
});

const jwt = require('jsonwebtoken'); // Import JWT library

// Bejelentkezés API
router.post('/login', async function(req, res, next) {
  const { email, password } = req.body;

  try {
      const user = await loginUser(email, password);  // Ellenőrzi a felhasználói adatokat
      if (user) {
          const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Generate JWT
          res.status(200).json({ success: true, token }); // Return token
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
  
    console.log('Received update profile request with:', req.body);  // Log what was received
  
    try {
        const success = await updateUserProfile(email, name, phone);  // Pass the email to the update function
        if (success) {
            res.status(200).json({ success: true });
        } else {
            res.status(400).json({ success: false, message: 'Nem sikerült a profil frissítése' });
        }
    } catch (error) {
        console.error('Error during profile update:', error);  // Log errors
        res.status(500).json({ success: false, message: error.message });
    }
  });

router.get('/profile', verifyToken, async function(req, res, next) { 

    const userId = req.userId; // Get user ID from the token
    try {
        const userProfile = await getUserProfile(userId); // Fetch user profile from the database
        if (userProfile) {
            res.status(200).json({ success: true, profile: userProfile });
        } else {
            res.status(404).json({ success: false, message: 'Profile not found' });
        }
    } catch (error) {
        console.error('Error fetching profile:', error); // Log errors
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
