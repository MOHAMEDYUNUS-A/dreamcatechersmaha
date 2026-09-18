/**
 * Source and UTM Tracking Module
 */
import { CONFIG } from '../config.js';

export function getTrackingData() {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  // Primary source parameter: qr, nfc, whatsapp, website, linkedin, email, or direct
  const rawSource = params.get('source');
  const sourceChannel = rawSource ? rawSource.toLowerCase().trim() : 'direct';

  // UTM Parameters
  const utmSource = params.get('utm_source') || '';
  const utmMedium = params.get('utm_medium') || '';
  const utmCampaign = params.get('utm_campaign') || '';
  const utmContent = params.get('utm_content') || '';
  const utmTerm = params.get('utm_term') || '';

  return {
    source: 'Digital Visiting Card',
    source_channel: sourceChannel,
    card_slug: CONFIG.person.vcardSlug,
    utm: {
      utm_source: utmSource,
      utm_medium: utmMedium,
      utm_campaign: utmCampaign,
      utm_content: utmContent,
      utm_term: utmTerm
    },
    page_url: window.location.href,
    referrer: document.referrer || 'direct',
    timestamp: new Date().toISOString(),
    user_agent: navigator.userAgent
  };
}

/**
 * Returns canonical URL with source parameter
 */
export function getSourceUrl(sourceType = 'qr') {
  const base = `${window.location.origin}${window.location.pathname}`;
  return `${base}?source=${encodeURIComponent(sourceType)}`;
}
