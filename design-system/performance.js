/*
 * DrufiyAI adaptive high-refresh performance field.
 * requestAnimationFrame follows the display refresh rate (60/90/100/120/144Hz).
 * The sampler classifies real delivery cadence without timers or forced frame caps.
 */

(function bootstrapPerformanceField(global) {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = global.matchMedia("(prefers-reduced-motion: reduce)");
  const samples = [];
  const maxSamples = 180;
  const profiles = Object.freeze({
    ultra: Object.freeze({ dpr: 1.4, particles: 0.82, effects: 1, videos: 2, filters: true }),
    high: Object.freeze({ dpr: 1.25, particles: 0.64, effects: 0.78, videos: 1, filters: false }),
    balanced: Object.freeze({ dpr: 1, particles: 0.42, effects: 0.56, videos: 1, filters: false }),
    eco: Object.freeze({ dpr: 0.85, particles: 0.22, effects: 0.34, videos: 1, filters: false }),
    reduced: Object.freeze({ dpr: 1, particles: 0, effects: 0, videos: 0, filters: false }),
  });
  let previous = 0;
  let frame = 0;
  let running = false;
  let measuredFps = 60;
  let tier = reducedMotion.matches ? "reduced" : "high";

  function classify(fps) {
    if (reducedMotion.matches) return "reduced";
    if (fps >= 95) return "ultra";
    if (fps >= 55) return "high";
    if (fps >= 40) return "balanced";
    return "eco";
  }

  function setTier(nextTier) {
    tier = nextTier;
    root.dataset.frameTier = tier;
    root.style.setProperty("--measured-fps", String(measuredFps));
    global.dispatchEvent(new CustomEvent("drufiy:frame-tier", {
      detail: { fps: measuredFps, tier, quality: profiles[tier] },
    }));
  }

  function publish() {
    if (!samples.length || reducedMotion.matches) return;
    const sorted = [...samples].sort((a, b) => a - b);
    const trim = Math.floor(sorted.length * 0.08);
    const stable = sorted.slice(trim, sorted.length - trim || sorted.length);
    const averageDelta = stable.reduce((sum, value) => sum + value, 0) / stable.length;
    measuredFps = Math.round(1000 / averageDelta);
    setTier(classify(measuredFps));
  }

  function sample(timestamp) {
    frame = 0;
    if (!running || document.hidden || reducedMotion.matches) return;
    if (previous) {
      const delta = timestamp - previous;
      // Ignore tab switches and debugger pauses.
      if (delta > 3 && delta < 80) samples.push(delta);
      if (samples.length > maxSamples) samples.shift();
    }
    previous = timestamp;

    if (samples.length === 60 || samples.length === 120 || samples.length === maxSamples) publish();
    if (samples.length < maxSamples) frame = requestAnimationFrame(sample);
    else running = false;
  }

  function start() {
    if (reducedMotion.matches) {
      stop();
      setTier("reduced");
      return;
    }
    if (running) return;
    running = true;
    previous = 0;
    samples.length = 0;
    setTier(classify(measuredFps));
    frame = requestAnimationFrame(sample);
  }

  function stop() {
    running = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
    else start();
  });
  reducedMotion.addEventListener?.("change", () => {
    stop();
    start();
  });
  start();

  global.DrufiyPerformance = Object.freeze({
    version: "1.1.0",
    profiles,
    start,
    stop,
    get fps() { return measuredFps; },
    get tier() { return tier; },
    get quality() { return profiles[tier]; },
  });
})(window);
