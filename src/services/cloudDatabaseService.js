/**
 * Global Cloud Database Service for Sprint Marketplace.
 * Synchronizes Real Users and Orders in real-time across ALL devices
 * (creator's computer, mom's phone, mobile devices, deployed sites).
 */

const USERS_STORE_ID = 'ff808181a0662e5201a066bb8064021b';
const ORDERS_STORE_ID = 'ff808181a0662e5201a066bbde19021c';
const BASE_URL = 'https://api.restful-api.dev/objects';

export const CREATOR_EMAIL = 'asd10101010qwerty@gmail.com';
export const CREATOR_PHONE = '+998 94 939 25 21';

export const cloudDatabaseService = {
  /**
   * Fetch all registered users from the global cloud database
   */
  async getRegisteredUsers() {
    try {
      const res = await fetch(`${BASE_URL}/${USERS_STORE_ID}?_t=${Date.now()}`, { 
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const obj = await res.json();
        if (Array.isArray(obj?.data?.users)) {
          return obj.data.users;
        }
      }
    } catch (e) {
      console.warn("Failed to fetch cloud users:", e);
    }
    return null;
  },

  /**
   * Add or update a user in the global cloud database
   */
  async saveUser(userRecord) {
    try {
      const currentUsers = (await this.getRegisteredUsers()) || [];
      const cleanIdentifier = (userRecord.phone || '').toLowerCase().trim();
      
      const existingIdx = currentUsers.findIndex(u => {
        const uId = (u.phone || '').toLowerCase().trim();
        return uId === cleanIdentifier || (userRecord.id && u.id === userRecord.id);
      });

      let updatedUsers;
      if (existingIdx > -1) {
        updatedUsers = [...currentUsers];
        updatedUsers[existingIdx] = {
          ...updatedUsers[existingIdx],
          ...userRecord,
          // Preserve creator role if it's the creator
          role: cleanIdentifier === CREATOR_EMAIL || cleanIdentifier.includes('949392521') ? 'creator' : (userRecord.role || updatedUsers[existingIdx].role)
        };
      } else {
        updatedUsers = [userRecord, ...currentUsers];
      }

      await fetch(`${BASE_URL}/${USERS_STORE_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'sprint_global_users_store',
          data: { users: updatedUsers }
        })
      });

      return updatedUsers;
    } catch (e) {
      console.warn("Failed to save user to cloud:", e);
    }
  },

  /**
   * Fetch all orders from the global cloud database
   */
  async getOrders() {
    try {
      const res = await fetch(`${BASE_URL}/${ORDERS_STORE_ID}?_t=${Date.now()}`, { 
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (res.ok) {
        const obj = await res.json();
        if (Array.isArray(obj?.data?.orders)) {
          return obj.data.orders;
        }
      }
    } catch (e) {
      console.warn("Failed to fetch cloud orders:", e);
    }
    return null;
  },

  /**
   * Save a new order to the global cloud database
   */
  async saveOrder(orderRecord) {
    try {
      const currentOrders = (await this.getOrders()) || [];
      const updatedOrders = [orderRecord, ...currentOrders];

      await fetch(`${BASE_URL}/${ORDERS_STORE_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'sprint_global_orders_store',
          data: { orders: updatedOrders }
        })
      });

      return updatedOrders;
    } catch (e) {
      console.warn("Failed to save order to cloud:", e);
    }
  },

  /**
   * Update order status in global cloud
   */
  async updateOrderStatus(orderId, newStatus) {
    try {
      const currentOrders = (await this.getOrders()) || [];
      const updatedOrders = currentOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);

      await fetch(`${BASE_URL}/${ORDERS_STORE_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'sprint_global_orders_store',
          data: { orders: updatedOrders }
        })
      });

      return updatedOrders;
    } catch (e) {
      console.warn("Failed to update order status in cloud:", e);
    }
  },

  /**
   * Delete order in global cloud
   */
  async deleteOrder(orderId) {
    try {
      const currentOrders = (await this.getOrders()) || [];
      const updatedOrders = currentOrders.filter(o => o.id !== orderId);

      await fetch(`${BASE_URL}/${ORDERS_STORE_ID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'sprint_global_orders_store',
          data: { orders: updatedOrders }
        })
      });

      return updatedOrders;
    } catch (e) {
      console.warn("Failed to delete order in cloud:", e);
    }
  }
};

