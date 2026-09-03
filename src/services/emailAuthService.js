/**
 * Email OTP Auth Service for Sprint Marketplace.
 * Generates 6-digit codes, stores them in cloud, and sends via EmailJS.
 * Works on all devices: desktop, mobile, deployed and localhost.
 */

import emailjs from '@emailjs/browser';

const CLOUD_API_URL = "https://api.restful-api.dev/objects";

// Creator email for admin access
export const CREATOR_EMAIL = "sprintmarket383@gmail.com";

// EmailJS configuration — real credentials
const EMAILJS_CONFIG = {
  serviceId: "service_rnz66er",
  templateId: "template_3vx4uqc",
  publicKey: "a2Q8zBdk3etZILPf2"
};

let emailjsInitialized = false;

class EmailAuthService {
  constructor() {
    this.pendingCode = null;
    this.pendingCloudId = null;
  }

  /**
   * Generate a random 6-digit OTP code
   */
  generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Send verification code to user's email
   * Returns { success, code, cloudId }
   */
  async sendVerificationCode(name, email) {
    const code = this.generateCode();
    
    // Store code in cloud API for verification
    let cloudId = null;
    try {
      const res = await fetch(CLOUD_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'sprint_otp',
          data: {
            email: email.toLowerCase().trim(),
            userName: name,
            code,
            createdAt: Date.now(),
            verified: false
          }
        })
      });
      if (res.ok) {
        const obj = await res.json();
        cloudId = obj.id;
      }
    } catch (err) {
      console.warn("Cloud storage failed:", err);
    }

    // Send via EmailJS
    let emailSent = false;
    try {
      if (!emailjsInitialized) {
        emailjs.init(EMAILJS_CONFIG.publicKey);
        emailjsInitialized = true;
      }

      await emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
        to_email: email,
        to_name: name,
        passcode: code,
        otp: code,
        verification_code: code,
        message: `Your Sprint Marketplace verification code is: ${code}`
      });
      emailSent = true;
      console.log(`[EMAIL SENT] Code sent to ${email}`);
    } catch (err) {
      console.warn("EmailJS send failed:", err);
    }

    this.pendingCode = code;
    this.pendingCloudId = cloudId;

    // Also cache locally for instant verification
    try {
      localStorage.setItem('sprint_pending_otp', JSON.stringify({
        code,
        email: email.toLowerCase().trim(),
        name,
        cloudId,
        createdAt: Date.now()
      }));
    } catch {
      // ignore
    }

    return {
      success: true,
      code, // The actual code (used for fallback display if email not configured)
      cloudId,
      emailSent
    };
  }

  /**
   * Verify the code entered by user
   */
  async verifyCode(inputCode, email) {
    const trimmedCode = (inputCode || '').trim();
    const trimmedEmail = (email || '').toLowerCase().trim();

    // 1. Check local cache first (fastest)
    try {
      const cached = JSON.parse(localStorage.getItem('sprint_pending_otp') || '{}');
      if (cached.code === trimmedCode && cached.email === trimmedEmail) {
        // Code is valid and less than 10 minutes old
        if (Date.now() - cached.createdAt < 10 * 60 * 1000) {
          localStorage.removeItem('sprint_pending_otp');
          return {
            verified: true,
            userName: cached.name,
            email: cached.email
          };
        }
      }
    } catch {
      // ignore
    }

    // 2. Check in-memory
    if (this.pendingCode === trimmedCode) {
      this.pendingCode = null;
      return {
        verified: true,
        userName: '',
        email: trimmedEmail
      };
    }

    // 3. Check cloud API
    if (this.pendingCloudId) {
      try {
        const res = await fetch(`${CLOUD_API_URL}/${this.pendingCloudId}?_t=${Date.now()}`, {
          cache: 'no-store'
        });
        if (res.ok) {
          const obj = await res.json();
          if (obj?.data?.code === trimmedCode && obj?.data?.email === trimmedEmail) {
            return {
              verified: true,
              userName: obj.data.userName,
              email: obj.data.email
            };
          }
        }
      } catch {
        // ignore
      }
    }

    return { verified: false };
  }

  /**
   * Check if email is the creator's email
   */
  isCreatorEmail(email) {
    const clean = (email || '').toLowerCase().trim();
    return clean === CREATOR_EMAIL;
  }
}

export const emailAuthService = new EmailAuthService();

