/* DrufiyAI cinematic interaction director: pooled VFX, contextual cues, and scene gating. */

(function bootstrapCinematicFX(global) {
  "use strict";

  const reducedMotion = global.matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = global.matchMedia("(pointer: fine)");
  const interactiveSelector = "a, button, input, textarea, select, [role='button'], [tabindex='0']";
  const particles = [];
  const waves = [];
  const inputCueTimes = new WeakMap();
  const pressTimers = new WeakMap();
  let canvas = null;
  let context = null;
  let frame = 0;
  let width = global.innerWidth;
  let height = global.innerHeight;
  let dpr = 1;
  let lastTime = performance.now();
  let lastSoundAt = 0;
  let hovered = null;

  const palettes = {
    navigation: [59, 232, 176],
    action: [253, 241, 225],
    data: [6, 182, 212],
    caution: [251, 191, 36],
    error: [248, 113, 113],
    cinematic: [167, 139, 250],
  };

  function classify(element) {
    if (element.matches("input, textarea, select")) return "data";
    if (element.matches(":invalid")) return "error";
    if (element.matches("[type='submit'], .lux-button-primary, .site-cta")) return "action";
    if (element.matches(".source-chip, [data-motion-demo], .arch-node")) return "data";
    if (element.matches(".sound-toggle, .detail-sound")) return "cinematic";
    if (element.matches("a")) return "navigation";
    return "action";
  }

  function cueFor(element, phase) {
    const kind = classify(element);
    if (phase === "hover") return { id: kind === "data" ? "data:highMid:subtle" : "hover:highMid:subtle", level: 0.12 };
    if (phase === "focus") return { id: kind === "data" ? "focus:highMid:subtle" : "shimmer:highMid:subtle", level: 0.17 };
    if (phase === "input") return { id: "typing:high:subtle", level: 0.1 };
    if (phase === "invalid") return { id: "failure:lowMid:soft", level: 0.42 };
    if (kind === "navigation") return { id: "portal:lowMid:soft", level: 0.3 };
    if (kind === "data") return { id: "data:highMid:soft", level: 0.24 };
    if (kind === "cinematic") return { id: "ignite:low:soft", level: 0.34 };
    return { id: "impact:lowMid:soft", level: 0.28 };
  }

  function play(id, level, x = width / 2, minimumGap = 46) {
    const now = performance.now();
    if (now - lastSoundAt < minimumGap) return false;
    lastSoundAt = now;
    const pan = width > 0 ? Math.max(-0.72, Math.min(0.72, (x / width - 0.5) * 1.44)) : 0;
    return global.DrufiySound?.play(id, { level, pan }) ?? false;
  }

  function ensureCanvas() {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.className = "cinematic-fx-canvas";
    canvas.setAttribute("aria-hidden", "true");
    document.body.append(canvas);
    context = canvas.getContext("2d", { alpha: true, desynchronized: true });
    resize();
  }

  function resize() {
    if (!canvas || !context) return;
    width = global.innerWidth;
    height = global.innerHeight;
    const adaptiveDpr = global.DrufiyPerformance?.quality?.dpr || 1.25;
    dpr = Math.min(global.devicePixelRatio || 1, adaptiveDpr, 1.5);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function emit(x, y, kind = "action", strength = 1) {
    if (reducedMotion.matches) return;
    ensureCanvas();
    const quality = global.DrufiyPerformance?.quality?.effects ?? 0.7;
    const count = Math.max(3, Math.round((kind === "cinematic" ? 16 : 9) * quality * strength));
    const color = palettes[kind] || palettes.action;
    waves.push({ x, y, radius: 5, alpha: 0.52 * strength, color, width: 1.2 + strength });
    for (let index = 0; index < count; index += 1) {
      const angle = (Math.PI * 2 * index) / count + Math.random() * 0.42;
      const speed = (0.45 + Math.random() * 1.65) * strength;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        decay: 0.025 + Math.random() * 0.025,
        size: 0.7 + Math.random() * 1.7,
        color,
      });
    }
    canvas.classList.add("is-active");
    if (!frame) {
      lastTime = performance.now();
      frame = requestAnimationFrame(draw);
    }
  }

  function draw(timestamp) {
    frame = 0;
    if (!context || !canvas || document.hidden) return;
    const scale = Math.min(2, Math.max(0.35, (timestamp - lastTime) / (1000 / 60)));
    lastTime = timestamp;
    context.clearRect(0, 0, width, height);
    context.globalCompositeOperation = "lighter";

    for (let index = waves.length - 1; index >= 0; index -= 1) {
      const wave = waves[index];
      wave.radius += 2.7 * scale;
      wave.alpha -= 0.026 * scale;
      if (wave.alpha <= 0) {
        waves.splice(index, 1);
        continue;
      }
      context.beginPath();
      context.arc(wave.x, wave.y, wave.radius, 0, Math.PI * 2);
      context.strokeStyle = `rgba(${wave.color.join(",")},${wave.alpha})`;
      context.lineWidth = wave.width;
      context.stroke();
    }

    for (let index = particles.length - 1; index >= 0; index -= 1) {
      const particle = particles[index];
      particle.x += particle.vx * scale;
      particle.y += particle.vy * scale;
      particle.vx *= Math.pow(0.965, scale);
      particle.vy *= Math.pow(0.965, scale);
      particle.life -= particle.decay * scale;
      if (particle.life <= 0) {
        particles.splice(index, 1);
        continue;
      }
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size * particle.life, 0, Math.PI * 2);
      context.fillStyle = `rgba(${particle.color.join(",")},${particle.life * 0.72})`;
      context.fill();
    }

    context.globalCompositeOperation = "source-over";
    if (particles.length || waves.length) frame = requestAnimationFrame(draw);
    else {
      canvas.classList.remove("is-active");
      context.clearRect(0, 0, width, height);
    }
  }

  function centerOf(element) {
    const rect = element.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  function pulse(element) {
    element.classList.remove("fx-press");
    // Force only the small control's animation to restart; no page-level layout is read.
    void element.offsetWidth;
    element.classList.add("fx-press");
    clearTimeout(pressTimers.get(element));
    pressTimers.set(element, setTimeout(() => element.classList.remove("fx-press"), 420));
  }

  function closestInteractive(target) {
    return target instanceof Element ? target.closest(interactiveSelector) : null;
  }

  function setupInteractions() {
    document.addEventListener("pointerover", (event) => {
      if (!finePointer.matches) return;
      const element = closestInteractive(event.target);
      if (!element || element === hovered || element.contains(event.relatedTarget)) return;
      hovered = element;
      element.classList.add("fx-hover");
      const point = centerOf(element);
      const cue = cueFor(element, "hover");
      play(cue.id, cue.level, point.x, 92);
    }, { passive: true });

    document.addEventListener("pointerout", (event) => {
      const element = closestInteractive(event.target);
      if (!element || element.contains(event.relatedTarget)) return;
      element.classList.remove("fx-hover");
      if (hovered === element) hovered = null;
    }, { passive: true });

    document.addEventListener("pointerdown", (event) => {
      const element = closestInteractive(event.target);
      if (!element || event.button > 0) return;
      const kind = classify(element);
      emit(event.clientX, event.clientY, kind, kind === "cinematic" ? 1.2 : 1);
      pulse(element);
      const cue = cueFor(element, "press");
      play(cue.id, cue.level, event.clientX);
    }, { passive: true });

    document.addEventListener("focusin", (event) => {
      const element = closestInteractive(event.target);
      if (!element) return;
      element.classList.add("fx-focus");
      const point = centerOf(element);
      emit(point.x, point.y, classify(element), 0.55);
      const cue = cueFor(element, "focus");
      play(cue.id, cue.level, point.x, 80);
    });

    document.addEventListener("focusout", (event) => {
      closestInteractive(event.target)?.classList.remove("fx-focus");
    });

    document.addEventListener("input", (event) => {
      const element = closestInteractive(event.target);
      if (!element) return;
      const now = performance.now();
      if (now - (inputCueTimes.get(element) || 0) < 90) return;
      inputCueTimes.set(element, now);
      const point = centerOf(element);
      emit(point.x, point.y, "data", 0.25);
      const cue = cueFor(element, "input");
      play(cue.id, cue.level, point.x, 78);
    });

    document.addEventListener("invalid", (event) => {
      const element = closestInteractive(event.target);
      if (!element) return;
      const point = centerOf(element);
      emit(point.x, point.y, "error", 1.1);
      const cue = cueFor(element, "invalid");
      play(cue.id, cue.level, point.x);
    }, true);
  }

  function setupFilmHUD() {
    document.querySelectorAll("video").forEach((video, index) => {
      const host = video.parentElement;
      if (!host || host.querySelector(":scope > .film-hud")) return;
      host.classList.add("film-host");
      const hud = document.createElement("div");
      const label = video.dataset.filmLabel || `CINEMATIC FEED ${String(index + 1).padStart(2, "0")}`;
      hud.className = "film-hud";
      hud.setAttribute("aria-hidden", "true");
      hud.innerHTML = `<span class="film-live"><i></i> LIVE</span><span class="film-label">${label}</span>`;
      host.append(hud);
      const setPlaying = () => host.classList.toggle("has-live-film", !video.paused && !video.ended);
      video.addEventListener("playing", setPlaying);
      video.addEventListener("pause", setPlaying);
      video.addEventListener("ended", setPlaying);
      video.addEventListener("error", () => host.classList.add("film-unavailable"));
      setPlaying();
    });
  }

  function setupSceneGating() {
    const scenes = [...document.querySelectorAll(".experience-chapter, .foundation-hangar, .detail-hero, .detail-section")];
    scenes.forEach((scene) => scene.classList.add("scene-managed"));
    if (!("IntersectionObserver" in global)) {
      scenes.forEach((scene) => scene.classList.add("is-scene-active"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.target.classList.toggle("is-scene-active", entry.isIntersecting)),
      { rootMargin: "12% 0px 12% 0px", threshold: 0.01 },
    );
    scenes.forEach((scene) => observer.observe(scene));
  }

  function cue(element, id = "cinematic:lowMid:soft", kind = "cinematic") {
    if (!(element instanceof Element)) return false;
    const point = centerOf(element);
    emit(point.x, point.y, kind, 1.15);
    return play(id, 0.38, point.x);
  }

  global.addEventListener("resize", resize, { passive: true });
  global.addEventListener("drufiy:frame-tier", resize);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden || !frame) return;
    cancelAnimationFrame(frame);
    frame = 0;
    particles.length = 0;
    waves.length = 0;
    canvas?.classList.remove("is-active");
  });

  setupInteractions();
  setupFilmHUD();
  setupSceneGating();

  global.DrufiyFX = Object.freeze({
    version: "1.0.0",
    emit,
    cue,
    refreshFilms: setupFilmHUD,
  });
})(window);
