// no import needed — BASE_URL comes from config.js script tag

// get current logged in user
const getMe = async () => {
  const response = await fetch("http://localhost:4600/api/auth/me", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return response.json();
};

// get all rooms for current user
const getRooms = async () => {
  const response = await fetch("http://localhost:4600/api/rooms", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return response.json();
};

// get messages for a specific room
const getMessages = async (roomId, page = 1) => {
  const response = await fetch(
    `http://localhost/api/rooms/${roomId}/messages?page=${page}&limit=20`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    }
  );
  return response.json();
};

// create a new room
const createRoom = async (type, members, name) => {
  const response = await fetch("http://localhost:4600/api/rooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ type, members, name }),
  });
  return response.json();
};

// logout current user
const logoutUser = async () => {
  const response = await fetch("http://localhost:4600/api/auth/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return response.json();
};

const getToken = async () => {
  const response = await fetch("http://localhost:4600/api/auth/token", {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();
  return data.accessToken;
};