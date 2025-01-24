var express = require('express');
var router = express.Router();
var Db = require('../db/dboperations');

/* GET termekek */
router.get('/', async function(req, res, next) {
  try {
    const termek = await Db.selectTermek(); // Adatbázis lekérdezés
    res.json({ products: termek }); // JSON válasz
  } catch (error) {
    res.status(500).send('Szerver hiba!'); // Hibaüzenet visszaküldése
  }
});

module.exports = router;
