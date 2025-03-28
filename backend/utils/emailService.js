const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // SMTP szervert használunk
    port: 587, // SMTP port
    secure: false, // TLS beállítás
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

// Email küldése
const sendConfirmationEmail = async (to, bookingId, carDetails, userDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Sikeres foglalás! - B&K Autókereskedés',
        text: `A foglalása sikeresen megtörtént! 
                A lefoglalt autó rendszáma: ${bookingId}. 
                Autó típusa: ${carDetails.Marka}, 
                Modell: ${carDetails.Modell}, 
                Évjárat: ${carDetails.Evjarat}. 
                
                Eladó adatai: 
                Név: ${carDetails.Nev}, 
                Telefon: ${carDetails.Telefon}, 
                Email: ${carDetails.Email}`,

    };

    try {
        await transporter.sendMail(mailOptions); // sendmail metódus meghívása
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error); // Hibakezelés
    }
};

module.exports = {
    sendConfirmationEmail,
};
