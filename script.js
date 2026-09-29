const workTitles = {
  "adapted illustration for clothes items.JPG": "succubus illustration for clothing items"
};

const works = [
  "schoolgirl illustration.JPG",
  "Jinx from Arcane illustration.JPG",
  "blue eyes illustration.JPG",
  "cigarettes illustration.JPG",
  "Ellie from the last of us II portrait.JPG",
  "one colour sketch illustration.JPG",
  "one colour pink sketch illustration.JPG",
  "scream fan art.JPG",
  "adapted illustration for clothes items.JPG",
  "obsessed vampire illustration.JPG"
].map((file) => ({
  file,
  src: `assets/images/${file}`,
  title: workTitles[file] || file.replace(/\.[^.]+$/, "").replace(/\s+/g, " ").trim()
}));

const merchWorks = [
  { file: "Intersect.jpg", title: "white t-shirt print" },
  { file: "Intersect1.jpg", title: "black t-shirt print" },
  { file: "Intersect3.jpg", title: "white t-shirt print 2" },
  { file: "Intersect4.jpg", title: "black t-shirt print 2" }
].map((item) => ({
  ...item,
  src: `assets/images/${item.file}`
}));

const body = document.body;
const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector(".main-nav");
const slider = document.querySelector("#workSlider");
const merchSlider = document.querySelector("#merchSlider");
const caption = document.querySelector("#workCaption");
const prevButton = document.querySelector(".slider-btn-prev");
const nextButton = document.querySelector(".slider-btn-next");
const merchPrevButton = document.querySelector(".merch-btn-prev");
const merchNextButton = document.querySelector(".merch-btn-next");
const imageModal = document.querySelector("#imageModal");
const modalImage = document.querySelector("#modalImage");
const imageModalTitle = document.querySelector("#imageModalTitle");
const socialToggle = document.querySelector(".contact-social-toggle");
const socialLinks = document.querySelector("#socialLinks");

let activeIndex = 0;
let activeMerchIndex = 0;
let activeModal = null;
let lastFocusedElement = null;

function normalizeIndex(index, length = works.length) {
  return (index + length) % length;
}

function renderSlides() {
  const fragment = document.createDocumentFragment();

  works.forEach((work, index) => {
    const slide = document.createElement("button");
    slide.className = "work-slide";
    slide.type = "button";
    slide.dataset.index = index;
    slide.setAttribute("aria-label", `Увеличить работу ${work.title}`);

    const image = document.createElement("img");
    image.src = work.src;
    image.alt = work.title;
    image.loading = "lazy";

    slide.append(image);
    fragment.append(slide);
  });

  slider.append(fragment);
  updateSlider();
}

function updateSlider() {
  const previous = normalizeIndex(activeIndex - 1);
  const next = normalizeIndex(activeIndex + 1);

  [...slider.children].forEach((slide, index) => {
    slide.classList.toggle("is-active", index === activeIndex);
    slide.classList.toggle("is-prev", index === previous);
    slide.classList.toggle("is-next", index === next);
    slide.tabIndex = index === activeIndex || index === previous || index === next ? 0 : -1;
  });

  caption.textContent = works[activeIndex].title;
}

function moveSlider(step) {
  activeIndex = normalizeIndex(activeIndex + step);
  updateSlider();
}

function renderMerchSlides() {
  const fragment = document.createDocumentFragment();

  merchWorks.forEach((work, index) => {
    const slide = document.createElement("button");
    slide.className = "merch-slide";
    slide.type = "button";
    slide.dataset.index = index;
    slide.setAttribute("aria-label", `Увеличить ${work.title}`);

    const image = document.createElement("img");
    image.src = work.src;
    image.alt = work.title;
    image.loading = "lazy";

    slide.append(image);
    fragment.append(slide);
  });

  merchSlider.append(fragment);
  updateMerchSlider();
}

function updateMerchSlider() {
  const previous = normalizeIndex(activeMerchIndex - 1, merchWorks.length);
  const next = normalizeIndex(activeMerchIndex + 1, merchWorks.length);

  [...merchSlider.children].forEach((slide, index) => {
    slide.classList.toggle("is-active", index === activeMerchIndex);
    slide.classList.toggle("is-prev", index === previous);
    slide.classList.toggle("is-next", index === next);
    slide.tabIndex = index === activeMerchIndex || index === previous || index === next ? 0 : -1;
  });
}

function moveMerchSlider(step) {
  activeMerchIndex = normalizeIndex(activeMerchIndex + step, merchWorks.length);
  updateMerchSlider();
}

function openModal(modal) {
  lastFocusedElement = document.activeElement;
  activeModal = modal;
  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  body.classList.add("modal-open");

  const focusTarget = modal.querySelector("button, input, textarea, [href]");
  if (focusTarget) {
    focusTarget.focus();
  }
}

function closeModal() {
  if (!activeModal) return;

  activeModal.classList.remove("is-open");
  activeModal.setAttribute("aria-hidden", "true");
  body.classList.remove("modal-open");

  if (lastFocusedElement) {
    lastFocusedElement.focus();
  }

  activeModal = null;
}

function openImageModal(src, title) {
  modalImage.src = src;
  modalImage.alt = title;
  imageModalTitle.textContent = title;
  openModal(imageModal);
}

function closeMenu() {
  body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
}

function setSocialLinksOpen(opened) {
  if (!socialToggle || !socialLinks) return;

  socialLinks.hidden = !opened;
  socialLinks.classList.toggle("is-open", opened);
  socialToggle.setAttribute("aria-expanded", String(opened));
}

menuToggle.addEventListener("click", () => {
  const opened = body.classList.toggle("menu-open");
  menuToggle.setAttribute("aria-expanded", String(opened));
});

mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    closeMenu();
  }
});

prevButton.addEventListener("click", () => moveSlider(-1));
nextButton.addEventListener("click", () => moveSlider(1));
merchPrevButton.addEventListener("click", () => moveMerchSlider(-1));
merchNextButton.addEventListener("click", () => moveMerchSlider(1));

if (socialToggle && socialLinks) {
  socialToggle.addEventListener("click", () => {
    setSocialLinksOpen(socialLinks.hidden);
  });
}

slider.addEventListener("click", (event) => {
  const slide = event.target.closest(".work-slide");
  if (!slide) return;

  const index = Number(slide.dataset.index);
  activeIndex = index;
  updateSlider();
  openImageModal(works[index].src, works[index].title);
});

merchSlider.addEventListener("click", (event) => {
  const slide = event.target.closest(".merch-slide");
  if (!slide) return;

  const index = Number(slide.dataset.index);
  activeMerchIndex = index;
  updateMerchSlider();
  openImageModal(merchWorks[index].src, merchWorks[index].title);
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (activeModal) {
      closeModal();
      return;
    }
    setSocialLinksOpen(false);
    closeMenu();
  }

  if (!activeModal && event.key === "ArrowLeft") {
    moveSlider(-1);
  }

  if (!activeModal && event.key === "ArrowRight") {
    moveSlider(1);
  }
});

document.addEventListener("click", (event) => {
  if (!socialLinks || socialLinks.hidden) return;
  if (event.target.closest(".contact-actions")) return;

  setSocialLinksOpen(false);
});

renderSlides();
renderMerchSlides();
