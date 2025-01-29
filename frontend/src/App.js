import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import Footer from './components/Footer';
import filmImage from './assets/hatter.jpg';
import { Container, Row, Col } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomCard from './components/Card'; // CustomCard importálása

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/termek');
        console.log(response);  // A válasz logolása
        setProducts(response.data.products || []); // Ensure the data is always an array
      } catch (err) {
        console.error('Fetch error:', err);  // Hiba részletes naplózása
        setError('Hiba!');
      }
    };
  
    fetchProducts();
  }, []);
  

  return (
    <div style={appStyle}>
      <Menu />
      
      {/* Parallax háttér */}
      <div style={parallaxStyle}></div>
      
      <main style={mainStyle}>
        <Container className="my-4">
          <h1 className="text-center mb-4">Jelenlegi kínálatunk</h1>
          {error && <p className="text-danger text-center">{error}</p>}
          
          {/* Itt jelennek meg a kártyák */}
          <Row>
          <Row>
  {products && products.length > 0 ? (
    products.map((auto) => (
      <Col key={auto.Auto_ID} xs={12} sm={6} md={4} lg={3} className="mb-4">
        <CustomCard
          imageSrc={`http://localhost:8080/${auto.Modell}.jpg`} // Példa kép URL
          title={`${auto.Marka}  ${auto.Modell}`} // Rendszám
          subtitle={`Évjarat: ${auto.Evjarat} | Ár: ${auto.Ar} Ft`}  // Évjárat és ár
          description={`Kilométeróra: ${auto.Kilometerora} | Üzemanyag: ${auto.Motortipus}`} // Kilométeróra, sebességváltó
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

          </Row>
        </Container>
      </main>

      <Footer />
    </div>
  );
}

export default App;
