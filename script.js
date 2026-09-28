/* DrufiyAI U-01 — cinematic scroll rig, infinite slider, and design-system demo. */

(() => {
  "use strict";

  const section = document.querySelector(".cinema-scroll");
  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const sightsTrack = document.querySelector(".sights-track");
  const sightsControls = document.querySelector(".sights-controls");
  const sightPrev = document.querySelector(".sight-prev");
  const sightNext = document.querySelector(".sight-next");
  const originalSightCards = sightsTrack ? [...sightsTrack.querySelectorAll(".sight-card")] : [];
  const originalSightCount = originalSightCards.length;

  if (!section || !sightsTrack || !sightsControls || !originalSightCount) return;

  let targetMouseX = 0;
  let targetMouseY = 0;
  let mouseX = 0;
  let mouseY = 0;
  let targetScroll = 0;
  let smoothScroll = 0;
  let initialized = false;
  let rafPending = false;
  let sightCards = [];
  let activeSight = originalSightCount;
  let statusTimeout = 0;

  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smoothstep = (edge0, edge1, value) => {
    const x = clamp((value - edge0) / (edge1 - edge0));
    return x * x * (3 - 2 * x);
  };
  const lerp = (a, b, amount) => a + (b - a) * amount;
  const segmentInOut = (scroll, a, b, c, d) => {
    const enter = smoothstep(a, b, scroll);
    const exit = smoothstep(c, d, scroll);
    return { enter, exit, active: enter * (1 - exit) };
  };
  const getScrollDistance = () =>
    clamp(-section.getBoundingClientRect().top, 0, section.offsetHeight - window.innerHeight);

  function write(name, value) {
    root.style.setProperty(name, value);
  }

  function updateProgress() {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const pageProgress = clamp(window.scrollY / maxScroll);
    const bar = document.querySelector(".scroll-progress i");
    if (bar) bar.style.transform = `scaleX(${pageProgress.toFixed(5)})`;
  }

  function update() {
    rafPending = false;
    targetScroll = getScrollDistance();

    if (!initialized || reduceMotion.matches) {
      smoothScroll = targetScroll;
      initialized = true;
    } else {
      smoothScroll = lerp(smoothScroll, targetScroll, 0.14);
    }
    if (Math.abs(smoothScroll - targetScroll) < 0.08) smoothScroll = targetScroll;

    mouseX = lerp(mouseX, targetMouseX, 0.12);
    mouseY = lerp(mouseY, targetMouseY, 0.12);

    const frame2 = segmentInOut(smoothScroll, 560, 900, 1300, 1620);
    const frame3 = segmentInOut(smoothScroll, 1760, 2140, 2540, 2700);
    const progress = clamp(smoothScroll / 2700);
    const introExit = smoothstep(90, 650, smoothScroll);
    const sightsEnterRaw = smoothstep(2760, 3560, smoothScroll);
    const sightsEnter = Math.pow(sightsEnterRaw, 1.55);
    const sightsControlsEnter = smoothstep(3360, 3660, smoothScroll);
    const blurActive = clamp(frame2.active + frame3.active);
    const frame2Opacity = frame2.active * (1 - frame3.enter);
    const splitDrift = Math.pow(frame2.enter, 1.5);
    const panel2Opacity = frame2.active * (1 - frame2.exit);
    const panel3Opacity = frame3.active * (1 - frame3.exit);
    const backScale = 0.76 + progress * 0.2 + frame2.enter * 0.18 + frame3.enter * 0.16;
    const sharedHeroY = progress * -74;
    const sharedHeroScale = progress * 0.23;
    const sightsScreenTop = Math.min(220, Math.max(112, window.innerHeight * 0.19)) - 50;
    const sightsParentTop = window.innerHeight - (window.innerHeight - sightsScreenTop) / backScale;
    const safeMouseX = reduceMotion.matches ? 0 : mouseX;
    const safeMouseY = reduceMotion.matches ? 0 : mouseY;

    write("--mx", safeMouseX.toFixed(4));
    write("--my", safeMouseY.toFixed(4));

    write("--back-opacity", (1 - frame2.active * 0.06).toFixed(4));
    write("--back-x", `${(safeMouseX * -12).toFixed(2)}px`);
    write("--back-y", `${(safeMouseY * -4).toFixed(2)}px`);
    write("--back-scale", backScale.toFixed(5));
    write("--four-y", `${(10 + progress * 10).toFixed(3)}vh`);
    write("--four-scale", (0.78 + progress * 0.16).toFixed(5));
    write("--bazaar-y", `${(20 - progress * 8).toFixed(3)}vh`);
    write("--blur-px", `${(blurActive * 14).toFixed(3)}px`);
    write("--back-brightness", (1 - blurActive * 0.255).toFixed(5));
    write("--bazaar-blur-px", `${(frame2.active * 14).toFixed(3)}px`);
    write("--bazaar-brightness", (1 - frame2.active * 0.255 - frame3.active * 0.06).toFixed(5));
    write("--bazaar-saturation", (1 + frame3.active * 0.18).toFixed(5));
    write("--shade-opacity", "1");
    write("--shade-z", frame2.active > 0.02 ? "2" : "0");
    write("--shade-top-alpha", (blurActive * 0.465).toFixed(5));
    write("--shade-mid-alpha", (blurActive * 0.42).toFixed(5));
    write("--shade-bottom-alpha", (blurActive * 0.51).toFixed(5));

    write("--title-y", `${(introExit * -210).toFixed(2)}px`);
    write("--title-scale", (1 - introExit * 0.08).toFixed(5));
    write("--title-opacity", (1 - introExit).toFixed(5));

    write("--bridge-x", `calc(-50% + ${(safeMouseX * 18).toFixed(2)}px)`);
    write("--bridge-y", `${(safeMouseY * 8 + sharedHeroY - frame2.exit * 760).toFixed(2)}px`);
    write("--bridge-bottom", `${(5 - frame2.enter * 13).toFixed(3)}vh`);
    write("--bridge-width", `${(67.2 + frame2.enter * 37.8).toFixed(3)}vw`);
    write("--bridge-scale", (1.02 + sharedHeroScale + frame2.exit * 0.46).toFixed(5));

    write("--split-left-x", `calc(-50% + ${(-splitDrift * 46).toFixed(3)}vw + ${(safeMouseX * 22).toFixed(2)}px)`);
    write("--split-left-y", `${(safeMouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(2)}px`);
    write("--split-left-scale", (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(5));
    write("--split-right-x", `calc(-50% + ${(splitDrift * 46).toFixed(3)}vw + ${(safeMouseX * 22).toFixed(2)}px)`);
    write("--split-right-y", `${(safeMouseY * 10 + sharedHeroY - splitDrift * 180).toFixed(2)}px`);
    write("--split-right-scale", (1 + sharedHeroScale + frame2.enter * 0.74).toFixed(5));

    write("--frame2-opacity", frame2Opacity.toFixed(5));
    write("--frame2-x", `calc(-50% + ${(safeMouseX * 10).toFixed(2)}px)`);
    write("--frame2-y", `calc(-50% + ${(safeMouseY * 8 - frame2.exit * 150).toFixed(2)}px)`);
    write("--frame2-scale", (1.06 + frame2.enter * 0.08 + frame2.exit * 0.08).toFixed(5));

    write("--intro-copy-y", `${(introExit * 90).toFixed(2)}px`);
    write("--intro-copy-opacity", (1 - introExit).toFixed(5));
    write("--panel2-opacity", panel2Opacity.toFixed(5));
    write("--panel2-y", `calc(-50% + ${(-frame2.exit * 86 + (1 - frame2.enter) * 58).toFixed(2)}px)`);
    write("--panel3-opacity", panel3Opacity.toFixed(5));
    write("--panel3-y", `calc(-50% + ${(-frame3.exit * 86 + (1 - frame3.enter) * 58).toFixed(2)}px)`);

    write("--sights-opacity", sightsEnter.toFixed(5));
    write("--sights-controls-opacity", sightsControlsEnter.toFixed(5));
    sightsControls.classList.toggle("is-ready", sightsControlsEnter > 0.98);
    write("--sights-visibility", sightsEnter > 0.01 ? "visible" : "hidden");
    write("--sights-y", "0px");
    write("--sights-enter-x", `${((1 - sightsEnter) * 420).toFixed(4)}vw`);
    write("--sights-scale", (1 / backScale).toFixed(6));
    write("--sights-top", `${sightsParentTop.toFixed(3)}px`);
    write("--sights-screen-top", `${sightsScreenTop.toFixed(3)}px`);

    updateProgress();

    if (
      Math.abs(smoothScroll - targetScroll) > 0.08 ||
      Math.abs(mouseX - targetMouseX) > 0.001 ||
      Math.abs(mouseY - targetMouseY) > 0.001
    ) {
      requestTick();
    }
  }

  function requestTick() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(update);
  }

  function updateSightSlider() {
    if (!sightCards.length) return;
    const cardWidth = sightCards[0].offsetWidth;
    const gap = parseFloat(getComputedStyle(sightsTrack).columnGap || "0");
    write("--sights-shift", `${-(cardWidth + gap) * activeSight}px`);
    sightCards.forEach((card, index) => {
      const isActive = index === activeSight;
      card.classList.toggle("is-active", isActive);
      card.setAttribute("aria-pressed", String(isActive));
    });
  }

  function jumpSightSlider(index) {
    sightsTrack.classList.add("is-jumping");
    activeSight = index;
    updateSightSlider();
    requestAnimationFrame(() => requestAnimationFrame(() => sightsTrack.classList.remove("is-jumping")));
  }

  function normalizeSightSlider(event) {
    // Ignore transition events bubbling from the cards; only the rail transform
    // marks the point where an infinite-loop normalization is visually safe.
    if (event && event.target !== sightsTrack) return;
    if (activeSight >= originalSightCount * 2) jumpSightSlider(activeSight - originalSightCount);
    else if (activeSight < originalSightCount) jumpSightSlider(activeSight + originalSightCount);
  }

  function moveSightSlider(direction) {
    activeSight += direction;
    updateSightSlider();
    window.DrufiySound?.play(direction > 0 ? "navigation:highMid:soft" : "navigation:lowMid:soft");
  }

  function selectSightCard(card) {
    const index = Number(card.dataset.sightIndex);
    if (!Number.isFinite(index)) return;
    activeSight = index;
    updateSightSlider();
    window.DrufiySound?.play("confirm:highMid:soft");
  }

  function setupSightSlider() {
    sightsTrack.replaceChildren();
    for (let setIndex = 0; setIndex < 3; setIndex += 1) {
      originalSightCards.forEach((originalCard, cardIndex) => {
        const clone = originalCard.cloneNode(true);
        clone.dataset.sightIndex = String(setIndex * originalSightCount + cardIndex);
        sightsTrack.append(clone);
      });
    }

    sightCards = [...sightsTrack.querySelectorAll(".sight-card")];
    activeSight = originalSightCount;
    sightCards.forEach((card) => {
      card.addEventListener("click", () => selectSightCard(card));
      card.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectSightCard(card);
        }
      });
    });
    sightsTrack.addEventListener("transitionend", normalizeSightSlider);
    updateSightSlider();
  }

  function showStatus(message) {
    const status = document.querySelector(".system-status");
    if (!status) return;
    window.clearTimeout(statusTimeout);
    status.textContent = message;
    status.classList.add("is-visible");
    statusTimeout = window.setTimeout(() => status.classList.remove("is-visible"), 2600);
  }

  function setupExperienceControls() {
    const soundToggle = document.querySelector(".sound-toggle");
    const soundLabel = document.querySelector(".sound-label");

    soundToggle?.addEventListener("click", async () => {
      const nextState = soundToggle.getAttribute("aria-pressed") !== "true";
      const didEnable = await window.DrufiySound?.setEnabled(nextState);
      const active = Boolean(nextState && didEnable);
      soundToggle.setAttribute("aria-pressed", String(active));
      if (soundLabel) soundLabel.textContent = active ? "Sound on" : "Sound off";
      if (active) {
        window.DrufiySound.play("launch:low:subtle", { level: 0.72 });
        showStatus(`Audio field enabled · ${window.DrufiySound.size} procedural cues ready`);
      } else {
        showStatus("Audio field muted");
      }
    });

    document.querySelector(".language-switcher")?.addEventListener("click", () => {
      window.DrufiySound?.play("ui:highMid:subtle");
      showStatus("English is the active language");
    });

    document.querySelectorAll("[data-motion-demo]").forEach((button) => {
      button.addEventListener("click", () => {
        window.DrufiyMotion?.run(button, button.dataset.motionDemo);
        window.DrufiySound?.play("pulse:highMid:subtle");
      });
    });
  }

  function setupReveals() {
    const items = [...document.querySelectorAll("[data-reveal]")];
    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
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
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );
    items.forEach((item) => observer.observe(item));
  }

  function setupVideoFallback() {
    const video = document.querySelector(".foundation-video");
    if (!video) return;
    video.addEventListener("error", () => {
      video.hidden = true;
      showStatus("Ambient film unavailable · static visual fallback active");
    });
    if (!reduceMotion.matches) video.play().catch(() => {});
  }

  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener(
    "resize",
    () => {
      updateSightSlider();
      requestTick();
    },
    { passive: true },
  );
  window.addEventListener(
    "pointermove",
    ({ clientX, clientY }) => {
      targetMouseX = clientX / window.innerWidth - 0.5;
      targetMouseY = clientY / window.innerHeight - 0.5;
      requestTick();
    },
    { passive: true },
  );

  sightPrev?.addEventListener("click", () => moveSightSlider(-1));
  sightNext?.addEventListener("click", () => moveSightSlider(1));
  reduceMotion.addEventListener?.("change", requestTick);

  setupSightSlider();
  setupExperienceControls();
  setupReveals();
  setupVideoFallback();
  requestTick();
})();
