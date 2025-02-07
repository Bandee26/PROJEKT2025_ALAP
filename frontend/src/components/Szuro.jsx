import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';

const Szuro = ({ onFilterChange, products }) => {
  const [brands, setBrands] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([1000, 100000000]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://localhost:8080/termek');
        setBrands(response.data.brands || []);
      } catch (error) {
        console.error('Márkák lekérése sikertelen:', error);
      }
    };

    fetchBrands();

    axios.get('http://localhost:8080/termek')
      .then(response => {
        console.log(response.data);
        setBrands([...new Set(response.data.products?.map(product => product.Marka)) || []]);
      })
      .catch(error => {
        console.error('Hiba történt:', error);
      });

  }, []);

  useEffect(() => {
    const filtered = products.filter(product =>
      (selectedBrands.length === 0 || selectedBrands.includes(product.Marka)) &&
      Number(product.Ar) >= priceRange[0] && Number(product.Ar) <= priceRange[1]
    );
    
    onFilterChange(filtered); // Szűrt termékek továbbítása az App komponensnek
  }, [selectedBrands, priceRange, products, onFilterChange]);

  const handleBrandChange = (event) => {
    const brand = event.target.value;
    setSelectedBrands((prevSelected) => {
      if (prevSelected.includes(brand)) {
        return prevSelected.filter(b => b !== brand);
      } else {
        return [...prevSelected, brand];
      }
    });
  };

  return (
    <div className="filter-container">
      <div className="checkbox-group">
        <h3>Válassz márkát:</h3>
        {brands && brands.length > 0 ? (
          brands.map((brand) => (
            <label key={brand}>
              <input
                type="checkbox"
                value={brand}
                onChange={handleBrandChange}
                checked={selectedBrands.includes(brand)}
              />
              {brand}
            </label>
          ))
        ) : (
          <p>Loading brands...</p>
        )}
      </div>

      <div className="slider-container">
        <h3>Ár szűrő:</h3>
        <ReactSlider
          min={0}
          max={100000000}
          step={100}
          value={priceRange}
          onChange={setPriceRange}
          renderTrack={(props, state) => (
            <div {...props} style={{ ...props.style, backgroundColor: '#ddd', height: '6px' }} />
          )}
          renderThumb={(props, state) => (
            <div {...props} style={{ ...props.style, backgroundColor: '#007BFF', width: '20px', height: '20px', borderRadius: '50%' }} />
          )}
        />
        <div>
          <span>Min: {priceRange[0]} Ft</span>
          <span style={{ marginLeft: '10px' }}>Max: {priceRange[1]} Ft</span>
        </div>
      </div>
    </div>
  );
};

export default Szuro;