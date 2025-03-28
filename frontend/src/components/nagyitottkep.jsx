import React from 'react';
import './Modal.css'; 

const Nagyitottkep = ({ isOpen, onClose, imageSrc }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <img src={imageSrc} alt="Nagy kép az autóról" />
                <button onClick={onClose}>Bezárás</button>
            </div>
        </div>
    );
};

export default Nagyitottkep;
