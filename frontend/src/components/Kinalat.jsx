import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import Szuro from './Szuro.jsx';
import CustomCard from './Card';
import Video from './video.jsx';
import Slider from 'react-slick';
import './KepLapozas.css';
import './Kinalat.css';

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Formázza az árat
}

function Kinalat({ isLoggedIn, handleFavoriteToggle, favorites }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts(0);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `http://localhost:8080/termek`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      setLoading(false);
      const fetchedProducts = response.data.products || [];
      setProducts(fetchedProducts);
      setFilteredProducts(fetchedProducts);
    } catch (err) {
      console.error('Fetch error:', err);
      setError('Hiba! Nem sikerült betölteni a termékeket.');
    }
  };

  // Animált konténer: jobbról csúszik be és középre áll
  const headerSpring = useSpring({
    from: { transform: 'translateX(150%)' },
    to: { transform: 'translateX(0%)' },
    config: { duration: 3200 }
  });

  // Slider beállítások, reszponzív módosítással
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
    prevArrow: <div className="slick-prev custom-arrow">&#8249;</div>,
    nextArrow: <div className="slick-next custom-arrow">&#8250;</div>,
  };

  return (
    <div className="szin" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="video-hatter">
        <Video />
        <Container className="my-4" style={{ position: 'relative', zIndex: 1 }}>
          {/* Animált header */}
          <Row className="d-flex justify-content-center animation-container">
            <Col xs={12} style={{ position: 'relative' }}>
              <animated.div style={headerSpring} className="animation-wrapper">
                <div className="car-animation">
                  <img src="/img/wrecker.png" alt="Vontatókocsi" className="car-image" />
                </div>
                <h1 className="kinalat-title">Jelenlegi kínálatunk</h1>
              </animated.div>
            </Col>
          </Row>
          {/* Termékek listázása */}
          <Row className="d-flex justify-content-between kinalat">
            <Col xs={12} sm={12} md={12} lg={3}>
              <Szuro onFilterChange={filtered => setFilteredProducts(filtered)} products={products} />
            </Col>
            <Col xs={12} sm={12} md={12} lg={9} className="card-container" style={{ margin: '0 auto' }}>
              {filteredProducts.length > 0 ? (
                <Row className="d-flex justify-content-center g-4" style={{ flexWrap: 'wrap' }}>
                  {filteredProducts.map((auto) => (
                    <Col key={auto.Rendszam} xs={12} sm={6} md={4} lg={4} style={{ padding: '0px', margin: '10px' }}>
                      <CustomCard
                        autoId={auto.Auto_ID}
                        title={`${auto.Marka} ${auto.Modell}`}
                        subtitle={`Évjárat: ${auto.Evjarat} | Ár: ${new Intl.NumberFormat('hu-HU').format(auto.Ar)} Ft`}
                        description={`Kilométeróra: ${auto.Kilometerora} | Üzemanyag: ${auto.Motortipus}`}
                        adatok={`Km.állás: ${auto.Kilometerora} | Motortípus: ${auto.Motortipus} | Motorspec.: ${auto.Motorspecifikacio} | Sebességváltó: ${auto.Sebessegvalto} | Használat: ${auto.Hasznalat} | Autó színe: ${auto.Szin}`}
                        year={`${auto.Rendszam}`}
                        elado={`${auto.Nev} | Tel.: ${auto.Telefon} | Email: ${auto.Email}`}
                        isFavorite={favorites.includes(auto.Rendszam)}
                        onFavoriteToggle={() => handleFavoriteToggle(auto.Rendszam)}
                        showFavoriteButton={isLoggedIn}
                      >
                        <Slider {...settings}>
                          {[1, 2].map((index) => (
                            <div key={index}>
                              <img
                                src={`/Img/${auto.Auto_ID}.${index}.jpg`}
                                alt={`${auto.Marka} ${auto.Modell} kép ${index}`}
                                style={{ width: '100%', height: 'auto', transition: 'transform 0.3s ease' }}
                              />
                            </div>
                          ))}
                        </Slider>
                      </CustomCard>
                    </Col>
                  ))}
                </Row>
              ) : (
                <>{loading ? <p className="text-center">Betöltés...</p> : <p className="text-center">Nincs megjeleníthető autó.</p>}</>
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
