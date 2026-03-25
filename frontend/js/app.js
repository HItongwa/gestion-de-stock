const form = document.getElementById("loginForm");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        document.getElementById("msg").textContent = "Connexion réussie";
        window.location.href = "index.html";
      } else {
        document.getElementById("msg").textContent = "Erreur login";
      }

    } catch (err) {
      document.getElementById("msg").textContent = "Erreur serveur";
    }
  });
}
