let socket = null;

const connectSocket = async () => {
  // get token from backend API
  const token = await getToken();

  if (!token) {
    console.error("Access token not found, please login");
    window.location.href = "Login.html";
    return;
  }

  socket = io(SOCKET_URL, {
    auth: {
      token: token,
    },
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    socket.emit("join-rooms");
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error.message);
  });
};

const sendMessage = (roomId, text) => {
  if (!socket) return;
  socket.emit("send-message", { roomId, text });
};

const emitTypingStart = (roomId) => {
  if (!socket) return;
  socket.emit("typing-start", { roomId });
};

const emitTypingStop = (roomId) => {
  if (!socket) return;
  socket.emit("typing-stop", { roomId });
};

// ---------------
const onNewMessage = (callback) => {
  if (!socket) return;
  socket.on("new-message", callback);
};

const onTyping = (callback) => {
  if (!socket) return;
  socket.on("typing", callback);
};

const onMessagesRead = (callback) => {
  if (!socket) return;
  socket.on("messages-read", callback);
};