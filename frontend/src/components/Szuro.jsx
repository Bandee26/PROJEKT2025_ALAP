import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';

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
  }, []);  // This only runs once when the component mounts

  // Handling brand and price filter changes
  useEffect(() => {
    const filtered = products.filter(product =>
      (selectedBrands.length === 0 || selectedBrands.includes(product.Marka)) &&
      Number(product.Ar) >= priceRange[0] && Number(product.Ar) <= priceRange[1]
    );

    // Call onFilterChange after filtering the products
    if (onFilterChange) {
      onFilterChange(filtered);
    }
  }, [selectedBrands, priceRange, products]);  // Dependency array ensures this runs only when necessary

  const handleBrandChange = (event) => {
    const brand = event.target.value;
    setSelectedBrands(prevSelected => {
      if (prevSelected.includes(brand)) {
        return prevSelected.filter(b => b !== brand);
      } else {
        return [...prevSelected, brand];
      }
    });
  };

  return (
    <div className="filter-container" style={{
      position: 'fixed',  // A bal oldalra rögzítjük
      top: '10px',
      left: '10px',
      maxWidth: '300px',  // A szűrő szélessége nem nyúlik túl
      marginTop: '80px',
      width: 'auto',  // Az elem szélessége igazodik a tartalomhoz
      maxHeight: 'calc(100vh - 20px)',  // Az elem magassága ne nyújjon túl
      overflowY: 'auto',  // Ha túl magas, görgethető legyen
      backgroundColor: '#fff',
      padding: '20px',
      boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
      borderRadius: '8px'
    }}>
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
