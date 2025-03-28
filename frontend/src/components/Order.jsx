import React, { useEffect, useState } from 'react';
import CreditCardModal from './CreditCardModal';
import CustomCard from './Card';
import { Col } from 'react-bootstrap';
import Slider from 'react-slick';
import './order.css';
import { useLocation } from 'react-router-dom';

function Order() {
  // Token lekérése és dekódolása a felhasználói adatokhoz
  const token = localStorage.getItem('token');
  let userId = null;
  let email = null;
  if (token) {
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    if (decodedToken && decodedToken.id) {
      userId = decodedToken.id;
      email = decodedToken.email;
    } else {
      console.error('Nem sikerült lekérni a felhasználó azonosítóját.');
    }
  }

  // URL paraméterek kezelése a kiválasztott autókhoz
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const [selectedCars, setSelectedCars] = useState(query.get('selectedCars') ? JSON.parse(query.get('selectedCars')) : []);
  const [carDetails, setCarDetails] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [creditCardDetails, setCreditCardDetails] = useState(null);

  // Autó adatok lekérése a backendről, ha vannak kiválasztott autók
  useEffect(() => {
    const fetchCarDetails = async () => {
      if (selectedCars.length > 0) {
        try {
          const response = await fetch(`http://localhost:8080/cars?ids=${selectedCars.join(',')}`);
          const data = await response.json();
          setCarDetails(data.cars);
        } catch (error) {
          console.error('Hiba az autó adatok lekérése során:', error);
        }
      }
    };

    fetchCarDetails();
  }, []);

  // Ellenőrzi, hogy a felhasználó be van-e jelentkezve
  useEffect(() => {
    if (!token) {
      alert('Kérjük, jelentkezzen be a foglaláshoz.');
      return;
    }
  }, []);

  // Autó eltávolítása a kiválasztottak közül
  const handleRemoveCar = (carId) => {
    setCarDetails(prevCarDetails => prevCarDetails.filter(car => car.Rendszam !== carId));
    setSelectedCars(prevSelectedCars => {
      const updatedSelectedCars = prevSelectedCars.filter(id => id !== carId);
      const newQuery = `?selectedCars=${JSON.stringify(updatedSelectedCars)}`;
      window.history.replaceState(null, '', newQuery);
      return updatedSelectedCars;
    });
  };

  // Foglalás végrehajtása
  const handleBooking = async () => {
    if (!paymentMethod) {
      alert('Kérjük, válassza ki a fizetési módot.');
      return;
    }

    const carId = selectedCars.join(',');
    if (!userId) {
      alert('Kérjük, jelentkezzen be a foglaláshoz.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ carId, userId, paymentMethod, creditCardDetails }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message);
        window.location.href = `/kinalat`;
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Foglalás létrehozása során hiba:', error);
    }
  };

  // Slider beállításai
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <div className="slick-prev custom-arrow">&#8249;</div>,
    nextArrow: <div className="slick-next custom-arrow">&#8250;</div>,
  };

  // Árak formázása ezres elválasztóval
  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
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
                  subtitle={`Évjárat: ${car.Evjarat} | Ár: ${formatPrice(car.Ar)} Ft`}
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
              setIsModalOpen(true);
            } else {
              handleBooking();
            }
          }}>Foglalás megerősítése</button>

          <CreditCardModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSubmit={(details) => {
              setCreditCardDetails(details);
              handleBooking();
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
