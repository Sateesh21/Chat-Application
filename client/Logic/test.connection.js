// test REST API connection
const testAPI = async () => {
  try {
    const response = await fetch(`${BASE_URL}/`, {
      credentials: "include",
    });
    const data = await response.json();
    console.log("REST API connected:", data);
  } catch (error) {
    console.error("REST API connection failed:", error);
  }
};

// test Socket.io connection
const testSocket = () => {
  const socket = io(SOCKET_URL, {
    auth: {
      token: "test-token",  // will fail auth but confirms socket connects
    },
  });

  socket.on("connect_error", (error) => {
    console.log("Socket connected but auth failed (expected):", error.message);
  });

  socket.on("connect", () => {
    console.log("Socket connected successfully:", socket.id);
  });
};

testAPI();
testSocket();

//for testing and its working...