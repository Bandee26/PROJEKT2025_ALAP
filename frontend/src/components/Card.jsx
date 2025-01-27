import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';

const CustomCard = ({ imageSrc, title, subtitle, description }) => {
  const [showModal, setShowModal] = useState(false);

  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <div>
      <Card style={{ width: '18rem' }}>
        <Card.Img variant="top" src={imageSrc} />
        <Card.Body>
          <Card.Title>{title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">{subtitle}</Card.Subtitle>
          <Card.Text>{description}</Card.Text>
          <Button variant="primary" onClick={handleShow}>Nézd meg nagyban</Button>
        </Card.Body>
      </Card>

      {/* Modal a kártya nagyításához */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imageSrc} alt={title} style={{ width: '100%', height: 'auto' }} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CustomCard;
