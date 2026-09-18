/**
 * Main Application Logic for Workforce Saudia Digital Business Card
 * Mohamed Rafi - Area Sales Manager
 */

import { CONFIG } from './config.js';
import { downloadVCard, initAssistedVCard } from './modules/vcard.js';
import { renderQRCode, downloadQRCode } from './modules/qr.js';
import { initForm } from './modules/form.js';
import { getTrackingData, getSourceUrl } from './modules/tracking.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Branded QR / NFC Splash Experience
  initSplashController();

  // 2. Initialize Dynamic QR Code
  initQR();

  // 3. Bind Save Contact / vCard Actions
  initVCardActions();

  // 4. Initialize Interactive 3D Card Tilt
  initCard3DTilt();

  // 5. Populate Dynamic Services & Stats
  populateConfigContent();

  // 6. Bind Web Share & Copy Actions
  initShareActions();

  // 7. Bind NFC Badge Action
  initNFCActions();

  // 8. Initialize Lead Capture Form & Webhook
  initForm();

  // 9. Check Assisted vCard Experience
  initAssistedVCard();
});

/**
 * 01. Premium QR Scan / NFC Splash Experience Controller
 * Staggered timeline:
 * 0ms: Background appears
 * 150ms: Geometric lines drawing
 * 300ms: Workforce Saudia logo fade/scale
 * 600ms: Arabic company branding
 * 850ms: NFC/QR indicator
 * 1050ms: محمد رافي appears
 * 1250ms: Mohamed Rafi & Area Sales Manager appears
 * 1500ms - 1700ms: Smooth transition into main digital card
 */
function initSplashController() {
  const splashScreen = document.getElementById('splash-screen');
  const appContainer = document.querySelector('.app-container');
  const skipBtn = document.getElementById('splash-skip-button');
  const sourceLabel = document.getElementById('splash-source-label');

  if (!splashScreen) {
    if (appContainer) appContainer.classList.add('card-revealed');
    return;
  }

  // Dynamic QR / Source Awareness
  const params = new URLSearchParams(window.location.search);
  const source = (params.get('source') || '').toLowerCase().trim();

  if (sourceLabel) {
    if (source === 'qr') {
      sourceLabel.textContent = 'SCANNED DIGITAL CARD';
    } else if (source === 'nfc') {
      sourceLabel.textContent = 'TAP TO CONNECT';
    } else if (source === 'whatsapp') {
      sourceLabel.textContent = 'WHATSAPP CONNECT';
    } else {
      sourceLabel.textContent = 'TAP OR SCAN TO CONNECT';
    }
  }

  // Return visitor session handling
  const isReturnVisit = sessionStorage.getItem('digitalCardIntroShown') === 'true';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let splashDuration = 1600; // Normal ~1.6s duration
  if (prefersReduced) {
    splashDuration = 100;
  } else if (isReturnVisit) {
    splashDuration = 450; // Compact transition for return visits in same session
  }

  let transitionTriggered = false;

  function dismissSplash() {
    if (transitionTriggered) return;
    transitionTriggered = true;

    sessionStorage.setItem('digitalCardIntroShown', 'true');

    // Reveal main digital card emerging upward
    if (appContainer) {
      appContainer.classList.add('card-revealed');
    }

    // Animate splash exit (desktop 3D tilt-out or mobile translate-up)
    splashScreen.classList.add('splash-exiting');

    setTimeout(() => {
      splashScreen.style.display = 'none';
      splashScreen.remove();
    }, 550);
  }

  // Automatic transition timer
  const timer = setTimeout(dismissSplash, splashDuration);

  // Unobtrusive "View Card" Skip button
  if (skipBtn) {
    skipBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      clearTimeout(timer);
      dismissSplash();
    });
  }
}

/**
 * 10. Dynamic QR Code Engine
 */
async function initQR() {
  const qrCanvas = document.getElementById('qr-canvas');
  if (!qrCanvas) return;

  const targetUrl = getSourceUrl('qr');
  await renderQRCode(qrCanvas, targetUrl);

  const downloadBtn = document.getElementById('btn-download-qr');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      downloadQRCode(qrCanvas, 'mohamed-rafi-workforce-qr.png');
    });
  }

  const copyQrBtn = document.getElementById('btn-copy-link');
  if (copyQrBtn) {
    copyQrBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(targetUrl);
        const originalText = copyQrBtn.innerHTML;
        copyQrBtn.innerHTML = '<span>✓ Copied!</span>';
        setTimeout(() => {
          copyQrBtn.innerHTML = originalText;
        }, 2000);
      } catch (e) {
        prompt('Copy this card link:', targetUrl);
      }
    });
  }
}

/**
 * 04 & 12. Save Contact (vCard 3.0) Triggers
 */
function initVCardActions() {
  const saveButtons = document.querySelectorAll('.action-save-vcard');
  saveButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const success = downloadVCard();
      if (success) {
        showToastNotification('Contact file (vCard) downloaded!');
      }
    });
  });

  // Assisted Toast Actions
  const toastAcceptBtn = document.getElementById('toast-vcard-btn');
  const toastCloseBtn = document.getElementById('toast-close-btn');
  const toastEl = document.getElementById('vcard-assisted-toast');

  if (toastAcceptBtn) {
    toastAcceptBtn.addEventListener('click', () => {
      downloadVCard();
      if (toastEl) toastEl.classList.remove('visible');
    });
  }

  if (toastCloseBtn) {
    toastCloseBtn.addEventListener('click', () => {
      if (toastEl) toastEl.classList.remove('visible');
    });
  }
}

/**
 * Interactive 3D Perspective Tilt for the physical card component
 */
function initCard3DTilt() {
  const card = document.getElementById('hero-digital-card');
  if (!card) return;

  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
  if (isTouch) return; // Keep performance optimal on mobile

  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
  });
}

/**
 * 06, 07, 17, 18. Configurable Content Population
 */
function populateConfigContent() {
  // Services / Business Solutions
  const servicesGrid = document.getElementById('services-grid-container');
  const servicesSection = document.getElementById('services-section');

  if (servicesGrid && CONFIG.services && CONFIG.services.length > 0) {
    servicesGrid.innerHTML = '';
    CONFIG.services.forEach(item => {
      const card = document.createElement('div');
      card.className = 'service-card';
      card.innerHTML = `
        <div class="service-icon-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="arabic-title arabic-text">${item.arabicTitle}</div>
        <h4>${item.title}</h4>
        <p>${item.description}</p>
      `;
      servicesGrid.appendChild(card);
    });
  } else if (servicesSection) {
    servicesSection.style.display = 'none';
  }

  // Statistics (Only rendered if enabled: true in config)
  const statsContainer = document.getElementById('stats-grid-container');
  const enabledStats = (CONFIG.stats || []).filter(s => s.enabled);
  if (statsContainer && enabledStats.length > 0) {
    statsContainer.innerHTML = '';
    enabledStats.forEach(stat => {
      const item = document.createElement('div');
      item.className = 'stat-item';
      item.innerHTML = `
        <div class="stat-val">${stat.value}</div>
        <div class="stat-lbl">${stat.label}</div>
      `;
      statsContainer.appendChild(item);
    });
  } else if (statsContainer) {
    statsContainer.style.display = 'none';
  }
}

/**
 * Native Web Share API
 */
function initShareActions() {
  const shareButtons = document.querySelectorAll('.action-share-card');
  shareButtons.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const shareData = {
        title: `${CONFIG.person.fullName} - ${CONFIG.company.name}`,
        text: `Connect with ${CONFIG.person.fullName}, ${CONFIG.person.designation} at ${CONFIG.company.name}.`,
        url: getSourceUrl('direct')
      };

      if (navigator.share) {
        try {
          await navigator.share(shareData);
        } catch (err) {
          if (err.name !== 'AbortError') {
            fallbackShare(shareData.url);
          }
        }
      } else {
        fallbackShare(shareData.url);
      }
    });
  });

  function fallbackShare(url) {
    navigator.clipboard.writeText(url).then(() => {
      showToastNotification('Card link copied to clipboard!');
    }).catch(() => {
      prompt('Share this card:', url);
    });
  }
}

/**
 * 09. NFC Tap Visual & Modal
 */
function initNFCActions() {
  const nfcBadge = document.getElementById('nfc-indicator-badge');
  if (nfcBadge) {
    nfcBadge.addEventListener('click', () => {
      const nfcUrl = getSourceUrl('nfc');
      showToastNotification(`NFC Active: Tap enabled card or scan QR to connect.`);
    });
  }
}

/**
 * Transient notification pill
 */
function showToastNotification(message) {
  let toast = document.getElementById('transient-floating-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'transient-floating-toast';
    toast.style.cssText = `
      position: fixed;
      top: 24px;
      left: 50%;
      transform: translateX(-50%) translateY(-20px);
      background: #0E292E;
      color: #FFFFFF;
      border: 1px solid rgba(15, 139, 141, 0.4);
      padding: 10px 20px;
      border-radius: 9999px;
      font-size: 0.84rem;
      font-weight: 600;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3);
      z-index: 10000;
      opacity: 0;
      transition: all 0.3s ease;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.style.opacity = '1';
  toast.style.transform = 'translateX(-50%) translateY(0)';

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(-20px)';
  }, 2600);
}
