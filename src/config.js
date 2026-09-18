/**
 * Central Configuration for Mohamed Rafi's Digital Business Card
 * WORKFORCE SAUDIA
 */

export const CONFIG = {
  // Webhook for Lead Capture / CRM Integration
  MAKE_WEBHOOK_URL: "https://hook.eu1.make.com/irql77cgi6tfik2iko1652h1ivtlcnvk",

  // Person Details
  person: {
    fullName: "Mohamed Rafi Niyaz Deen",
    arabicName: "محمد رافي نياز دين",
    designation: "Head of Business Development | Area Sales Manager",
    arabicDesignation: "مدير مبيعات المنطقة",
    phone: "+966 55 395 1303",
    normalizedPhone: "+966553951303",
    email: "mohamed.rafi@workforcesaudi.com",
    personalEmail: "mohamedrafi2512@gmail.com",
    vcardSlug: "mohamed-rafi",
    bio: "Connecting customers with reliable workforce solutions and building strong long-term business relationships across the Kingdom of Saudi Arabia and the GCC region.",
    arabicBio: "ربط العملاء بحلول قوى عاملة موثوقة وبناء شراكات تجارية متينة وطويلة الأجل في جميع أنحاء المملكة ومنطقة الخليج."
  },

  // Company Details
  company: {
    name: "WORKFORCE SAUDIA",
    arabicName: "القوات العاملة السعودية",
    website: "https://workforcesaudi.com",
    description: "Professional workforce and business solutions delivering executive talent, specialized staffing, and corporate support services across Saudi Arabia.",
    arabicDescription: "حلول احترافية للقوى العاملة ودعم الأعمال وتقديم الكوادر المؤهلة والخدمات المؤسسية عبر المملكة العربية السعودية.",
    address: {
      street: "6588 King Fahd Bin Abdul Aziz Road",
      district: "Al Khalidiyah Al Shamaliyah",
      city: "Dammam",
      postalCode: "32231",
      country: "Saudi Arabia",
      full: "6588 King Fahd Bin Abdul Aziz Road, Al Khalidiyah Al Shamaliyah, Dammam 32231, Saudi Arabia",
      arabicFull: "٦٥٨٨ طريق الملك فهد بن عبد العزيز، الخالدية الشمالية، الدمام ٣٢٢٣١، المملكة العربية السعودية"
    },
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("6588 King Fahd Bin Abdul Aziz Road, Al Khalidiyah Al Shamaliyah, Dammam 32231, Saudi Arabia")
  },

  // Enquiry Types for Lead Capture
  enquiryTypes: [
    "Business Enquiry",
    "Sales Enquiry",
    "Partnership",
    "Service Enquiry",
    "General Enquiry",
    "Other"
  ],

  // Business Solutions / Services (Configurable - set enabled: false to hide)
  services: [
    {
      id: "workforce-solutions",
      title: "Workforce Solutions",
      arabicTitle: "حلول القوى العاملة",
      description: "End-to-end recruitment, skilled personnel deployment, and comprehensive workforce management customized for industrial and corporate projects.",
      icon: "users"
    },
    {
      id: "business-support",
      title: "Business Support",
      arabicTitle: "دعم الأعمال المؤسسية",
      description: "Operational assistance, compliance facilitation, and administrative support ensuring smooth business continuity in the Kingdom.",
      icon: "briefcase"
    },
    {
      id: "staffing-solutions",
      title: "Staffing Solutions",
      arabicTitle: "حلول التوظيف والكوادر",
      description: "Flexible talent acquisition, short-term and long-term staffing solutions across engineering, technical, and executive sectors.",
      icon: "award"
    },
    {
      id: "corporate-services",
      title: "Corporate Services",
      arabicTitle: "الخدمات المؤسسية المتكاملة",
      description: "Tailored B2B services, onboarding management, and specialized corporate consultation aligned with Saudi Vision 2030 standards.",
      icon: "shield-check"
    }
  ],

  // Company Statistics (Configurable - defaults to false to avoid unverified claims)
  stats: [
    {
      value: "10+",
      label: "Years Experience",
      arabicLabel: "سنوات خبرة",
      enabled: false
    },
    {
      value: "500+",
      label: "Corporate Clients",
      arabicLabel: "عميل مؤسسي",
      enabled: false
    },
    {
      value: "100%",
      label: "Vision 2030 Compliance",
      arabicLabel: "التزام برؤية ٢٠٣٠",
      enabled: false
    }
  ],

  // Social and Direct Contact URLs
  social: {
    whatsapp: "https://wa.me/966553951303",
    call: "tel:+966553951303",
    email: "mailto:mohamed.rafi@workforcesaudi.com",
    website: "https://workforcesaudi.com",
    linkedin: "https://www.linkedin.com/company/workforcesaudi"
  },

  // vCard Configuration
  vcard: {
    fileName: "mohamed-rafi.vcf",
    autoDownloadPrompt: true, // Shows smart 1-time assisted contact saving toast
    sessionKey: "workforce_vcard_prompted"
  }
};
