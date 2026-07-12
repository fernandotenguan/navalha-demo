/* NAVALHA Â· Clube de Barbear â€” interactions
   Reveal on scroll Â· nav state Â· mobile menu Â· floating service image */

(function () {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------- Nav background after scroll ---------- */
  const nav = document.querySelector(".nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const burger = document.querySelector(".nav__burger");
  const menu = document.querySelector(".menu-mobile");

  const closeMenu = () => {
    menu.hidden = true;
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Abrir menu");
    document.body.style.overflow = "";
  };

  burger.addEventListener("click", () => {
    const open = menu.hidden;
    menu.hidden = !open;
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open ? "hidden" : "";
  });

  menu
    .querySelectorAll("a")
    .forEach((a) => a.addEventListener("click", closeMenu));

  /* ---------- Floating image on service hover (desktop only) ---------- */
  const floatImg = document.querySelector(".float-img");
  const rows = document.querySelectorAll(".price-row");
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (floatImg && finePointer && !prefersReducedMotion) {
    let targetX = 0;
    let targetY = 0;
    let x = 0;
    let y = 0;
    let rafId = null;

    const follow = () => {
      // interpolaÃ§Ã£o suave (lerp) para o efeito de "arrasto" orgÃ¢nico
      x += (targetX - x) * 0.12;
      y += (targetY - y) * 0.12;
      floatImg.style.transform = `translate(${x}px, ${y}px) scale(1)`;
      rafId = requestAnimationFrame(follow);
    };

    rows.forEach((row) => {
      row.addEventListener("mouseenter", () => {
        floatImg.src = row.dataset.img;
        floatImg.classList.add("on");
        if (rafId === null) rafId = requestAnimationFrame(follow);
      });
      row.addEventListener("mouseleave", () => {
        floatImg.classList.remove("on");
        if (rafId !== null) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    });

    document.addEventListener(
      "mousemove",
      (e) => {
        targetX = e.clientX + 28;
        targetY = e.clientY - floatImg.offsetHeight / 2;
      },
      { passive: true },
    );
  }
})();
