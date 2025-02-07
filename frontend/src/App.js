import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import Footer from './components/Footer';
import filmImage from './assets/hatter.jpg';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomCard from './components/Card'; // CustomCard importálása
import Szuro from './components/Szuro';  // A szűrő komponens importálása


function App() {
  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  const mainStyle = {
    position: 'relative',
  };

  const parallaxStyle = {
    backgroundImage: `url(${filmImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    height: '400px',
    width: '100%',
  };

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/termek');
        setProducts(response.data.products || []);
        setFilteredProducts(response.data.products || []); // Alapértelmezetten a szűrt termékek megegyeznek az összes termékkel
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Hiba! Nem sikerült betölteni a termékeket.');
      }
    };

    fetchProducts();
  }, []);

  // Kedvencek kezelése
  const handleFavoriteToggle = (autoId) => {
    if (favorites.includes(autoId)) {
      setFavorites(favorites.filter(id => id !== autoId));
    } else {
      setFavorites([...favorites, autoId]);
    }
  };

  // A szűrők kezeléséhez használt függvény
  const handleFilterChange = (filtered) => {
    setFilteredProducts(filtered);
  };

  return (
    <div className='szin' style={appStyle}>
      <Menu />
      {/* Parallax háttér */}
      <div style={parallaxStyle}></div>

      {/* Szűrő komponens */}
      <Szuro onFilterChange={handleFilterChange} products={products} />

      <main style={mainStyle}>
        <Container className="my-4">
          {/* "Jelenlegi kínálatunk" csak akkor jelenik meg, ha van találat */}
          {filteredProducts.length > 0 && (
            <>
              <h1 className="text-center mb-4">Jelenlegi kínálatunk</h1>
              <Row>
                {filteredProducts.map((auto) => (
                  <Col key={auto.Rendszam} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <CustomCard
                      imageSrc={`http://localhost:8080/${auto.Modell}.jpg`} // Példa kép URL
                      title={`${auto.Marka}  ${auto.Modell}`} // Márka és modell
                      subtitle={`Évjárat: ${auto.Evjarat} | Ár: ${auto.Ar} Ft`}  // Évjárat és ár
                      description={`Kilométeróra: ${auto.Kilometerora} | Üzemanyag: ${auto.Motortipus}`} // Kilométeróra és üzemanyag típus
                      adatok={`Km.állás: ${auto.Kilometerora} | Motortípus: ${auto.Motortipus} | Motorspec.: ${auto.Motorspecifikacio} | Sebességváltó: ${auto.Sebessegvalto} | Használat típusa: ${auto.Hasznalat} | Autó színe: ${auto.Szin}`}
                      year={`${auto.Rendszam}`} // Rendszám
                      elado={`${auto.Nev} | Tel.: ${auto.Telefon} | Email: ${auto.Email}`} // Eladó információ
                      isFavorite={favorites.includes(auto.Rendszam)} // Kedvencek állapot
                      onFavoriteToggle={() => handleFavoriteToggle(auto.Rendszam)} // Kedvencek gomb kezelése
                    />
                  </Col>
                ))}
              </Row>
            </>
          )}

          {/* Ha nincs találat, akkor egy üzenetet jelenítünk meg */}
          {filteredProducts.length === 0 && (
            <p className="text-center">Nincs megjeleníthető autó.</p>
          )}

          {error && <p className="text-danger text-center">{error}</p>}
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default App;
