import React, { useState } from 'react';
import './CreditCardModal.css'; // Importing CSS for modal styling

const CreditCardModal = ({ isOpen, onClose, onSubmit }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [cvv, setCvv] = useState(''); // State for CVV code

const validateCardNumber = (number) => {
    // Remove non-digit characters
    const sanitizedNumber = number.replace(/\D/g, '');
    // Check if the length is between 13 and 19 digits
    if (sanitizedNumber.length < 13 || sanitizedNumber.length > 19) {
        return false;
    }
    // Luhn algorithm for card number validation
    let sum = 0;
    let alternate = false;
    for (let i = sanitizedNumber.length - 1; i >= 0; i--) {
        let n = parseInt(sanitizedNumber.charAt(i), 10);
        if (alternate) {
            n *= 2;
            if (n > 9) n -= 9;
        }
        sum += n;
        alternate = !alternate;
    }
    return sum % 10 === 0;
};

const handleSubmit = (e) => {
    e.preventDefault(); 

    if (!validateCardNumber(cardNumber)) {
        alert("Kérjük, adjon meg egy érvényes bankkártya számot."); // Alert for invalid card number
        return; // Prevent submission if card number is invalid
    }

        const formattedExpirationDate = `${expirationDate.slice(0, 2)}/${expirationDate.slice(2)}`; // Format expiration date

        e.preventDefault(); 

        onSubmit({
            // Include the card number validation check

            cardNumber,
            expirationDate: formattedExpirationDate, // Use formatted expiration date
            cardholderName, 
            cvv, 
            paymentMethod: { cardNumber, expirationDate, cardholderName, cvv } // Send payment method
        }); // Include CVV in submission

        onClose(); // Close the modal after submission
    };

    if (!isOpen) return null; // Don't render the modal if it's not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Foglalás megerősítése </h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Bankkártya száma:</label>
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
                            onChange={(e) => {
                                const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
                                if (value.length > 4) return; // Limit to 4 digits
                                if (value.length >= 2) {
                                    const month = value.slice(0, 2);
                                    if (parseInt(month) > 12) return; // Limit month to 12
                                    setExpirationDate(`${month}/${value.slice(2)}`); // Format as MM/YY
                                } else {
                                    setExpirationDate(value); // Set raw value
                                }
                            }} 
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
                            onChange={(e) => {
                                if (e.target.value.length <= 3) {
                                    setCvv(e.target.value); // Limit CVV to 3 characters
                                }
                            }}
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
