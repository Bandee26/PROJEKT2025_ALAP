import React, { useState, useEffect } from 'react';


function Reservations() {
    const [reservations, setReservations] = useState([]);
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
                        reservations.map((reservation) => (
                            <li key={reservation.id}>
                               A lefoglalt autó rendszáma: {reservation.car_id} | Foglalás dátuma: {reservation.order_date}  | Fizetési mód:  {reservation.fizmod}
                            </li>
                        ))
                    ) : (
                        <p>Nincsenek foglalásai.</p>
                    )}
                </ul>
            )}
        </div>
    );
}


export default Reservations;
