/**
 * DREAM CATCHERS FOUNDATION - JASIM FAWAZ U
 * Documentation & IT Officer
 * Executive Digital Visiting Card & Profile Platform
 */

// ==========================================================
// CENTRAL CONFIGURATION
// ==========================================================
const CARD_CONFIG = {
  person: {
    fullName: "JASIM FAWAZ U",
    displayName: "Jasim Fawaz U",
    title: "Documentation & IT Officer",
    phone: "+91 94431 92318",
    normalizedPhone: "+919443192318",
    profileImage: "assets/jasim-fawaz.png",
    bio: "Documentation & IT Officer at Dream Catchers Foundation. Managing organizational documentation, digital systems, and technical infrastructure while actively driving youth empowerment, education initiatives, and community impact across Tamil Nadu."
  },
  organization: {
    name: "Dream Catchers Foundation",
    motto: "Lets Catch Yours",
    tagline: "If it hides we will find it, If it is tough we will hunt it TOGETHER",
    website: "https://dreamcatchersfdn.org/",
    logo: "assets/dream-catchers-logo.jpg",
    address: "Plot No 7, Vasanth Nagar, Mutharasanallur, Trichy - 620101",
    headOffice: "NO : 42, 3rd Main Road, Ponnagar, Trichy - 620001",
    email: "dreamcatchersfoundationforall@gmail.com",
    officialPhone: "+91 87789 75962",
    officialWhatsApp: "+91 9087197736"
  },
  vcardFileName: "jasim-fawaz.vcf",
  whatsappPresetMessage: "Hello Jasim Fawaz, I am connecting with you through your Dream Catchers Foundation executive card."
};

// ==========================================================
// INITIALIZATION
// ==========================================================
document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  // 1. Dynamic Year
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2. Setup Action Listeners
  initializeActions();

  // 3. Setup Copy Address / Share Action
  initShareAndCopy();

  // 4. Interactive 3D Card Tilt on Portrait
  initCard3DTilt();

  // 5. Animated Number Counters
  initNumberCounters();

  // 6. AUTOMATIC VCARD DOWNLOAD ON PAGE LOAD
  setTimeout(() => {
    autoDownloadVCard();
  }, 600);
}

// ==========================================================
// VCARD GENERATION & DOWNLOAD
// ==========================================================
function generateVCardBlob() {
  const vcardText = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${CARD_CONFIG.person.fullName}`,
    "N:Fawaz U;Jasim;;;",
    `ORG:${CARD_CONFIG.organization.name}`,
    `TITLE:${CARD_CONFIG.person.title}`,
    `TEL;TYPE=CELL,VOICE,PREF:${CARD_CONFIG.person.normalizedPhone}`,
    `ADR;TYPE=WORK,POSTAL:;;Plot No 7, Vasanth Nagar;Mutharasanallur;Trichy;620101;Tamil Nadu, India`,
    `URL:${CARD_CONFIG.organization.website}`,
    `NOTE:${CARD_CONFIG.organization.name} - ${CARD_CONFIG.organization.motto} | ${CARD_CONFIG.person.title}`,
    "END:VCARD"
  ].join("\r\n");

  return new Blob([vcardText], { type: "text/vcard;charset=utf-8" });
}

function triggerDownload(isAuto = false) {
  try {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    const a = document.createElement("a");
    a.href = CARD_CONFIG.vcardFileName;
    a.download = CARD_CONFIG.vcardFileName;
    if (isIOS) a.target = "_blank";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();

    setTimeout(() => {
      if (a.parentNode) document.body.removeChild(a);
    }, 600);

    if (isAuto) {
      showToast("Jasim Fawaz's vCard downloaded automatically!");
    } else {
      showToast("Jasim Fawaz's contact card saved!");
    }
    return true;
  } catch (err) {
    console.error("Direct file download fallback:", err);
    try {
      const blob = generateVCardBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = CARD_CONFIG.vcardFileName;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        if (a.parentNode) document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 600);
      showToast("Jasim Fawaz's contact card saved!");
      return true;
    } catch (e) {
      console.error("Blob vCard fallback failed:", e);
      return false;
    }
  }
}

function autoDownloadVCard() {
  triggerDownload(true);
}

function downloadVCard() {
  triggerDownload(false);
}

// ==========================================================
// ACTIONS & COMMUNICATION HANDLERS
// ==========================================================
function initializeActions() {
  // Download vCard buttons
  document.querySelectorAll(".action-download-vcard").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      downloadVCard();
    });
  });

  // WhatsApp preset link
  const waUrl = `https://wa.me/${CARD_CONFIG.person.normalizedPhone.replace("+", "")}?text=${encodeURIComponent(CARD_CONFIG.whatsappPresetMessage)}`;
  document.querySelectorAll(".link-whatsapp").forEach((link) => {
    link.href = waUrl;
  });

  // Direct Call links
  document.querySelectorAll(".link-call").forEach((link) => {
    link.href = `tel:${CARD_CONFIG.person.normalizedPhone}`;
  });
}

// ==========================================================
// SHARE & COPY HELPERS
// ==========================================================
function initShareAndCopy() {
  // Copy Address Button
  const copyAddressBtn = document.getElementById("btn-copy-address");
  if (copyAddressBtn) {
    copyAddressBtn.addEventListener("click", async () => {
      const addressText = "Plot No 7, Vasanth Nagar, Mutharasanallur, Trichy - 620101, Tamil Nadu";
      try {
        await navigator.clipboard.writeText(addressText);
        showToast("Address copied to clipboard!");
      } catch (err) {
        showToast("Address copied!");
      }
    });
  }

  // Share Card Button
  const shareBtn = document.getElementById("btn-share-card");
  if (shareBtn) {
    shareBtn.addEventListener("click", async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "JASIM FAWAZ U — Documentation & IT Officer | Dream Catchers Foundation",
            text: "Official Digital Executive Card of Jasim Fawaz U (Documentation & IT Officer - Dream Catchers Foundation)",
            url: window.location.href
          });
        } catch (e) {
          // User cancelled
        }
      } else {
        try {
          await navigator.clipboard.writeText(window.location.href);
          showToast("Digital card link copied!");
        } catch (e) {
          showToast("Link ready to share!");
        }
      }
    });
  }
}

// ==========================================================
// INTERACTIVE 3D TILT EFFECT
// ==========================================================
function initCard3DTilt() {
  const card = document.querySelector(".hero-portrait-frame");
  if (!card) return;

  const wrapper = document.querySelector(".hero-portrait-wrapper");
  if (!wrapper) return;

  wrapper.addEventListener("mousemove", (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  wrapper.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  });
}

// ==========================================================
// ANIMATED NUMBER COUNTERS
// ==========================================================
function initNumberCounters() {
  const statNumbers = document.querySelectorAll(".stat-number[data-target]");
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute("data-target"), 10);
        const suffix = el.getAttribute("data-suffix") || "";
        let current = 0;
        const step = Math.max(1, Math.floor(target / 40));
        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            el.textContent = target.toLocaleString() + suffix;
            clearInterval(timer);
          } else {
            el.textContent = current.toLocaleString() + suffix;
          }
        }, 30);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  statNumbers.forEach((el) => observer.observe(el));
}

// Toast notification helper
function showToast(message) {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "active-toast";
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.classList.add("toast-visible");
  });

  setTimeout(() => {
    toast.classList.remove("toast-visible");
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 350);
  }, 3400);
}
