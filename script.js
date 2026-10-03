const revealElements = document.querySelectorAll("[data-reveal]");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealElements.forEach((element) => observer.observe(element));

const hero = document.querySelector(".hero");
const heroImage = document.querySelector(".hero-image");
const topbar = document.querySelector(".topbar");
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

if (topbar && menuToggle && primaryNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = topbar.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      topbar.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (hero && heroImage && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  hero.addEventListener("pointermove", (event) => {
    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    heroImage.style.transform = `scale(1.07) translate3d(${x * -18}px, ${y * -14}px, 0)`;
  });

  hero.addEventListener("pointerleave", () => {
    heroImage.style.transform = "";
  });
}
