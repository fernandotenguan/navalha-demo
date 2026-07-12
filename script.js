/* NAVALHA · Clube de Barbear — interactions
   Reveal on scroll · nav state · mobile menu · floating service image */

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

  /* ---------- Mapa customizado (Google Maps API) ---------- */
  const mapaEl = document.getElementById("mapa");
  if (mapaEl) {
    const apiKey = mapaEl.dataset.apiKey || ""; // insira sua chave aqui

    // Estilo sofisticado da NAVALHA: osso, latão e cinzas elegantes
    const mapStyle = [
      {
        featureType: "all",
        elementType: "labels.text.fill",
        stylers: [{ color: "#c9a227" }], // latão
      },
      {
        featureType: "all",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#c9a227" }, { lightness: 30 }],
      },
      {
        featureType: "administrative",
        elementType: "geometry.fill",
        stylers: [{ color: "#f5f0e6" }, { lightness: 100 }], // osso
      },
      {
        featureType: "administrative",
        elementType: "geometry.stroke",
        stylers: [{ color: "#c9a227" }, { weight: 0.5 }],
      },
      {
        featureType: "administrative.country",
        elementType: "geometry.stroke",
        stylers: [{ color: "#c9a227" }, { weight: 1 }],
      },
      {
        featureType: "administrative.province",
        elementType: "geometry.stroke",
        stylers: [{ color: "#c9a227" }, { weight: 0.7 }],
      },
      {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [{ color: "#ffffff" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#c9a227" }, { weight: 0.3 }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.fill",
        stylers: [{ color: "#f5f0e6" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#c9a227" }, { weight: 0.6 }],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.fill",
        stylers: [{ color: "#ffffff" }],
      },
      {
        featureType: "road.arterial",
        elementType: "geometry.stroke",
        stylers: [{ color: "#c9a227" }, { weight: 0.4 }],
      },
      {
        featureType: "road.local",
        elementType: "geometry.fill",
        stylers: [{ color: "#ffffff" }],
      },
      {
        featureType: "road.local",
        elementType: "geometry.stroke",
        stylers: [{ color: "#c9a227" }, { weight: 0.3 }, { lightness: 20 }],
      },
      {
        featureType: "poi",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "poi.place_of_worship",
        elementType: "all",
        stylers: [{ visibility: "on" }],
      },
      {
        featureType: "transit",
        elementType: "all",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "landscape",
        elementType: "geometry",
        stylers: [{ color: "#f5f0e6" }], // osso como fundo
      },
    ];

    // Se houver chave de API, carregar mapa real
    if (apiKey) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.defer = true;
      script.onload = () => {
        const map = new google.maps.Map(mapaEl, {
          center: { lat: -23.5612, lng: -46.6561 }, // Vila Madalena
          zoom: 16,
          styles: mapStyle,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },
        });

        // Marcador na barbearia
        new google.maps.Marker({
          position: { lat: -23.5612, lng: -46.6561 },
          map: map,
          title: "NAVALHA · Clube de Barbear",
        });
      };
      document.head.appendChild(script);
    } else {
      // Fallback: mostrar mensagem ou placeholder visual
      mapaEl.style.display = "flex";
      mapaEl.style.alignItems = "center";
      mapaEl.style.justifyContent = "center";
      mapaEl.style.background = "#f5f0e6";
      mapaEl.style.color = "#c9a227";
      mapaEl.style.fontSize = "0.9rem";
      mapaEl.style.textAlign = "center";
      mapaEl.innerHTML =
        "Rua Harmonia, 123 · Vila Madalena, São Paulo<br>(Para habilitar mapa interativo, adicione data-api-key na div#mapa)";
    }
  }

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
      // interpolação suave (lerp) para o efeito de "arrasto" orgânico
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
