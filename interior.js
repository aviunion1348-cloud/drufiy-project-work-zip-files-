/* Shared DrufiyAI detail-page runtime. */

(() => {
  "use strict";

  const page = document.querySelector(".detail-page");
  if (!page) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sound = (id, level = 0.62) => window.DrufiySound?.play(id, { level });

  function setupLoaderAndVideo() {
    const video = document.querySelector(".detail-hero-video");
    const reveal = () => {
      page.classList.add("is-loaded");
      if (video) video.classList.add("is-ready");
    };

    if (!video || reducedMotion.matches) {
      window.setTimeout(reveal, 120);
      return;
    }

    if (video.readyState >= 2) reveal();
    else {
      video.addEventListener("canplay", reveal, { once: true });
      video.addEventListener("error", reveal, { once: true });
      window.setTimeout(reveal, 1800);
    }
    video.play().catch(() => reveal());
  }

  function setupReveals() {
    const elements = [...document.querySelectorAll("[data-detail-reveal]")];
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8%" },
    );
    elements.forEach((element) => observer.observe(element));
  }

  function setupProgress() {
    const bar = document.querySelector(".detail-progress i");
    let scheduled = false;
    const update = () => {
      scheduled = false;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / max));
      if (bar) bar.style.transform = `scaleX(${progress.toFixed(5)})`;
    };
    window.addEventListener("scroll", () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  function setupSound() {
    const button = document.querySelector(".detail-sound");
    if (!button) return;
    button.addEventListener("click", async () => {
      const requested = button.getAttribute("aria-pressed") !== "true";
      const enabled = requested ? await window.DrufiySound?.setEnabled(true) : false;
      if (!requested) await window.DrufiySound?.setEnabled(false);
      button.setAttribute("aria-pressed", String(Boolean(enabled)));
      button.querySelector("span").textContent = enabled ? "AUDIO ON" : "AUDIO OFF";
      if (enabled) sound("launch:low:subtle", 0.5);
    });
  }

  function setupTerminalReplay() {
    document.querySelectorAll(".detail-terminal").forEach((terminal) => {
      terminal.addEventListener("click", () => {
        terminal.classList.remove("is-visible");
        requestAnimationFrame(() => terminal.classList.add("is-visible"));
        sound("scan:highMid:soft");
      });
    });
  }

  function setupArchitecture() {
    const nodes = [...document.querySelectorAll(".arch-node[data-detail]")];
    const detail = document.querySelector(".arch-detail span");
    nodes.forEach((node) => {
      const activate = () => {
        nodes.forEach((item) => item.classList.toggle("is-active", item === node));
        if (detail) detail.textContent = node.dataset.detail;
        sound("select:highMid:subtle");
      };
      node.addEventListener("click", activate);
      node.addEventListener("focus", activate);
    });
  }

  function setupRouteTransitions() {
    const veil = document.createElement("div");
    veil.className = "detail-route-veil";
    veil.setAttribute("aria-hidden", "true");
    document.body.append(veil);

    document.querySelectorAll("a[href$='.html'], a[href*='.html#']").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        const destination = new URL(link.href, window.location.href);
        if (destination.pathname === window.location.pathname && destination.hash) return;
        event.preventDefault();
        veil.classList.add("is-active");
        sound("open:highMid:soft");
        window.setTimeout(() => window.location.assign(destination.href), reducedMotion.matches ? 0 : 500);
      });
    });
  }

  function setupHeroParallax() {
    if (reducedMotion.matches || !window.matchMedia("(pointer: fine)").matches) return;
    const title = document.querySelector(".detail-hero h1");
    const video = document.querySelector(".detail-hero-video");
    let targetX = 0;
    let targetY = 0;
    let frame = 0;
    const render = () => {
      frame = 0;
      if (title) title.style.transform = `translate3d(${(targetX * -13).toFixed(2)}px, ${(targetY * -8).toFixed(2)}px, 0)`;
      if (video) video.style.objectPosition = `${(50 + targetX * 2.5).toFixed(2)}% ${(50 + targetY * 2).toFixed(2)}%`;
    };
    window.addEventListener("pointermove", (event) => {
      targetX = event.clientX / window.innerWidth - 0.5;
      targetY = event.clientY / window.innerHeight - 0.5;
      if (!frame) frame = requestAnimationFrame(render);
    }, { passive: true });
  }

  function setupInteractiveSounds() {
    document.querySelectorAll("a, button").forEach((element) => {
      element.addEventListener("pointerenter", () => sound("hover:highMid:subtle", 0.16));
    });
  }

  setupLoaderAndVideo();
  setupReveals();
  setupProgress();
  setupSound();
  setupTerminalReplay();
  setupArchitecture();
  setupRouteTransitions();
  setupHeroParallax();
  setupInteractiveSounds();
})();
