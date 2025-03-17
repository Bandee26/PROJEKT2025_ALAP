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

router.get('/page/:pageNo', (req, res) =>{
  let oldal = Number(req.params.pageNo)
  Db.selectProductPerPage(oldal)
    .then(adat => res.json(adat))
    .catch(error => res.send(error))
})

router.post('/filter', async (req, res) => {
  try{
    console.log(req.body)
    const JS = req.body
    console.log(JS)
    const adat = await Db.selectProductWhere(JS)
    res.json(adat)
  }
  catch(error)
  {
    res.send(error)
  }
})

module.exports = router;
