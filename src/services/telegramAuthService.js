/**
 * Global Realtime Telegram Messenger Auth Service for Sprint Marketplace.
 * Works seamlessly across Localhost, Google Cloud Hosting, iOS Safari, Android Chrome, and Desktop.
 */

const BOT_USERNAME = "SprintAuthBot";
const CLOUD_API_URL = "https://api.restful-api.dev/objects";

class TelegramMessengerAuthService {
  constructor() {
    this.botUsername = BOT_USERNAME;
  }

  /**
   * Creates a live cloud session with both Web and Native Mobile Deep Links
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
        const telegramNativeLink = `tg://resolve?domain=${BOT_USERNAME}&start=auth_${cloudId}`;

        // Cache in localStorage for mobile browser background recovery
        try {
          localStorage.setItem('sprint_pending_session_id', cloudId);
        } catch {
          // ignore
        }

        return {
          success: true,
          sessionId: cloudId,
          botUsername: BOT_USERNAME,
          telegramDeepLink,
          telegramNativeLink
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
      telegramDeepLink: `https://t.me/${BOT_USERNAME}?start=auth_${fallbackId}`,
      telegramNativeLink: `tg://resolve?domain=${BOT_USERNAME}&start=auth_${fallbackId}`
    };
  }

  /**
   * Polls global cloud session status
   */
  async checkSessionStatus(sessionId) {
    if (!sessionId) return { authenticated: false };

    try {
      // 1. Check Global Cloud API first (works everywhere: Google Cloud, iPhone, Android, PC)
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
      // 2. Local fallback check for localhost development
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
