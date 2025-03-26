// termek.js

var express = require('express');
var router = express.Router();
var Db = require('../db/dboperations');

/* GET autorendszer */
router.get('/', async function(req, res, next) {
  // Removed limit and offset to fetch all cars


  try {
  const products = await Db.selectAutoFromAutorendszer();  // Lekérdezés az autorendszer nézetből


    res.json({ products: products });  // JSON válasz
  } catch (error) {
    res.status(500).send('Szerver hiba!'); // Hibaüzenet visszaküldése
  }
});

router.get('/betolt', (req, res) => {
  const page = Number(req.query.page) || 1; // Get the page number from query, default to 1
  const limit = 25; // Number of products to load
  const offset = (page - 1) * limit; // Calculate offset for pagination


  Db.selectProductPerPage(page) // Adjust this to use the new pagination logic

    .then(products => res.json(products))

    .catch(error => res.send(error))
})

router.post('/filter', async (req, res) => {
  try{
    const JS = req.body
    const adat = await Db.selectProductWhere(JS)
    res.status(500).send('Szerver hiba!'); // Handle errors

  }
  catch(error)
  {
    res.send(error)
  }
})

module.exports = router;
