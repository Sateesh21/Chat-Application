const registerBtn = document.getElementById("register-btn");
const errorMsg = document.getElementById("error-msg");

registerBtn.addEventListener("click", async () => {
  // clear previous error
  errorMsg.textContent = "";
  errorMsg.classList.add("hidden");

  const name = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // basic empty check
  if (!name || !email || !password) {
    errorMsg.textContent = "Please fill in all fields";
    errorMsg.classList.remove("hidden");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      window.location.href = "Login.html";  // redirect to login after register
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