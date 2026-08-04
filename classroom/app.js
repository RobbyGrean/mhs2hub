const courses = {
  1: {
    id: 1,
    code: "C01",
    kicker: "COURSE 01 · FOUNDATION",
    title: "ภาพรวมกระบวนการงบประมาณ",
    shortTitle: "กระบวนการงบประมาณ",
    description: "เข้าใจเส้นทางตั้งแต่ได้รับจัดสรรงบประมาณ การผูกพันงบ การตรวจรับ ไปจนถึงการควบคุมครุภัณฑ์และประกัน",
    level: "พื้นฐาน",
    audience: "ผู้เริ่มต้น",
    total: 11,
    folder: "course-1",
    pdf: "course-1-budget.pdf",
    accent: "#43e0c3",
    accentRgb: "67, 224, 195",
    accentTwo: "#a978ff"
  },
  2: {
    id: 2,
    code: "C02",
    kicker: "COURSE 02 · ASSET CONTROL",
    title: "จัดทำทะเบียนครุภัณฑ์และสินทรัพย์",
    shortTitle: "ทะเบียนครุภัณฑ์และสินทรัพย์",
    description: "เรียนรู้การรับเข้าระบบ การลงรายละเอียดครุภัณฑ์ การออกเลข การควบคุมทะเบียน และการบันทึกประวัติซ่อมอย่างเป็นขั้นตอน",
    level: "ปฏิบัติ",
    audience: "เจ้าหน้าที่พัสดุ",
    total: 9,
    folder: "course-2",
    pdf: "course-2-assets.pdf",
    accent: "#f2c55c",
    accentRgb: "242, 197, 92",
    accentTwo: "#43e0c3"
  },
  3: {
    id: 3,
    code: "C03",
    kicker: "COURSE 03 · REAL-LIFE ANALOGY",
    title: "จัดซื้อจัดจ้าง เทียบกับชีวิตจริง",
    shortTitle: "จัดซื้อจัดจ้างเทียบชีวิตจริง",
    description: "มองกระบวนการจัดซื้อจัดจ้างผ่านประสบการณ์ชอปปิ้ง เพื่อจำลำดับตั้งแต่กำหนดความต้องการจนถึงตรวจรับและเบิกจ่ายได้ง่ายขึ้น",
    level: "เข้าใจง่าย",
    audience: "ทุกคน",
    total: 13,
    folder: "course-3",
    pdf: "course-3-procurement.pdf",
    accent: "#ff7a8a",
    accentRgb: "255, 122, 138",
    accentTwo: "#f2c55c"
  },
  4: {
    id: 4,
    code: "C04",
    kicker: "COURSE 04 · APPEAL KNOWLEDGE",
    title: "องค์ความรู้ด้านการอุทธรณ์",
    shortTitle: "การอุทธรณ์",
    description: "เข้าใจหลักการอุทธรณ์ ผู้มีสิทธิอุทธรณ์ เรื่องที่อุทธรณ์ได้หรือไม่ได้ และกรอบเวลาที่ต้องดำเนินการอย่างเป็นระบบ",
    level: "เฉพาะเรื่อง",
    audience: "คณะกรรมการและเจ้าหน้าที่",
    total: 9,
    folder: "course-4",
    orientation: "portrait",
    pdf: "../appeal/appealinglaw.pdf",
    accent: "#ff9a52",
    accentRgb: "255, 154, 82",
    accentTwo: "#ff7a8a"
  },
  5: {
    id: 5,
    code: "C05",
    kicker: "COURSE 05 · LEGAL FOUNDATION",
    title: "ภาพรวมกฎหมายและระเบียบพัสดุ",
    shortTitle: "กฎหมายและระเบียบพัสดุ",
    description: "ปูพื้นฐานองค์ความรู้ด้านงานพัสดุ ตั้งแต่กรอบกฎหมาย การจัดซื้อจัดจ้าง การควบคุมพัสดุ การบริหารสัญญา ไปจนถึงการจำหน่ายพัสดุ",
    level: "พื้นฐานสำคัญ",
    audience: "ผู้ปฏิบัติงานทุกระดับ",
    total: 11,
    folder: "course-5",
    pdf: "https://drive.google.com/file/d/1RTbgAm172FUEujS-01I9NnQZmq_ZYNl1/view?usp=sharing",
    accent: "#7dd3fc",
    accentRgb: "125, 211, 252",
    accentTwo: "#f2c55c"
  }
};

const elements = {
  root: document.documentElement,
  viewer: document.getElementById("course-viewer"),
  tabs: [...document.querySelectorAll(".course-tab")],
  courseKicker: document.getElementById("course-kicker"),
  courseTitle: document.getElementById("course-title"),
  courseDescription: document.getElementById("course-description"),
  courseLevel: document.getElementById("course-level"),
  courseTotal: document.getElementById("course-total"),
  courseAudience: document.getElementById("course-audience"),
  downloadLink: document.getElementById("download-link"),
  copyLink: document.getElementById("copy-link"),
  slideCourseId: document.getElementById("slide-course-id"),
  slideNumberLabel: document.getElementById("slide-number-label"),
  slideFrame: document.getElementById("slide-frame"),
  slideImage: document.getElementById("slide-image"),
  slideCounter: document.getElementById("slide-counter"),
  progressBar: document.getElementById("slide-progress-bar"),
  thumbnailRail: document.getElementById("thumbnail-rail"),
  previousButton: document.getElementById("previous-button"),
  nextButton: document.getElementById("next-button"),
  framePrev: document.getElementById("frame-prev"),
  frameNext: document.getElementById("frame-next"),
  zoomButton: document.getElementById("zoom-button"),
  fullscreenButton: document.getElementById("fullscreen-button"),
  toast: document.getElementById("toast"),
  heroVisual: document.querySelector(".hero-visual"),
  heroCards: [...document.querySelectorAll(".hero-card")]
};

let activeCourse = 1;
let activeSlide = 1;
let toastTimer;
let touchStartX = 0;
let touchStartY = 0;
let imageRequest = 0;

function twoDigits(value) {
  return String(value).padStart(2, "0");
}

function slideSource(courseId, slideNumber) {
  const course = courses[courseId];
  return `./assets/${course.folder}/${twoDigits(slideNumber)}.webp`;
}

function readInitialState() {
  const params = new URLSearchParams(window.location.search);
  const storedCourse = Number(localStorage.getItem("mhs2-learning-course"));
  const storedSlide = Number(localStorage.getItem("mhs2-learning-slide"));
  const requestedCourse = Number(params.get("course")) || storedCourse || 1;
  activeCourse = courses[requestedCourse] ? requestedCourse : 1;
  const requestedSlide = Number(params.get("slide")) || storedSlide || 1;
  activeSlide = Math.min(Math.max(requestedSlide, 1), courses[activeCourse].total);
}

function applyTheme(course) {
  elements.root.style.setProperty("--accent", course.accent);
  elements.root.style.setProperty("--accent-rgb", course.accentRgb);
  elements.root.style.setProperty("--accent-two", course.accentTwo);
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", course.id === 1 ? "#080b16" : "#090c16");
}

function updateCourseContent(course) {
  elements.courseKicker.textContent = course.kicker;
  elements.courseTitle.textContent = course.title;
  elements.courseDescription.textContent = course.description;
  elements.courseLevel.textContent = course.level;
  elements.courseTotal.textContent = `${course.total} หน้า`;
  elements.courseAudience.textContent = course.audience;
  const isDirectPath = course.pdf.startsWith(".") || course.pdf.startsWith("http");
  const isExternal = course.pdf.startsWith("http");
  elements.downloadLink.href = isDirectPath ? course.pdf : `./downloads/${course.pdf}`;
  if (isExternal) {
    elements.downloadLink.target = "_blank";
    elements.downloadLink.rel = "noopener";
    elements.downloadLink.removeAttribute("download");
  } else {
    elements.downloadLink.removeAttribute("target");
    elements.downloadLink.removeAttribute("rel");
    elements.downloadLink.setAttribute("download", "");
  }
  elements.slideCourseId.textContent = course.code;
  const isPortraitCourse = course.orientation === "portrait";
  elements.slideFrame.classList.toggle("is-portrait", isPortraitCourse);
  elements.slideFrame.style.setProperty("--slide-ratio", isPortraitCourse ? "4 / 5" : "16 / 9");

  elements.tabs.forEach((tab) => {
    const selected = Number(tab.dataset.course) === course.id;
    tab.classList.toggle("is-active", selected);
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
}

function renderThumbnails(course) {
  const fragment = document.createDocumentFragment();

  for (let page = 1; page <= course.total; page += 1) {
    const button = document.createElement("button");
    button.className = "thumbnail-button";
    button.classList.toggle("is-portrait", course.orientation === "portrait");
    button.type = "button";
    button.dataset.slide = String(page);
    button.setAttribute("aria-label", `เปิดสไลด์หน้า ${page}`);

    const image = document.createElement("img");
    image.src = slideSource(course.id, page);
    image.alt = "";
    image.loading = page <= 3 ? "eager" : "lazy";
    image.decoding = "async";

    const label = document.createElement("span");
    label.textContent = twoDigits(page);

    button.append(image, label);
    button.addEventListener("click", () => setSlide(page));
    fragment.append(button);
  }

  elements.thumbnailRail.replaceChildren(fragment);
}

function updateThumbnailSelection(shouldScroll = true) {
  const buttons = elements.thumbnailRail.querySelectorAll(".thumbnail-button");
  buttons.forEach((button) => {
    const selected = Number(button.dataset.slide) === activeSlide;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-current", selected ? "true" : "false");
    if (selected && shouldScroll) {
      button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  });
}

function updateUrlAndMemory() {
  const url = new URL(window.location.href);
  url.searchParams.set("course", String(activeCourse));
  url.searchParams.set("slide", String(activeSlide));
  history.replaceState({ course: activeCourse, slide: activeSlide }, "", url);
  localStorage.setItem("mhs2-learning-course", String(activeCourse));
  localStorage.setItem("mhs2-learning-slide", String(activeSlide));
}

function preloadNeighbors() {
  const course = courses[activeCourse];
  [activeSlide - 1, activeSlide + 1]
    .filter((page) => page >= 1 && page <= course.total)
    .forEach((page) => {
      const image = new Image();
      image.src = slideSource(activeCourse, page);
    });
}

function updateSlideUi({ scrollThumbnail = true } = {}) {
  const course = courses[activeCourse];
  const requestId = ++imageRequest;
  const source = slideSource(activeCourse, activeSlide);

  elements.slideFrame.classList.remove("is-zoomed");
  elements.zoomButton.setAttribute("aria-pressed", "false");
  elements.zoomButton.textContent = "ขยาย";
  elements.slideFrame.classList.add("is-loading");

  const incoming = new Image();
  incoming.onload = () => {
    if (requestId !== imageRequest) return;
    const isPortrait = incoming.naturalHeight > incoming.naturalWidth;
    elements.slideFrame.classList.toggle("is-portrait", isPortrait);
    elements.slideFrame.style.setProperty("--slide-ratio", `${incoming.naturalWidth} / ${incoming.naturalHeight}`);
    elements.slideImage.src = source;
    elements.slideImage.alt = `วิชา${course.shortTitle} สไลด์หน้า ${activeSlide} จาก ${course.total}`;
    elements.slideFrame.classList.remove("is-loading");
  };
  incoming.onerror = () => {
    if (requestId !== imageRequest) return;
    elements.slideFrame.classList.remove("is-loading");
    showToast("ไม่สามารถโหลดภาพหน้านี้ได้ กรุณาลองใหม่");
  };
  incoming.src = source;

  elements.slideNumberLabel.textContent = `SLIDE ${twoDigits(activeSlide)}`;
  elements.slideCounter.textContent = `${twoDigits(activeSlide)} / ${twoDigits(course.total)}`;
  elements.progressBar.style.width = `${(activeSlide / course.total) * 100}%`;

  const atStart = activeSlide === 1;
  const atEnd = activeSlide === course.total;
  [elements.previousButton, elements.framePrev].forEach((button) => { button.disabled = atStart; });
  [elements.nextButton, elements.frameNext].forEach((button) => { button.disabled = atEnd; });

  updateThumbnailSelection(scrollThumbnail);
  updateUrlAndMemory();
  preloadNeighbors();
  document.title = `${twoDigits(activeSlide)}/${twoDigits(course.total)} ${course.shortTitle} — MHS2 Learning Library`;
}

function setCourse(courseId, options = {}) {
  const course = courses[courseId];
  if (!course) return;

  elements.viewer.classList.add("course-swap");
  activeCourse = course.id;
  activeSlide = Math.min(Math.max(options.slide || 1, 1), course.total);
  applyTheme(course);
  updateCourseContent(course);
  renderThumbnails(course);
  updateSlideUi({ scrollThumbnail: false });
  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => elements.viewer.classList.remove("course-swap"));
  });

  if (options.scroll) {
    elements.viewer.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => elements.viewer.focus({ preventScroll: true }), 450);
  }
}

function setSlide(page) {
  const course = courses[activeCourse];
  const nextPage = Math.min(Math.max(page, 1), course.total);
  if (nextPage === activeSlide) return;
  activeSlide = nextPage;
  updateSlideUi();
}

function changeSlide(delta) {
  setSlide(activeSlide + delta);
}

function toggleZoom() {
  const isZoomed = elements.slideFrame.classList.toggle("is-zoomed");
  elements.zoomButton.setAttribute("aria-pressed", String(isZoomed));
  elements.zoomButton.textContent = isZoomed ? "พอดีจอ" : "ขยาย";
  if (!isZoomed) {
    elements.slideFrame.scrollTo({ top: 0, left: 0 });
  }
}

async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }
    if (elements.slideFrame.classList.contains("is-zoomed")) {
      toggleZoom();
    }
    if (elements.slideFrame.requestFullscreen) {
      elements.slideFrame.classList.add("is-fullscreen");
      await elements.slideFrame.requestFullscreen();
    } else {
      showToast("อุปกรณ์นี้ไม่รองรับโหมดเต็มจอ ใช้ปุ่มขยายแทนได้");
    }
  } catch {
    elements.slideFrame.classList.remove("is-fullscreen");
    showToast("เปิดเต็มจอไม่สำเร็จ ใช้ปุ่มขยายแทนได้");
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => elements.toast.classList.remove("is-visible"), 2400);
}

async function copyCurrentLink() {
  updateUrlAndMemory();
  try {
    await navigator.clipboard.writeText(window.location.href);
    showToast("คัดลอกลิงก์หน้านี้แล้ว");
  } catch {
    const input = document.createElement("textarea");
    input.value = window.location.href;
    input.setAttribute("readonly", "");
    input.style.position = "fixed";
    input.style.opacity = "0";
    document.body.append(input);
    input.select();
    document.execCommand("copy");
    input.remove();
    showToast("คัดลอกลิงก์หน้านี้แล้ว");
  }
}

function bindEvents() {
  elements.tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setCourse(Number(tab.dataset.course)));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
      const nextIndex = (index + direction + elements.tabs.length) % elements.tabs.length;
      elements.tabs[nextIndex].focus();
      setCourse(Number(elements.tabs[nextIndex].dataset.course));
    });
  });

  document.querySelectorAll("[data-open-course]").forEach((button) => {
    button.addEventListener("click", () => setCourse(Number(button.dataset.openCourse), { scroll: true }));
  });

  elements.previousButton.addEventListener("click", () => changeSlide(-1));
  elements.nextButton.addEventListener("click", () => changeSlide(1));
  elements.framePrev.addEventListener("click", () => changeSlide(-1));
  elements.frameNext.addEventListener("click", () => changeSlide(1));
  elements.zoomButton.addEventListener("click", toggleZoom);
  elements.slideImage.addEventListener("click", toggleZoom);
  elements.fullscreenButton.addEventListener("click", toggleFullscreen);
  elements.copyLink.addEventListener("click", copyCurrentLink);

  document.addEventListener("fullscreenchange", () => {
    elements.slideFrame.classList.toggle("is-fullscreen", document.fullscreenElement === elements.slideFrame);
    elements.fullscreenButton.textContent = document.fullscreenElement ? "ออกจากเต็มจอ" : "เต็มจอ";
  });

  document.addEventListener("keydown", (event) => {
    if (["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(document.activeElement?.tagName)) return;
    if (event.key === "ArrowLeft") changeSlide(-1);
    if (event.key === "ArrowRight") changeSlide(1);
    if (event.key.toLowerCase() === "f") toggleFullscreen();
  });

  elements.slideFrame.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
    touchStartY = event.changedTouches[0].clientY;
  }, { passive: true });

  elements.slideFrame.addEventListener("touchend", (event) => {
    if (elements.slideFrame.classList.contains("is-zoomed")) return;
    const deltaX = event.changedTouches[0].clientX - touchStartX;
    const deltaY = event.changedTouches[0].clientY - touchStartY;
    if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
      changeSlide(deltaX < 0 ? 1 : -1);
    }
  }, { passive: true });

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canHover && !reduceMotion) {
    elements.heroVisual.addEventListener("pointermove", (event) => {
      const rect = elements.heroVisual.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      const transforms = [
        `rotateX(${y * -1.2}deg) rotateY(${x * 1.5}deg) rotateZ(-3deg) translate3d(${-10 + x * 3}px, ${-18 + y * 3}px, -160px)`,
        `rotateX(${y * -1.4}deg) rotateY(${x * 1.8}deg) rotateZ(2.2deg) translate3d(${-4 + x * 4}px, ${-10 + y * 4}px, -120px)`,
        `rotateX(${y * -1.7}deg) rotateY(${x * 2.2}deg) rotateZ(-1.8deg) translate3d(${x * 5}px, ${-4 + y * 5}px, -80px)`,
        `rotateX(${y * -2}deg) rotateY(${x * 2.7}deg) rotateZ(1deg) translate3d(${4 + x * 6}px, ${3 + y * 6}px, -40px)`,
        `rotateX(${y * -2.4}deg) rotateY(${x * 3.2}deg) rotateZ(-0.4deg) translate3d(${8 + x * 8}px, ${10 + y * 8}px, 20px)`
      ];
      elements.heroCards.forEach((card, index) => { card.style.transform = transforms[index]; });
    });

    elements.heroVisual.addEventListener("pointerleave", () => {
      elements.heroCards.forEach((card) => { card.style.transform = ""; });
    });
  }
}

readInitialState();
bindEvents();
setCourse(activeCourse, { slide: activeSlide });
