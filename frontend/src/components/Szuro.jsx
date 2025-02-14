import React, { useState, useEffect } from 'react';
import ReactSlider from 'react-slider';
import axios from 'axios';
import CustomCard from './Card';  // CustomCard importálása

const FilterComponent = () => {
    const [brands, setBrands] = useState([]);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState([1000, 4000]);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/termek');
                setProducts(response.data.products);
                setBrands([...new Set(response.data.products.map(product => product.Marka))]);
            } catch (error) {
                console.error('Hiba történt:', error);
            }
        };

        fetchData();
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

    return (
        <div className="container-fluid">
            <div className="row">
                {/* Szűrő oldalsáv */}
                <div className="col-md-3" style={{ maxWidth: '300px', marginTop: '30px' }}>
                    <div className="card mb-4">
                        <div className="card-body" style={{ position: 'relative', padding: '30px' }}>
                            <h5 className="card-title">Szűrők</h5>

                            {/* Márka szűrő */}
                            <div className="mb-3">
                                <h6>Válassz márkát:</h6>
                                {brands.length > 0 ? (
                                    brands.map((brand) => (
                                        <div key={brand} className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={brand}
                                                onChange={handleBrandChange}
                                                checked={selectedBrands.includes(brand)}
                                                id={`brand-${brand}`}
                                            />
                                            <label className="form-check-label" htmlFor={`brand-${brand}`}>
                                                {brand}
                                            </label>
                                        </div>
                                    ))
                                ) : (
                                    <p>Loading brands...</p>
                                )}
                            </div>

                            {/* Ár szűrő */}
                            <div className="mb-3">
                                <h6>Ár szűrő:</h6>
                                <div className="d-flex justify-content-between">
                                    <span>Min: {priceRange[0]} Ft</span>
                                    <span>Max: {priceRange[1]} Ft</span>
                                </div>
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
                                                    height: '6px',
                                                    borderRadius: '5px',
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
                                                    borderRadius: '50%',
                                                    border: '2px solid #fff',
                                                }}
                                            />
                                        );
                                    }}
                                    style={{
                                        position: 'relative',
                                        width: '100%',
                                        marginTop: '10px',
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterComponent;
