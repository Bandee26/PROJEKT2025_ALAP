import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Menu from './components/Menu';
import Footer from './components/Footer';
import filmImage from './assets/film.jpg';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh', // A teljes képernyő magasságának beállítása
  };
  const mainStyle = {
    backgroundImage: `url(${filmImage})`,
    backgroundSize: 'cover', // A kép teljesen kitölti a rendelkezésre álló teret, a képarány megtartásával.
    backgroundPosition: 'center', // A kép középre igazítva jelenik meg.
    backgroundRepeat: 'no-repeat', // A kép nem ismétlődik.
    flex: '1', // A fő tartalom kitölti a fennmaradó helyet
    padding: '20px',
  };

  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/');
        setProducts(response.data.products || []); // Ensure the data is always an array
      } catch (err) {
        setError('Hiba!');
      }
    };

    fetchProducts();
  }, []);

  return (
    <div style={appStyle}>
      <Menu />
      <main style={mainStyle}>
        <h1 style={{ color: 'Black', textAlign: 'center' }}>

        </h1>

        
      </main>
      
      <Container className="my-4">
        <h1 className="text-center mb-4">Jelenlegi kínálatunk</h1>
        {error && <p className="text-danger text-center">{error}</p>}
        <Row>
          {products && products.length > 0 ? (
            products.map((car) => (
              <Col key={car["Azonosító"]} xs={12} sm={6} md={4} lg={3} className="mb-4">
                <Card>
                  <Card.Body>
                    <Card.Title>{car["10"]}</Card.Title> {/* Rendszám */}
                    <Card.Subtitle className="mb-2 text-muted">
                      Márka ID: {car["Márka ID"]}
                    </Card.Subtitle>
                    <Card.Text>
                      <strong>Évjárat:</strong> {car["Évjárat"]}
                    </Card.Text>
                    <Card.Text>
                      <strong>Kilométeróra állás:</strong> {car["Kilométeróra állás"]}
                    </Card.Text>
                    <Card.Text>
                      <strong>Ár:</strong> {car["Ár"]} Ft
                    </Card.Text>
                    <Button variant="primary">Kosárba</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p className="text-center">Nincs megjeleníthető autó.</p>
          )}
        </Row>
      </Container>

      <Footer />
    </div>
  );
}

export default App;
