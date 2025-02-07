import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import Logo from './auto.png';

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
    const [name, setName] = useState('');  // Név állapot
    const [phone, setPhone] = useState('');  // Telefonszám állapot
    const [userEmail, setUserEmail] = useState('');
    const [alertMessage, setAlertMessage] = useState(''); // Alert üzenet kezelése
    const [alertVariant, setAlertVariant] = useState('info'); // Alert típus

    // Profil módosító modal
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [profileName, setProfileName] = useState(''); // Név
    const [profilePhone, setProfilePhone] = useState(''); // Telefonszám

    // Kedvencek modal
    const [showFavoritesModal, setShowFavoritesModal] = useState(false);
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
        setAlertMessage(''); // Üzenet törlése a modal bezárásakor
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
                setAlertMessage('Sikeres regisztráció!');
                setAlertVariant('success'); // Success alert
            } else {
                setAlertMessage('Hiba történt a regisztráció során.');
                setAlertVariant('danger'); // Error alert
            }
        } catch (error) {
            setAlertMessage('Hálózati hiba történt.');
            setAlertVariant('danger'); // Error alert
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
                setUserEmail(loginEmail); // Email elmentése a profil frissítéshez
                setShowLoginModal(false); // Zárd be a modalt
                setAlertMessage('Sikeres bejelentkezés!');
                setAlertVariant('success'); // Success alert
            } else {
                setAlertMessage('Helytelen email vagy jelszó.');
                setAlertVariant('danger'); // Error alert
            }
        } catch (error) {
            setAlertMessage('Hálózati hiba történt.');
            setAlertVariant('danger'); // Error alert
        }
    };

    // Profil frissítése
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        if (!name || !phone || !userEmail) {
            setAlertMessage('Minden mezőt ki kell tölteni!');
            setAlertVariant('danger'); // Error alert
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/users/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    email: userEmail,
                }),
            });

            const result = await response.json();
            if (result.success) {
                setAlertMessage('Profil sikeresen frissítve');
                setAlertVariant('success'); // Success alert
                setShowProfileModal(false);
            } else {
                setAlertMessage('Hiba történt a profil frissítése során');
                setAlertVariant('danger'); // Error alert
            }
        } catch (error) {
            setAlertMessage('Hálózati hiba történt');
            setAlertVariant('danger'); // Error alert
        }
    };

    const imageStyle = {
        width: "40px",
        height: "40px",
    };

    return (
        <>
            <Navbar expand="lg" className="bg-white fixed-menu">
                <Container>
                    <Navbar.Brand href="/">
                        <img src={Logo} style={imageStyle} alt="Logo" />
                        B&K Autókereskedés
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Nav.Link href="#home">Home</Nav.Link>
                            <Nav.Link href="#link">Kínálat</Nav.Link>
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

            {/* Alert üzenet */}
            {alertMessage && (
                <div className={`alert alert-${alertVariant} mt-3`}>
                    {alertMessage}
                </div>
            )}

            {/* Regisztrációs modal */}
            <Modal show={showRegisterModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Regisztráció</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleRegisterSubmit}>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email cím</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Adja meg az email címét"
                                value={registerEmail}
                                onChange={(e) => setRegisterEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Jelszó</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Adja meg a jelszavát"
                                value={registerPassword}
                                onChange={(e) => setRegisterPassword(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicName">
                            <Form.Label>Teljes név</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Adja meg a nevét"
                                value={registerName}
                                onChange={(e) => setRegisterName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPhone">
                            <Form.Label>Telefonszám</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Adja meg a telefonszámát"
                                value={registerPhone}
                                onChange={(e) => setRegisterPhone(e.target.value)}
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
                        <Form.Group className="mb-3" controlId="formLoginEmail">
                            <Form.Label>Email cím</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Adja meg az email címét"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formLoginPassword">
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

            {/* Profil módosító modal */}
            <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Profil frissítése</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleProfileSubmit}>
                        <Form.Group controlId="formProfileName">
                            <Form.Label>Név</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Adja meg a nevét"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Form.Group>

                        <Form.Group controlId="formProfilePhone">
                            <Form.Label>Telefonszám</Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Adja meg a telefonszámát"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Frissítés
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
                    {favorites.length === 0 ? (
                        <p>Nincsenek kedvenc autók.</p>
                    ) : (
                        <ul>
                            {favorites.map((car, index) => (
                                <li key={index}>{car}</li>
                            ))}
                        </ul>
                    )}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Menu;
