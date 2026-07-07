const revealItems = document.querySelectorAll(".reveal");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll(".content-section");
const scrollTopButton = document.querySelector(".scroll-top");
const viewButtons = document.querySelectorAll("[data-view]");
const printButton = document.querySelector("[data-print]");
const webViewButton = document.querySelector('[data-view="web"]');
const sideNav = document.querySelector(".side-nav");
const sideNavToggle = document.querySelector(".side-nav-toggle");

const navDescriptions = {
  "#section-1": "แต่งตั้งกรรมการ + TOR + ราคากลาง",
  "#section-2": "รับราคา พิจารณา และเรียกทำสัญญา",
  "#section-3": "ส่งมอบงานรายงวดให้ตรวจรับได้",
  "#section-4": "ปิดชุดเอกสารและเบิกจ่ายครบ",
};

navLinks.forEach((link, index) => {
  const href = link.getAttribute("href");
  const rawText = link.textContent.trim();
  const title = rawText.replace(/^\d+\.\s*/, "");
  const number = String(index + 1).padStart(2, "0");

  link.innerHTML = `
    <span class="nav-no">${number}</span>
    <span class="nav-copy">
      <strong>${title}</strong>
      <small>${navDescriptions[href] || "เปิดรายละเอียดในหัวข้อนี้"}</small>
    </span>
  `;
});

function setSideNavOpen(isOpen) {
  if (!sideNav || !sideNavToggle) {
    return;
  }

  sideNav.classList.toggle("is-open", isOpen);
  sideNavToggle.setAttribute("aria-expanded", String(isOpen));
}

if (sideNavToggle) {
  sideNavToggle.addEventListener("click", () => {
    setSideNavOpen(!sideNav.classList.contains("is-open"));
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 760) {
      setSideNavOpen(false);
    }
  });
});

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
