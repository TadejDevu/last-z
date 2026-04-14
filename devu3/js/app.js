const content = document.getElementById("content");

const titles = {
  home: "Domov",
  about_me: "Kdo sem",
  about_work: "Kaj delam",
  Poldka: "Poldka testira",
  gallery: "Galerija",
  contact: "Kontakt",
};

const cache = {};

async function loadPage(page, push = true) {
  content.style.opacity = "0.5";

  try {
    let html;

    if (cache[page]) {
      html = cache[page];
    } else {
      const res = await fetch("pages/" + page + ".html");
      if (!res.ok) throw new Error("404");
      html = await res.text();
      cache[page] = html;
    }

    content.innerHTML = html;

    if (push) history.pushState({ page }, "", "#" + page);

    document.title = "DeVu – " + (titles[page] || "Stran");

    // obvesti menu.js da posodobi active state
    document.dispatchEvent(new CustomEvent("app:pagechange", { detail: { page } }));
  } catch {
    content.innerHTML = "<h2>Stran ne obstaja</h2>";
  }

  content.style.opacity = "1";
}

function getCurrentPage() {
  return location.hash ? location.hash.substring(1) : "home";
}

function router() {
  loadPage(getCurrentPage(), false);
}

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
  router();

  // preload
  ["home", "about_me"].forEach(async (p) => {
    try {
      const res = await fetch("pages/" + p + ".html");
      if (res.ok) cache[p] = await res.text();
    } catch {}
  });
});
