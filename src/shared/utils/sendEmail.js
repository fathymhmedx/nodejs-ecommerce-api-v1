const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
    // 1) Create transport (service that will send email like 'gmil','mailgun', 'mailtrap').
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT), // If secure false port= 587, if true= 465
        secure: Number(process.env.EMAIL_PORT) == 465,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }

    })

    // 2) Define email options like 'from', 'to', 'subject', 'email content'.
    const mailOptions = {
        from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
        to: options.email,
        subject: options.subject,
        text: options.message
    };

    //  3) Send email
    await transporter.sendMail(mailOptions);
};