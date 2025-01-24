const config = require('./dbconfig');
const sql = require('mysql2/promise');

let pool = sql.createPool(config);

async function selectTermek() {
    try{ 
     const [rows] = await pool.query('select * from autók');
     return rows;
    }
    catch(error){
     throw error;
    } 
 }

module.exports = {
    selectTermek
}