(function () {
  const nav = document.querySelector(".nav");
  const navToggle = document.querySelector(".nav__toggle");
  const navDropdownItems = document.querySelectorAll(".nav__item--dropdown");
  const mobileNavQuery = window.matchMedia("(max-width: 1024px)");

  if (!nav || !navToggle || nav.dataset.navReady === "true") return;

  nav.dataset.navReady = "true";

  const closeMobileNav = () => {
    nav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Menü öffnen");

    navDropdownItems.forEach((item) => {
      item.classList.remove("is-expanded");
      item.querySelector(".nav__trigger")?.setAttribute("aria-expanded", "false");
    });
  };

  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Menü schließen" : "Menü öffnen");

    if (!isOpen) {
      navDropdownItems.forEach((item) => {
        item.classList.remove("is-expanded");
        item.querySelector(".nav__trigger")?.setAttribute("aria-expanded", "false");
      });
    }
  });

  navDropdownItems.forEach((item) => {
    const trigger = item.querySelector(".nav__trigger");

    trigger?.addEventListener("click", () => {
      if (!mobileNavQuery.matches) return;

      const shouldOpen = !item.classList.contains("is-expanded");

      navDropdownItems.forEach((otherItem) => {
        otherItem.classList.remove("is-expanded");
        otherItem.querySelector(".nav__trigger")?.setAttribute("aria-expanded", "false");
      });

      item.classList.toggle("is-expanded", shouldOpen);
      trigger.setAttribute("aria-expanded", String(shouldOpen));
    });
  });

  document.querySelectorAll(".nav__links a").forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  mobileNavQuery.addEventListener?.("change", (event) => {
    if (!event.matches) closeMobileNav();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileNav();
  });
})();
