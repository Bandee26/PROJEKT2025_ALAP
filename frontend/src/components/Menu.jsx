import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
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
            const response = await fetch('/api/login', {
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
                setMessage('Sikeres bejelentkezés!');
                setIsLoggedIn(true);
                setShowLoginModal(false);
            } else {
                setMessage('Helytelen email vagy jelszó.');
            }
        } catch (error) {
            setMessage('Hálózati hiba történt.');
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
                                        <NavDropdown.Item href="#profile">Profil</NavDropdown.Item>
                                        <NavDropdown.Item onClick={() => setIsLoggedIn(false)}>
                                            Kijelentkezés
                                        </NavDropdown.Item>
                                    </>
                                )}
                            </NavDropdown>
                        </Nav>
                        <Form className="d-flex">
                            <DropdownButton
                                variant="outline-secondary"
                                title="Szűrő"
                                className="me-2"
                                align="end"
                            >
                                {/* Márkák szűrő */}
                            </DropdownButton>
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
        </>
    );
}

export default Menu;
