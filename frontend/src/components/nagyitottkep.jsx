import React from 'react';
import './Modal.css'; // Assuming you will create a CSS file for modal styles

const Nagyitottkep = ({ isOpen, onClose, imageSrc }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <img src={imageSrc} alt="Enlarged Car" />
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Nagyitottkep;
