import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import Szuro from './Szuro.jsx';
import CustomCard from './Card';
import Video from './video.jsx'; // Import the Video component


function Kinalat({ isLoggedIn, handleFavoriteToggle, }) {
  
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
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

 

  // Szűrő komponensből érkező visszahívás: frissítjük a megjelenítendő termékek listáját
  const handleFilterChange = (filtered) => {
    setFilteredProducts(filtered);
  };

  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  };

  

  return (
    <div className="szin" style={appStyle}>

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
      showFavoriteButton={isLoggedIn} // Ellenőrizd, hogy ez a prop helyesen van beállítva
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

    </div>
  );
}

export default Kinalat;
