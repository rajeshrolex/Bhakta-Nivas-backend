const PDFDocument = require('pdfkit');

/**
 * Generate a PDF invoice for a booking
 * @param {Object} bookingDetails - Details of the booking
 * @returns {Promise<Buffer>} - PDF buffer
 */
const generateInvoicePDF = (bookingDetails) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        // Header
        doc.fillColor('#444444')
           .fontSize(20)
           .text('Booking Invoice', 110, 57)
           .fontSize(10)
           .text('BHAKTA NIVAS', 200, 65, { align: 'right' })
           .text('Mantralayam, Andhra Pradesh', 200, 80, { align: 'right' })
           .moveDown();

        // Horizontal line
        doc.strokeColor('#aaaaaa')
           .lineWidth(1)
           .moveTo(50, 100)
           .lineTo(550, 100)
           .stroke();

        // Customer & Booking Info
        const customerTop = 120;
        doc.fontSize(10)
           .text('Invoice ID:', 50, customerTop)
           .font('Helvetica-Bold').text(bookingDetails.bookingId, 150, customerTop)
           .font('Helvetica').text('Date:', 50, customerTop + 15)
           .text(new Date().toLocaleDateString('en-IN'), 150, customerTop + 15)
           .text('Payment Status:', 50, customerTop + 30)
           .font('Helvetica-Bold').text(bookingDetails.paymentStatus.toUpperCase(), 150, customerTop + 30)
           
           .font('Helvetica').text('Guest Name:', 350, customerTop)
           .font('Helvetica-Bold').text(bookingDetails.guestName, 450, customerTop)
           .font('Helvetica').text('Phone:', 350, customerTop + 15)
           .text(bookingDetails.phone, 450, customerTop + 15)
           .text('Email:', 350, customerTop + 30)
           .text(bookingDetails.email || 'N/A', 450, customerTop + 30);

        // Details Table
        const tableTop = 200;
        doc.font('Helvetica-Bold');
        generateTableRow(doc, tableTop, 'Lodge / Room', 'Dates', 'Guests', 'Total Amount');
        generateHr(doc, tableTop + 20);
        
        doc.font('Helvetica');
        const lodgeInfo = `${bookingDetails.lodgeName}\n(${bookingDetails.roomName})`;
        const datesInfo = `${bookingDetails.checkIn}\nto ${bookingDetails.checkOut}`;
        generateTableRow(
            doc, 
            tableTop + 30, 
            lodgeInfo, 
            datesInfo, 
            bookingDetails.guests, 
            `₹${bookingDetails.amount}`
        );

        generateHr(doc, tableTop + 75);

        // Summary
        const summaryTop = tableTop + 100;
        doc.fontSize(10);
        
        doc.text('Total Amount:', 350, summaryTop)
           .font('Helvetica-Bold').text(`₹${bookingDetails.amount}`, 480, summaryTop)
           
           .font('Helvetica').text('Amount Paid:', 350, summaryTop + 20)
           .font('Helvetica-Bold').fillColor('#16a34a').text(`₹${bookingDetails.amountPaid}`, 480, summaryTop + 20)
           
           .font('Helvetica').fillColor('#444444').text('Balance Due:', 350, summaryTop + 40)
           .font('Helvetica-Bold').fillColor('#dc2626').text(`₹${bookingDetails.balanceAmount}`, 480, summaryTop + 40);

        // Terms & Conditions
        const termsTop = summaryTop + 80;
        doc.fillColor('#444444')
           .fontSize(10)
           .font('Helvetica-Bold')
           .text('Terms & Conditions:', 50, termsTop)
           .font('Helvetica')
           .fontSize(8)
           .text(bookingDetails.terms || 'Standard terms and conditions apply.', 50, termsTop + 15, { width: 500 });

        // Footer
        doc.fillColor('#444444')
           .fontSize(10)
           .text('Thank you for booking with Mantralayam Lodges. We wish you a peaceful stay!', 50, 700, { align: 'center', width: 500 });

        doc.end();
    });
};

function generateTableRow(doc, y, c1, c2, c3, c4) {
    doc.fontSize(10)
       .text(c1, 50, y)
       .text(c2, 200, y)
       .text(c3, 350, y, { width: 50, align: 'right' })
       .text(c4, 450, y, { width: 100, align: 'right' });
}

function generateHr(doc, y) {
    doc.strokeColor('#aaaaaa')
       .lineWidth(1)
       .moveTo(50, y)
       .lineTo(550, y)
       .stroke();
}

module.exports = { generateInvoicePDF };
