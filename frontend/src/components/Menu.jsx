import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { useState } from 'react';
import Modal from 'react-bootstrap/Modal'; // Modal komponens importálása
import Logo from './auto.png';

function Menu() {
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [showRegisterModal, setShowRegisterModal] = useState(false); // Regisztráció modal állapota
    const [showLoginModal, setShowLoginModal] = useState(false); // Bejelentkezés modal állapota

    const handleBrandToggle = (brand) => {
        if (selectedBrands.includes(brand)) {
            setSelectedBrands(selectedBrands.filter((b) => b !== brand));
        } else {
            setSelectedBrands([...selectedBrands, brand]);
        }
    };

    const handleRegisterClick = () => {
        setShowRegisterModal(true); // Regisztráció modal megnyitása
    };

    const handleLoginClick = () => {
        setShowLoginModal(true); // Bejelentkezés modal megnyitása
    };

    const handleCloseModal = () => {
        setShowRegisterModal(false); // Modal bezárása (regisztráció)
        setShowLoginModal(false); // Modal bezárása (bejelentkezés)
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
                                <NavDropdown.Item onClick={handleRegisterClick}>
                                    Regisztráció
                                </NavDropdown.Item>
                                <NavDropdown.Item onClick={handleLoginClick}>
                                    Bejelentkezés
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Profil</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">Kijelentkezés</NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                        <Form className="d-flex">
                            <DropdownButton
                                variant="outline-secondary"
                                title="Szűrő"
                                className="me-2"
                                align="end"
                            >
                                <Dropdown.ItemText>
                                    <Form.Check
                                        type="checkbox"
                                        label="Toyota"
                                        checked={selectedBrands.includes("Toyota")}
                                        onChange={() => handleBrandToggle("Toyota")}
                                    />
                                </Dropdown.ItemText>
                                <Dropdown.ItemText>
                                    <Form.Check
                                        type="checkbox"
                                        label="BMW"
                                        checked={selectedBrands.includes("BMW")}
                                        onChange={() => handleBrandToggle("BMW")}
                                    />
                                </Dropdown.ItemText>
                                <Dropdown.ItemText>
                                    <Form.Check
                                        type="checkbox"
                                        label="Audi"
                                        checked={selectedBrands.includes("Audi")}
                                        onChange={() => handleBrandToggle("Audi")}
                                    />
                                </Dropdown.ItemText>
                                <Dropdown.ItemText>
                                    <Form.Check
                                        type="checkbox"
                                        label="Ford"
                                        checked={selectedBrands.includes("Ford")}
                                        onChange={() => handleBrandToggle("Ford")}
                                    />
                                </Dropdown.ItemText>
                                <Dropdown.ItemText>
                                    <Form.Check
                                        type="checkbox"
                                        label="Volkswagen"
                                        checked={selectedBrands.includes("Volkswagen")}
                                        onChange={() => handleBrandToggle("Volkswagen")}
                                    />
                                </Dropdown.ItemText>
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

            {/* Regisztrációs modal */}
            <Modal show={showRegisterModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Regisztráció</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email cím</Form.Label>
                            <Form.Control type="email" placeholder="Adja meg az email címét" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Jelszó</Form.Label>
                            <Form.Control type="password" placeholder="Adja meg a jelszavát" />
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
                    <Form>
                        <Form.Group className="mb-3" controlId="formLoginEmail">
                            <Form.Label>Email cím</Form.Label>
                            <Form.Control type="email" placeholder="Adja meg az email címét" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formLoginPassword">
                            <Form.Label>Jelszó</Form.Label>
                            <Form.Control type="password" placeholder="Adja meg a jelszavát" />
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
