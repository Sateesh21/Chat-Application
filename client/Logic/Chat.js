let currentUser = null;

const init = async () => {
  try {
    const response = await getMe();

    if (!response.success) {
      window.location.href = "Login.html";
      return;
    }

    currentUser = response.user;

    await loadRooms();

    await connectSocket();

    // listen for new messages
    onNewMessage((message) => {
      if (message.roomId === currentRoomId) {
        appendMessage(message);
      }
    });

    // listen for typing events
    onTyping((data) => {
      if (data.roomId === currentRoomId) {
        if (data.isTyping) {
          setText("typing-indicator", `${data.userId} is typing...`);
          showElement("typing-indicator");
        } else {
          hideElement("typing-indicator");
        }
      }
    });

    // listen for read receipts
    onMessagesRead(({ roomId }) => {
      console.log("Messages read in room:", roomId);
    });

  } catch (error) {
    console.error(error);
    window.location.href = "login.html";
  }
};

const handleSend = () => {
  const input = document.getElementById("message-input");
  const text = input.value.trim();

  if (!text || !currentRoomId) return;

  sendMessage(currentRoomId, text);
  input.value = "";
  emitTypingStop(currentRoomId);
};

const handleLogout = async () => {
  try {
    await logoutUser();
  } catch (error) {
    console.error(error);
  }
  window.location.href = "login.html";
};

// event listeners
document.getElementById("send-btn").addEventListener("click", handleSend);

document.getElementById("logout-btn").addEventListener("click", handleLogout);

document.getElementById("message-input").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleSend();
  }
});

document.getElementById("message-input").addEventListener("input", (e) => {
  if (!currentRoomId) return;
  if (e.target.value.trim() === "") {
    emitTypingStop(currentRoomId);
  } else {
    emitTypingStart(currentRoomId);
  }
});

document.getElementById("new-room-btn").addEventListener("click", () => {
  console.log("Create Room Clicked — build this next");
});

init();