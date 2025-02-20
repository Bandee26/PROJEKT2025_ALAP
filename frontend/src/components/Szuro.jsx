import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import axios from 'axios';
import { Card, Form, Row, Col } from 'react-bootstrap';
import carIcon from './auto.png';
import './Szuro.css'; // Egyedi stílusokhoz


const Szuro = ({ onFilterChange, products }) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000000]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/termek');
        const fetchedProducts = response.data.products || [];
        const fetchedBrands = [...new Set(fetchedProducts.map(product => product.Marka))];

        setBrands(fetchedBrands);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      (selectedBrands.length === 0 || selectedBrands.includes(product.Marka)) &&
      Number(product.Ar) >= priceRange[0] &&
      Number(product.Ar) <= priceRange[1]
    );

    if (onFilterChange) {
      onFilterChange(filtered);
    }
  }, [selectedBrands, priceRange, products]);

  const handleBrandChange = (event) => {
    const brand = event.target.value;
    setSelectedBrands(prevSelected =>
      prevSelected.includes(brand) ? prevSelected.filter(b => b !== brand) : [...prevSelected, brand]
    );
  };

  return (
    <Card className="szuro-container">
        <Card.Title className="text-center text-light">Szűrő</Card.Title>

        {/* Márkák checkboxok */}
        <Form.Group className="mb-3">
          <Form.Label className="text-light"><strong>Válassz márkát:</strong></Form.Label>
          {brands.length > 0 ? (
            brands.map((brand) => (
              <Form.Check
                key={brand}
                type="checkbox"
                label={brand}
                value={brand}
                onChange={handleBrandChange}
                checked={selectedBrands.includes(brand)}
                className="text-light"
              />
            ))
          ) : (
            <p className="text-muted">Márkák betöltése...</p>
          )}
        </Form.Group>

        {/* Ár csúszka */}
        <Form.Group className="mb-3">
          <Form.Label className="text-light"><strong>Ár szűrő:</strong></Form.Label>
          <ReactSlider
            min={0}
            max={100000000}
            step={100}
            value={priceRange}
            onChange={setPriceRange}
            className="custom-slider"
            renderThumb={(props, state) => (
              <div {...props}>
                <img src={carIcon} alt="car" className="slider-car" />
              </div>
            )}
            trackClassName="slider-track"
          />

          <Row className="mt-2">
            <Col><small className="text-light">{priceRange[0]} Ft</small></Col>
            <Col className="text-end"><small className="text-light">{priceRange[1]} Ft</small></Col>
          </Row>

        </Form.Group>
    </Card>
  );
};

export default Szuro;
