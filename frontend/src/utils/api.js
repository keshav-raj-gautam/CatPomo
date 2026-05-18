// When VITE_API_URL is empty (Docker), requests go to same origin and
// nginx proxies /api/* → http://api:4000.
// In local dev set VITE_API_URL=http://localhost:4000 in .env.local
const BASE = import.meta.env.VITE_API_URL || "";

async function req(path, opts = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || res.statusText);
  }
  return res.json();
}

export const api = {
  // Users
  createUser:  (name)        => req("/api/users",        { method:"POST",   body:JSON.stringify({name}) }),
  getUser:     (id)          => req(`/api/users/${id}`),
  updateUser:  (id, data)    => req(`/api/users/${id}`,  { method:"PATCH",  body:JSON.stringify(data) }),

  // Sessions
  addSession:  (data)        => req("/api/sessions",     { method:"POST",   body:JSON.stringify(data) }),
  getSessions: (userId)      => req(`/api/sessions/${userId}`),

  // Todos
  getTodos:    (userId)      => req(`/api/todos/${userId}`),
  addTodo:     (data)        => req("/api/todos",        { method:"POST",   body:JSON.stringify(data) }),
  patchTodo:   (id, data)    => req(`/api/todos/${id}`,  { method:"PATCH",  body:JSON.stringify(data) }),
  deleteTodo:  (id)          => req(`/api/todos/${id}`,  { method:"DELETE" }),

  // Leaderboard
  getLeaderboard: (cat="sessions") => req(`/api/leaderboard?category=${cat}&limit=20`),

  // Stats / analytics
  getUserStats: (userId)     => req(`/api/stats/${userId}`),
  patchStats:   (userId, data) => req(`/api/stats/${userId}`, { method:"PATCH", body:JSON.stringify(data) }),
};
