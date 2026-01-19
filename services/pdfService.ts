import jsPDF from 'jspdf';

export const generatePDF = (noticeText: string, language: 'EN' | 'HI' | 'MR') => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  
  // Set font
  pdf.setFont('Helvetica');

  // Add header
  pdf.setFontSize(16);
  pdf.setFont('Helvetica', 'bold');
  pdf.text('LEGAL NOTICE', margin, margin + 10);

  // Add metadata
  pdf.setFontSize(10);
  pdf.setFont('Helvetica', 'normal');
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  pdf.text(`Generated: ${dateStr}`, margin, margin + 20);
  
  if (language !== 'EN') {
    const langName = language === 'HI' ? 'Hindi' : 'Marathi';
    pdf.text(`Language: ${langName}`, margin, margin + 26);
  }

  // Add horizontal line
  pdf.setDrawColor(0);
  pdf.line(margin, margin + 30, pageWidth - margin, margin + 30);

  // Split text into lines that fit the page width
  const lines = pdf.splitTextToSize(noticeText, maxWidth);
  
  let yPosition = margin + 40;
  const lineHeight = 6;
  
  // Add text content
  pdf.setFontSize(11);
  pdf.setFont('Helvetica', 'normal');
  
  for (let i = 0; i < lines.length; i++) {
    if (yPosition > pageHeight - margin - 30) {
      // Add new page if content exceeds current page
      pdf.addPage();
      yPosition = margin;
    }
    pdf.text(lines[i], margin, yPosition);
    yPosition += lineHeight;
  }

  // Add footer
  yPosition = pageHeight - margin;
  pdf.setFontSize(9);
  pdf.setFont('Helvetica', 'italic');
  pdf.setTextColor(100);
  pdf.text('This notice has been AI-generated. Consult with a qualified lawyer before sending.', margin, yPosition - 5);
  
  // Add signature line
  pdf.line(margin, yPosition - 15, margin + 40, yPosition - 15);
  pdf.text('Signature', margin, yPosition - 10);

  return pdf;
};

export const downloadPDF = (pdf: jsPDF, filename: string = 'legal_notice.pdf') => {
  pdf.save(filename);
};

export const printPDF = (pdf: jsPDF) => {
  const pdfBlob = pdf.output('blob');
  const url = URL.createObjectURL(pdfBlob);
  const printWindow = window.open(url, '_blank');
  if (printWindow) {
    printWindow.onload = () => {
      printWindow.print();
    };
  }
};
