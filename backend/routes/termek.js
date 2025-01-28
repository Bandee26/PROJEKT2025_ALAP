var express = require('express');
var router = express.Router();
var Db = require('../db/dboperations');

/* GET termekek */
router.get('/', async function(req, res, next) {
  try {
    // Az új lekérdezés hívása a markaid_view-ból
    const termek = await Db.selectTermekWithMarkaFromView(); // Módosított lekérdezés
    res.json({ products: termek }); // JSON válasz
  } catch (error) {
    console.error("Server error:", error);  // Hibák naplózása
    res.status(500).send('Szerver hiba!'); // Hibaüzenet visszaküldése
  }
});

module.exports = router;
