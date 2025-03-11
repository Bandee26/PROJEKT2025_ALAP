import React, { useEffect, useState } from 'react';
import CustomCard from './Card'; // Importing the CustomCard component
import './order.css'; // Importing the CSS file for Order component styles
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

    const handleBooking = async () => {
        const userId = 1; // Placeholder for user ID, replace with actual logic if needed
        const carId = selectedCars.join(','); // Assuming you want to book all selected cars
        try {
            const response = await fetch('http://localhost:8080/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carId, userId }),
            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message); // Show success message
            } else {
                alert('Error: ' + result.message); // Show error message
            }
        } catch (error) {
            console.error('Error creating booking:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <h1>Megrendelés</h1>
            {carDetails.length > 0 ? (
                <div>
                    <h2>Kiválasztott autók:</h2>
                    <div className="card-container">
                        {carDetails.map(car => (
                            <CustomCard
                                key={car.Rendszam}
                                imageSrc={`http://localhost:8080/${car.Modell}.jpg`} // Assuming image URL format
                                title={`${car.Marka} ${car.Modell}`}
                                subtitle={`Évjárat: ${car.Evjarat} | Ár: ${car.Ar} Ft`}
                                description={`Kilométeróra: ${car.Kilometerora} | Üzemanyag: ${car.Motortipus}`}
                                adatok={`Km.állás: ${car.Kilometerora} | Motortípus: ${car.Motortipus} | Motorspec.: ${car.Motorspecifikacio} | Sebességváltó: ${car.Sebessegvalto} | Használat: ${car.Hasznalat} | Autó színe: ${car.Szin}`}
                                year={`${car.Rendszam}`}
                                elado={`${car.Nev} | Tel.: ${car.Telefon} | Email: ${car.Email}`}
                            />
                        ))}
                    </div>
                    <button onClick={handleBooking}>Foglalás megerősítése</button>
                </div>
            ) : (
                <p>Jelöld be a lefoglalni kívánt autót.</p>
            )}
        </div>
    );
}

export default Order;
