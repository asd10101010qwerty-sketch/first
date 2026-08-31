/**
 * Multi-Device Isolated Telegram Bot Worker for SprintAuthBot
 * Each device has its own unique sessionId so devices never mix up accounts!
 */

import fs from 'fs';
import path from 'path';

const BOT_TOKEN = "8607198704:AAH630BQCJieHm-Ln3QrzGne_ULh8U4gT7Q";
const BASE_URL = `https://api.telegram.org/bot${BOT_TOKEN}`;

const AUTH_STATUS_FILE = path.resolve('./public/telegram_auth_status.json');

// Helper to safely read and write session map
function getSessionsMap() {
  try {
    if (fs.existsSync(AUTH_STATUS_FILE)) {
      const content = fs.readFileSync(AUTH_STATUS_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    // ignore
  }
  return {};
}

function saveSession(sessionId, sessionData) {
  try {
    const map = getSessionsMap();
    map[sessionId] = sessionData;
    fs.writeFileSync(AUTH_STATUS_FILE, JSON.stringify(map, null, 2));
  } catch (err) {
    console.error("Error saving session:", err);
  }
}

// Ensure clean status file initially
try {
  if (!fs.existsSync('./public')) {
    fs.mkdirSync('./public', { recursive: true });
  }
  fs.writeFileSync(AUTH_STATUS_FILE, JSON.stringify({}));
} catch {
  // ignore
}

// Conversation states per user chatId:
// { step: 'awaiting_name' | 'awaiting_contact', lang: 'ru' | 'uz' | 'en', name: string, sessionId: string }
const userStates = new Map();

// Multilingual messages
const texts = {
  uz: {
    chooseLang: "🌐 <b>Salom! Iltimos, tilni tanlang:</b>",
    askName: "👤 <b>Iltimos, ismingizni yozing:</b>",
    askContact: (name) => 
      `📱 Ajoyib, <b>${name}</b>!\n\nEndi quyidagi <b>«📱 Kontaktni yuborish»</b> tugmasini bosing yoki telefon raqamingizni yozing:`,
    btnContact: "📱 Kontaktni yuborish",
    success: (name, phone) => 
      `✅ <b>Muvaffaqiyatli!</b>\n\nSalom, <b>${name}</b> (${phone})!\nSprint Marketplace saytiga kirishingiz tasdiqlandi. Sayt avtomatik ravishda ochilmoqda.`
  },
  ru: {
    chooseLang: "🌐 <b>Здравствуйте! Пожалуйста, выберите язык:</b>",
    askName: "👤 <b>Пожалуйста, напишите ваше имя:</b>",
    askContact: (name) => 
      `📱 Отлично, <b>${name}</b>!\n\nТеперь нажмите кнопку <b>«📱 Отправить контакт»</b> ниже или введите номер телефона:`,
    btnContact: "📱 Отправить контакт",
    success: (name, phone) => 
      `✅ <b>Успешно!</b>\n\nЗдравствуйте, <b>${name}</b> (${phone})!\nВход на сайт Sprint Marketplace подтверждён. Страница на сайте сейчас обновится.`
  },
  en: {
    chooseLang: "🌐 <b>Hello! Please choose your language:</b>",
    askName: "👤 <b>Please write your name:</b>",
    askContact: (name) => 
      `📱 Great, <b>${name}</b>!\n\nNow click the <b>«📱 Share Contact»</b> button below or enter your phone number:`,
    btnContact: "📱 Share Contact",
    success: (name, phone) => 
      `✅ <b>Success!</b>\n\nHello, <b>${name}</b> (${phone})!\nYour login to Sprint Marketplace has been confirmed. The website is now updating.`
  }
};

// Inline Language Selection Keyboard
const languageInlineKeyboard = {
  inline_keyboard: [
    [
      { text: "🇺🇿 O'zbekcha", callback_data: "lang_uz" },
      { text: "🇷🇺 Русский", callback_data: "lang_ru" },
      { text: "🇬🇧 English", callback_data: "lang_en" }
    ]
  ]
};

// Request Contact Keyboard
function getContactKeyboard(lang = 'ru') {
  const dict = texts[lang] || texts.ru;
  return {
    keyboard: [
      [{ text: dict.btnContact, request_contact: true }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  };
}

let lastUpdateId = 0;

async function sendTelegramMessage(chatId, text, replyMarkup = null) {
  try {
    const payload = {
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML'
    };
    if (replyMarkup) {
      payload.reply_markup = replyMarkup;
    }

    await fetch(`${BASE_URL}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("SendMessage error:", err);
  }
}

async function answerCallbackQuery(callbackQueryId) {
  try {
    await fetch(`${BASE_URL}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId })
    });
  } catch {
    // ignore
  }
}

async function pollUpdates() {
  try {
    const response = await fetch(`${BASE_URL}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`);
    if (!response.ok) return;

    const data = await response.json();
    if (!data.ok || !data.result) return;

    for (const update of data.result) {
      lastUpdateId = update.update_id;

      // 1. Language selected by user
      if (update.callback_query) {
        const query = update.callback_query;
        const chatId = query.message.chat.id;
        const callbackData = query.data;

        if (callbackData.startsWith('lang_')) {
          const selectedLang = callbackData.replace('lang_', '');
          await answerCallbackQuery(query.id);

          const currentState = userStates.get(chatId) || { sessionId: 'default' };
          userStates.set(chatId, {
            ...currentState,
            step: 'awaiting_name',
            lang: selectedLang,
            name: ''
          });

          const dict = texts[selectedLang] || texts.ru;
          await sendTelegramMessage(chatId, dict.askName, { remove_keyboard: true });
        }
        continue;
      }

      // 2. Incoming Messages
      if (update.message) {
        const message = update.message;
        const chatId = message.chat.id;
        const state = userStates.get(chatId) || { step: 'initial', lang: 'ru', name: '', sessionId: 'default' };
        const dict = texts[state.lang] || texts.ru;

        // /start command (Extract unique device sessionId: /start auth_sess_123456)
        if (message.text && message.text.startsWith('/start')) {
          let extractedSessionId = 'default';
          const parts = message.text.split(' ');
          if (parts.length > 1) {
            extractedSessionId = parts[1].replace('auth_', '').trim();
          }

          userStates.set(chatId, { 
            step: 'initial', 
            lang: 'ru', 
            name: '', 
            sessionId: extractedSessionId 
          });

          console.log(`[START RECEIVED] User: ${message.from?.first_name} | Session: ${extractedSessionId}`);
          await sendTelegramMessage(chatId, texts.ru.chooseLang, languageInlineKeyboard);
          continue;
        }

        // Case A: User sent their Contact
        if (message.contact) {
          let phoneNumber = message.contact.phone_number;
          if (!phoneNumber.startsWith('+')) {
            phoneNumber = '+' + phoneNumber;
          }

          const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
          const isCreator = cleanPhone.endsWith('949392521') || cleanPhone === '998949392521';
          const finalUserName = isCreator ? 'Sprint383' : (state.name || message.contact.first_name || message.from.first_name || 'Пользователь');

          // Save session data specifically for this device's sessionId
          saveSession(state.sessionId, {
            authenticated: true,
            userName: finalUserName,
            phone: phoneNumber,
            lang: state.lang,
            timestamp: Date.now(),
            consumed: false
          });

          await sendTelegramMessage(chatId, dict.success(finalUserName, phoneNumber), { remove_keyboard: true });
          userStates.delete(chatId);
          console.log(`[AUTH COMPLETED] Session: ${state.sessionId} | User: ${finalUserName} | Phone: ${phoneNumber}`);
          continue;
        }

        // Case B: User sent text
        if (message.text) {
          const text = message.text.trim();

          // If in awaiting_name step -> Save Name and Ask for Contact
          if (state.step === 'awaiting_name') {
            const enteredName = text;
            state.name = enteredName;
            state.step = 'awaiting_contact';
            userStates.set(chatId, state);

            await sendTelegramMessage(chatId, dict.askContact(enteredName), getContactKeyboard(state.lang));
            continue;
          }

          // If in awaiting_contact step and typed phone number manually
          if (state.step === 'awaiting_contact') {
            let phoneNumber = text.replace(/[^\d+]/g, '');
            if (!phoneNumber.startsWith('+')) {
              phoneNumber = '+' + phoneNumber;
            }

            const cleanPhone = phoneNumber.replace(/[^\d]/g, '');
            const isCreator = cleanPhone.endsWith('949392521') || cleanPhone === '998949392521';
            const finalUserName = isCreator ? 'Sprint383' : (state.name || message.from.first_name || 'Пользователь');

            saveSession(state.sessionId, {
              authenticated: true,
              userName: finalUserName,
              phone: phoneNumber,
              lang: state.lang,
              timestamp: Date.now(),
              consumed: false
            });

            await sendTelegramMessage(chatId, dict.success(finalUserName, phoneNumber), { remove_keyboard: true });
            userStates.delete(chatId);
            console.log(`[AUTH COMPLETED MANUAL] Session: ${state.sessionId} | User: ${finalUserName} | Phone: ${phoneNumber}`);
            continue;
          }

          // Fallback prompt
          await sendTelegramMessage(chatId, texts.ru.chooseLang, languageInlineKeyboard);
        }
      }
    }
  } catch (error) {
    // retry
  }
}

async function startBot() {
  console.log("🤖 Multi-Device Isolated SprintAuthBot Worker is active...");
  while (true) {
    await pollUpdates();
    await new Promise(r => setTimeout(r, 1000));
  }
}

startBot();
