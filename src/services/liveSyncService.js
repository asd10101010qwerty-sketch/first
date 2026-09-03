/**
 * Global Realtime WebSocket LiveSync Service for Sprint Marketplace.
 * Uses public HiveMQ WebSocket Broker (wss://broker.hivemq.com:8884/mqtt).
 * Enables INSTANT live sync between phones, tablets, and computers across the globe with 0 limits.
 */

import mqtt from 'mqtt';

const BROKER_URL = 'wss://broker.hivemq.com:8884/mqtt';
const TOPIC_EVENTS = 'sprint_market_383/events';
const TOPIC_USERS_RETAIN = 'sprint_market_383/users_state';
const TOPIC_ORDERS_RETAIN = 'sprint_market_383/orders_state';

class LiveSyncService {
  constructor() {
    this.client = null;
    this.listeners = new Set();
    this.isConnected = false;
    this.init();
  }

  init() {
    try {
      const clientId = `sprint_web_${Math.random().toString(36).substring(2, 9)}`;
      this.client = mqtt.connect(BROKER_URL, {
        clientId,
        clean: true,
        reconnectPeriod: 2500,
        connectTimeout: 10000
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        console.log('⚡ [LIVE SYNC] Connected to Realtime WebSocket Broker');
        this.client.subscribe([TOPIC_EVENTS, TOPIC_USERS_RETAIN, TOPIC_ORDERS_RETAIN], { qos: 1 });
      });

      this.client.on('message', (topic, payload) => {
        try {
          const data = JSON.parse(payload.toString());
          this.notify(topic, data);
        } catch {
          // ignore
        }
      });

      this.client.on('error', (err) => {
        console.warn('[LIVE SYNC] MQTT connection error:', err);
      });

      this.client.on('offline', () => {
        this.isConnected = false;
      });
    } catch (e) {
      console.warn('[LIVE SYNC] Failed to initialize live sync:', e);
    }
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  notify(topic, data) {
    this.listeners.forEach(cb => {
      try {
        cb(topic, data);
      } catch (e) {
        console.error(e);
      }
    });
  }

  /**
   * Publish a live registration event + retain the new users state on broker
   */
  publishUserRegistered(user, allUsers = []) {
    if (!this.client || !this.isConnected) return;

    // 1. Send live event to any active tab/admin panel instantly
    this.client.publish(TOPIC_EVENTS, JSON.stringify({
      type: 'USER_REGISTERED',
      user,
      timestamp: Date.now()
    }), { qos: 1 });

    // 2. Retain full list on broker for any tab opened later
    if (allUsers.length > 0) {
      this.client.publish(TOPIC_USERS_RETAIN, JSON.stringify({
        users: allUsers,
        timestamp: Date.now()
      }), { qos: 1, retain: true });
    }
  }

  /**
   * Publish a live order event + retain the new orders state on broker
   */
  publishOrderPlaced(order, allOrders = []) {
    if (!this.client || !this.isConnected) return;

    this.client.publish(TOPIC_EVENTS, JSON.stringify({
      type: 'ORDER_PLACED',
      order,
      timestamp: Date.now()
    }), { qos: 1 });

    if (allOrders.length > 0) {
      this.client.publish(TOPIC_ORDERS_RETAIN, JSON.stringify({
        orders: allOrders,
        timestamp: Date.now()
      }), { qos: 1, retain: true });
    }
  }

  /**
   * Sync complete users list
   */
  syncUsersList(allUsers) {
    if (!this.client || !this.isConnected) return;
    this.client.publish(TOPIC_USERS_RETAIN, JSON.stringify({
      users: allUsers,
      timestamp: Date.now()
    }), { qos: 1, retain: true });
  }

  /**
   * Sync complete orders list
   */
  syncOrdersList(allOrders) {
    if (!this.client || !this.isConnected) return;
    this.client.publish(TOPIC_ORDERS_RETAIN, JSON.stringify({
      orders: allOrders,
      timestamp: Date.now()
    }), { qos: 1, retain: true });
  }
}

export const liveSyncService = new LiveSyncService();

