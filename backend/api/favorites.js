const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getFavorites } = require('../db/dboperations'); // Correctly reference the dboperations module

const verifyToken = require('../middleware/verifyToken'); // Import the verifyToken middleware

// Kedvencekhez adás
router.post('/favorites/:carId', verifyToken, async (req, res) => {
    const userId = req.userId;
    const carId = req.params.carId;

    try {
        const result = await addFavorite(userId, carId);
        return res.status(200).json({
            success: true,
            message: 'Favorite added successfully.',
            favorites: result.favorites, // Add the favorites array here
        });
    } catch (error) {
        console.error('Error adding favorite:', error.message);
        return res.status(500).json({
            success: false,
            message: 'Error adding favorite.',
        });
    }
});


// Kedvencek törlése
router.delete('/favorites/:carId', verifyToken, async (req, res) => { // Apply the middleware here
    const userId = req.userId; // Use userId set by the middleware
    const carId = req.params.carId;

    try {
        const result = await removeFavorite(userId, carId); // Remove favorite and get updated favorites
        res.status(200).json({ success: true, favorites: result.favorites, message: 'Favorite removed successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing favorite.' });
    }
});

// KJedvencek lekérdezése
router.get('/favorites', verifyToken, async (req, res) => {
    const userId = req.userId; // Use userId set by the middleware

    try {
        const favorites = await getFavorites(userId); // Fetch favorites from the database
        

        res.json({ success: true, favorites });

    } catch (error) {
        console.error('Error fetching favorites for userId:', userId, error);

        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
