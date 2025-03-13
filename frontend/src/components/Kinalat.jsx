import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import Szuro from './Szuro.jsx';
import CustomCard from './Card';
import Video from './video.jsx';
import Slider from 'react-slick';
import './KepLapozas.css';

const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Format the price
}

function Kinalat({ isLoggedIn, handleFavoriteToggle, favorites }) {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true); // Ha nincs több adat, ne töltsön be újabb oldalt

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:8080/termek/${page}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        const fetchedProducts = response.data.products || [];
        
        if (fetchedProducts.length === 0) {
          setHasMore(false); // Ha nincs több termék, ne töltsön be újabb adatokat
        } else {
          setProducts((prevProducts) => [...prevProducts, ...fetchedProducts]); // Hozzáfűzés a meglévő adatokhoz
          setFilteredProducts((prevFiltered) => [...prevFiltered, ...fetchedProducts]); // Frissítés a szűrt listára is
        }

        setLoading(false);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Hiba! Nem sikerült betölteni a termékeket.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]); // Ha a page változik, új adatok betöltése

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 10
      ) {
        if (!loading && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  const handleFilterChange = (filtered) => {
    setFilteredProducts(filtered);
  };

  const isFavorite = (autoId) => {
    return favorites.includes(autoId);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <div className="slick-prev custom-arrow">&#8249;</div>,
    nextArrow: <div className="slick-next custom-arrow">&#8250;</div>,
  };

  return (
    <div className="szin" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="video-hatter">
        <Video />
        <Container className="my-4" style={{ position: 'relative', zIndex: 1 }}>
          <Row className="d-flex justify-content-between kinalat">
            <Col xs={12} sm={3} md={3} lg={2}>
              <Szuro onFilterChange={handleFilterChange} products={products} />
            </Col>

            <Col xs={12} sm={9} md={9} lg={10} className="card-container">
              {filteredProducts.length > 0 && (
                <>
                  <h1 className="text-center mb-4">Jelenlegi kínálatunk</h1>
                  <Row className="d-flex justify-content-center g-7">
                    {filteredProducts.map((auto) => (
                      <Col key={auto.Rendszam} xs={12} sm={6} md={4} lg={4} style={{ padding: '0px', maxWidth: '350px', marginLeft: '70px' }}>
                        <CustomCard
                          autoId={auto.Auto_ID}
                          title={`${auto.Marka} ${auto.Modell}`}
                          subtitle={`Évjárat: ${auto.Evjarat} | Ár: ${auto.Ar} Ft`}
                          description={`Kilométeróra: ${auto.Kilometerora} | Üzemanyag: ${auto.Motortipus}`}
                          adatok={`Km.állás: ${auto.Kilometerora} | Motortípus: ${auto.Motortipus} | Motorspec.: ${auto.Motorspecifikacio} | Sebességváltó: ${auto.Sebessegvalto} | Használat: ${auto.Hasznalat} | Autó színe: ${auto.Szin}`}
                          year={`${auto.Rendszam}`}
                          elado={`${auto.Nev} | Tel.: ${auto.Telefon} | Email: ${auto.Email}`}
                          isFavorite={isFavorite(auto.Rendszam)}
                          onFavoriteToggle={() => handleFavoriteToggle(auto.Rendszam)}
                          showFavoriteButton={isLoggedIn}
                        >
                          <Slider {...settings}>
                            {[1, 2].map((index) => (
                              <div key={index}>
                                <img
                                  src={`/Img/${auto.Auto_ID}.${index}.jpg`}
                                  alt={`${auto.Marka} ${auto.Modell} kép ${index}`}
                                  style={{
                                    width: '100%',
                                    transition: 'transform 0.3s ease',
                                    transform: hoveredImage === `${auto.Auto_ID}.${index}` ? 'scale(1.5)' : 'scale(1)',
                                  }}
                                  onMouseEnter={() => setHoveredImage(`${auto.Auto_ID}.${index}`)}
                                  onMouseLeave={() => setHoveredImage(null)}
                                />
                              </div>
                            ))}
                          </Slider>
                        </CustomCard>
                      </Col>
                    ))}
                  </Row>
                </>
              )}

              {loading && <p className="text-center">Betöltés...</p>}
              {!loading && filteredProducts.length === 0 && <p className="text-center">Nincs megjeleníthető autó.</p>}
              {error && <p className="text-danger text-center">{error}</p>}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Kinalat;
