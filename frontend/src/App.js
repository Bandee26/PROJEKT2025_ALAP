import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import Footer from './components/Footer';
import filmImage from './assets/hatter.jpg';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomCard from './components/Card'; // CustomCard importálása
import Szuro from './components/Szuro.jsx'
import Video from './components/video.jsx';

function App() {
  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // A teljes képernyő magasságának beállítása
  };

  const mainStyle = {
    position: 'relative', // A tartalom és háttér együttműködéséhez
  };

  const parallaxStyle = {
    backgroundImage: `url(${filmImage})`,
    backgroundSize: 'cover', // A kép teljesen kitölti a rendelkezésre álló teret, a képarány megtartásával.
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed', // Parallax effektus
    height: '400px', // A parallax szekció magassága
    width: '100%',
  };

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [favorites, setFavorites] = useState([]); // Kedvencek állapota

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/termek');
        console.log(response);  // A válasz logolása
        setProducts(response.data.products || []); // Ensure the data is always an array
      } catch (err) {
        console.error('Fetch error:', err);  // Hiba részletes naplózása
        setError('Hiba! Nem sikerült betölteni a termékeket.');
      }
    };

    fetchProducts();
  }, []);

  // Kedvencek kezelése
  const handleFavoriteToggle = (autoId) => {
    if (favorites.includes(autoId)) {
      setFavorites(favorites.filter(id => id !== autoId)); // Eltávolítás a kedvencek közül
    } else {
      setFavorites([...favorites, autoId]); // Hozzáadás a kedvencekhez
    }
  };

  return (
    <div className='szin'  tyle={appStyle}>
      
      <Menu />
      {/* Parallax háttér */}
      <div style={parallaxStyle}></div>

      <main>
        <Container className="my-4">
          <Row>
            {/* Szűrő a bal oldalon, most már teljesen a bal szélén */}
            <Col
              xs={12} 
              sm={4} 
              md={3} 
              className="mb-4"
              style={{
                padding: '10px',    // Padding a szűrő komponenshez
                backgroundColor: '#fff', // Háttér szín
                boxShadow: '2px 0 5px rgba(0, 0, 0, 0.1)', // Árnyék
                height: 'auto',      // Ne legyen fix magasság
                position: 'absolute', // A szűrő a bal oldalon fixálva
                top: 0,              // Felülről kezdődjön
                left: 0,             // Bal oldalra igazítva
                width: '250px',      // A szűrő szélessége most 200px
                zIndex: 999,         // További tartalom fölött legyen
                marginTop: '467px',  // A szűrő pozicionálása a képernyőn
              }}
            >
              <Szuro onFilterChange={handleFilterChange} products={products} />
            </Col>

            {/* Termékek a jobb oldalon */}
            <Col xs={12} sm={8} md={11} className="mb-5" style={{ marginLeft: 'auto' }}> {/* 220px margó a szűrő mellett */}
              {/* "Jelenlegi kínálatunk" csak akkor jelenik meg, ha van találat */}
              {filteredProducts.length > 0 && (
                <>
                  <h1 className="text-center mb-4">Jelenlegi Kínálatunk</h1>
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
            </Row>
          </Container>
        </main>
      </div>



      <Footer />
    </div>
  );
}

export default App;
