import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
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

  // Kedvencek kezelése
  const handleFavoriteToggle = (autoId) => {
    if (favorites.includes(autoId)) {
      setFavorites(favorites.filter(id => id !== autoId));
    } else {
      setFavorites([...favorites, autoId]);
    }
  };

  // Szűrő komponensből érkező visszahívás: frissítjük a megjelenítendő termékek listáját
  const handleFilterChange = (filtered) => {
    setFilteredProducts(filtered);
  };

  return (
    <div className="szin" style={appStyle}>
      <Menu favorites={favorites} handleFavoriteToggle={handleFavoriteToggle} products={products} /> {/* Kedvencek átadása Menu komponensnek */}

      {/* Videó háttér */}
      <div className="video-hatter">
        <Video />

        <Container className="my-4" style={{ position: 'relative', zIndex: 1 }}>
          <Row className="d-flex justify-content-between kinalat">
            {/* Szűrő oldalsáv */}
            <Col xs={12} sm={3} md={3} lg={2}>
              <Szuro onFilterChange={handleFilterChange} products={products} />
            </Col>

            {/* Termékek megjelenítése */}
            <Col xs={12} sm={9} md={9} lg={10} className="card-container">
              {filteredProducts.length > 0 && (
                <>
                  <h1 className="text-center mb-4">Jelenlegi kínálatunk</h1>
                  <Row className="d-flex justify-content-start g-4">
                    {filteredProducts.map((auto) => (
                      <Col
                        key={auto.Rendszam}
                        xs={12} sm={6} md={4} lg={4}
                        style={{ padding: '10px', maxWidth: '350px' }}
                      >
                        <CustomCard
                          imageSrc={`http://localhost:8080/${auto.Modell}.jpg`}
                          title={`${auto.Marka} ${auto.Modell}`}
                          subtitle={`Évjárat: ${auto.Evjarat} | Ár: ${auto.Ar} Ft`}
                          description={`Kilométeróra: ${auto.Kilometerora} | Üzemanyag: ${auto.Motortipus}`}
                          adatok={`Km.állás: ${auto.Kilometerora} | Motortípus: ${auto.Motortipus} | Motorspec.: ${auto.Motorspecifikacio} | Sebességváltó: ${auto.Sebessegvalto} | Használat: ${auto.Hasznalat} | Autó színe: ${auto.Szin}`}
                          year={`${auto.Rendszam}`}
                          elado={`${auto.Nev} | Tel.: ${auto.Telefon} | Email: ${auto.Email}`}
                          isFavorite={favorites.includes(auto.Rendszam)}
                          onFavoriteToggle={() => handleFavoriteToggle(auto.Rendszam)}
                        />
                      </Col>
                    ))}
                  </Row>
                </>
              )}

              {filteredProducts.length === 0 && (
                <p className="text-center">Nincs megjeleníthető autó.</p>
              )}

              {error && <p className="text-danger text-center">{error}</p>}
            </Col>
          </Row>
        </Container>

      </div>

      <Footer />
    </div>
  );
}

export default App;