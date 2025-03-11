import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

function Order() {
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const selectedCars = query.get('selectedCars') ? JSON.parse(query.get('selectedCars')) : [];
    
    const [carDetails, setCarDetails] = useState([]);

    useEffect(() => {
        const fetchCarDetails = async () => {
            if (selectedCars.length > 0) {
                try {
                    const response = await fetch(`http://localhost:8080/cars?ids=${selectedCars.join(',')}`);
                    const data = await response.json();
                    setCarDetails(data.cars); // Assuming the response contains a 'cars' array
                } catch (error) {
                    console.error('Error fetching car details:', error);
                }
            }
        };

        fetchCarDetails();
    }, []); // Changed to empty dependency array


    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Megrendelés</h1>
            <p>Köszönjük a rendelését! Az Ön rendelése feldolgozás alatt áll.</p>
            <p>Hamarosan felvesszük Önnel a kapcsolatot a részletekkel.</p>
            {carDetails.length > 0 ? (
                <div>
                    <h2>Kiválasztott autók:</h2>
                    <ul>
                        {carDetails.map(car => (
                            <li key={car.Rendszam}>
                                {`${car.Marka} ${car.Modell} (${car.Evjarat}) - ${car.Szin} - ${car.Kilometerora} km - ${car.Motortipus} - ${car.Ar} Ft`}
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Jelöld be a lefoglalni kívánt autót.</p>
            )}
        </div>
    );
}

export default Order;
