import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateDealPDF = (deal, filePath = 'deal.pdf') => {
    return new Promise((resolve, reject) => {
        try {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            const doc = new PDFDocument();
            const stream = fs.createWriteStream(filePath);
            doc.pipe(stream);

            doc.fontSize(20).text('Документ по сделке', { align: 'center' });
            doc.moveDown();
            doc.fontSize(14).text(`ID сделки: ${deal._id}`);
            doc.text(`Покупатель: ${deal.buyerId.name || deal.buyerId.email}`);
            doc.text(`Аукцион: ${deal.auctionId.title}`);
            doc.text(`Цена: ${deal.finalPrice || deal.price || 'Не указана'}`);
            doc.text(`Дата: ${new Date(deal.createdAt).toLocaleString()}`);

            doc.end();

            stream.on('finish', () => resolve(filePath));
            stream.on('error', reject);
        } catch (error) {
            reject(error);
        }
    });
};
