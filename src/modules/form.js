/**
 * Lead Capture Form & Make.com Webhook Integration
 */
import { CONFIG } from '../config.js';
import { getTrackingData } from './tracking.js';

/**
 * Normalizes phone numbers, specifically supporting Saudi (+966) formats:
 * - 05XXXXXXXX -> +9665XXXXXXXX
 * - 9665XXXXXXXX -> +9665XXXXXXXX
 * - +9665XXXXXXXX -> +9665XXXXXXXX
 */
export function normalizePhone(rawPhone) {
  if (!rawPhone) return '';
  let cleaned = rawPhone.replace(/[\s\-\(\)]/g, '').trim();

  // Saudi 05xxxxxxxx format
  if (/^05\d{8}$/.test(cleaned)) {
    return '+966' + cleaned.substring(1);
  }
  // Saudi 9665xxxxxxxx format without +
  if (/^9665\d{8}$/.test(cleaned)) {
    return '+' + cleaned;
  }
  // If already +9665xxxxxxxx
  if (/^\+9665\d{8}$/.test(cleaned)) {
    return cleaned;
  }
  // Other general numbers with country code or national digits
  if (!cleaned.startsWith('+') && cleaned.length >= 8) {
    return '+' + cleaned;
  }
  return cleaned;
}

export function isValidPhone(phone) {
  const normalized = normalizePhone(phone);
  // Validates Saudi format +9665XXXXXXXX or general E.164 +[1-9][0-9]{7,14}
  const saudiRegex = /^\+9665\d{8}$/;
  const generalE164Regex = /^\+[1-9]\d{7,14}$/;
  return saudiRegex.test(normalized) || generalE164Regex.test(normalized);
}

export function isValidEmail(email) {
  if (!email || !email.trim()) return true; // Optional field
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function initForm() {
  const form = document.getElementById('connect-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const successBox = document.getElementById('form-success-state');
  const errorBox = document.getElementById('form-error-state');
  const resetBtn = document.getElementById('form-reset-btn');

  if (!form) return;

  // Auto-fill enquiry types in select dropdown
  const enquirySelect = document.getElementById('enquiry_type');
  if (enquirySelect && enquirySelect.children.length <= 1) {
    CONFIG.enquiryTypes.forEach(type => {
      const opt = document.createElement('option');
      opt.value = type;
      opt.textContent = type;
      enquirySelect.appendChild(opt);
    });
  }

  // Real-time phone formatting guidance
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('blur', () => {
      const val = phoneInput.value.trim();
      if (val) {
        phoneInput.value = normalizePhone(val);
      }
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Honeypot check: reject bots filling hidden input
    const honeypot = document.getElementById('website_hp')?.value;
    if (honeypot) {
      console.warn('Spam detected via honeypot.');
      return;
    }

    // Collect field values
    const fullName = document.getElementById('full_name')?.value.trim() || '';
    const companyName = document.getElementById('company_name')?.value.trim() || '';
    const rawPhone = document.getElementById('phone')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const country = document.getElementById('country')?.value.trim() || '';
    const jobTitle = document.getElementById('job_title')?.value.trim() || '';
    const enquiryType = document.getElementById('enquiry_type')?.value || '';
    const message = document.getElementById('message')?.value.trim() || '';
    const consent = document.getElementById('consent')?.checked || false;

    // Reset previous errors
    clearFormErrors();

    // Validate required fields
    let hasError = false;

    if (!fullName || fullName.length < 2) {
      showFieldError('full_name', 'Please enter your full name.');
      hasError = true;
    }

    if (!rawPhone || !isValidPhone(rawPhone)) {
      showFieldError('phone', 'Please enter a valid phone number (e.g. 055 395 1303 or +966...)');
      hasError = true;
    }

    if (email && !isValidEmail(email)) {
      showFieldError('email', 'Please enter a valid email address.');
      hasError = true;
    }

    if (!enquiryType) {
      showFieldError('enquiry_type', 'Please select an enquiry category.');
      hasError = true;
    }

    if (!message || message.length < 5) {
      showFieldError('message', 'Please enter your enquiry message (at least 5 characters).');
      hasError = true;
    }

    if (!consent) {
      showFieldError('consent', 'Please accept the consent to proceed.');
      hasError = true;
    }

    if (hasError) return;

    // Build payload matching exact specifications
    const tracking = getTrackingData();
    const normalizedPhone = normalizePhone(rawPhone);

    const payload = {
      source: tracking.source,
      source_channel: tracking.source_channel,
      card_slug: tracking.card_slug,

      person: {
        name: CONFIG.person.fullName,
        designation: CONFIG.person.designation,
        company: CONFIG.company.name
      },

      visitor: {
        name: fullName,
        company_name: companyName,
        phone: normalizedPhone,
        email: email,
        country: country || 'Saudi Arabia',
        job_title: jobTitle,
        enquiry_type: enquiryType,
        message: message
      },

      consent: consent,

      utm: tracking.utm,
      page_url: tracking.page_url,
      referrer: tracking.referrer,
      timestamp: tracking.timestamp,
      user_agent: tracking.user_agent
    };

    // UI Loading state
    setSubmitting(true);
    hideAlerts();

    try {
      const isPlaceholderWebhook = !CONFIG.MAKE_WEBHOOK_URL || 
        CONFIG.MAKE_WEBHOOK_URL.includes('YOUR_MAKE_WEBHOOK_URL');

      if (isPlaceholderWebhook) {
        // Simulation mode with realistic network delay & local cache
        await new Promise(res => setTimeout(res, 950));
        saveLocalLead(payload);
        showSuccessState(payload.visitor.name);
      } else {
        // Live Make.com Webhook POST
        const response = await fetch(CONFIG.MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error(`Webhook responded with status ${response.status}`);
        }

        saveLocalLead(payload);
        showSuccessState(payload.visitor.name);
      }

      form.reset();
    } catch (err) {
      console.error('Form submission failed:', err);
      showErrorState();
    } finally {
      setSubmitting(false);
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      hideAlerts();
      form.style.display = 'block';
    });
  }

  function setSubmitting(isSubmitting) {
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.btn-spinner');
    if (btnText) btnText.textContent = isSubmitting ? 'Sending...' : 'SEND ENQUIRY';
    if (spinner) spinner.style.display = isSubmitting ? 'inline-block' : 'none';
  }

  function showSuccessState(name) {
    form.style.display = 'none';
    if (successBox) {
      successBox.style.display = 'block';
      const nameEl = successBox.querySelector('.visitor-confirm-name');
      if (nameEl) nameEl.textContent = name || '';
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function showErrorState() {
    if (errorBox) {
      errorBox.style.display = 'block';
      errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function hideAlerts() {
    if (successBox) successBox.style.display = 'none';
    if (errorBox) errorBox.style.display = 'none';
  }

  function showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    field.classList.add('input-error');
    const errEl = document.getElementById(`${fieldId}-error`);
    if (errEl) {
      errEl.textContent = message;
      errEl.style.display = 'block';
    }
  }

  function clearFormErrors() {
    const errorMessages = form.querySelectorAll('.field-error');
    errorMessages.forEach(el => {
      el.textContent = '';
      el.style.display = 'none';
    });
    const errorInputs = form.querySelectorAll('.input-error');
    errorInputs.forEach(el => el.classList.remove('input-error'));
  }

  function saveLocalLead(lead) {
    try {
      const stored = JSON.parse(localStorage.getItem('workforce_leads') || '[]');
      stored.push(lead);
      localStorage.setItem('workforce_leads', JSON.stringify(stored));
    } catch (e) {
      console.warn('Storage quota or disabled:', e);
    }
  }
}
