const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Specify the SMTP server
    port: 587, // Use port 587 for TLS
    secure: false, // Use TLS
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Use the App Password here
    },
});

// Function to send confirmation email
const sendConfirmationEmail = async (to, bookingId, carDetails, userDetails) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Sikeres foglalás!',
        text: `A foglalása sikeresen megtörtént! 
                A lefoglalt autó rendszáma: ${bookingId}. 
                Autó típusa: ${carDetails.Tipus}, 
                Modell: ${carDetails.Modell}, 
                Évjárat: ${carDetails.Evjarat}. 
                
                Eladó adatai: 
                Név: ${carDetails.Nev}, 
                Telefon: ${carDetails.Telefon}, 
                Email: ${carDetails.Email}`,

    };

    try {
        await transporter.sendMail(mailOptions); // Await sendMail
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error); // Log error
    }
};

module.exports = {
    sendConfirmationEmail,
};
