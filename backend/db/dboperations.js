// dboperations.js

const config = require('./dbconfig');
const sql = require('mysql2/promise');

let pool = sql.createPool(config);



async function selectAutoFromAutorendszer() {
  try {
    // Lekérdezés a már létező 'autorendszer' nézetből
    const [rows] = await pool.query('SELECT * FROM autorendszer');  // Az új nézet használata
    return rows;
  } catch (error) {
    console.error("Database query failed:", error);  // Hibák naplózása
    throw new Error('Hiba történt az adatbázis lekérdezésében');
  }
}

module.exports = {
  selectAutoFromAutorendszer
};
