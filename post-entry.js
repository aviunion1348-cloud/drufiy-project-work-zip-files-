/* DrufiyAI post-entry immersive runtime. Dependency-free and motion-safe. */

(() => {
  "use strict";

  const experience = document.querySelector(".experience-shell");
  if (!experience) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = window.matchMedia("(pointer: fine)");
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const lerp = (from, to, amount) => from + (to - from) * amount;
  const sound = (id, level = 0.72) => window.DrufiySound?.play(id, { level });

  let pointerTargetX = 0;
  let pointerTargetY = 0;
  let pointerX = 0;
  let pointerY = 0;
  let pointerFrame = 0;
  let cursorX = -100;
  let cursorY = -100;
  let dotX = -100;
  let dotY = -100;
  let cursorTargetX = -100;
  let cursorTargetY = -100;

  function setupLazyVideos() {
    const videos = [...experience.querySelectorAll("video")];

    const activateVideo = (video) => {
      const source = video.querySelector("source[data-src]");
      if (source && !source.src) {
        source.src = source.dataset.src;
        video.load();
      }

      const markReady = () => video.classList.add("is-ready");
      if (video.readyState >= 2) markReady();
      else video.addEventListener("canplay", markReady, { once: true });

      if (!reducedMotion.matches) {
        video.play().catch(() => video.classList.add("is-blocked"));
      }
    };

    const pauseVideo = (video) => {
      if (!video.closest(".gateway-chapter")) video.pause();
    };

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      if (!reducedMotion.matches) videos.forEach(activateVideo);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) activateVideo(video);
          else pauseVideo(video);
        });
      },
      { rootMargin: "75% 0px 75% 0px", threshold: 0.01 },
    );

    videos.forEach((video) => {
      video.addEventListener("error", () => video.classList.add("has-error"));
      observer.observe(video);
    });
  }

  function setupReveals() {
    const revealItems = [...experience.querySelectorAll("[data-lux-reveal]")];
    revealItems.forEach((item) => {
      item.style.setProperty("--reveal-delay", `${Number(item.dataset.delay || 0)}ms`);
    });

    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      revealItems.forEach((item) => item.classList.add("is-visible"));
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
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" },
    );
    revealItems.forEach((item) => observer.observe(item));
  }

  function setupChapterNavigation() {
    const chapters = [...experience.querySelectorAll("[data-chapter]")];
    const dockLinks = [...experience.querySelectorAll(".dock-links a")];
    const railLinks = [...experience.querySelectorAll(".chapter-rail a")];
    let activeId = "";

    const setActive = (id) => {
      if (!id || id === activeId) return;
      activeId = id;
      [...dockLinks, ...railLinks].forEach((link) => {
        const isActive = link.getAttribute("href") === `#${id}`;
        link.classList.toggle("is-active", isActive);
        if (isActive) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
      sound("scan:highMid:subtle", 0.42);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.dataset.chapter);
      },
      { threshold: [0.18, 0.38, 0.58], rootMargin: "-18% 0px -38% 0px" },
    );
    chapters.forEach((chapter) => observer.observe(chapter));

    const engagementObserver = new IntersectionObserver(
      ([entry]) => experience.classList.toggle("is-engaged", entry.isIntersecting),
      { threshold: 0.01 },
    );
    engagementObserver.observe(experience);
  }

  function updatePointerField() {
    pointerFrame = 0;
    pointerX = lerp(pointerX, pointerTargetX, 0.09);
    pointerY = lerp(pointerY, pointerTargetY, 0.09);
    experience.style.setProperty("--lux-x", pointerX.toFixed(4));
    experience.style.setProperty("--lux-y", pointerY.toFixed(4));

    cursorX = lerp(cursorX, cursorTargetX, 0.16);
    cursorY = lerp(cursorY, cursorTargetY, 0.16);
    dotX = lerp(dotX, cursorTargetX, 0.42);
    dotY = lerp(dotY, cursorTargetY, 0.42);

    const cursor = document.querySelector(".lux-cursor");
    const dot = document.querySelector(".lux-cursor-dot");
    if (cursor) cursor.style.transform = `translate3d(${(cursorX - 19).toFixed(2)}px, ${(cursorY - 19).toFixed(2)}px, 0)`;
    if (dot) dot.style.transform = `translate3d(${(dotX - 2).toFixed(2)}px, ${(dotY - 2).toFixed(2)}px, 0)`;

    if (
      Math.abs(pointerX - pointerTargetX) > 0.0005 ||
      Math.abs(pointerY - pointerTargetY) > 0.0005 ||
      Math.abs(cursorX - cursorTargetX) > 0.1 ||
      Math.abs(cursorY - cursorTargetY) > 0.1
    ) {
      requestPointerFrame();
    }
  }

  function requestPointerFrame() {
    if (!pointerFrame) pointerFrame = requestAnimationFrame(updatePointerField);
  }

  function setupPointerExperience() {
    if (!finePointer.matches || reducedMotion.matches) return;

    const cursor = document.createElement("i");
    const dot = document.createElement("i");
    cursor.className = "lux-cursor";
    dot.className = "lux-cursor-dot";
    cursor.setAttribute("aria-hidden", "true");
    dot.setAttribute("aria-hidden", "true");
    document.body.append(cursor, dot);

    window.addEventListener(
      "pointermove",
      (event) => {
        pointerTargetX = event.clientX / window.innerWidth - 0.5;
        pointerTargetY = event.clientY / window.innerHeight - 0.5;
        cursorTargetX = event.clientX;
        cursorTargetY = event.clientY;
        document.body.classList.add("has-lux-cursor");
        requestPointerFrame();
      },
      { passive: true },
    );

    document.addEventListener("pointerleave", () => document.body.classList.remove("has-lux-cursor"));
    const interactive = experience.querySelectorAll("a, button, input, textarea, [role='button']");
    interactive.forEach((element) => {
      element.addEventListener("pointerenter", () => cursor.classList.add("is-hovering"));
      element.addEventListener("pointerleave", () => cursor.classList.remove("is-hovering"));
    });
  }

  function setupTiltSurfaces() {
    if (!finePointer.matches || reducedMotion.matches) return;
    experience.querySelectorAll(".tilt-surface").forEach((surface) => {
      surface.addEventListener("pointermove", (event) => {
        const rect = surface.getBoundingClientRect();
        const x = clamp((event.clientX - rect.left) / rect.width);
        const y = clamp((event.clientY - rect.top) / rect.height);
        surface.style.setProperty("--tilt-x", `${((0.5 - y) * 5).toFixed(2)}deg`);
        surface.style.setProperty("--tilt-y", `${((x - 0.5) * 5).toFixed(2)}deg`);
        surface.style.setProperty("--card-x", `${(x * 100).toFixed(1)}%`);
        surface.style.setProperty("--card-y", `${(y * 100).toFixed(1)}%`);
      });
      surface.addEventListener("pointerleave", () => {
        surface.style.setProperty("--tilt-x", "0deg");
        surface.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  function setupMagneticControls() {
    if (!finePointer.matches || reducedMotion.matches) return;
    experience.querySelectorAll(".magnetic").forEach((element) => {
      element.addEventListener("pointermove", (event) => {
        const rect = element.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) * 0.12;
        const y = (event.clientY - rect.top - rect.height / 2) * 0.16;
        element.style.setProperty("--magnetic-x", `${x.toFixed(2)}px`);
        element.style.setProperty("--magnetic-y", `${y.toFixed(2)}px`);
      });
      element.addEventListener("pointerleave", () => {
        element.style.setProperty("--magnetic-x", "0px");
        element.style.setProperty("--magnetic-y", "0px");
      });
    });
  }

  function makeCanvasEngine(canvas, type) {
    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return null;
    let width = 1;
    let height = 1;
    let dpr = 1;
    let animationFrame = 0;
    let visible = false;
    const points = [];
    const pointCount = type === "star" ? 105 : 64;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!points.length) {
        for (let index = 0; index < pointCount; index += 1) {
          points.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * (type === "star" ? 0.08 : 0.18),
            vy: (Math.random() - 0.5) * (type === "star" ? 0.05 : 0.13),
            size: Math.random() * (type === "star" ? 1.6 : 1.9) + 0.25,
            phase: Math.random() * Math.PI * 2,
          });
        }
      }
    }

    function draw(time = 0) {
      animationFrame = 0;
      if (!visible || reducedMotion.matches || document.hidden) return;
      context.clearRect(0, 0, width, height);

      for (const point of points) {
        point.x += point.vx;
        point.y += point.vy;
        if (point.x < -20) point.x = width + 20;
        if (point.x > width + 20) point.x = -20;
        if (point.y < -20) point.y = height + 20;
        if (point.y > height + 20) point.y = -20;
      }

      if (type === "network") {
        for (let a = 0; a < points.length; a += 1) {
          for (let b = a + 1; b < points.length; b += 1) {
            const dx = points[a].x - points[b].x;
            const dy = points[a].y - points[b].y;
            const distance = Math.hypot(dx, dy);
            if (distance > 145) continue;
            context.beginPath();
            context.moveTo(points[a].x, points[a].y);
            context.lineTo(points[b].x, points[b].y);
            context.strokeStyle = `rgba(59, 232, 176, ${((1 - distance / 145) * 0.12).toFixed(3)})`;
            context.lineWidth = 0.7;
            context.stroke();
          }
        }
      }

      points.forEach((point) => {
        const pulse = 0.5 + Math.sin(time * 0.0015 + point.phase) * 0.35;
        context.beginPath();
        context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        context.fillStyle = type === "star" ? `rgba(240, 242, 245, ${0.16 + pulse * 0.35})` : `rgba(59, 232, 176, ${0.2 + pulse * 0.42})`;
        context.fill();
      });

      animationFrame = requestAnimationFrame(draw);
    }

    function setVisible(next) {
      visible = next;
      if (visible && !animationFrame) animationFrame = requestAnimationFrame(draw);
      if (!visible && animationFrame) cancelAnimationFrame(animationFrame);
      if (!visible) animationFrame = 0;
    }

    resize();
    window.addEventListener("resize", resize, { passive: true });
    return { setVisible, resize };
  }

  function setupCanvases() {
    if (reducedMotion.matches) return;
    const canvases = [
      [experience.querySelector("[data-starfield]"), "star"],
      [experience.querySelector("[data-network-canvas]"), "network"],
    ].filter(([canvas]) => canvas);

    const engines = new Map(canvases.map(([canvas, type]) => [canvas, makeCanvasEngine(canvas, type)]));
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => engines.get(entry.target)?.setVisible(entry.isIntersecting)),
      { rootMargin: "20% 0px 20% 0px" },
    );
    canvases.forEach(([canvas]) => observer.observe(canvas));
  }

  function setupSignalConsole() {
    const sourceChips = [...experience.querySelectorAll(".source-chip")];
    const consoleElement = experience.querySelector(".signal-console");
    sourceChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        sourceChips.forEach((item) => item.classList.toggle("is-active", item === chip));
        sound("scan:highMid:soft");
        if (consoleElement) {
          consoleElement.classList.remove("is-visible");
          requestAnimationFrame(() => consoleElement.classList.add("is-visible"));
        }
      });
    });
  }

  function setupContactForm() {
    const form = experience.querySelector("[data-contact-form]");
    if (!form) return;
    const status = form.querySelector(".form-status");
    const submit = form.querySelector("button[type='submit']");

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      const data = Object.fromEntries(new FormData(form));
      submit.disabled = true;
      status.className = "form-status";
      status.textContent = "Opening encrypted channel…";
      sound("scan:lowMid:soft");

      try {
        const response = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!response.ok) throw new Error("Request failed");
        status.classList.add("is-success");
        status.textContent = "Message received. We'll get back to you shortly.";
        form.reset();
        sound("confirm:highMid:firm");
      } catch {
        status.classList.add("is-error");
        status.textContent = "Channel unavailable. Please try again.";
        sound("error:lowMid:soft");
      } finally {
        submit.disabled = false;
      }
    });
  }

  function setupRouteTransitions() {
    const veil = document.createElement("div");
    veil.className = "route-veil";
    veil.setAttribute("aria-hidden", "true");
    document.body.append(veil);

    experience.querySelectorAll("a[href$='.html'], a[href*='.html#']").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        const destination = link.href;
        veil.classList.add("is-active");
        sound("launch:low:soft", 0.54);
        window.setTimeout(() => window.location.assign(destination), reducedMotion.matches ? 0 : 520);
      });
    });
  }

  function setupScrollDepth() {
    let scheduled = false;
    const update = () => {
      scheduled = false;
      const rect = experience.getBoundingClientRect();
      const distance = Math.max(1, experience.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / distance);
      experience.style.setProperty("--chapter-progress", progress.toFixed(5));
    };
    window.addEventListener("scroll", () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }, { passive: true });
    update();
  }

  setupLazyVideos();
  setupReveals();
  setupChapterNavigation();
  setupPointerExperience();
  setupTiltSurfaces();
  setupMagneticControls();
  setupCanvases();
  setupSignalConsole();
  setupContactForm();
  setupRouteTransitions();
  setupScrollDepth();
})();
