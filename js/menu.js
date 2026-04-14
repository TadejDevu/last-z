const hamburger = document.getElementById("hamburger");
const burgerTxt = document.getElementById("BurgerTxt");
const menuHost = document.getElementById("menu");

function setMenuOpen(isOpen) {
  menuHost.classList.toggle("open", isOpen);
  if (hamburger) {
    hamburger.textContent = isOpen ? "✕" : "☰";
    hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }
}

function updateActive(page) {
  // zapri vse submenu
  document.querySelectorAll(".menu-item").forEach((item) => item.classList.remove("open"));

  // odstrani active
  document.querySelectorAll(".menu-link").forEach((btn) => btn.classList.remove("active"));

  // aktivni
  const active = document.querySelector(`.menu-link[data-page="${page}"]`);
  if (active) {
    active.classList.add("active");
    const parent = active.closest(".menu-item");
    if (parent) parent.classList.add("open");
  }
}

document.addEventListener("click", (e) => {
  // hamburger / label toggle
  if (e.target.closest(".burger-toggle")) {
    setMenuOpen(!menuHost.classList.contains("open"));
    return;
  }

  const btn = e.target.closest(".menu-link");
  if (!btn) return;

  // submenu toggle
  if (btn.classList.contains("has-sub")) {
    const parent = btn.closest(".menu-item");
    const willOpen = !parent.classList.contains("open");
    parent.classList.toggle("open", willOpen);
    btn.setAttribute("aria-expanded", willOpen ? "true" : "false");
    return;
  }

  // page navigation
  const page = btn.dataset.page;
  if (page && typeof window.loadPage === "function") {
    window.loadPage(page, true);
  }

  // close on mobile
  if (window.innerWidth <= 768) {
    setMenuOpen(false);
  }
});

// poslušaj page change iz app.js
document.addEventListener("app:pagechange", (e) => {
  updateActive(e.detail.page);
});

document.addEventListener("DOMContentLoaded", async () => {
  // naloži menu.html
  const html = await fetch("menu.html").then((r) => r.text());
  menuHost.innerHTML = html;

  // init active
  const page = location.hash ? location.hash.substring(1) : "home";
  updateActive(page);

  // init burger aria
  if (hamburger) {
    hamburger.setAttribute("aria-expanded", "false");
  }

  // klik na tekst naj tudi toggle-a (varnost)
  if (burgerTxt) {
    burgerTxt.addEventListener("click", () => setMenuOpen(!menuHost.classList.contains("open")));
  }
});
