const config = require('./dbconfig');
const sql = require('mysql2/promise');
const crypto = require('crypto');
const { validateHeaderValue } = require('http');

let pool = sql.createPool(config);

// Lapozás
async function selectProductPerPage(pageNo) {
  try {
      const [elements] = await pool.query(
          'SELECT * FROM autorendszer ORDER BY Evjarat LIMIT ?, 25', 
          [(pageNo - 1) * 25]
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

async function getCarsByIds(ids) { // Ensure the function is defined correctly
    try {
        const [rows] = await pool.query('SELECT * FROM autorendszer WHERE Rendszam IN (?)', [ids]);
        return rows;
    } catch (error) {
        console.error('Error fetching cars by IDs:', error);
        throw new Error('Failed to fetch cars.');
    }
}

async function selectAutoFromAutorendszer(limit, offset) {


  try {
    const [rows] = await pool.query('SELECT * FROM autorendszer'); // Fetch all cars without limits


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
          return rows[0];  // Return user object for JWT generation
      } else {
          return null;  // Return null for unsuccessful login
      }
  } catch (error) {
      console.error('Login failed:', error);
      throw new Error('Hiba történt a bejelentkezés során');
  }
}

// Adatbázis frissítő függvény
async function updateUserProfile(email, name, phone) {
  try {
      const [result] = await pool.query(
          'UPDATE regisztracio SET nev = ?, telefon = ? WHERE email = ?',
          [name, phone, email] // Use the email passed as a parameter
      );
      return result.affectedRows > 0;  // If any rows were affected, return true
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
    Modell: {sql: 'Modell LiKE', value: (val) => '%${val}%' }
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

async function addFavorite(userId, carId) {
  try {
      // Frissített kedvencek listája a lekérdezés után
      const [result] = await pool.query(
          'UPDATE regisztracio SET kedvencek = JSON_ARRAY_APPEND(kedvencek, "$", ?) WHERE id = ?',
          [carId, userId]
      );

      // Lekérjük a frissített kedvencek listáját
      const [updatedFavorites] = await pool.query(
          'SELECT kedvencek FROM regisztracio WHERE id = ?',
          [userId]
      );

      // Parse JSON string-tömbbé
      const favoritesArray = updatedFavorites.length > 0 && updatedFavorites[0].kedvencek
          ? JSON.parse(updatedFavorites[0].kedvencek)
          : [];

      return { success: true, favorites: favoritesArray }; // Visszaadjuk a tömböt, nem a JSON stringet
  } catch (error) {
      console.error('Failed to add favorite:', error.message); // Log the specific error message
      throw new Error('Error adding favorite.');
  }
}

async function removeFavorite(userId, carId) {
  try {
      // Eltávolítjuk a kedvencet a listából
      const [result] = await pool.query(
          'UPDATE regisztracio SET kedvencek = JSON_REMOVE(kedvencek, JSON_UNQUOTE(JSON_SEARCH(kedvencek, "one", ?))) WHERE id = ?',
          [carId, userId]
      );

      // Visszaadjuk a frissített kedvencek listáját
      const favorites = await getFavorites(userId);
      return { success: true, favorites }; // Frissített kedvencek visszaadása
  } catch (error) {
      console.error('Failed to remove favorite:', error.message); // Log the specific error message
      throw new Error('Error removing favorite.');
  }
}

// Function to get favorites for a user
async function getFavorites(userId) {
    try {
        const query = 'SELECT kedvencek FROM regisztracio WHERE id = ?'; // Adjust the query as per your database schema
        const [rows] = await pool.query(query, [userId]);
        if (rows.length === 0) {
            throw new Error('No favorites found for this user.'); // More detailed error message
        }
        return rows[0].kedvencek; // Return the favorites array

    } catch (error) {
        console.error('Error fetching favorites from database:', error);
        throw new Error('Failed to fetch favorites.'); // More descriptive error message
    }
}

async function getUserProfile(userId) {
    try {
        const [rows] = await pool.query('SELECT * FROM regisztracio WHERE id = ?', [userId]);
        if (rows.length > 0) {
            return rows[0]; // Return the user profile
        } else {
            return null; // No profile found
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Failed to fetch user profile.');
    }
}

async function getUserIdByEmail(email) {
    try {
        const [rows] = await pool.query('SELECT id FROM regisztracio WHERE email = ?', [email]);
        if (rows.length > 0) {
            return rows[0].id; // Return the user ID
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error fetching user ID:', error);
        throw new Error('Failed to fetch user ID.');
    }
}

async function createBooking(carId, userId, paymentMethod) {

    // Check if the car is already booked
    const [existingBooking] = await pool.query('SELECT * FROM foglalas WHERE car_id = ?', [carId]);
    if (existingBooking.length > 0) {
        throw new Error(`The car with ID ${carId} is already booked.`);
    }

    try {
        const [result] = await pool.query(
            'INSERT INTO foglalas (car_id, user_id, fizmod) VALUES (?, ?, ?)',
            [carId, userId, paymentMethod] // Include payment method

        );
        return result.insertId; // Return the insertId after a successful insertion

    } catch (error) {
        console.error('Error creating booking:', error); // Log the error
        throw new Error('Failed to create booking.');
    }
}

module.exports = { // Ensure all functions are exported correctly
  selectAutoFromAutorendszer, selectProductPerPage , registerUser,
  loginUser ,updateUserProfile, selectProductWhere, addFavorite, removeFavorite, getFavorites,
  getUserProfile, createBooking,getCarsByIds // Export the new function
};
