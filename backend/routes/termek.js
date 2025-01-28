// termek.js

var express = require('express');
var router = express.Router();
var Db = require('../db/dboperations');

/* GET autorendszer */
router.get('/', async function(req, res, next) {
  try {
    const products = await Db.selectAutoFromAutorendszer();  // Lekérdezés az autorendszer nézetből
    res.json({ products: products });  // JSON válasz
  } catch (error) {
    res.status(500).send('Szerver hiba!'); // Hibaüzenet visszaküldése
  }
});

module.exports = router;
