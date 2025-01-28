// dboperations.js

const config = require('./dbconfig');
const sql = require('mysql2/promise');

let pool = sql.createPool(config);

// Lekérdezi a markaid nézetet
// dboperations.js

async function selectTermekWithMarkaFromView() {
  try {
    const [rows] = await pool.query('SELECT Marka FROM markaidleker');  // Frissítve: markaid helyett markaidleker
    return rows;
  } catch (error) {
    console.error("Database query failed:", error);  // Hibák naplózása
    throw new Error('Hiba történt az adatbázis lekérdezésében');
  }
}


module.exports = {
  selectTermekWithMarkaFromView
};
