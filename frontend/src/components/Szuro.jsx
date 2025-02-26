import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import axios from 'axios';
import { Card, Form, Row, Col, Button } from 'react-bootstrap';
import carIcon from './auto.png';
import { FaArrowLeft } from 'react-icons/fa';
import './Szuro.css'; // Egyedi stílusokhoz

const Szuro = ({ onFilterChange, products }) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [modelsByBrand, setModelsByBrand] = useState({});
  const [selectedModels, setSelectedModels] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100000000]);
  const [isVisible, setIsVisible] = useState(true);
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [yearRange, setYearRange] = useState([1990, 2025]);
  const [engineTypes, setEngineTypes] = useState([]);
  const [selectedEngineType, setSelectedEngineType] = useState('');
  const [usageTypes, setUsageTypes] = useState([]);
  const [selectedUsageType, setSelectedUsageType] = useState('');
  const [transmissions, setTransmissions] = useState([]);
  const [selectedTransmission, setSelectedTransmission] = useState('');
  const [maxKm, setMaxKm] = useState(1000000); // Kilométeróra szűrő – alapból max értéken

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  // Közös thumb renderelő függvény, ami minden slider esetében ugyanazt a gombot használja
  const renderCarThumb = (props, state) => (
    <div {...props}>
      <img src={carIcon} alt="car" className="slider-car" />
    </div>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/termek');
        const fetchedProducts = response.data.products || [];
        const fetchedBrands = [...new Set(fetchedProducts.map(product => product.Marka))];
        const fetchedModelsByBrand = {};
        const fetchedColors = [...new Set(fetchedProducts.map(product => product.Szin))];
        const fetchedEngineTypes = [...new Set(fetchedProducts.map(product => product.Motortipus))];
        const fetchedUsageTypes = [...new Set(fetchedProducts.map(product => product.Hasznalat))];
        const fetchedTransmissions = [...new Set(fetchedProducts.map(product => product.Sebessegvalto))];

        fetchedProducts.forEach(product => {
          if (!fetchedModelsByBrand[product.Marka]) {
            fetchedModelsByBrand[product.Marka] = new Set();
          }
          fetchedModelsByBrand[product.Marka].add(product.Modell);
        });

        setBrands(fetchedBrands);
        setModelsByBrand(Object.fromEntries(
          Object.entries(fetchedModelsByBrand).map(([brand, models]) => [brand, [...models]])
        ));
        setColors(fetchedColors);
        setEngineTypes(fetchedEngineTypes);
        setUsageTypes(fetchedUsageTypes);
        setTransmissions(fetchedTransmissions);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      (selectedBrands.length === 0 || selectedBrands.includes(product.Marka)) &&
      (selectedModels.length === 0 || selectedModels.includes(product.Modell)) &&
      (selectedColor === '' || product.Szin === selectedColor) &&
      Number(product.Ar) >= priceRange[0] &&
      Number(product.Ar) <= priceRange[1] &&
      (selectedEngineType === '' || product.Motortipus === selectedEngineType) &&
      (selectedUsageType === '' || product.Hasznalat === selectedUsageType) &&
      (selectedTransmission === '' || product.Sebessegvalto === selectedTransmission) &&
      Number(product.Evjarat) >= yearRange[0] &&
      Number(product.Evjarat) <= yearRange[1] &&
      Number(product.Kilometerora) <= maxKm
    );

    if (onFilterChange) {
      onFilterChange(filtered);
    }
  }, [
    selectedBrands,
    selectedModels,
    selectedColor,
    priceRange,
    selectedEngineType,
    selectedUsageType,
    selectedTransmission,
    yearRange,
    maxKm,
    products
  ]);

  const handleBrandChange = (event) => {
    const brand = event.target.value;
    setSelectedBrands(prevSelected =>
      prevSelected.includes(brand) ? prevSelected.filter(b => b !== brand) : [...prevSelected, brand]
    );
  };

  const handleModelChange = (event) => {
    const model = event.target.value;
    setSelectedModels(prevSelected =>
      prevSelected.includes(model) ? prevSelected.filter(m => m !== model) : [...prevSelected, model]
    );
  };

  return (
    <div className={`filter-container ${isVisible ? '' : 'collapsed'}`}>
      <Button 
        className="toggle-button" 
        onClick={toggleVisibility}
        variant="secondary"
      >
        <FaArrowLeft className={isVisible ? 'arrow-visible' : 'arrow-hidden'} />
      </Button>

      <Card className="szuro-container">
        <Card.Title className="text-center text-light">Szűrő</Card.Title>

        {/* Márkák és modellek checkboxok */}
        <Form.Group className="mb-3">
          <Form.Label className="text-light"><strong>Válassz márkát és modellt:</strong></Form.Label>
          {brands.length > 0 ? (
            brands.map((brand) => (
              <div key={brand}>
                <Form.Check
                  type="checkbox"
                  label={brand}
                  value={brand}
                  onChange={handleBrandChange}
                  checked={selectedBrands.includes(brand)}
                  className="text-light"
                />
                <div className="ms-3">
                  {modelsByBrand[brand]?.map((model) => (
                    <Form.Check
                      key={model}
                      type="checkbox"
                      label={model}
                      value={model}
                      onChange={handleModelChange}
                      checked={selectedModels.includes(model)}
                      className="text-light ms-4"
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted">Márkák és modellek betöltése...</p>
          )}
        </Form.Group>

        {/* Csúszkás szűrők egymás alatt */}

        {/* Évjárat csúszka */}
        <Form.Group className="mb-3">
          <Form.Label className="text-light"><strong>Évjárat:</strong></Form.Label>
          <ReactSlider
            min={1990}
            max={2025}
            step={1}
            value={yearRange}
            onChange={setYearRange}
            pearling
            minDistance={1}
            className="custom-slider"
            thumbClassName="custom-thumb"
            trackClassName="slider-track"
            renderThumb={renderCarThumb}
          />
          <Row className="mt-2">
            <Col><small className="text-light">Min: {yearRange[0]}</small></Col>
            <Col className="text-end"><small className="text-light">Max: {yearRange[1]}</small></Col>
          </Row>
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
            thumbClassName="custom-thumb"
            trackClassName="slider-track"
            renderThumb={renderCarThumb}
          />
          <Row className="mt-2">
            <Col><small className="text-light">{priceRange[0]} Ft</small></Col>
            <Col className="text-end"><small className="text-light">{priceRange[1]} Ft</small></Col>
          </Row>
        </Form.Group>

        {/* Kilométeróra csúszka */}
        <Form.Group className="mb-3">
          <Form.Label className="text-light"><strong>Max futott km:</strong></Form.Label>
          <ReactSlider
            min={0}
            max={1000000}
            step={1000}
            value={maxKm}
            onChange={setMaxKm}
            className="custom-slider"
            thumbClassName="custom-thumb"
            trackClassName="slider-track"
            renderThumb={renderCarThumb}
          />
          <Row className="mt-2">
            <Col><small className="text-light">0 km</small></Col>
            <Col className="text-end"><small className="text-light">{maxKm} km</small></Col>
          </Row>
        </Form.Group>

        {/* Egyéb szűrők */}
        <Form.Group className="mb-3">
          <Form.Label className="text-light"><strong>Szín:</strong></Form.Label>
          <Form.Select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
            <option value="">Mindegy</option>
            {colors.map(color => <option key={color} value={color}>{color}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-light"><strong>Motortípus:</strong></Form.Label>
          <Form.Select value={selectedEngineType} onChange={(e) => setSelectedEngineType(e.target.value)}>
            <option value="">Mindegy</option>
            {engineTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-light"><strong>Használat:</strong></Form.Label>
          <Form.Select value={selectedUsageType} onChange={(e) => setSelectedUsageType(e.target.value)}>
            <option value="">Mindegy</option>
            {usageTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="text-light"><strong>Sebességváltó:</strong></Form.Label>
          <Form.Select value={selectedTransmission} onChange={(e) => setSelectedTransmission(e.target.value)}>
            <option value="">Mindegy</option>
            {transmissions.map(trans => <option key={trans} value={trans}>{trans}</option>)}
          </Form.Select>
        </Form.Group>
      </Card>
    </div>
  );
};

export default Szuro;
