import React, { useState } from 'react';
import './CreditCardModal.css'; 

const CreditCardModal = ({ isOpen, onClose, onSubmit }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [cardholderName, setCardholderName] = useState('');
    const [cvv, setCvv] = useState(''); 

const validateCardNumber = (number) => {
    // Nem számokat tartalmazó karakterek eltávolítása
    const sanitizedNumber = number.replace(/\D/g, '');
    // Ellenőrzés, hogy a szám 13 és 19 karakter hosszú-e
    if (sanitizedNumber.length < 13 || sanitizedNumber.length > 19) {
        return false;
    }
    // A kártyaszám Luhn-algoritmus szerinti ellenőrzése
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
        alert("Kérjük, adjon meg egy érvényes bankkártya számot."); // Hibás kártyaszám esetén hibaüzenet
        return;
    }

        const formattedExpirationDate = `${expirationDate.slice(0, 2)}/${expirationDate.slice(2)}`; // lejárati dátum formázása

        e.preventDefault(); 

        onSubmit({

            cardNumber,
            expirationDate: formattedExpirationDate, 
            cardholderName, 
            cvv, 
            paymentMethod: { cardNumber, expirationDate, cardholderName, cvv } 
        }); 

        onClose();
    };

    if (!isOpen) return null; // ne töltse be a komponenst, ha a modal nem látható

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
                                const value = e.target.value.replace(/\D/g, ''); 
                                if (value.length > 4) return; 
                                if (value.length >= 2) {
                                    const month = value.slice(0, 2);
                                    if (parseInt(month) > 12) return; 
                                    setExpirationDate(`${month}/${value.slice(2)}`); 
                                } else {
                                    setExpirationDate(value);
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
                                    setCvv(e.target.value); 
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
