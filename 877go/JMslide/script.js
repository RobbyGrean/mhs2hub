const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll(".content-section");
const scrollTopButton = document.querySelector(".scroll-top");
const viewButtons = document.querySelectorAll("[data-view]");
const printButton = document.querySelector("[data-print]");
const webViewButton = document.querySelector('[data-view="web"]');

function setViewMode(view) {
  document.body.classList.toggle("presentation-view", view === "presentation");
  viewButtons.forEach((item) => {
    item.classList.toggle("is-current", item.getAttribute("data-view") === view);
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

revealItems.forEach((item) => revealObserver.observe(item));

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }

    const id = entry.target.getAttribute("id");
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
    });
  });
}, { rootMargin: "-35% 0px -45% 0px", threshold: 0.1 });

sections.forEach((section) => navObserver.observe(section));

window.addEventListener("scroll", () => {
  if (scrollTopButton) {
    scrollTopButton.classList.toggle("is-visible", window.scrollY > 480);
  }
});

if (scrollTopButton) {
  scrollTopButton.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

viewButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const view = button.getAttribute("data-view");
    setViewMode(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
});

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && document.body.classList.contains("presentation-view")) {
    setViewMode("web");
    if (webViewButton) {
      webViewButton.focus();
    }
  }
});

if (printButton) {
  printButton.addEventListener("click", () => {
    window.print();
  });
}
