import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Logo from './auto.png';

function Menu() {

    const imageStyle = {
        width: "40px",
        height: "40px",
      };

  return (
    <Navbar expand="lg" className="bg-white">
      <Container>
        <Navbar.Brand href="/">
                <img src={Logo} style={imageStyle} alt="Logo"/>
                Használtautó
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Fehasználóknak" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Regisztráció</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Bejelentkezés</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Profil</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">Kijelentkezés</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Menu;