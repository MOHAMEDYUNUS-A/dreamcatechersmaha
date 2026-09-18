/**
 * Dynamic QR Code Generator
 */
import QRCode from 'qrcode';
import { getSourceUrl } from './tracking.js';

export async function renderQRCode(canvasElement, targetUrl = null) {
  if (!canvasElement) return;

  const url = targetUrl || getSourceUrl('qr');

  try {
    await QRCode.toCanvas(canvasElement, url, {
      width: 220,
      margin: 2,
      color: {
        dark: '#08484B',    // Deep corporate teal
        light: '#FFFFFF'   // Pure white for maximum contrast & reliable scanning
      },
      errorCorrectionLevel: 'M'
    });

    return true;
  } catch (err) {
    console.error('Failed to generate QR code:', err);
    return false;
  }
}

export function downloadQRCode(canvasElement, filename = 'mohamed-rafi-workforce-qr.png') {
  if (!canvasElement) return;
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvasElement.toDataURL('image/png');
  link.click();
}
