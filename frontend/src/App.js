import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import Footer from './components/Footer';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomCard from './components/Card'; // CustomCard importálása
import Szuro from './components/Szuro.jsx'
import Video from './components/video.jsx';
import ImageSlider from './components/ImageSlider.jsx';



function App() {
  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // A teljes képernyő magasságának beállítása
  };

  const mainStyle = {
    position: 'relative', // A tartalom és háttér együttműködéséhez
  };

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

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

  return (
    <div className='szin'  tyle={appStyle}>
      
      <Menu />

      <div className="video-hatter">
      <Video />



        {/* Tartalom a videó előtt */}
        <Szuro />
        <main style={mainStyle}>
          <Container className="my-4">
            <h1 className="text-center mb-4">Jelenlegi kínálatunk</h1>
            {error && <p className="text-danger text-center">{error}</p>}

            {/* Kártyák */}
            
            <div className='card-container'>
            <Row>
              {products && products.length > 0 ? (
                products.map((auto) => (
                  <Col key={auto.Rendszam} xs={12} sm={6} md={4} lg={3} className="mb-4">
                    <CustomCard
                      imageSrc={`http://localhost:8080/${auto.Modell}.jpg`}
                      title={`${auto.Marka}  ${auto.Modell}`}
                      subtitle={`Évjarat: ${auto.Evjarat} | Ár: ${auto.Ar} Ft`}
                      description={`Kilométeróra: ${auto.Kilometerora} | Üzemanyag: ${auto.Motortipus}`}
                      adatok={`Km.állás: ${auto.Kilometerora} | Motortipusa: ${auto.Motortipus} | Motorspec.: ${auto.Motorspecifikacio} | Sebességváltó: ${auto.Sebessegvalto} | Használat tipusa: ${auto.Hasznalat} | Autó szine: ${auto.Szin}`}
                      year={`${auto.Rendszam}`}
                      elado={`${auto.Nev} | Tel.: ${auto.Telefon} | Email: ${auto.Email}`}
                    />
                  </Col>
                ))
              ) : (
                <p className="text-center">Nincs megjeleníthető autó.</p>
              )}
            </Row>
            </div>

          </Container>
        </main>
      </div>



      <Footer />
    </div>
  );
}

export default App;
