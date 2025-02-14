import React, { useState } from 'react';
import { Card, Button, Modal, ButtonGroup } from 'react-bootstrap';

const CustomCard = ({
  imageSrc,
  title,
  subtitle,
  description,
  year,
  adatok,
  elado,
  isFavorite,  // Kedvencek állapota
  onFavoriteToggle  // Kedvencek kezelése
}) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div className='kartya hover-effect'>
      <Card className='doboz kartya-hover' style={{ width: '18rem' }}>
        <Card.Img className='kep image-hover' variant="top" src={imageSrc} />
        <Card.Body>
          <Card.Title className='card-title'>{title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
          <Card.Text className='card-text'>{description}</Card.Text>
          <ButtonGroup className="mt-2">
            <Button className="hover-button" variant="primary" onClick={handleShow}>Részletek</Button>
            <Button className="hover-button" variant={isFavorite ? 'danger' : 'success'} onClick={onFavoriteToggle}>
              {isFavorite ? 'Kedvencekből eltávolít' : 'Kedvencekhez adás'}
            </Button>
          </ButtonGroup>
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
