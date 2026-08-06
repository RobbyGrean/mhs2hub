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
    total: 8,
    folder: "course-1",
    category: "knowledge",
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
    category: "knowledge",
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
    category: "knowledge",
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
    category: "knowledge",
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
    category: "knowledge",
    pdf: "https://drive.google.com/file/d/1RTbgAm172FUEujS-01I9NnQZmq_ZYNl1/view?usp=sharing",
    accent: "#7dd3fc",
    accentRgb: "125, 211, 252",
    accentTwo: "#f2c55c"
  },
  6: {
    id: 6,
    code: "C06",
    kicker: "COURSE 06 · SCHOOL LUNCH",
    title: "แนวทางการจัดซื้อจัดจ้างและบริหารจัดการอาหารกลางวัน",
    shortTitle: "อาหารกลางวัน",
    description: "สรุปกระบวนการจัดซื้อจัดจ้าง การบริหารงบประมาณ การจัดหาอาหาร การรายงานผล และการส่งคืนเงินสำหรับโครงการอาหารกลางวัน",
    level: "แนวทางปฏิบัติ",
    audience: "สถานศึกษาและผู้รับผิดชอบโครงการ",
    total: 5,
    folder: "course-6",
    category: "knowledge",
    pdf: "course-6-lunch.pdf",
    accent: "#f48fb1",
    accentRgb: "244, 143, 177",
    accentTwo: "#7dd3fc"
  },
  7: {
    id: 7,
    code: "C01",
    kicker: "CIRCULAR 01 · W804",
    title: "สรุปหนังสือเวียน ว804",
    shortTitle: "หนังสือเวียน ว804",
    description: "สรุปแนวทางการจัดซื้อจัดจ้างตามหนังสือเวียน ว804 ให้เห็นขั้นตอน เอกสาร และประเด็นสำคัญในรูปแบบภาพ",
    level: "สรุปหนังสือเวียน",
    audience: "เจ้าหน้าที่พัสดุและผู้เกี่ยวข้อง",
    total: 9,
    folder: "course-7",
    category: "circulars",
    pdf: "circular-w804.pdf",
    accent: "#d66a5f",
    accentRgb: "214, 106, 95",
    accentTwo: "#f7b267"
  },
  8: {
    id: 8,
    code: "C02",
    kicker: "CIRCULAR 02 · W414",
    title: "สรุปหนังสือเวียน ว414",
    shortTitle: "หนังสือเวียน ว414",
    description: "สรุปแนวทางเร่งรัดการจัดซื้อจัดจ้างกรณีไม่ใช้งบประมาณรายจ่ายประจำปี พร้อมประเด็นที่ควรรู้ก่อนดำเนินงาน",
    level: "สรุปหนังสือเวียน",
    audience: "ผู้วางแผนและผู้ปฏิบัติงานจัดซื้อจัดจ้าง",
    total: 6,
    folder: "course-8",
    category: "circulars",
    pdf: "circular-w414.pdf",
    accent: "#d9a441",
    accentRgb: "217, 164, 65",
    accentTwo: "#7dd3fc"
  },
  9: {
    id: 9,
    code: "C03",
    kicker: "CIRCULAR 03 · W371",
    title: "สรุปหนังสือเวียน ว371",
    shortTitle: "หนังสือเวียน ว371",
    description: "สรุปแนวทางปฏิบัติในการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พร้อมลำดับวินิจฉัยเบื้องต้นในรูปแบบอ่านง่าย",
    level: "สรุปหนังสือเวียน",
    audience: "ผู้ปฏิบัติงานและคณะกรรมการ",
    total: 12,
    folder: "course-9",
    category: "circulars",
    pdf: "circular-w371.pdf",
    accent: "#2f8f83",
    accentRgb: "47, 143, 131",
    accentTwo: "#d9a441"
  }
};

const elements = {
  root: document.documentElement,
  viewer: document.getElementById("course-viewer"),
  tabs: [...document.querySelectorAll(".course-tab")],
  categoryToggles: [...document.querySelectorAll("button.category-toggle")],
  categoryGroups: [...document.querySelectorAll(".course-group")],
  themeToggle: document.getElementById("theme-toggle"),
  themeLabel: document.getElementById("theme-label"),
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
  heroCards: [...document.querySelectorAll(".hero-card")],
  musicPlayer: document.getElementById("music-player"),
  musicCurrentIndex: document.getElementById("music-current-index"),
  musicCurrentTitle: document.getElementById("music-current-title"),
  musicYoutubeLink: document.getElementById("music-youtube-link"),
  musicTracks: [...document.querySelectorAll(".music-track")]
};

const viewerBindings = {
  knowledge: {
    viewer: elements.viewer,
    tabs: [...document.querySelectorAll('[data-category="knowledge"] .course-tab')],
    courseKicker: elements.courseKicker,
    courseTitle: elements.courseTitle,
    courseDescription: elements.courseDescription,
    courseLevel: elements.courseLevel,
    courseTotal: elements.courseTotal,
    courseAudience: elements.courseAudience,
    downloadLink: elements.downloadLink,
    copyLink: elements.copyLink,
    slideCourseId: elements.slideCourseId,
    slideNumberLabel: elements.slideNumberLabel,
    slideFrame: elements.slideFrame,
    slideImage: elements.slideImage,
    slideCounter: elements.slideCounter,
    progressBar: elements.progressBar,
    thumbnailRail: elements.thumbnailRail,
    previousButton: elements.previousButton,
    nextButton: elements.nextButton,
    framePrev: elements.framePrev,
    frameNext: elements.frameNext,
    zoomButton: elements.zoomButton,
    fullscreenButton: elements.fullscreenButton
  },
  circulars: {
    viewer: document.getElementById("circular-course-viewer"),
    tabs: [...document.querySelectorAll('[data-category="circulars"] .course-tab')],
    courseKicker: document.getElementById("circular-course-kicker"),
    courseTitle: document.getElementById("circular-course-title"),
    courseDescription: document.getElementById("circular-course-description"),
    courseLevel: document.getElementById("circular-course-level"),
    courseTotal: document.getElementById("circular-course-total"),
    courseAudience: document.getElementById("circular-course-audience"),
    downloadLink: document.getElementById("circular-download-link"),
    copyLink: document.getElementById("circular-copy-link"),
    slideCourseId: document.getElementById("circular-slide-course-id"),
    slideNumberLabel: document.getElementById("circular-slide-number-label"),
    slideFrame: document.getElementById("circular-slide-frame"),
    slideImage: document.getElementById("circular-slide-image"),
    slideCounter: document.getElementById("circular-slide-counter"),
    progressBar: document.getElementById("circular-slide-progress-bar"),
    thumbnailRail: document.getElementById("circular-thumbnail-rail"),
    previousButton: document.getElementById("circular-previous-button"),
    nextButton: document.getElementById("circular-next-button"),
    framePrev: document.getElementById("circular-frame-prev"),
    frameNext: document.getElementById("circular-frame-next"),
    zoomButton: document.getElementById("circular-zoom-button"),
    fullscreenButton: document.getElementById("circular-fullscreen-button")
  }
};

// Keep route IDs global for compatibility, but restart the visible course number per section.
const categoryCourseNumbers = Object.values(courses).reduce((groups, course) => {
  if (!groups[course.category]) groups[course.category] = [];
  groups[course.category].push(course.id);
  return groups;
}, {});

const viewerStates = {
  knowledge: { course: 1, slide: 1 },
  circulars: { course: 7, slide: 1 }
};

let activeCourse = 1;
let activeSlide = 1;
let activeViewerCategory = "knowledge";
let toastTimer;
let musicLoadTimer;
let imageRequest = 0;

function activateViewer(category) {
  const nextCategory = viewerBindings[category] ? category : "knowledge";
  Object.assign(elements, viewerBindings[nextCategory]);
  activeViewerCategory = nextCategory;
  activeCourse = viewerStates[nextCategory].course;
  activeSlide = viewerStates[nextCategory].slide;
}

function twoDigits(value) {
  return String(value).padStart(2, "0");
}

function categoryCourseNumber(course) {
  const courseIds = categoryCourseNumbers[course.category] || [];
  const position = courseIds.indexOf(course.id);
  return position >= 0 ? position + 1 : course.id;
}

function displayCourseCode(course) {
  return `C${twoDigits(categoryCourseNumber(course))}`;
}

function normalizeCourseTabNumbers() {
  document.querySelectorAll(".course-tab").forEach((tab) => {
    const course = courses[Number(tab.dataset.course)];
    const number = tab.querySelector(".tab-number");
    if (course && number) number.textContent = twoDigits(categoryCourseNumber(course));
  });
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
  activeViewerCategory = courses[activeCourse].category;
  viewerStates[activeViewerCategory] = { course: activeCourse, slide: activeSlide };
}

function setColorMode(mode, { persist = true } = {}) {
  const nextMode = mode === "dark" ? "dark" : "soft";
  elements.root.dataset.theme = nextMode;
  if (persist) localStorage.setItem("mhs2-learning-theme", nextMode);
  if (elements.themeToggle) {
    const isDark = nextMode === "dark";
    elements.themeToggle.setAttribute("aria-pressed", String(isDark));
    elements.themeToggle.setAttribute("aria-label", isDark ? "เปลี่ยนเป็น Soft mode" : "เปลี่ยนเป็น Dark mode");
  }
  if (elements.themeLabel) elements.themeLabel.textContent = nextMode === "dark" ? "Dark" : "Soft";
  updateThemeColor();
}

function updateThemeColor() {
  const isDark = elements.root.dataset.theme === "dark";
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", isDark ? "#080b16" : "#f3e3cd");
}

function openCategory(categoryId) {
  const group = elements.categoryGroups.find((candidate) => candidate.dataset.category === categoryId);
  if (!group) return;
  if (group.dataset.static === "true") {
    group.classList.add("is-open");
    const panel = group.querySelector(".course-group-panel");
    if (panel) panel.hidden = false;
    return;
  }
  group.classList.add("is-open");
  group.querySelector(".category-toggle")?.setAttribute("aria-expanded", "true");
  const panel = group.querySelector(".course-group-panel");
  if (panel) panel.hidden = false;
}

function toggleCategory(categoryId) {
  const group = elements.categoryGroups.find((candidate) => candidate.dataset.category === categoryId);
  if (!group || group.dataset.static === "true") return;
  const isOpen = group.classList.contains("is-open");
  if (isOpen) {
    group.classList.remove("is-open");
    group.querySelector(".category-toggle")?.setAttribute("aria-expanded", "false");
    const panel = group.querySelector(".course-group-panel");
    if (panel) panel.hidden = true;
    return;
  }
  openCategory(categoryId);
}

function applyTheme(course) {
  elements.root.style.setProperty("--accent", course.accent);
  elements.root.style.setProperty("--accent-rgb", course.accentRgb);
  elements.root.style.setProperty("--accent-two", course.accentTwo);
  elements.viewer.style.setProperty("--accent", course.accent);
  elements.viewer.style.setProperty("--accent-rgb", course.accentRgb);
  elements.viewer.style.setProperty("--accent-two", course.accentTwo);
  updateThemeColor();
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
  elements.slideCourseId.textContent = displayCourseCode(course);
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
  const viewerCategory = activeViewerCategory;

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
    button.addEventListener("click", () => {
      activateViewer(viewerCategory);
      setSlide(page);
    });
    fragment.append(button);
  }

  elements.thumbnailRail.replaceChildren(fragment);
}

function centerThumbnailHorizontally(button) {
  const rail = elements.thumbnailRail;
  const railRect = rail.getBoundingClientRect();
  const buttonRect = button.getBoundingClientRect();
  const targetLeft = rail.scrollLeft
    + (buttonRect.left - railRect.left)
    - ((rail.clientWidth - buttonRect.width) / 2);
  const maxLeft = Math.max(0, rail.scrollWidth - rail.clientWidth);
  const left = Math.min(Math.max(targetLeft, 0), maxLeft);
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  rail.scrollTo({ left, behavior: reduceMotion ? "auto" : "smooth" });
}

function updateThumbnailSelection(shouldScroll = true) {
  const buttons = elements.thumbnailRail.querySelectorAll(".thumbnail-button");
  buttons.forEach((button) => {
    const selected = Number(button.dataset.slide) === activeSlide;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-current", selected ? "true" : "false");
    if (selected && shouldScroll) {
      centerThumbnailHorizontally(button);
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
  viewerStates[activeViewerCategory] = { course: activeCourse, slide: activeSlide };
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

  viewerStates[activeViewerCategory] = { course: activeCourse, slide: activeSlide };
  activateViewer(course.category);
  elements.viewer.classList.add("course-swap");
  activeCourse = course.id;
  activeSlide = Math.min(Math.max(options.slide || 1, 1), course.total);
  viewerStates[activeViewerCategory] = { course: activeCourse, slide: activeSlide };
  openCategory(course.category);
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

function selectMusicTrack(track) {
  if (!track || !elements.musicPlayer) return;
  const { video, title, index } = track.dataset;
  if (!video || !title || !index) return;

  elements.musicTracks.forEach((button) => {
    const selected = button === track;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-pressed", String(selected));
  });
  elements.musicCurrentIndex.textContent = `${index} / 05`;
  elements.musicCurrentTitle.textContent = title;
  elements.musicYoutubeLink.href = `https://youtu.be/${video}`;

  if (elements.musicPlayer.dataset.currentVideo === video) return;
  elements.musicPlayer.closest(".music-player-shell")?.classList.add("is-switching");
  window.clearTimeout(musicLoadTimer);
  musicLoadTimer = window.setTimeout(() => {
    elements.musicPlayer.closest(".music-player-shell")?.classList.remove("is-switching");
  }, 8000);
  elements.musicPlayer.dataset.currentVideo = video;
  elements.musicPlayer.title = `เพลงพัสดุ: ${title}`;
  elements.musicPlayer.src = `https://www.youtube-nocookie.com/embed/${video}?rel=0&playsinline=1&autoplay=1`;
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
  elements.categoryToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => toggleCategory(toggle.closest(".course-group")?.dataset.category));
  });

  elements.tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => setCourse(Number(tab.dataset.course)));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      const direction = ["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1;
      const groupTabs = [...tab.closest(".course-tabs").querySelectorAll(".course-tab")];
      const groupIndex = groupTabs.indexOf(tab);
      const nextIndex = (groupIndex + direction + groupTabs.length) % groupTabs.length;
      groupTabs[nextIndex].focus();
      setCourse(Number(groupTabs[nextIndex].dataset.course));
    });
  });

  elements.themeToggle?.addEventListener("click", () => {
    setColorMode(elements.root.dataset.theme === "dark" ? "soft" : "dark");
  });

  elements.musicTracks.forEach((track) => {
    track.addEventListener("click", () => selectMusicTrack(track));
  });
  elements.musicPlayer?.addEventListener("load", () => {
    window.clearTimeout(musicLoadTimer);
    elements.musicPlayer.closest(".music-player-shell")?.classList.remove("is-switching");
  });

  document.querySelectorAll("[data-open-course]").forEach((button) => {
    button.addEventListener("click", () => setCourse(Number(button.dataset.openCourse), { scroll: true }));
  });

  Object.entries(viewerBindings).forEach(([category, viewer]) => {
    const activate = () => activateViewer(category);
    viewer.previousButton.addEventListener("click", () => { activate(); changeSlide(-1); });
    viewer.nextButton.addEventListener("click", () => { activate(); changeSlide(1); });
    viewer.framePrev.addEventListener("click", () => { activate(); changeSlide(-1); });
    viewer.frameNext.addEventListener("click", () => { activate(); changeSlide(1); });
    viewer.zoomButton.addEventListener("click", () => { activate(); toggleZoom(); });
    viewer.slideImage.addEventListener("click", () => { activate(); toggleZoom(); });
    viewer.fullscreenButton.addEventListener("click", () => { activate(); toggleFullscreen(); });
    viewer.copyLink.addEventListener("click", () => { activate(); copyCurrentLink(); });

    let startX = 0;
    let startY = 0;
    viewer.slideFrame.addEventListener("touchstart", (event) => {
      activate();
      startX = event.changedTouches[0].clientX;
      startY = event.changedTouches[0].clientY;
    }, { passive: true });

    viewer.slideFrame.addEventListener("touchend", (event) => {
      if (viewer.slideFrame.classList.contains("is-zoomed")) return;
      const deltaX = event.changedTouches[0].clientX - startX;
      const deltaY = event.changedTouches[0].clientY - startY;
      if (Math.abs(deltaX) > 55 && Math.abs(deltaX) > Math.abs(deltaY) * 1.3) {
        activate();
        changeSlide(deltaX < 0 ? 1 : -1);
      }
    }, { passive: true });
  });

  document.addEventListener("fullscreenchange", () => {
    Object.values(viewerBindings).forEach((viewer) => {
      const isFullscreen = document.fullscreenElement === viewer.slideFrame;
      viewer.slideFrame.classList.toggle("is-fullscreen", isFullscreen);
      viewer.fullscreenButton.textContent = isFullscreen ? "ออกจากเต็มจอ" : "เต็มจอ";
    });
  });

  document.addEventListener("keydown", (event) => {
    if (["INPUT", "TEXTAREA", "SELECT", "BUTTON", "A"].includes(document.activeElement?.tagName)) return;
    if (event.key === "ArrowLeft") changeSlide(-1);
    if (event.key === "ArrowRight") changeSlide(1);
    if (event.key.toLowerCase() === "f") toggleFullscreen();
  });

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
normalizeCourseTabNumbers();
bindEvents();
setColorMode(elements.root.dataset.theme, { persist: false });
setCourse(activeCourse, { slide: activeSlide });
