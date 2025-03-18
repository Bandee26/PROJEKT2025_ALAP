import React, { useState } from 'react';
import './CreditCardModal.css'; // Importing CSS for modal styling

const CreditCardModal = ({ isOpen, onClose, onSubmit }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [cvv, setCvv] = useState(''); // State for CVV code

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ cardNumber, expirationDate, cardholderName, cvv }); // Include CVV in submission
        onClose(); // Close the modal after submission
    };

    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Bankkártya adatok</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Kártyaszám:</label>
                        <input 
                            type="text" 
                            value={cardNumber} 
                            onChange={(e) => setCardNumber(e.target.value)} 
                            placeholder="1234 5678 9012 3456" 
                            required 
                        />
                    </div>
                    <div>
                        <label>Lejárati dátum:</label>
                        <input 
                            type="text" 
                            value={expirationDate} 
                            onChange={(e) => setExpirationDate(e.target.value)} 
                            placeholder="MM/YY" 
                            required 
                        />
                    </div>
                    <div>
                        <label>CVV:</label>
                    </div>
                    <div>
                        <input 
                            type="text" 
                            value={cvv} 
                            onChange={(e) => setCvv(e.target.value)} 
                            placeholder="XXX" 
                            required 
                        />

                    </div>
                    
                    <div>
                        <label>Kártyán szereplő név:</label>
                        <input 
                            type="text" 
                            value={cardholderName} 
                            onChange={(e) => setCardholderName(e.target.value)} 
                            placeholder="Minta Márton" 
                            required 
                        />
                    </div>

                    <button type="submit">Megerősítés</button>
                    <button type="button" onClick={onClose}>Mégse</button>
                </form>
            </div>
        </div>
    );
};

export default CreditCardModal;
