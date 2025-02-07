import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';  // importáljuk a ReactSlider-t
import axios from 'axios';

const FilterComponent = () => {
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([1000, 4000]); // előre beállított ár
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        // Márkák lekérése a backendről
        const fetchBrands = async () => {
            // Példa márkák lekérése a backendről, amit cserélhetsz saját API hívásra
            const fetchedBrands = ['Toyota', 'BMW', 'Audi'];
            setBrands(fetchedBrands);
        };

        fetchBrands();

        // Termékek lekérése Axios segítségével
        axios.get('http://localhost:8080/termek')
            .then(response => {
                setProducts(response.data.products);
            })
            .catch(error => {
                console.error('Hiba történt:', error);
            });

    }, []);  // üres függőségi tömb, hogy csak egyszer fusson

    useEffect(() => {
        // Szűrés a kiválasztott márkák és az ár intervallum alapján
        const filtered = products.filter(product =>
            (selectedBrands.length === 0 || selectedBrands.includes(product.brand)) &&
            product.price >= priceRange[0] && product.price <= priceRange[1]
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

    return (
        <div className="filter-container">
            <div className="checkbox-group">
    <h3>Válassz márkát:</h3>
    {products.map((product) => (
        <label key={product.Rendszam}>
            <input
                type="checkbox"
                value={product.Marka}
                onChange={handleBrandChange}
                checked={selectedBrands.includes(product.Marka)}
            />
            {product.Marka}
        </label>
    ))}

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

            <div className="filtered-products">
                <h3>Szűrt termékek:</h3>
                {filteredProducts.length > 0 ? (
                    <ul>
                        {filteredProducts.map((product) => (
                            <li key={product.Rendszam}>{product.Marka} - {product.Ar} Ft</li>
                        ))}
                    </ul>
                ) : (
                    <p>Nincs találat</p>
                )}
            </div>
        </div>
    );
};

export default FilterComponent;
