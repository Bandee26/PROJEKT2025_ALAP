import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

const CustomCard = ({ imageSrc, title, subtitle, description, year, adatok, elado }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div className='kartya'>
      <Card className='doboz' style={{ width: '18rem' }}>
        <Card.Img className='kep' variant="top" src={imageSrc} />
        <Card.Body>
          <Card.Title className='card-title'>{title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
          <Card.Text className='card-text'>{description}</Card.Text>
          <Button variant="primary" onClick={handleShow}>Részletek</Button>
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
