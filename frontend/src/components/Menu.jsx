import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Reservations from './Reservations';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import Slider from 'react-slick';

import Logo from './auto.png';
import './Menu.css';
import Home from './Home';
import Kinalat from './Kinalat';
import Order from './Order';

function Menu({ favorites, setFavorites, products }) {
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userEmail, setUserEmail] = useState(localStorage.getItem('token') ? '' : '');

    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerPhone, setRegisterPhone] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');
    // Profil módosító modal
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [profilePhone, setProfilePhone] = useState('');
    // Kedvencek modal
    const [showFavoritesModal, setShowFavoritesModal] = useState(false);
    const [validatedFavorites, setValidatedFavorites] = useState([]);

    useEffect(() => {
        setValidatedFavorites(Array.isArray(favorites) ? favorites : []);
    }, [favorites]);

    // Fetch user profile data when the profile modal is opened
    useEffect(() => {
        const fetchUserProfile = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:8080/users/profile', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                    });
                    const result = await response.json();
                    if (result.success) {
                        setProfileName(result.profile.nev);
                        setUserEmail(result.profile.email);
                        setProfilePhone(result.profile.telefon);
                    } else {
                        alert('Hiba történt a profil lekérése során');
                    }
                } catch (error) {
                    alert('Hálózati hiba történt a profil lekérése során');
                }
            }
        };

        if (showProfileModal) {
            fetchUserProfile();
        }
    }, [showProfileModal]);

    // Modal megnyitása és zárása
    const handleRegisterClick = () => setShowRegisterModal(true);
    const handleLoginClick = () => setShowLoginModal(true);
    const handleCloseModal = () => {
        setShowRegisterModal(false);
        setShowLoginModal(false);
    };

    // Regisztráció kezelése
    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: registerEmail,
                    password: registerPassword,
                    nev: registerName,
                    telefon: registerPhone,
                }),
            });
            const result = await response.json();
            if (result.success) {
                alert('Sikeres regisztráció!');
                setShowRegisterModal(false);
            } else {
                alert('Hiba történt a regisztráció során.');
            }
        } catch (error) {
            alert('Hálózati hiba történt.');
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            setUserEmail(loginEmail);

            // Fetch favorites after login
            const fetchFavorites = async () => {
                try {
                    const favoritesResponse = await fetch('http://localhost:8080/users/favorites', {
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`,
                        },
                        method: 'GET',
                    });
                    const favoritesResult = await favoritesResponse.json();
                    if (favoritesResult.success) {
                        try {
                            const parsedFavorites = JSON.parse(favoritesResult.favorites);
                            const uniqueFavorites = [...new Set(parsedFavorites)];
                            setFavorites(uniqueFavorites);
                            setValidatedFavorites(uniqueFavorites);
                        } catch (parseError) {
                            console.error('Error parsing favorites:', parseError);
                            alert('Hiba történt a kedvencek feldolgozása során.');
                        }
                    } else {
                        console.error('Error fetching favorites:', favoritesResult);
                        alert('Hiba történt a kedvencek lekérése során: ' + (favoritesResult.message || 'Unknown error'));
                    }
                } catch (error) {
                    console.error('Error fetching favorites:', error);
                    alert('Hálózati hiba történt a kedvencek lekérése során.');
                }
            };

            fetchFavorites();
        }
    }, []);

    // Bejelentkezés kezelése
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: loginEmail,
                    password: loginPassword,
                }),
            });
            const result = await response.json();
            if (result.success) {
                const token = result.token;
                localStorage.setItem('token', token);
                setIsLoggedIn(true);
                setUserEmail(loginEmail);
                setShowLoginModal(false);
                alert('Sikeres bejelentkezés!');

                // Now fetch favorites
                const favoritesResponse = await fetch('http://localhost:8080/users/favorites', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    method: 'GET',
                });
                const favoritesResult = await favoritesResponse.json();
                if (favoritesResult.success) {
                    const parsedFavorites = JSON.parse(favoritesResult.favorites);
                    const uniqueFavorites = [...new Set(parsedFavorites)];
                    setFavorites(uniqueFavorites);
                    setValidatedFavorites(uniqueFavorites);
                } else {
                    alert('Hiba történt a kedvencek lekérése során');
                }
            } else {
                alert('Helytelen email vagy jelszó.');
            }
        } catch (error) {
            alert('Hálózati hiba történt.');
        }
    };

    // Profil frissítése
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!profileName || !profilePhone || !userEmail) {
            alert('Minden mezőt ki kell tölteni!');
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:8080/users/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    email: userEmail,
                    name: profileName,
                    phone: profilePhone,
                }),
            });
            const result = await response.json();
            if (result.success) {
                alert('Profil sikeresen frissítve');
                setShowProfileModal(false);
            } else {
                alert('Hiba történt a profil frissítése során');
            }
        } catch (error) {
            alert('Hálózati hiba történt');
        }
    };

    // Slider settings for favorites modal
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

    const formatPrice = (price) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    const handleFavoriteToggle = async (carId) => {
        if (!isLoggedIn) {
            alert('Kérjük, jelentkezzen be a kedvencek kezeléséhez.');
            return;
        }
        const token = localStorage.getItem('token');
        const isFavorite = validatedFavorites.includes(carId);
        try {
            const response = await fetch(`http://localhost:8080/users/favorites/${carId}`, {
                method: isFavorite ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorMessage = await response.text();
                alert(`Hiba történt a kedvenc hozzáadásakor: ${errorMessage}`);
                return;
            }
            const result = await response.json();
            if (result.success) {
                if (isFavorite) {
                    setFavorites((prevFavorites) => prevFavorites.filter((id) => id !== carId));
                    setValidatedFavorites((prevFavorites) => prevFavorites.filter((id) => id !== carId));
                } else {
                    setFavorites((prevFavorites) => [...prevFavorites, carId]);
                    setValidatedFavorites((prevFavorites) => [...prevFavorites, carId]);
                }
            } else {
                alert('Hiba történt a kedvenc hozzáadásakor!');
            }
        } catch (error) {
            alert(`Hálózati hiba történt: ${error.message}`);
        }
    };

    useEffect(() => {}, [favorites]);

    return (
        <Router>
            <Navbar expand="lg" className="fixed-menu" style={{ backgroundColor: '#222', flexDirection: 'column' }}>
                <Container>
                    <Navbar.Brand as={Link} to="/">
                        <img src={Logo} style={{ width: "40px", height: "40px", marginRight: '20px' }} alt="Logo" />
                        B&K Autókereskedés
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto" style={{ flexWrap: 'wrap' }}>
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/kinalat">Kínálat</Nav.Link>
                        </Nav>
                        <Nav>
                            <NavDropdown title="Felhasználóknak" id="basic-nav-dropdown" className="custom-dropdown" drop="down">
                                {!isLoggedIn ? (
                                    <>
                                        <NavDropdown.Item onClick={handleRegisterClick}>
                                            Regisztráció
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={handleLoginClick}>
                                            Bejelentkezés
                                        </NavDropdown.Item>
                                    </>
                                ) : (
                                    <>
                                        <NavDropdown.Item onClick={() => setShowProfileModal(true)}>
                                            Profil
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => setShowFavoritesModal(true)}>
                                            Kedvencek
                                        </NavDropdown.Item>
                                        <NavDropdown.Item as={Link} to="/foglalas">
                                            Foglalások
                                        </NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => {

                                            localStorage.removeItem('token');
                                            setIsLoggedIn(false);
                                            window.location.reload();
                                        }}>
                                            Kijelentkezés
                                        </NavDropdown.Item>
                                    </>
                                )}
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {message && <div className="alert alert-info mt-3">{message}</div>}

            <Modal show={showRegisterModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Regisztráció</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleRegisterSubmit}>
                        <Form.Group controlId="registerName">
                            <Form.Label>Név</Form.Label>
                            <Form.Control 
                                type="text" 
                                placeholder="Adja meg nevét" 
                                value={registerName} 
                                onChange={(e) => setRegisterName(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group controlId="registerEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Adja meg email címét" 
                                value={registerEmail} 
                                onChange={(e) => setRegisterEmail(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group controlId="registerPhone">
                            <Form.Label>Telefonszám</Form.Label>
                            <Form.Control 
                                type="tel" 
                                placeholder="Adja meg telefonszámát" 
                                value={registerPhone} 
                                onChange={(e) => setRegisterPhone(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group controlId="registerPassword">
                            <Form.Label>Jelszó</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Adja meg jelszavát" 
                                value={registerPassword} 
                                onChange={(e) => setRegisterPassword(e.target.value)} 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Regisztráció
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showLoginModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Bejelentkezés</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleLoginSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email cím</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Adja meg az email címét"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Jelszó</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Adja meg a jelszavát"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Bejelentkezés
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Profil módosítása</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleProfileSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Teljes név</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Adja meg a nevét"
                                value={profileName}
                                onChange={(e) => setProfileName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Adja meg az email címét"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPhone">
                            <Form.Label>Telefonszám</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Adja meg a telefonszámát"
                                value={profilePhone}
                                onChange={(e) => setProfilePhone(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Frissítés
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Kedvencek modal */}
            <Modal show={showFavoritesModal} onHide={() => setShowFavoritesModal(false)} centered style={{  textAlign: 'center' }}>
                <Modal.Header closeButton>
                    <Modal.Title>Kedvenc autók</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Array.isArray(validatedFavorites) && validatedFavorites.length > 0 ? (
                        <ul>
                            {validatedFavorites.map((carId) => {
                                const car = products.find((auto) => auto.Rendszam === carId);
                                if (car) {
                                    return (
                                        <li key={car.Rendszam}>
                                            <Slider {...settings} style={{ display: 'block', width: '100%' }}>
                                                <div>
                                                    <img src={`/Img/${car.Auto_ID}.1.jpg`} alt={`${car.Marka} ${car.Modell} első kép`} style={{ width: '100%' }} />
                                                </div>
                                                <div>
                                                    <img src={`/Img/${car.Auto_ID}.2.jpg`} alt={`${car.Marka} ${car.Modell} második kép`} style={{ width: '100%' }} />
                                                </div>
                                            </Slider>
                                            {`${car.Marka} ${car.Modell} (${car.Evjarat}) - ${formatPrice(car.Ar)} Ft`}
                                            <Button 
                                                variant="danger" 
                                                onClick={() => handleFavoriteToggle(car.Rendszam)}
                                                style={{ marginLeft: '10px' }}
                                            >
                                                Eltávolítás
                                            </Button>
                                            <Button 
                                                variant="primary" 
                                                onClick={() => {
                                                    window.location.href = `/order?selectedCars=${JSON.stringify([car.Rendszam])}`;
                                                }} 
                                                style={{ marginLeft: '10px' }}
                                            >
                                                Foglalás
                                            </Button>
                                        </li>
                                    );
                                }
                                return null;
                            })}
                        </ul>
                    ) : (
                        <p>Nincsenek kedvencek.</p>
                    )}
                </Modal.Body>
            </Modal>

            {/* Route-ok definiálása */}
            <Routes>
                <Route path="/order" element={<Order userId={userEmail} />} />
                <Route path="/" element={<Home />} />
                <Route path="/foglalas" element={<Reservations />} />

                <Route path="/kinalat" element={<Kinalat isLoggedIn={isLoggedIn} handleFavoriteToggle={handleFavoriteToggle} favorites={favorites} />} />
            </Routes>
        </Router>
    );

}

export default Menu;
