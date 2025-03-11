import React, { useEffect, useState } from 'react';
import CustomCard from './Card'; // Importing the CustomCard component
import './order.css'; // Importing the CSS file for Order component styles
import { useLocation } from 'react-router-dom';

function Order() { // Remove userId prop
    const token = localStorage.getItem('token'); // Get token from local storage
    let userId = null; // Initialize userId
    let email = null; // Initialize email

    if (token) {
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode the JWT token
        if (decodedToken && decodedToken.id) {
            userId = decodedToken.id; // Extract id from the token
            email = decodedToken.email; // Extract email from the token if available
        } else {
            console.error('Failed to fetch user ID.'); // Log error if id is not found
        }
    }

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

    useEffect(() => {
        if (!token) {
            alert('Kérjük, jelentkezzen be a foglaláshoz.');
            return; // Exit the function if user is not logged in
        }
    }, []); // Dependency array to run only on mount

    const handleBooking = async () => {
        const carId = selectedCars.join(','); // Assuming you want to book all selected cars
        if (!userId) {
            alert('Kérjük, jelentkezzen be a foglaláshoz.');
            return; // Exit the function if user is not logged in
        }

        try {
            const response = await fetch('http://localhost:8080/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ carId, userId }), // Use userId for booking

            });
            const result = await response.json();
            if (response.ok) {
                alert(result.message); // Show success message
            } else {
            alert(result.message); // Show error message as an alert

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
