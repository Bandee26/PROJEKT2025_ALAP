import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import Szuro from './Szuro.jsx';
import CustomCard from './Card';
import Video from './video.jsx'; // Import the Video component
import Slider from 'react-slick'; // Import react-slick for image carousel
import './KepLapozas.css'; // Import the CSS file for styling the arrows

function Kinalat({ isLoggedIn, handleFavoriteToggle, favorites }) {

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // Add loading state

  // Termékek lekérése az API-ból
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true); // Set loading to true before fetching
        const token = localStorage.getItem('token'); // Retrieve JWT from local storage
        const response = await axios.get('http://localhost:8080/termek', {
          headers: {
            'Authorization': `Bearer ${token}` // Include JWT in the request headers
          }
        });

        setLoading(false); // Set loading to false after fetching

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
    return favorites.includes(autoId); // Check if the car is a favorite
  };

  // React-Slick settings for the image carousel
  const settings = {
    dots: true, // Show dots for navigation
    infinite: true, // Infinite scroll
    speed: 500, // Speed of slide transition
    slidesToShow: 1, // Only one image visible at a time
    slidesToScroll: 1, // Scroll one image at a time
    arrows: true, // Show arrows for navigation
    prevArrow: <div className="slick-prev custom-arrow">&#8249;</div>, // Left arrow
    nextArrow: <div className="slick-next custom-arrow">&#8250;</div>, // Right arrow
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
                          title={`${auto.Marka} ${auto.Modell}`}
                          subtitle={`Évjárat: ${auto.Evjarat} | Ár: ${auto.Ar} Ft`}
                          description={`Kilométeróra: ${auto.Kilometerora} | Üzemanyag: ${auto.Motortipus}`}
                          adatok={`Km.állás: ${auto.Kilometerora} | Motortípus: ${auto.Motortipus} | Motorspec.: ${auto.Motorspecifikacio} | Sebességváltó: ${auto.Sebessegvalto} | Használat: ${auto.Hasznalat} | Autó színe: ${auto.Szin}`}
                          year={`${auto.Rendszam}`}
                          elado={`${auto.Nev} | Tel.: ${auto.Telefon} | Email: ${auto.Email}`}
                          isFavorite={isFavorite(auto.Rendszam)} // Use a function to check if the car is a favorite
                          onFavoriteToggle={() => handleFavoriteToggle(auto.Rendszam)}
                          showFavoriteButton={isLoggedIn} // Ellenőrizd, hogy ez a prop helyesen van beállítva
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

              {loading && <p className="text-center">Betöltés...</p>} {/* Loading message */}
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
