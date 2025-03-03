const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite } = require('../db/dboperations'); // Correctly reference the dboperations module
const verifyToken = require('../middleware/verifyToken'); // Import the verifyToken middleware

// Add Favorite
router.post('/favorites/:carId', verifyToken, async (req, res) => { // Apply the middleware here
    const userId = req.userId; // Use userId set by the middleware
    const carId = req.params.carId;

    console.log(`Adding favorite for userId: ${userId}, carId: ${carId}`); // Debugging log
    try {
        const result = await addFavorite(userId, carId);
        console.log(`Favorite added successfully: ${result}`); // Log success

        res.status(200).json({ success: true, message: 'Favorite added successfully.' });
    } catch (error) {
        console.error('Error adding favorite:', error.message); // Log the specific error message
        res.status(500).json({ success: false, message: 'Error adding favorite.' });

    }
});

// Remove Favorite
router.delete('/favorites/:carId', verifyToken, async (req, res) => { // Apply the middleware here
    const userId = req.userId; // Use userId set by the middleware
    const carId = req.params.carId;

    try {
        await removeFavorite(userId, carId);
        res.status(200).json({ success: true, message: 'Favorite removed successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error removing favorite.' });
    }
});

module.exports = router;
