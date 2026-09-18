/**
 * vCard 3.0 Generator & Contact Saver
 */
import { CONFIG } from '../config.js';

/**
 * Builds standard RFC 2426 vCard 3.0 string
 */
export function buildVCardString() {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${CONFIG.person.fullName}`,
    'N:Rafi;Mohamed;;;',
    `TITLE:${CONFIG.person.designation}`,
    `ORG:${CONFIG.company.name}`,
    `TEL;TYPE=CELL:${CONFIG.person.normalizedPhone}`,
    `EMAIL:${CONFIG.person.email}`,
    `ADR;TYPE=WORK:;;${CONFIG.company.address.street};${CONFIG.company.address.city};;${CONFIG.company.address.postalCode};${CONFIG.company.address.country}`,
    `URL:${CONFIG.company.website}`,
    'NOTE;CHARSET=UTF-8:Workforce Saudia - Professional Workforce & Business Solutions',
    'END:VCARD'
  ].join('\r\n');

  return vcard;
}

/**
 * Dynamically creates a Blob and triggers client-side download without backend
 */
export function downloadVCard() {
  try {
    const vcardData = buildVCardString();
    const blob = new Blob([vcardData], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', CONFIG.vcard.fileName);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    
    // Clean up to prevent memory leaks
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 250);

    return true;
  } catch (error) {
    console.error('vCard generation error:', error);
    return false;
  }
}

/**
 * Initializes assisted vCard experience on initial load
 * Mobile browsers often block automatic downloads, so we provide an elegant
 * non-intrusive notification banner on the first visit with 1-tap confirmation.
 */
export function initAssistedVCard() {
  if (!CONFIG.vcard.autoDownloadPrompt) return;

  const hasBeenPrompted = sessionStorage.getItem(CONFIG.vcard.sessionKey);
  if (hasBeenPrompted) return;

  // Mark as prompted in session
  sessionStorage.setItem(CONFIG.vcard.sessionKey, 'true');

  // Check if user arrived via QR or NFC
  const params = new URLSearchParams(window.location.search);
  const source = params.get('source');
  const isDirectTapOrScan = source === 'qr' || source === 'nfc';

  // Delay slightly for loading screen completion
  setTimeout(() => {
    const toast = document.getElementById('vcard-assisted-toast');
    if (toast) {
      toast.classList.add('visible');
    }
  }, 1800);
}
