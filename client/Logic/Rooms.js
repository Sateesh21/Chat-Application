let currentRoomId = null;

const renderRooms = (rooms) => {
  clearHTML("room-list");

  const roomList = document.getElementById("room-list");

  rooms.forEach((room) => {
    const button = document.createElement("button");

    // show other person's name for direct, room name for group
    button.textContent = room.type === "direct"
      ? room.members.find(m => m._id !== currentUser?._id)?.name || "Direct Chat"
      : room.name;

    button.className =
      "w-full text-left px-4 py-3 rounded-lg hover:bg-gray-100 transition";

    button.addEventListener("click", () => {
      selectRoom(room._id, button.textContent);
    });

    roomList.appendChild(button);
  });
};

const selectRoom = (roomId, roomName) => {
  currentRoomId = roomId;
  setText("chat-header", roomName);
  loadMessages(roomId);
};

const loadRooms = async () => {
  try {
    const response = await getRooms();

    if (response.success) {
      renderRooms(response.rooms);

      if (response.rooms.length > 0) {
        selectRoom(response.rooms[0]._id, response.rooms[0].name);
      }
    } else {
      showError("room-list", response.message || "Unable to load rooms");
    }

  } catch (error) {
    console.error(error);
    showError("room-list", "Something went wrong while loading rooms");
  }
};