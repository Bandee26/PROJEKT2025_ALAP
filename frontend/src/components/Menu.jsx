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

function Menu() {
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Bejelentkezett állapot
    const [registerEmail, setRegisterEmail] = useState('');
    const [registerPassword, setRegisterPassword] = useState('');
    const [registerName, setRegisterName] = useState(''); // Név állapot
    const [registerPhone, setRegisterPhone] = useState(''); // Telefonszám állapot
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [message, setMessage] = useState(''); // Üzenetek megjelenítése

    // Profil módosító modal
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileName, setProfileName] = useState(''); // Név
    const [profilePhone, setProfilePhone] = useState(''); // Telefonszám

    // Kedvencek modal
    const [showFavoritesModal, setShowFavoritesModal] = useState(false);
    // Példa kedvenc autók adatai; később ezeket például backendről töltheti be
    const [favorites, setFavorites] = useState([
        "BMW X5",
        "Audi A6",
        "Mercedes-Benz C-Class"
    ]);

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
            const response = await fetch('http://localhost:8080/users/register', {  // Backend URL itt szerepel
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
                setIsLoggedIn(true); // Bejelentkezett státusz
                setShowLoginModal(false); // Zárd be a modalt
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

        // Ellenőrizd, hogy a nevet és telefonszámot kitöltötte-e a felhasználó
        if (!profileName || !profilePhone) {
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

            {/* Üzenet megjelenítése */}
            {message && <div className="alert alert-info mt-3">{message}</div>}

            {/* Regisztrációs modal */}
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

            {/* Bejelentkezési modal */}
            <Modal show={showLoginModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Bejelentkezés</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleLoginSubmit}>
                        <Form.Group controlId="loginEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control 
                                type="email" 
                                placeholder="Adja meg email címét" 
                                value={loginEmail} 
                                onChange={(e) => setLoginEmail(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group controlId="loginPassword">
                            <Form.Label>Jelszó</Form.Label>
                            <Form.Control 
                                type="password" 
                                placeholder="Adja meg jelszavát" 
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

            {/* Profil módosító modal */}
            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Profil frissítése</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleProfileSubmit}>
                        <Form.Group controlId="profileName">
                            <Form.Label>Név</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={profileName} 
                                onChange={(e) => setProfileName(e.target.value)} 
                            />
                        </Form.Group>
                        <Form.Group controlId="profilePhone">
                            <Form.Label>Telefonszám</Form.Label>
                            <Form.Control 
                                type="tel" 
                                value={profilePhone} 
                                onChange={(e) => setProfilePhone(e.target.value)} 
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Profil mentése
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Kedvencek modal */}
            <Modal show={showFavoritesModal} onHide={() => setShowFavoritesModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Kedvencek</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ul>
                        {favorites.map((car, index) => (
                            <li key={index}>{car}</li>
                        ))}
                    </ul>
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
