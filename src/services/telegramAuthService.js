/**
 * Global Realtime Telegram Messenger Auth Service for Sprint Marketplace.
 * Works seamlessly across Localhost, Google Cloud Hosting, iOS Safari, Android Chrome, and Desktop.
 * Uses no-cache headers to prevent mobile browsers (Safari/Chrome) from serving stale auth states.
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
      const res = await fetch(`${CLOUD_API_URL}?_t=${Date.now()}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        },
        cache: 'no-store',
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

        console.log(`[AUTH SESSION CREATED] ID: ${cloudId} | Link: ${telegramDeepLink}`);

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
   * Polls global cloud session status with strict cache-busting
   */
  async checkSessionStatus(sessionId) {
    if (!sessionId) return { authenticated: false };

    try {
      // 1. Check Global Cloud API with no-cache and timestamp query param
      const res = await fetch(`${CLOUD_API_URL}/${sessionId}?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (res.ok) {
        const obj = await res.json();
        if (obj?.data?.authenticated) {
          console.log(`[AUTH VERIFIED VIA CLOUD] User: ${obj.data.userName} | Phone: ${obj.data.phone}`);
          return {
            authenticated: true,
            userName: obj.data.userName,
            phone: obj.data.phone
          };
        }
      }
    } catch (err) {
      console.warn("Cloud poll error:", err);
    }

    try {
      // 2. Local fallback check for localhost development
      const localRes = await fetch(`/telegram_auth_status.json?_t=${Date.now()}`, {
        cache: 'no-store'
      });
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
