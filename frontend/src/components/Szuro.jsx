import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import axios from 'axios';
import CustomCard from './Card';  // Importáljuk a CustomCard komponenst
import { Row, Col } from 'react-bootstrap';  // Importáljuk a Bootstrap Row és Col komponenst

const FilterComponent = () => {
  const [brands, setBrands] = useState([]);  // Márkák
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState([1000, 4000]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await axios.get('http://localhost:8080/termek');
        setBrands(response.data.brands || []);  // Ha nem érkezik adat, egy üres tömböt adunk
      } catch (error) {
        console.error('Márkák lekérése sikertelen:', error);
      }
    };

    fetchBrands();

    axios.get('http://localhost:8080/termek')
      .then(response => {
        console.log(response.data);
        setProducts(response.data.products || []);  // Ha nem érkezik adat, egy üres tömböt adunk
        setBrands([...new Set(response.data.products?.map(product => product.Marka)) || []]); // Ha nincs adat, üres tömb
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
    
    setFilteredProducts(filtered);
  }, [selectedBrands, priceRange, products]);

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

  const handleFavoriteToggle = (productId) => {
    if (favorites.includes(productId)) {
      setFavorites(favorites.filter(id => id !== productId));
    } else {
      setFavorites([...favorites, productId]);
    }
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
          max={50000000}
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

      <div className="filtered-products text-center ">
        <h3>Szűrt termékek:</h3>
        {filteredProducts.length > 0 ? (
          <Row>
            {filteredProducts.map((product) => (
              <Col key={product.Rendszam} xs={12} sm={6} md={4} lg={2} className="mb-5">
                <CustomCard
                  imageSrc={`http://localhost:8080/${product.Modell}.jpg`} // Példa kép URL
                  title={`${product.Marka}  ${product.Modell}`} // Márka és modell
                  subtitle={`Évjárat: ${product.Evjarat} | Ár: ${product.Ar} Ft`}  // Évjárat és ár
                  description={`Kilométeróra: ${product.Kilometerora} | Üzemanyag: ${product.Motortipus}`} // Kilométeróra és üzemanyag típus
                  adatok={`Km.állás: ${product.Kilometerora} | Motortípus: ${product.Motortipus} | Motorspec.: ${product.Motorspecifikacio} | Sebességváltó: ${product.Sebessegvalto} | Használat típusa: ${product.Hasznalat} | Autó színe: ${product.Szin}`}
                  year={`${product.Rendszam}`} // Rendszám
                  elado={`${product.Nev} | Tel.: ${product.Telefon} | Email: ${product.Email}`} // Eladó információ
                  isFavorite={favorites.includes(product.Rendszam)} // Kedvencek állapot
                  onFavoriteToggle={() => handleFavoriteToggle(product.Rendszam)} // Kedvencek gomb kezelése
                />
              </Col>
            ))}
          </Row>
        ) : (
          <p>Nincs találat</p>
        )}
      </div>

      
    </div>
  );
};

export default FilterComponent;
