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
const sendConfirmationEmail = async (to, bookingId) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: 'Sikeres foglaló!',
text: `A foglalása sikeresen megtörtént! A lefoglalt autó rendszáma: ${bookingId}`,

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
