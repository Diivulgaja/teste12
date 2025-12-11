
// src/apiClient.js
const API_BASE = (import.meta && import.meta.env && import.meta.env.VITE_API_BASE) ? import.meta.env.VITE_API_BASE : '';

export async function createOrder(payload) {
  const res = await fetch(`${API_BASE}/api/pedidos`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  });
  return await res.json();
}

export async function fetchCart(userId) {
  const res = await fetch(`${API_BASE}/api/carts?userId=${userId}`);
  return await res.json();
}

export async function saveCart(userId, payload) {
  const res = await fetch(`${API_BASE}/api/carts`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({ userId, items: payload.items || [] })
  });
  return await res.json();
}

export async function fetchOrder(id) {
  const res = await fetch(`${API_BASE}/api/pedidos?id=${id}`);
  return await res.json();
}

// stub subscribe - consumer can poll instead
export function subscribeToOrder(id, cb) {
  const iv = setInterval(async () => {
    try {
      const data = await fetchOrder(id);
      cb(data);
    } catch(e){}
  }, 3000);
  return () => clearInterval(iv);
}
