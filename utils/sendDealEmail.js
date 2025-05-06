import nodemailer from 'nodemailer';
import config from 'config';

export const sendDealEmail = async (to, subject, text, pdfPath) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.emailUser,
            pass: config.emailPass
        }
    });

    const mailOptions = {
        from: config.emailUser,
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
