const config = require('./dbconfig');
const sql = require('mysql2/promise');
const crypto = require('crypto');
const { validateHeaderValue } = require('http');

let pool = sql.createPool(config);

// Lapozás
async function selectProductPerPage(pageNo) {
  try {
      const [elements] = await pool.query(
          'SELECT * FROM autorendszer ORDER BY Evjarat LIMIT ?, 20', 
          [(pageNo - 1) * 20]
      );
      return elements;
  } catch (error) {
      throw error;
  }
}

// SHA-256 kódolás függvény
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

async function selectAutoFromAutorendszer() {
  try {
    const [rows] = await pool.query('SELECT * FROM autorendszer');
    return rows;
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error('Hiba történt az adatbázis lekérdezésében');
  }
}

// Regisztráció függvény
async function registerUser(email, password, nev, telefon) {
  const hashedPassword = hashPassword(password);  // Jelszó hash-elve
  try {
      const [result] = await pool.query(
        'INSERT INTO regisztracio (email, jelszo, nev, telefon) VALUES (?, ?, ?, ?)',
        [email, hashedPassword, nev, telefon]  // Hashed jelszó
      );
      return result;
  } catch (error) {
      console.error('Registration failed:', error);
      throw new Error('Hiba történt a regisztráció során');
  }
}

// Bejelentkezés függvény
async function loginUser(email, password) {
  const hashedPassword = hashPassword(password);  // A megadott jelszó hashelése
  try {
      const [rows] = await pool.query(
          'SELECT * FROM regisztracio WHERE email = ? AND jelszo = ?', 
          [email, hashedPassword]
      );
      if (rows.length > 0) {
          return true;  // Ha van találat, akkor sikeres belépés
      } else {
          return false;  // Ha nincs találat, sikertelen belépés
      }
  } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Hiba történt a bejelentkezés során');
  }
}

// Adatbázis frissítő függvény
async function updateUserProfile(name, phone) {
  try {
      const [result] = await pool.query(
          'UPDATE regisztracio SET nev = ?, telefon = ? WHERE email = ?',
          [name, phone, 'example@domain.com'] // Az email-t dinamikusan kell lekérni a session-ből vagy tokenből
      );
      return result.affectedRows > 0;  // Ha történt módosítás, akkor igazat ad vissza
  } catch (error) {
      console.error('Profile update failed:', error);
      throw new Error('Hiba történt a profil frissítésekor');
  }
}


async function selectProductWhere(whereConditions){
  const conditions = []
  const values = []

  const mappings = {
    Marka: {sql: 'Marka LiKE', value: (val) => '%${val}%'},
    Modell: {sql: 'Modell LiKE', value: (val) => '%${val}%'}
  }

  console.log("dfgdfsgdfs",whereConditions)

  for(const [key, {sql, value}] of Object.entries(mappings))
    {
      console.log(whereConditions[key])
      if(whereConditions[key]){
        conditions.push(sql)
        values.push(value(whereConditions[key]))
      }
    }

    const whereClause = conditions.length ? `WHERE ${conditions.join(" AND ")}` : ""

    const query = `SELECT * FROM autorendszer ${whereClause} ORDER BY Ar`

    console.log(query)

    try{
      const [elements] = await pool.query(query, values)
    }
    catch (error)
    {
      throw error
    }
}

module.exports = {
  selectAutoFromAutorendszer, selectProductPerPage , registerUser,
  loginUser ,updateUserProfile, selectProductWhere
};
