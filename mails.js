const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

const sendMFACodeToEmail = async (email, mfaCode) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'OTP',
        text: `OTP is: ${mfaCode} Don't share it with anyone`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {sendMFACodeToEmail};