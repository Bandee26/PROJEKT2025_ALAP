import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // Importáld a szükséges komponenseket
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import Logo from './auto.png';
import './Menu.css';
import Home from './Home';  // Home komponens importálása
import Kinalat from './Kinalat';  // Kínálat komponens importálása

function Menu({ favorites, handleFavoriteToggle, products }) {
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerName, setRegisterName] = useState('');
    const [registerPhone, setRegisterPhone] = useState('');
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState('');
    const [userEmail, setUserEmail] = useState('');
    
    // Profil módosító modal
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileName, setProfileName] = useState('');
    const [profilePhone, setProfilePhone] = useState('');

    // Kedvencek modal
    const [showFavoritesModal, setShowFavoritesModal] = useState(false);

    // Márkák kiválasztása
    const handleBrandToggle = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter((b) => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

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
                setMessage('Sikeres regisztráció!');
                setShowRegisterModal(false);
            } else {
                setMessage('Hiba történt a regisztráció során.');
            }
        } catch (error) {
            setMessage('Hálózati hiba történt.');
        }
    };

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
                setIsLoggedIn(true); 
                setUserEmail(loginEmail); 
                setShowLoginModal(false); 
                setMessage('Sikeres bejelentkezés!');
            } else {
                setMessage('Helytelen email vagy jelszó.');
            }
        } catch (error) {
            setMessage('Hálózati hiba történt.');
        }
    };

   // Profil frissítése
const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!profileName || !profilePhone || !userEmail) {
        setMessage('Minden mezőt ki kell tölteni!');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/users/updateProfile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userEmail, // Send the user's email
                name: profileName,
                phone: profilePhone,
            }),
        });

        const result = await response.json();
        if (result.success) {
            setMessage('Profil sikeresen frissítve');
            setShowProfileModal(false);
        } else {
            setMessage('Hiba történt a profil frissítése során');
        }
    } catch (error) {
        setMessage('Hálózati hiba történt');
    }
};

    // Kedvenc autók kiszűrése a products listából
    const favoriteCars = products.filter(auto => favorites.includes(auto.Rendszam));

    return (
        <Router>
            <Navbar expand="lg" className="fixed-menu" style={{ backgroundColor: '#222' }}>
                <Container>
                    <Navbar.Brand href="/">
                        <img src={Logo} style={{ width: "40px", height: "40px", marginRight: '20px' }} alt="Logo" />
                        B&K Autókereskedés
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link as={Link} to="/">Home</Nav.Link>
                            <Nav.Link as={Link} to="/kinalat">Kínálat</Nav.Link>
                            <NavDropdown title="Felhasználóknak" id="basic-nav-dropdown">
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
                                        <NavDropdown.Item onClick={() => setIsLoggedIn(false)}>
                                            Kijelentkezés
                                        </NavDropdown.Item>
                                    </>
                                )}
                            </NavDropdown>
                        </Nav>
                        <Form className="d-flex">
                            <Form.Control
                                type="search"
                                placeholder="Keresés"
                                className="me-2"
                                aria-label="Search"
                            />
                            <Button variant="outline-primary">Keresés</Button>
                        </Form>
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

            <Modal show={showFavoritesModal} onHide={() => setShowFavoritesModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Kedvenc autók</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {favoriteCars.length > 0 ? (
                        <ul>
                            {favoriteCars.map((car) => (
                                <li key={car.Rendszam}>
                                    {`${car.Marka} ${car.Modell} (${car.Evjarat}) - ${car.Ar} Ft`}
                                    <Button variant="danger" onClick={() => handleFavoriteToggle(car.Rendszam)} style={{ marginLeft: '20px' }}>Eltávolítás</Button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Nincsenek kedvenc autók.</p>
                    )}
                </Modal.Body>
            </Modal>

            {/* Route-ok definiálása */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/kinalat" element={<Kinalat />} />
            </Routes>
        </Router>
    );
}

export default Menu;