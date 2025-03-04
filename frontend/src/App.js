import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import Kinalat from './components/Kinalat';
import Home from './components/Home.jsx';
import Footer from './components/Footer';
import Video from './components/video.jsx';
import Szuro from './components/Szuro.jsx';
import CustomCard from './components/Card';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState([]); // Kedvencek állapot


  const [error, setError] = useState(null);

  // Termékek lekérése az API-ból
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/termek');
        const fetchedProducts = response.data.products || [];
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Alapértelmezetten minden termék megjelenik
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Hiba! Nem sikerült betölteni a termékeket.');
      }
    };

    fetchProducts();
  }, []);

  const handleFavoriteToggle = (autoId) => {
    // Ellenőrizzük, hogy az Auto_ID benne van-e a kedvencek listájában
    if (favorites.includes(autoId)) {
      setFavorites(favorites.filter(id => id !== autoId)); // Ha már kedvenc, eltávolítjuk
    } else {
      setFavorites([...favorites, autoId]); // Ha nem kedvenc, hozzáadjuk
    }
  };
  

  // Szűrő komponensből érkező visszahívás: frissítjük a megjelenítendő termékek listáját
  const handleFilterChange = (filtered) => {
    setFilteredProducts(filtered);
  };
<Kinalat
        isLoggedIn={true} // Feltételezve, hogy a felhasználó be van jelentkezve
        favorites={favorites} // Kedvencek átadása
        handleFavoriteToggle={handleFavoriteToggle} // Kedvencek kezelése
        products={products} // Termékek átadása
      />
  return (
    <div className="szin" style={appStyle}>
      <Menu 
  favorites={favorites} 
  handleFavoriteToggle={handleFavoriteToggle} 
  setFavorites={setFavorites} // Átadjuk a setFavorites függvényt is
  products={products} 
/>




      <Footer />
    </div>
  );
}

export default App;
