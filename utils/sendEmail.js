const nodemailer = require("nodemailer");
const sendEmail = async (options) => {
    //1) Create a transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT, //if secure use 465 else 587
        secure: process.env.EMAIL_SECURE , //true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    }); 
    //2) Define the email options
    const mailOptions = {
        from: `E-Commerce App <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    };
    //3) Actually send the email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;