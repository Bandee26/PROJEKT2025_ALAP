import React, { useState, useEffect } from 'react';

function Reservations() {
    const [reservations, setReservations] = useState([]);
    const [carDetails, setCarDetails] = useState([]);
    const [loading, setLoading] = useState(true);

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
            <h1>Foglalások</h1>
            {loading ? (
                <p>Töltés...</p>
            ) : (
                <ul>
                    {reservations.length > 0 ? (
                        reservations.map((reservation) => {
                            const car = carDetails.find(car => car.Rendszam === reservation.car_id);
                            return (
                                <li key={reservation.id}>
                                    A lefoglalt autó rendszáma: {reservation.car_id} | Foglalás dátuma: {reservation.order_date} | Fizetési mód: {reservation.fizmod}
                                    {car && <img src={`/Img/${car.Auto_ID}.1.jpg`} alt={car.Rendszam} />}
                                </li>
                            );
                        })
                    ) : (
                        <p>Nincsenek foglalásai.</p>
                    )}
                </ul>
            )}
        </div>
    );
}

export default Reservations;
