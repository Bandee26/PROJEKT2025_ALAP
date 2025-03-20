import React, { useEffect, useState } from 'react';
import CreditCardModal from './CreditCardModal'; // Importing the CreditCardModal component

import CustomCard from './Card'; // Importing the CustomCard component
import { Col } from 'react-bootstrap'; // Importing Col from react-bootstrap
import Slider from 'react-slick'; // Importing Slider from react-slick

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
    const [selectedCars, setSelectedCars] = useState(query.get('selectedCars') ? JSON.parse(query.get('selectedCars')) : []);

    const [carDetails, setCarDetails] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState(''); // State for payment method
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
    const [creditCardDetails, setCreditCardDetails] = useState(null); // State for credit card details


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

    const handleRemoveCar = (carId) => {
        setCarDetails((prevCarDetails) => prevCarDetails.filter(car => car.Rendszam !== carId)); // Remove the car from carDetails
        setSelectedCars((prevSelectedCars) => {
            const updatedSelectedCars = prevSelectedCars.filter(id => id !== carId); // Remove the car from selectedCars
            // Update the URL with the new selectedCars
            const newQuery = `?selectedCars=${JSON.stringify(updatedSelectedCars)}`;
            window.history.replaceState(null, '', newQuery); // Update the URL without reloading
            return updatedSelectedCars;
        });
    };

    const handleBooking = async () => {
        if (!paymentMethod) {
            alert('Kérjük, válassza ki a fizetési módot.');
            return; // Exit the function if payment method is not selected
        }

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
body: JSON.stringify({ carId, userId, paymentMethod, creditCardDetails }), // Include payment method and credit card details in booking

            });
            const result = await response.json();
            if (response.ok) {
            alert(result.message); // Show success message
            // Redirect to the Kinalat page and pass car details
            window.location.href = `/kinalat?carDetails=${JSON.stringify(result.car)}`; // Redirect to the offer page with car details


            } else {
                alert(result.message); // Show error message as an alert
            }
        } catch (error) {
            console.error('Error creating booking:', error);
        }
    };

    const settings = { // Define settings for the Slider
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        prevArrow: <div className="slick-prev custom-arrow">&#8249;</div>,
        nextArrow: <div className="slick-next custom-arrow">&#8250;</div>,
    };

    // Function to format numbers with dots as thousands separators
    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Format the price
    };

return ( 
        <div className="order-background" style={{ textAlign: 'center' }}>

            <h1>Megrendelés</h1>
            {carDetails.length > 0 ? (
                <div>
                    <h2>Kiválasztott autók:</h2>
                    <div className="card-container">
                        {carDetails.map(car => (
                            <Col
                                key={car.Rendszam}
                                xs={12} sm={6} md={4} lg={4}
                                style={{ padding: '10px', maxWidth: '350px' }}
                            >
                                <CustomCard
                                    autoId={car.Auto_ID}
                                    title={`${car.Marka} ${car.Modell}`}
                                    subtitle={`Évjárat: ${car.Evjarat} | Ár: ${formatPrice(car.Ar)} Ft`} // Format price here
                                    description={`Kilométeróra: ${car.Kilometerora} | Üzemanyag: ${car.Motortipus}`}
                                    adatok={`Km.állás: ${car.Kilometerora} | Motortípus: ${car.Motortipus} | Motorspec.: ${car.Motorspecifikacio} | Sebességváltó: ${car.Sebessegvalto} | Használat: ${car.Hasznalat} | Autó színe: ${car.Szin}`}
                                    year={`${car.Rendszam}`}
                                    elado={`${car.Nev} | Tel.: ${car.Telefon} | Email: ${car.Email}`}
                                >
                                    <Slider {...settings}>
                                        <div>
                                            <img src={`/Img/${car.Auto_ID}.1.jpg`} alt={`${car.Marka} ${car.Modell} első kép`} style={{ width: '100%' }} />
                                        </div>
                                        <div>
                                            <img src={`/Img/${car.Auto_ID}.2.jpg`} alt={`${car.Marka} ${car.Modell} második kép`} style={{ width: '100%' }} />
                                        </div>
                                    </Slider>
                                </CustomCard>
                                <button onClick={() => handleRemoveCar(car.Rendszam)}>Eltávolítás</button>
                            </Col>
                        ))}
                    </div>

                    <div>
                    <h3>Fizetési lehetőségek:</h3>
                    {carDetails.length > 0 && carDetails[0].Ar && (
                        <p>A kiválasztott autó ára: {formatPrice(Math.round(carDetails[0].Ar * 0.1))} Ft</p>
                    )}

                        <label className="payment-option">
                            <input 
                                type="radio" 
                                value="Készpénz a helyszinen" 
                                name="paymentMethod" 
                                onChange={(e) => setPaymentMethod(e.target.value)} 
                            />
                            Készpénzes fizetés a helyszínen
                        </label>
                        <label className="payment-option">
                            <input 
                                type="radio" 
                                value="Bankkártya" 
                                name="paymentMethod" 
                                onChange={(e) => setPaymentMethod(e.target.value)} 
                            />
                            Bankkártyás fizetés.
                        </label>
                    </div>
                    <button onClick={() => {
                        if (paymentMethod === 'Bankkártya') {

                            setIsModalOpen(true); // Open modal for credit card details
                        } else {
                            handleBooking(); // Proceed with booking if cash payment
                        }
                    }}>Foglalás megerősítése</button>

                    <CreditCardModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        onSubmit={(details) => {
                            setCreditCardDetails(details); // Set credit card details
                            handleBooking(); // Proceed with booking
                        }} 
                    />

                </div>
            ) : (
                <p>Jelöld be a lefoglalni kívánt autót.</p>
            )}
        </div>
    );
}

export default Order;
