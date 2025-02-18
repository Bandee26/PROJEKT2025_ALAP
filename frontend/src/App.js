import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import Footer from './components/Footer';
import filmImage from './assets/hatter.jpg';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomCard from './components/Card';
import Szuro from './components/Szuro.jsx';
import Video from './components/video.jsx';

function App() {
  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
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
  const [filteredProducts, setFilteredProducts] = useState([]); // Hozzáadva
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]);

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

  // Szűrő változás kezelése
  const handleFilterChange = (filtered) => {
    setFilteredProducts(filtered);
  };

  return (
    <div className='szin' style={appStyle}>
      <Menu />

      {/* Parallax háttér */}
      <div style={parallaxStyle}></div>

      <main>
        <Container className="my-4">
          <Row>
            {/* Szűrő komponens */}
            <Col
              xs={12}
              sm={4}
              md={3}
              className="mb-4"
              style={{
                padding: '10px',
                backgroundColor: '#fff',
                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)',
                position: 'absolute',
                left: 0,
                width: '250px',
                zIndex: 999,
                marginTop: '467px',
              }}
            >
              <Szuro onFilterChange={handleFilterChange} products={products} />
            </Col>

            {/* Termékek megjelenítése */}
            <Col xs={12} sm={8} md={9} style={{ marginLeft: 'auto' }}>
              {filteredProducts.length > 0 && (
                <>
                  <h1 className="text-center mb-4">Jelenlegi Kínálatunk</h1>
                  <Row>
                    {filteredProducts.map((auto) => (
                      <Col key={auto.Rendszam} xs={12} sm={6} md={4} lg={3} className="mb-4">
                        <CustomCard
                          imageSrc={`http://localhost:8080/${auto.Modell}.jpg`}
                          title={`${auto.Marka} ${auto.Modell}`}
                          subtitle={`Évjárat: ${auto.Evjarat} | Ár: ${auto.Ar} Ft`}
                          description={`Kilométeróra: ${auto.Kilometerora} | Üzemanyag: ${auto.Motortipus}`}
                          adatok={`Km.állás: ${auto.Kilometerora} | Motortípus: ${auto.Motortipus} | Motorspec.: ${auto.Motorspecifikacio} | Sebességváltó: ${auto.Sebessegvalto} | Használat típusa: ${auto.Hasznalat} | Autó színe: ${auto.Szin}`}
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
            </Col>
          </Row>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default App;
