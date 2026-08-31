/**
 * Global Realtime Telegram Messenger Auth Service for Sprint Marketplace.
 * Works seamlessly across Localhost, Google Hosting, Firebase, Vercel, and Mobile devices.
 */

const BOT_USERNAME = "SprintAuthBot";
const CLOUD_API_URL = "https://api.restful-api.dev/objects";

class TelegramMessengerAuthService {
  constructor() {
    this.botUsername = BOT_USERNAME;
  }

  /**
   * Creates a live cloud session accessible globally from any hosting or mobile device
   */
  async createCloudSession() {
    try {
      const localId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const res = await fetch(CLOUD_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'sprint_auth',
          data: {
            localId,
            authenticated: false,
            createdAt: Date.now()
          }
        })
      });

      if (res.ok) {
        const cloudObj = await res.json();
        const cloudId = cloudObj.id;
        const telegramDeepLink = `https://t.me/${BOT_USERNAME}?start=auth_${cloudId}`;

        return {
          success: true,
          sessionId: cloudId,
          botUsername: BOT_USERNAME,
          telegramDeepLink
        };
      }
    } catch (e) {
      console.warn("Cloud session creation failed, using fallback:", e);
    }

    // Fallback local session ID
    const fallbackId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return {
      success: true,
      sessionId: fallbackId,
      botUsername: BOT_USERNAME,
      telegramDeepLink: `https://t.me/${BOT_USERNAME}?start=auth_${fallbackId}`
    };
  }

  /**
   * Polls global cloud session status
   */
  async checkSessionStatus(sessionId) {
    try {
      // 1. Check Cloud API first (works on Google / production / any device)
      const res = await fetch(`${CLOUD_API_URL}/${sessionId}`);
      if (res.ok) {
        const obj = await res.json();
        if (obj?.data?.authenticated) {
          return {
            authenticated: true,
            userName: obj.data.userName,
            phone: obj.data.phone
          };
        }
      }
    } catch {
      // ignore
    }

    try {
      // 2. Local fallback check
      const localRes = await fetch(`/telegram_auth_status.json?t=${Date.now()}`);
      if (localRes.ok) {
        const localData = await localRes.json();
        if (localData[sessionId]?.authenticated) {
          return localData[sessionId];
        }
      }
    } catch {
      // ignore
    }

    return { authenticated: false };
  }
}

export const telegramAuthService = new TelegramMessengerAuthService();
