import React, { useState, useEffect } from 'react';
import Nagyitottkep from './nagyitottkep'; // Import the modal component
import './Reservations.css'; // Import the new CSS file

function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [carDetails, setCarDetails] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [selectedImage, setSelectedImage] = useState(''); // State to hold the selected image source

    useEffect(() => {
        const fetchReservations = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:8080/reservations', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    const result = await response.json();
                    if (result.success) {
                        setReservations(result.reservations);
                        // Fetch car details based on the car IDs from reservations
                        const carIds = result.reservations.map(reservation => reservation.car_id);
                        const carResponse = await fetch(`http://localhost:8080/cars?ids=${carIds.join(',')}`);
                        const carResult = await carResponse.json();
                        if (carResult.cars) {
                            setCarDetails(carResult.cars);
                        }
                    } else {
                        alert('Hiba történt a foglalások lekérése során');
                    }
                } catch (error) {
                    alert('Hálózati hiba történt a foglalások lekérése során');
                } finally {
                    setLoading(false);
                }
            } else {
                alert('Kérjük, jelentkezzen be a foglalások megtekintéséhez.');
                setLoading(false);
            }
        };

        fetchReservations();
    }, []);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Foglalások</h1>

            {loading ? (
                <p>Töltés...</p>
            ) : (
                <ul style={{ listStyleType: 'none', padding: 0 }}>

                    <div className="reservation-container">
                        {reservations.length > 0 ? (

                        reservations.map((reservation) => {
                            const car = carDetails.find(car => car.Rendszam === reservation.car_id);
                            return (
                                <li key={reservation.id} className="reservation-item">
                                    {car && (
                                        <div className="car-images">
                                            <img 
                                                src={`/Img/${car.Auto_ID}.1.jpg`} 
                                                alt={car.Rendszam} 
                                                className="car-image" 
                                                onClick={() => { 
                                                    setSelectedImage(`/Img/${car.Auto_ID}.1.jpg`); 
                                                    setIsModalOpen(true); 
                                                }} 
                                            />
                                            <img 
                                                src={`/Img/${car.Auto_ID}.2.jpg`} 
                                                alt={`${car.Rendszam} Second View`} 
                                                className="car-image" 
                                                onClick={() => { 
                                                    setSelectedImage(`/Img/${car.Auto_ID}.2.jpg`); 
                                                    setIsModalOpen(true); 
                                                }} 
                                            />
                                        </div>
                                    )}
                                    <div className="reservation-details">
                                        <p>A lefoglalt autó rendszáma: <strong>{reservation.car_id}</strong></p>
                                        <p>Foglalás dátuma: <strong>{reservation.order_date}</strong></p>
                                        <p>Fizetési mód: <strong>{reservation.fizmod}</strong></p>
                                    </div>
                                </li>
                            );
                        })
                    ) : (
                        <p>Nincsenek foglalásai.</p>
                    )}</div>
                </ul>
            )}
            <Nagyitottkep isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} imageSrc={selectedImage} /> {/* Modal for enlarged image */}
                
        </div>
    );
}

export default Reservations;
