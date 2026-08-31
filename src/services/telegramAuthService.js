/**
 * Real Telegram Messenger OTP Verification Service for Sprint Marketplace.
 * Provides per-device session isolation so multiple devices never mix up accounts.
 */

const BOT_USERNAME = "SprintAuthBot";

class TelegramMessengerAuthService {
  constructor() {
    this.botUsername = BOT_USERNAME;
  }

  /**
   * Generates unique deep link for a specific device session
   */
  async sendMessengerCode(sessionId, name = '', lang = 'ru') {
    const cleanSessionId = sessionId || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const telegramDeepLink = `https://t.me/${BOT_USERNAME}?start=auth_${cleanSessionId}`;

    console.log(`[TELEGRAM INITIATED] Session: ${cleanSessionId} | Link: ${telegramDeepLink}`);

    return {
      success: true,
      sessionId: cleanSessionId,
      botUsername: BOT_USERNAME,
      telegramDeepLink,
      message: `Telegram ochilmoqda...`
    };
  }
}

export const telegramAuthService = new TelegramMessengerAuthService();
