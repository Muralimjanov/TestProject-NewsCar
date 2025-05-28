import nodemailer from 'nodemailer';
import config from 'config';

export const sendDealEmail = async (to, subject, text, pdfPath) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.get("EMAIL_USER"),
            pass: config.get("EMAIL_PASS")
        }
    });

    const mailOptions = {
        from: config.get("EMAIL_USER"),
        to,
        subject,
        text,
        attachments: [
            {
                filename: 'deal.pdf',
                path: pdfPath
            }
        ]
    };

    await transporter.sendMail(mailOptions);
};
