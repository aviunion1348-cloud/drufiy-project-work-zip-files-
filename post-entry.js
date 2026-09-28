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
  let cursorElement = null;
  let cursorDotElement = null;
  let experienceActive = false;
  let pointerLastTime = performance.now();
  const frameDuration = 1000 / 60;
  const refreshRateBlend = (baseAmount, delta) => 1 - Math.pow(1 - baseAmount, delta / frameDuration);

  function setupCinematicVideos() {
    const videos = [...document.querySelectorAll("video")];
    const visibility = new Map(videos.map((video) => [video, 0]));
    let filmsEnabled = true;

    const ensureSource = (video) => {
      const source = video.querySelector("source[data-src]");
      if (!source || source.src) return;
      source.src = source.dataset.src;
      video.load();
    };

    const activeLimit = () => window.DrufiyPerformance?.quality?.videos ?? 1;

    const reconcile = () => {
      const candidates = videos
        .filter((video) => (visibility.get(video) || 0) > 0)
        .sort((a, b) => (visibility.get(b) || 0) - (visibility.get(a) || 0));
      const selected = new Set(filmsEnabled && !reducedMotion.matches && !document.hidden
        ? candidates.slice(0, activeLimit())
        : []);

      videos.forEach((video) => {
        const shouldPlay = selected.has(video);
        if (shouldPlay) {
          ensureSource(video);
          if (video.paused) {
            video.play().then(() => video.classList.add("is-playing")).catch(() => video.classList.add("is-blocked"));
          }
        } else {
          video.pause();
          video.classList.remove("is-playing");
        }
      });
    };

    const loadObserver = new IntersectionObserver(
      (entries) => entries.forEach((entry) => {
        if (entry.isIntersecting && filmsEnabled && !reducedMotion.matches) ensureSource(entry.target);
      }),
      { rootMargin: "40% 0px 40% 0px", threshold: 0.01 },
    );
    const playObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visibility.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
        reconcile();
      },
      { threshold: [0, 0.08, 0.2, 0.4, 0.65, 0.9] },
    );

    videos.forEach((video) => {
      const markReady = () => video.classList.add("is-ready");
      video.addEventListener("canplay", markReady);
      video.addEventListener("error", () => video.classList.add("has-error"));
      if (video.readyState >= 2) markReady();
      loadObserver.observe(video);
      playObserver.observe(video);
    });

    const toggle = document.querySelector(".video-toggle");
    const label = toggle?.querySelector(".video-label");
    const icon = toggle?.querySelector(".video-toggle-icon");
    toggle?.addEventListener("click", () => {
      filmsEnabled = !filmsEnabled;
      toggle.setAttribute("aria-pressed", String(filmsEnabled));
      if (label) label.textContent = filmsEnabled ? "Films on" : "Films paused";
      if (icon) icon.textContent = filmsEnabled ? "Ⅱ" : "▶";
      if (filmsEnabled) sound("cinematic:low:soft", 0.34);
      reconcile();
    });

    document.addEventListener("visibilitychange", reconcile);
    reducedMotion.addEventListener?.("change", reconcile);
    window.addEventListener("drufiy:frame-tier", reconcile);
    return { reconcile };
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
      const chapterCues = {
        experience: "portal:lowMid:subtle",
        products: "reveal:highMid:soft",
        "signal-theatre": "data:highMid:soft",
        "how-we-build": "cinematic:lowMid:soft",
        principles: "shimmer:highMid:soft",
        contact: "ignite:lowMid:soft",
      };
      window.DrufiyFX?.emit(window.innerWidth * 0.5, window.innerHeight * 0.42, "cinematic", 0.72);
      sound(chapterCues[id] || "orbit:highMid:subtle", 0.34);
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
      ([entry]) => {
        experienceActive = entry.isIntersecting;
        experience.classList.toggle("is-engaged", experienceActive);
        if (!experienceActive) document.body.classList.remove("has-lux-cursor");
        window.dispatchEvent(new CustomEvent("drufiy:experience-active", { detail: { active: experienceActive } }));
      },
      { threshold: 0.01 },
    );
    engagementObserver.observe(experience);
  }

  function updatePointerField(timestamp = performance.now()) {
    pointerFrame = 0;
    const delta = clamp(timestamp - pointerLastTime, 4, 34);
    pointerLastTime = timestamp;
    const fieldBlend = refreshRateBlend(0.09, delta);
    const cursorBlend = refreshRateBlend(0.16, delta);
    const dotBlend = refreshRateBlend(0.42, delta);
    pointerX = lerp(pointerX, pointerTargetX, fieldBlend);
    pointerY = lerp(pointerY, pointerTargetY, fieldBlend);
    experience.style.setProperty("--lux-x", pointerX.toFixed(4));
    experience.style.setProperty("--lux-y", pointerY.toFixed(4));

    cursorX = lerp(cursorX, cursorTargetX, cursorBlend);
    cursorY = lerp(cursorY, cursorTargetY, cursorBlend);
    dotX = lerp(dotX, cursorTargetX, dotBlend);
    dotY = lerp(dotY, cursorTargetY, dotBlend);

    if (cursorElement) cursorElement.style.transform = `translate3d(${(cursorX - 19).toFixed(2)}px, ${(cursorY - 19).toFixed(2)}px, 0)`;
    if (cursorDotElement) cursorDotElement.style.transform = `translate3d(${(dotX - 2).toFixed(2)}px, ${(dotY - 2).toFixed(2)}px, 0)`;

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
    cursorElement = cursor;
    cursorDotElement = dot;
    cursor.className = "lux-cursor";
    dot.className = "lux-cursor-dot";
    cursor.setAttribute("aria-hidden", "true");
    dot.setAttribute("aria-hidden", "true");
    document.body.append(cursor, dot);

    window.addEventListener(
      "pointermove",
      (event) => {
        if (!experienceActive) return;
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
      element.addEventListener("pointerenter", () => {
        cursor.classList.add("is-hovering");
      });
      element.addEventListener("pointerleave", () => cursor.classList.remove("is-hovering"));
    });
  }

  function setupTiltSurfaces() {
    if (!finePointer.matches || reducedMotion.matches) return;
    experience.querySelectorAll(".tilt-surface").forEach((surface) => {
      let frame = 0;
      let clientX = 0;
      let clientY = 0;
      const render = () => {
        frame = 0;
        const rect = surface.getBoundingClientRect();
        const x = clamp((clientX - rect.left) / rect.width);
        const y = clamp((clientY - rect.top) / rect.height);
        surface.style.setProperty("--tilt-x", `${((0.5 - y) * 5).toFixed(2)}deg`);
        surface.style.setProperty("--tilt-y", `${((x - 0.5) * 5).toFixed(2)}deg`);
        surface.style.setProperty("--card-x", `${(x * 100).toFixed(1)}%`);
        surface.style.setProperty("--card-y", `${(y * 100).toFixed(1)}%`);
      };
      surface.addEventListener("pointermove", (event) => {
        clientX = event.clientX;
        clientY = event.clientY;
        if (!frame) frame = requestAnimationFrame(render);
      });
      surface.addEventListener("pointerleave", () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        surface.style.setProperty("--tilt-x", "0deg");
        surface.style.setProperty("--tilt-y", "0deg");
      });
    });
  }

  function setupMagneticControls() {
    if (!finePointer.matches || reducedMotion.matches) return;
    experience.querySelectorAll(".magnetic").forEach((element) => {
      let frame = 0;
      let clientX = 0;
      let clientY = 0;
      const render = () => {
        frame = 0;
        const rect = element.getBoundingClientRect();
        const x = (clientX - rect.left - rect.width / 2) * 0.12;
        const y = (clientY - rect.top - rect.height / 2) * 0.16;
        element.style.setProperty("--magnetic-x", `${x.toFixed(2)}px`);
        element.style.setProperty("--magnetic-y", `${y.toFixed(2)}px`);
      };
      element.addEventListener("pointermove", (event) => {
        clientX = event.clientX;
        clientY = event.clientY;
        if (!frame) frame = requestAnimationFrame(render);
      });
      element.addEventListener("pointerleave", () => {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
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
    let lastDrawTime = 0;
    const points = [];
    const pointCount = type === "star" ? 105 : 64;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const adaptiveDpr = window.DrufiyPerformance?.quality?.dpr || 1.5;
      dpr = Math.min(window.devicePixelRatio || 1, adaptiveDpr);
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

    function draw(time = performance.now()) {
      animationFrame = 0;
      if (!visible || reducedMotion.matches || document.hidden) return;
      const frameScale = lastDrawTime ? clamp((time - lastDrawTime) / frameDuration, 0.25, 2) : 1;
      lastDrawTime = time;
      context.clearRect(0, 0, width, height);
      const particleFactor = window.DrufiyPerformance?.quality?.particles ?? 1;
      const activeCount = Math.max(0, Math.round(points.length * particleFactor));

      for (let index = 0; index < activeCount; index += 1) {
        const point = points[index];
        point.x += point.vx * frameScale;
        point.y += point.vy * frameScale;
        if (point.x < -20) point.x = width + 20;
        if (point.x > width + 20) point.x = -20;
        if (point.y < -20) point.y = height + 20;
        if (point.y > height + 20) point.y = -20;
      }

      if (type === "network") {
        context.beginPath();
        for (let a = 0; a < activeCount; a += 1) {
          for (let b = a + 1; b < activeCount; b += 1) {
            const dx = points[a].x - points[b].x;
            const dy = points[a].y - points[b].y;
            if ((dx * dx) + (dy * dy) > 21025) continue;
            context.moveTo(points[a].x, points[a].y);
            context.lineTo(points[b].x, points[b].y);
          }
        }
        context.strokeStyle = "rgba(59, 232, 176, 0.075)";
        context.lineWidth = 0.7;
        context.stroke();
      }

      for (let index = 0; index < activeCount; index += 1) {
        const point = points[index];
        const pulse = 0.5 + Math.sin(time * 0.0015 + point.phase) * 0.35;
        context.beginPath();
        context.arc(point.x, point.y, point.size, 0, Math.PI * 2);
        context.fillStyle = type === "star" ? `rgba(240, 242, 245, ${0.16 + pulse * 0.35})` : `rgba(59, 232, 176, ${0.2 + pulse * 0.42})`;
        context.fill();
      }

      animationFrame = requestAnimationFrame(draw);
    }

    function setVisible(next) {
      visible = next;
      if (visible) lastDrawTime = performance.now();
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
    window.addEventListener("drufiy:frame-tier", () => {
      engines.forEach((engine) => engine?.resize());
    });
  }

  function setupPerformanceReadout() {
    const readout = experience.querySelector("[data-frame-readout]");
    if (!readout) return;
    const update = ({ detail }) => {
      readout.textContent = `FPS / ${detail.fps} · ${detail.tier.toUpperCase()}`;
      readout.title = `Measured frame delivery: ${detail.fps} FPS. Rendering tier: ${detail.tier}.`;
    };
    window.addEventListener("drufiy:frame-tier", update);
    if (window.DrufiyPerformance) {
      readout.textContent = `FPS / ${window.DrufiyPerformance.fps} · ${window.DrufiyPerformance.tier.toUpperCase()}`;
    }
  }

  function setupSignalConsole() {
    const sourceChips = [...experience.querySelectorAll(".source-chip")];
    const consoleElement = experience.querySelector(".signal-console");
    sourceChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        sourceChips.forEach((item) => item.classList.toggle("is-active", item === chip));
        sound("transmit:highMid:soft");
        if (consoleElement) {
          consoleElement.classList.remove("is-visible");
          requestAnimationFrame(() => consoleElement.classList.add("is-visible"));
          const terminal = consoleElement.querySelector(".console-terminal");
          window.DrufiyExperience?.apply(terminal, "correlate:terminal:precise", { sound: false });
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
      sound("transmit:lowMid:soft");

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
        window.DrufiyExperience?.apply(status, "resolve:glass:calm", { sound: false });
        sound("resolve:highMid:firm");
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
        sound("open:low:soft", 0.54);
        window.setTimeout(() => window.location.assign(destination), reducedMotion.matches ? 0 : 520);
      });
    });
  }

  function setupScrollDepth() {
    let scheduled = false;
    const update = () => {
      scheduled = false;
      if (!experienceActive) return;
      const rect = experience.getBoundingClientRect();
      const distance = Math.max(1, experience.offsetHeight - window.innerHeight);
      const progress = clamp(-rect.top / distance);
      experience.style.setProperty("--chapter-progress", progress.toFixed(5));
    };
    window.addEventListener("scroll", () => {
      if (!experienceActive || scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }, { passive: true });
    window.addEventListener("drufiy:experience-active", ({ detail }) => {
      if (detail.active) update();
    });
  }

  setupCinematicVideos();
  setupReveals();
  setupChapterNavigation();
  setupPointerExperience();
  setupTiltSurfaces();
  setupMagneticControls();
  setupCanvases();
  setupPerformanceReadout();
  setupSignalConsole();
  setupContactForm();
  setupRouteTransitions();
  setupScrollDepth();
})();
