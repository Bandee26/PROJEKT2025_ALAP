import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import Slider from 'react-slick'; // Import Slider for carousel functionality
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CardCSS from './Card.css';

const CustomCard = ({
  autoId,          // Az autó azonosítója
  imageSrc1,       // Első kép forrás (opcionális)
  imageSrc2,       // Második kép forrás (opcionális)
  title,
  subtitle,
  description,
  year,
  adatok,
  elado,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton,
  children
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  // Dark theme styles for the modal
  const modalStyles = {
    header: {
      backgroundColor: '#222',
      borderColor: '#333',
      color: '#fff'
    },
    body: {
      backgroundColor: '#222',
      color: '#fff'
    },
    image: {
      width: '100%',
      height: 'auto',
      maxHeight: '80vh',       // Növelt max-height a modalban (80% viewport magasság)
      objectFit: 'contain',    // Megőrzi a kép arányait, nem vágja le
      border: '2px solid #333',
      borderRadius: '4px'
    }
  };

  // React-Slick settings for the image carousel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: <div className="slick-prev custom-arrow">&#8249;</div>,
    nextArrow: <div className="slick-next custom-arrow">&#8250;</div>
  };

  // Ha nincs explicit képforrás megadva, akkor az autoId alapján építjük fel az útvonalat
  const modalImage1 = imageSrc1 || `/Img/${autoId}.1.jpg`;
  const modalImage2 = imageSrc2 || `/Img/${autoId}.2.jpg`;

  return (
    <div className='kartya hover-effect'>
      <Card className='doboz kartya-hover shadow-sm rounded' style={{ width: '18rem' }}>
        {/* A gyermek komponens tartalmazza például a slider-t a főoldali képekhez */}
        {children}
        <Card.Body>
          <Card.Title className='text-center'>{title}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted text-center">{subtitle}</Card.Subtitle>
          <Card.Text className='card-text text-center'>{description}</Card.Text>

          <div className="d-flex justify-content-between mt-3">
            <Button className="hover-button" variant="primary" onClick={handleShow} style={{ backgroundColor: 'orangered' }}>
              Részletek
            </Button>
            {showFavoriteButton && (
              <Button
                className="hover-button"
                variant={isFavorite ? 'danger' : 'success'}
                onClick={onFavoriteToggle}
              >
                {isFavorite ? 'Kedvencekből eltávolít' : 'Kedvencekhez adás'}
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton style={modalStyles.header}>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body style={modalStyles.body}>
          <Slider {...settings}>
            <div>
              <img src={modalImage1} alt={`${title} első kép`} style={modalStyles.image} />
            </div>
            <div>
              <img src={modalImage2} alt={`${title} második kép`} style={modalStyles.image} />
            </div>
          </Slider>
          <div className="mt-3">
            <p><strong>Rendszám:</strong> {year}</p>
            <p><strong>Autó adatai:</strong> {adatok}</p>
            <p><strong>Eladó adatai:</strong> {elado}</p>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CustomCard;
