const USER_COOKIE = "lab3_user";
const AUTH_COOKIE = "lab3_auth";

function setCookie(name, value, days) {
  const date = new Date();
  date.setDate(date.getDate() + days);

  document.cookie = name + "=" + encodeURIComponent(value)
      + "; expires=" + date.toUTCString() + "; path=/";
}

function getCookie(name) {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();

    if (cookie.startsWith(name + "=")) {
      return decodeURIComponent(cookie.substring(name.length + 1));
    }
  }

  return null;
}

function deleteCookie(name) {
  document.cookie = name + "=; max-age=0; path=/";
}

const page = document.body.dataset.page;

if (page === "register") {
  const form = document.getElementById("register-form");
  const message = document.getElementById("register-message");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const name = form.elements.name.value.trim();
    const email = form.elements.email.value.trim().toLowerCase();
    const password = form.elements.password.value;
    const confirm = form.elements.confirm.value;

    if (!name || !email || !password || !confirm) {
      message.textContent = "Заполните все поля.";
      return;
    }

    if (!form.elements.email.validity.valid) {
      message.textContent = "Введите корректный email.";
      return;
    }

    if (password.length < 4) {
      message.textContent = "Пароль должен содержать минимум 4 символа.";
      return;
    }

    if (password !== confirm) {
      message.textContent = "Пароли не совпадают.";
      return;
    }

    const user = {
      name: name,
      email: email,
      password: password
    };

    setCookie(USER_COOKIE, JSON.stringify(user), 7);
    setCookie(AUTH_COOKIE, email, 1);

    window.location.href = "home.html";
  });
}

if (page === "login") {
  const form = document.getElementById("login-form");
  const message = document.getElementById("login-message");

  form.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = form.elements.email.value.trim().toLowerCase();
    const password = form.elements.password.value;

    const savedUser = getCookie(USER_COOKIE);

    if (!savedUser) {
      message.textContent = "Пользователь не найден.";
      return;
    }

    const user = JSON.parse(savedUser);

    if (user.email !== email || user.password !== password) {
      message.textContent = "Неверный email или пароль.";
      return;
    }

    setCookie(AUTH_COOKIE, email, 1);

    window.location.href = "home.html";
  });
}

if (page === "home") {
  const savedUser = getCookie(USER_COOKIE);
  const auth = getCookie(AUTH_COOKIE);

  if (!savedUser || !auth) {
    window.location.href = "index.html";
  } else {
    const user = JSON.parse(savedUser);

    if (user.email !== auth) {
      window.location.href = "index.html";
    } else {
      document.getElementById("user-name").textContent = user.name;
    }
  }

  document.getElementById("logout-button").onclick = function() {
    deleteCookie(AUTH_COOKIE);
    window.location.href = "index.html";
  };
}
