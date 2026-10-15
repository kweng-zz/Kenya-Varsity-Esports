/**
 * Client-side helpers that generate the KVE e-ticket PDF (one page per ticket
 * code) and trigger the download. `jspdf` and `qrcode` are loaded on demand so
 * they stay out of the initial bundle.
 *
 * This module is browser-only and must only be imported from client
 * components (it is intentionally not re-exported by `src/lib/tickets/index.ts`,
 * which pulls in server-only Appwrite code).
 */

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    img.src = src;
  });
}

/**
 * Load the KVE logo and return a tightly-cropped PNG data URL (transparent
 * padding trimmed off) so it can be embedded cleanly in the PDF.
 * Returns null when the logo cannot be processed (text fallback handles it).
 */
async function loadCroppedLogo(): Promise<{ dataUrl: string; width: number; height: number } | null> {
  try {
    const img = await loadImageElement('/images/KVE%20white%20no%20words.png');

    // Work on a downscaled copy - plenty of detail for print and fast to scan
    const work = 1024;
    const canvas = document.createElement('canvas');
    canvas.width = work;
    canvas.height = work;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, work, work);

    // Find the bounding box of all visible (non-transparent) pixels
    const { data } = ctx.getImageData(0, 0, work, work);
    let minX = work, minY = work, maxX = -1, maxY = -1;
    for (let y = 0; y < work; y++) {
      for (let x = 0; x < work; x++) {
        if (data[(y * work + x) * 4 + 3] > 8) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX < minX || maxY < minY) return null;

    const pad = Math.round(work * 0.012);
    minX = Math.max(0, minX - pad);
    minY = Math.max(0, minY - pad);
    maxX = Math.min(work - 1, maxX + pad);
    maxY = Math.min(work - 1, maxY + pad);
    const cropW = maxX - minX + 1;
    const cropH = maxY - minY + 1;

    const cropped = document.createElement('canvas');
    cropped.width = cropW;
    cropped.height = cropH;
    const croppedCtx = cropped.getContext('2d');
    if (!croppedCtx) return null;
    croppedCtx.drawImage(canvas, minX, minY, cropW, cropH, 0, 0, cropW, cropH);

    return { dataUrl: cropped.toDataURL('image/png'), width: cropW, height: cropH };
  } catch {
    return null;
  }
}

/**
 * Generate a multi-page PDF (one e-ticket per page) with QR codes and save it.
 */
export async function downloadTicketsPdf(purchase: any, codes: string[]) {
  const { jsPDF } = await import('jspdf');
  const QRCode = await import('qrcode');

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const pageWidth = 210;
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;

  const BRAND: [number, number, number] = [140, 17, 13];
  const DARK: [number, number, number] = [26, 26, 26];
  const GRAY: [number, number, number] = [110, 110, 110];
  const LIGHT: [number, number, number] = [245, 245, 245];

  const eventTitle = purchase.eventTitle || 'Event';
  const ticketTypeName = purchase.ticketTypeName || 'Standard Admission';
  const holder = purchase.userName || '\u2014';
  const confirmationCode = purchase.confirmationCode || purchase.purchaseId || '';
  const eventDate = purchase.eventDate
    ? new Date(purchase.eventDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'TBA';
  const eventTime = purchase.eventTime
    ? new Date(purchase.eventTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : 'TBA';
  const eventVenue = purchase.eventVenue || 'TBA';
  const total = codes.length;

  // Brand logo (white variant for dark backgrounds) - cropped on demand
  const logo = await loadCroppedLogo();

  for (let i = 0; i < total; i++) {
    const code = codes[i];
    if (i > 0) doc.addPage();

    // Double frame
    doc.setDrawColor(...DARK);
    doc.setLineWidth(0.6);
    doc.rect(margin, margin, contentWidth, 269);
    doc.setDrawColor(...BRAND);
    doc.setLineWidth(0.3);
    doc.rect(margin + 2, margin + 2, contentWidth - 4, 265);

    // Header band
    doc.setFillColor(...DARK);
    doc.rect(margin + 2, margin + 2, contentWidth - 4, 32, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(`TICKET ${i + 1} OF ${total}`, pageWidth - margin - 6, margin + 9, { align: 'right' });

    if (logo) {
      // White KVE logo over the dark band
      const logoHeight = 15;
      const logoWidth = logoHeight * (logo.width / logo.height);
      doc.addImage(logo.dataUrl, 'PNG', (pageWidth - logoWidth) / 2, margin + 4, logoWidth, logoHeight);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(185, 185, 185);
      doc.text('KENYA VARSITY ESPORTS \u2022 OFFICIAL E-TICKET', pageWidth / 2, margin + 28.5, { align: 'center', charSpace: 1 });
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('KVE', pageWidth / 2, margin + 17, { align: 'center', charSpace: 2 });
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(185, 185, 185);
      doc.text('KENYA VARSITY ESPORTS', pageWidth / 2, margin + 23, { align: 'center', charSpace: 1.5 });
      doc.setFontSize(7);
      doc.text('OFFICIAL E-TICKET', pageWidth / 2, margin + 30, { align: 'center', charSpace: 1 });
    }

    // Event title
    doc.setFillColor(...LIGHT);
    doc.rect(margin + 6, margin + 42, contentWidth - 12, 22, 'F');
    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    const titleLines = doc.splitTextToSize(eventTitle, contentWidth - 24) as string[];
    const titleY = margin + 42 + (titleLines.length > 1 ? 9.5 : 13.5);
    titleLines.slice(0, 2).forEach((line, li) => {
      doc.text(line, pageWidth / 2, titleY + li * 7, { align: 'center' });
    });

    // QR code
    const qrDataUrl = await QRCode.toDataURL(code, { width: 320, margin: 1 });
    doc.setDrawColor(...BRAND);
    doc.setLineWidth(0.8);
    doc.rect(margin + 6, 92, 72, 72);
    doc.addImage(qrDataUrl, 'PNG', margin + 10, 96, 64, 64);
    doc.setTextColor(...GRAY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('SCAN AT ENTRY', margin + 6 + 36, 169.5, { align: 'center', charSpace: 0.8 });

    // Ticket details
    const detailsX = 104;
    const detailsWidth = 92;
    let rowY = 96;
    const addRow = (label: string, value: string) => {
      doc.setTextColor(...GRAY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.text(label.toUpperCase(), detailsX, rowY, { charSpace: 0.7 });
      doc.setTextColor(...DARK);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      const lines = doc.splitTextToSize(value, detailsWidth) as string[];
      doc.text(lines.slice(0, 2), detailsX, rowY + 5.5);
      rowY += 13;
    };
    addRow('Date', eventDate);
    addRow('Time', eventTime);
    addRow('Venue', eventVenue);
    addRow('Ticket Type', ticketTypeName);
    addRow('Attendee', holder);
    addRow('Confirmation', confirmationCode);
    addRow('Order ID', purchase.purchaseId || '\u2014');

    // Ticket code band
    doc.setFillColor(...LIGHT);
    doc.rect(margin + 6, 188, contentWidth - 12, 18, 'F');
    doc.setTextColor(...GRAY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('TICKET CODE', pageWidth / 2, 194, { align: 'center', charSpace: 1 });
    doc.setTextColor(...BRAND);
    doc.setFont('courier', 'bold');
    doc.setFontSize(12);
    doc.text(code, pageWidth / 2, 201, { align: 'center' });

    // Perforation line
    doc.setLineDashPattern([1.2, 1.2], 0);
    doc.setDrawColor(190, 190, 190);
    doc.setLineWidth(0.25);
    doc.line(margin + 6, 212, pageWidth - margin - 6, 212);
    doc.setLineDashPattern([], 0);

    // Important information
    doc.setTextColor(...DARK);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.text('IMPORTANT INFORMATION', margin + 6, 221);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...GRAY);
    const notices = [
      'Present this e-ticket on your mobile device or as a printout at the event entrance.',
      'Each ticket code can only be scanned once - duplicates will be rejected.',
      'Arrive at least 30 minutes before the event starts.',
      'A valid photo ID matching the ticket holder name may be required.',
    ];
    let noticeY = 228.5;
    for (const notice of notices) {
      const lines = doc.splitTextToSize(notice, contentWidth - 18) as string[];
      doc.text('\u2022', margin + 6, noticeY);
      doc.text(lines, margin + 11, noticeY);
      noticeY += lines.length * 4.4 + 2;
    }

    // Footer
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.2);
    doc.line(margin + 6, 268, pageWidth - margin - 6, 268);
    doc.setFontSize(7.5);
    doc.setTextColor(...GRAY);
    doc.text('KVE - www.kve.co.ke', margin + 6, 274);
    doc.text(`Ticket ${i + 1} of ${total} - ${confirmationCode}`, pageWidth - margin - 6, 274, {
      align: 'right',
    });
  }

  const fileBase = (eventTitle || 'kve-tickets')
    .replace(/[^a-z0-9]+/gi, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  doc.save(`${fileBase || 'kve-tickets'}-${confirmationCode || 'tickets'}.pdf`);
}
