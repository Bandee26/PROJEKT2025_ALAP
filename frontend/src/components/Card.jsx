import React, { useState } from 'react';
import { Card, Button, Modal, ButtonGroup } from 'react-bootstrap';
import CardCSS from './Card.css'

const CustomCard = ({
  imageSrc,
  title,
  subtitle,
  description,
  year,
  adatok,
  elado,
  isFavorite,  // Kedvencek állapota
  onFavoriteToggle,  // Kedvencek kezelése
  showFavoriteButton  // Új prop a kedvencek gomb láthatóságához
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div className='kartya hover-effect'>
      <Card className='doboz kartya-hover shadow-sm rounded' style={{ width: '18rem' }}>
        <Card.Img className='kep image-hover' variant="top" src={imageSrc} />
        <Card.Body>
          <Card.Title className='text-center'>{title}</Card.Title>
          <Card.Subtitle className="mb-3 text-muted text-center">{subtitle}</Card.Subtitle>
          <Card.Text className='card-text text-center'>{description}</Card.Text>

          {/* Gombok elrendezése */}
          <div className="d-flex justify-content-between mt-3">
            <Button className="hover-button" variant="primary" onClick={handleShow} style={{backgroundColor: 'orangered'}}>Részletek</Button>
            {showFavoriteButton && (  // Csak akkor jelenik meg, ha a felhasználó be van jelentkezve
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

      {/* Modal a kártya nagyításához */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imageSrc} alt={title} style={{ width: '100%', height: 'auto' }} />
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
