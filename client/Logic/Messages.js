const renderMessage = (message) => {
  const messagesArea = document.getElementById("messages-area");

  const isMine = message.senderId._id === currentUser?._id;

  const messageDiv = document.createElement("div");

  messageDiv.className = `flex mb-4 ${isMine ? "justify-end" : "justify-start"}`;

  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  messageDiv.innerHTML = `
    <div class="
      max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow
      ${isMine ? "bg-blue-600 text-white" : "bg-white text-gray-800"}
    ">
      <p class="text-sm font-semibold mb-1">
        ${isMine ? "You" : message.senderId.name}
      </p>
      <p class="break-words">
        ${message.text}
      </p>
      <p class="text-xs mt-2 text-right opacity-75">
        ${time}
      </p>
    </div>
  `;

  messagesArea.appendChild(messageDiv);
};

const loadMessages = async (roomId) => {
  clearHTML("messages-area");

  try {
    const response = await getMessages(roomId);

    if (response.success) {
      response.messages.forEach((message) => {
        renderMessage(message);
      });
      scrollToBottom("messages-area");
    } else {
      showError("messages-area", response.message || "Unable to load messages");
    }

  } catch (error) {
    console.error(error);
    showError("messages-area", "Something went wrong while loading messages");
  }
};

const appendMessage = (message) => {
  renderMessage(message);
  scrollToBottom("messages-area");
};