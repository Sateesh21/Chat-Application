const registerBtn = document.getElementById("register-btn");
const errorMsg = document.getElementById("error-msg");

registerBtn.addEventListener("click", async () => {
  // clear previous error
  errorMsg.textContent = "";
  errorMsg.classList.add("hidden");

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // basic empty check
  if (!email || !password) {
    errorMsg.textContent = "Please fill in all fields";
    errorMsg.classList.remove("hidden");
    return;
  }

  try {
    const response = await fetch("http://localhost:4600/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = "Messages.html";  //to chat interface
    } else {
      // show error from backend (Zod errors or "email already exists")
      const message = data.errors
        ? data.errors.map((e) => e.message).join(", ")
        : data.message;
      errorMsg.textContent = message;
      errorMsg.classList.remove("hidden");
    }

  } catch (error) {
    console.error(error);
    errorMsg.textContent = "Something went wrong. Please try again.";
    errorMsg.classList.remove("hidden");
  }
});