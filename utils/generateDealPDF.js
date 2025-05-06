import PDFDocument from 'pdfkit';
import fs from 'fs';

export const generateDealPDF = (deal, path = 'deal.pdf') => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const stream = fs.createWriteStream(path);
        doc.pipe(stream);

        doc.fontSize(20).text('Документ по сделке', { align: 'center' });
        doc.moveDown();
        doc.fontSize(14).text(`ID сделки: ${deal._id}`);
        doc.text(`Покупатель: ${deal.buyerId.name || deal.buyerId.email}`);
        doc.text(`Аукцион: ${deal.auctionId.title}`);
        doc.text(`Цена: ${deal.price}`);
        doc.text(`Дата: ${new Date(deal.createdAt).toLocaleString()}`);

        doc.end();

        stream.on('finish', () => resolve(path));
        stream.on('error', reject);
    });
};
