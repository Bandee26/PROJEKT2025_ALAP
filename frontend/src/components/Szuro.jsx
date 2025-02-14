import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';  // importáljuk a ReactSlider-t
import axios from 'axios';

const FilterComponent = () => {
    const [brands, setBrands] = useState([]);  // A márkák tárolása
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([1000, 4000]);  // Előre beállított ár
    const [products, setProducts] = useState([]);  // Termékek tárolása
    const [filteredProducts, setFilteredProducts] = useState([]);  // Szűrt termékek tárolása

    useEffect(() => {
        // Márkák és termékek lekérése a backendről
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/termek');
                setProducts(response.data.products);
                // Márkák generálása a termékekből
                setBrands([...new Set(response.data.products.map(product => product.Marka))]);
            } catch (error) {
                console.error('Hiba történt:', error);
            }
        };

        fetchData();
    }, []);  // üres függőségi tömb, hogy csak egyszer fusson

    useEffect(() => {
        // Szűrés a kiválasztott márkák és az ár intervallum alapján
        const filtered = products.filter(product =>
            (selectedBrands.length === 0 || selectedBrands.includes(product.Marka)) &&
            Number(product.Ar) >= priceRange[0] && Number(product.Ar) <= priceRange[1]  // Biztosítsuk, hogy az ár szám
        );
        
        setFilteredProducts(filtered);
    }, [selectedBrands, priceRange, products]);

    const handleBrandChange = (event) => {
        const brand = event.target.value;
        setSelectedBrands((prevSelected) => {
            if (prevSelected.includes(brand)) {
                return prevSelected.filter(b => b !== brand);  // Márka eltávolítása, ha már ki van választva
            } else {
                return [...prevSelected, brand];  // Márka hozzáadása, ha nincs kiválasztva
            }
        });
    };

    return (
        <div className="filter-container">
            <div className="checkbox-group">
                <h3>Válassz márkát:</h3>
                {brands.length > 0 ? (  // Ellenőrizzük, hogy a 'brands' tömb nem üres
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
                    <p>Loading brands...</p>  // Ha még nincsenek márkák, mutassunk egy töltődő üzenetet
                )}
            </div>

            <div>
                <h3>Ár szűrő:</h3>
                <ReactSlider
                    min={0}
                    max={50000000}
                    step={100}
                    value={priceRange}
                    onChange={setPriceRange}
                    renderTrack={(props, state) => {
                        const { key, ...restProps } = props;
                        return (
                            <div
                                key={key}
                                {...restProps}
                                style={{ 
                                    ...restProps.style, 
                                    backgroundColor: '#ddd', 
                                    height: '6px' 
                                }}
                            />
                        );
                    }}
                    renderThumb={(props, state) => {
                        const { key, ...restProps } = props;
                        return (
                            <div
                                key={key}
                                {...restProps}
                                style={{ 
                                    ...restProps.style, 
                                    backgroundColor: '#007BFF', 
                                    width: '20px', 
                                    height: '20px', 
                                    borderRadius: '50%' 
                                }}
                            />
                        );
                    }}
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
                            <li key={product.Rendszam}>{product.Marka} {product.Modell} - {product.Ar} Ft</li>
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
