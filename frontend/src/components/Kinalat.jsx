import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import Szuro from './Szuro.jsx';
import CustomCard from './Card';
import Video from './video.jsx'; // Import the Video component
import Slider from 'react-slick'; // Import react-slick for image carousel
import './KepLapozas.css'; // Import the CSS file for styling the arrows

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Format the price
}

function Kinalat({ isLoggedIn, handleFavoriteToggle, favorites }) {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Betöltési állapot hozzáadása

  // Termékek lekérése az API-ból
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Betöltés előtt állítsa be az állapotot igazra
        const token = localStorage.getItem('token'); // JWT lekérése a helyi tárolóból
        const response = await axios.get('http://localhost:8080/termek', {
          headers: {
            'Authorization': `Bearer ${token}` // JWT hozzáadása a kérés fejlécéhez
          }
        });

        setLoading(false); // Betöltés befejezése után állítsa az állapotot hamisra

        const fetchedProducts = response.data.products || [];
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Alapértelmezetten minden termék megjelenik
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Hiba! Nem sikerült betölteni a termékeket. Kérjük, próbálja újra később.'); // Improved error message
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

  const isFavorite = (autoId) => {
    return favorites.includes(autoId); // Ellenőrizze, hogy az autó kedvenc-e
  };

  // React-Slick settings for the image carousel
  const settings = {
    dots: true, // Pontok megjelenítése a navigációhoz
    infinite: true, // Végtelen görgetés
    speed: 500, // A diavetítés sebessége
    slidesToShow: 1, // Csak egy kép látható egyszerre
    slidesToScroll: 1, // Egy képet görgetni
    arrows: true, // Nyilak megjelenítése a navigációhoz
    prevArrow: <div className="slick-prev custom-arrow">&#8249;</div>, // Bal nyíl
    nextArrow: <div className="slick-next custom-arrow">&#8250;</div>, // Jobb nyíl
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
                          autoId={auto.Auto_ID}
                          title={`${auto.Marka} ${auto.Modell}`}
                          subtitle={`Évjárat: ${auto.Evjarat} | Ár: ${formatPrice(auto.Ar)} Ft`}
                          description={`Kilométeróra: ${auto.Kilometerora} | Üzemanyag: ${auto.Motortipus}`}
                          adatok={`Km.állás: ${auto.Kilometerora} | Motortípus: ${auto.Motortipus} | Motorspec.: ${auto.Motorspecifikacio} | Sebességváltó: ${auto.Sebessegvalto} | Használat: ${auto.Hasznalat} | Autó színe: ${auto.Szin}`}
                          year={`${auto.Rendszam}`}
                          elado={`${auto.Nev} | Tel.: ${auto.Telefon} | Email: ${auto.Email}`}
                          isFavorite={isFavorite(auto.Rendszam)}
                          onFavoriteToggle={() => handleFavoriteToggle(auto.Rendszam)}
                          showFavoriteButton={isLoggedIn}
                        >
                          <Slider {...settings}>
                            <div>
                              <img src={`/Img/${auto.Auto_ID}.1.jpg`} alt={`${auto.Marka} ${auto.Modell} első kép`} style={{ width: '100%' }} />
                            </div>
                            <div>
                              <img src={`/Img/${auto.Auto_ID}.2.jpg`} alt={`${auto.Marka} ${auto.Modell} második kép`} style={{ width: '100%' }} />
                            </div>
                          </Slider>
                        </CustomCard>

                      </Col>
                    ))}
                  </Row>
                </>
              )}

              {loading && <p className="text-center">Betöltés...</p>} {/* Betöltési üzenet */}

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
