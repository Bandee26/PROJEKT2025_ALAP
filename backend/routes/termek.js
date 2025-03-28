var express = require('express');
var router = express.Router();
var Db = require('../db/dboperations');

/* autorendszer lekérése */
router.get('/', async function(req, res, next) {
  


  try {
  const products = await Db.selectAutoFromAutorendszer();  // Lekérdezés az autorendszer nézetből


    res.json({ products: products });  // JSON válasz
  } catch (error) {
    res.status(500).send('Szerver hiba!'); // Hibaüzenet visszaküldése
  }
});

router.get('/betolt', (req, res) => {
  const page = Number(req.query.page) || 1; // Lekérjük az oldalszámot a queryből
  const limit = 25; // A betöltött elemek száma oldalanként
  const offset = (page - 1) * limit; // kiszámolja az offsetet


  Db.selectProductPerPage(page) 

    .then(products => res.json(products))

    .catch(error => res.send(error))
})

router.post('/filter', async (req, res) => {
  try{
    const JS = req.body
    const adat = await Db.selectProductWhere(JS)
    res.status(500).send('Szerver hiba!'); // Hibakezelés

  }
  catch(error)
  {
    res.send(error)
  }
})

module.exports = router;
