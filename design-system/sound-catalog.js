/*
 * DrufiyAI U-01 procedural sound catalog
 * 32 families × 4 pitch registers × 4 intensities = 512 lightweight sound recipes.
 * No audio files are shipped. Nothing plays until a user explicitly enables sound.
 */

(function bootstrapSoundCatalog(global) {
  "use strict";

  const families = [
    "ui",
    "navigation",
    "confirm",
    "caution",
    "error",
    "pulse",
    "scan",
    "launch",
    "hover",
    "select",
    "open",
    "close",
    "transmit",
    "resolve",
    "boundary",
    "orbit",
    "ignite",
    "shimmer",
    "impact",
    "warp",
    "data",
    "focus",
    "reveal",
    "approve",
    "deny",
    "alert",
    "typing",
    "portal",
    "cinematic",
    "energy",
    "success",
    "failure",
  ];
  const pitches = ["low", "lowMid", "highMid", "high"];
  const intensities = ["subtle", "soft", "firm", "peak"];

  const pitchHz = { low: 110, lowMid: 164.81, highMid: 246.94, high: 369.99 };
  const intensityValue = {
    subtle: { gain: 0.018, duration: 0.09 },
    soft: { gain: 0.032, duration: 0.16 },
    firm: { gain: 0.052, duration: 0.28 },
    peak: { gain: 0.072, duration: 0.46 },
  };

  const familyValue = {
    ui: { waveform: "sine", intervals: [0], speed: 0.04, filter: 2800, noise: 0 },
    navigation: { waveform: "triangle", intervals: [0, 7], speed: 0.055, filter: 2400, noise: 0 },
    confirm: { waveform: "sine", intervals: [0, 4, 12], speed: 0.06, filter: 3200, noise: 0 },
    caution: { waveform: "square", intervals: [0, -2], speed: 0.11, filter: 1400, noise: 0.05 },
    error: { waveform: "sawtooth", intervals: [0, -7, -12], speed: 0.07, filter: 900, noise: 0.08 },
    pulse: { waveform: "sine", intervals: [-12, 0], speed: 0.09, filter: 1800, noise: 0 },
    scan: { waveform: "triangle", intervals: [-12, 0, 7, 12], speed: 0.045, filter: 3600, noise: 0.025 },
    launch: { waveform: "sawtooth", intervals: [-24, -12, 0, 12], speed: 0.12, filter: 1200, noise: 0.12 },
    hover: { waveform: "sine", intervals: [0, 12], speed: 0.025, filter: 4200, noise: 0 },
    select: { waveform: "triangle", intervals: [0, 5, 12], speed: 0.04, filter: 3000, noise: 0 },
    open: { waveform: "sine", intervals: [-12, 0, 12], speed: 0.07, filter: 3400, noise: 0.012 },
    close: { waveform: "triangle", intervals: [12, 0, -12], speed: 0.055, filter: 2200, noise: 0.008 },
    transmit: { waveform: "square", intervals: [-5, 0, 7, 12], speed: 0.035, filter: 2800, noise: 0.015 },
    resolve: { waveform: "sine", intervals: [0, 7, 12, 16], speed: 0.052, filter: 3900, noise: 0 },
    boundary: { waveform: "square", intervals: [0, 1], speed: 0.12, filter: 800, noise: 0.03 },
    orbit: { waveform: "sine", intervals: [-24, -12, 0, 7, 12], speed: 0.08, filter: 2600, noise: 0.018 },
    ignite: { waveform: "sawtooth", intervals: [-24, -12, 0, 7], speed: 0.065, filter: 1650, noise: 0.08 },
    shimmer: { waveform: "sine", intervals: [0, 12, 19, 24], speed: 0.032, filter: 5200, noise: 0.006 },
    impact: { waveform: "triangle", intervals: [-24, -12, 0], speed: 0.026, filter: 980, noise: 0.14 },
    warp: { waveform: "sawtooth", intervals: [-12, 0, 12, 24], speed: 0.045, filter: 2300, noise: 0.05 },
    data: { waveform: "square", intervals: [0, 7, 2, 12], speed: 0.022, filter: 4100, noise: 0.01 },
    focus: { waveform: "sine", intervals: [-5, 0, 7], speed: 0.052, filter: 3000, noise: 0 },
    reveal: { waveform: "triangle", intervals: [-12, 0, 7, 12], speed: 0.06, filter: 3600, noise: 0.012 },
    approve: { waveform: "sine", intervals: [0, 4, 7, 12], speed: 0.055, filter: 4300, noise: 0 },
    deny: { waveform: "square", intervals: [0, -2, -7], speed: 0.065, filter: 1200, noise: 0.04 },
    alert: { waveform: "triangle", intervals: [0, 12, 0], speed: 0.085, filter: 2100, noise: 0.025 },
    typing: { waveform: "square", intervals: [0], speed: 0.018, filter: 4800, noise: 0.008 },
    portal: { waveform: "sine", intervals: [-24, -7, 0, 12, 24], speed: 0.055, filter: 3300, noise: 0.035 },
    cinematic: { waveform: "triangle", intervals: [-24, -12, 0, 7, 12], speed: 0.095, filter: 1900, noise: 0.07 },
    energy: { waveform: "sawtooth", intervals: [-12, 0, 5, 12], speed: 0.038, filter: 2700, noise: 0.045 },
    success: { waveform: "sine", intervals: [0, 4, 7, 12, 19], speed: 0.052, filter: 4600, noise: 0 },
    failure: { waveform: "sawtooth", intervals: [0, -5, -12, -19], speed: 0.06, filter: 860, noise: 0.09 },
  };

  function makeRecipe(family, pitch, intensity) {
    const base = pitchHz[pitch];
    const force = intensityValue[intensity];
    const voice = familyValue[family];
    return Object.freeze({
      id: `${family}:${pitch}:${intensity}`,
      family,
      pitch,
      intensity,
      base,
      gain: force.gain,
      duration: force.duration,
      waveform: voice.waveform,
      intervals: Object.freeze([...voice.intervals]),
      speed: voice.speed,
      filter: voice.filter,
      noise: voice.noise,
    });
  }

  const catalog = new Map();
  for (const family of families) {
    for (const pitch of pitches) {
      for (const intensity of intensities) {
        const recipe = makeRecipe(family, pitch, intensity);
        catalog.set(recipe.id, recipe);
      }
    }
  }

  let context = null;
  let master = null;
  let compressor = null;
  let enabled = false;

  function ensureContext() {
    if (context) return context;
    const AudioContext = global.AudioContext || global.webkitAudioContext;
    if (!AudioContext) return null;
    context = new AudioContext();
    master = context.createGain();
    compressor = context.createDynamicsCompressor();
    master.gain.value = 0.64;
    compressor.threshold.value = -22;
    compressor.knee.value = 18;
    compressor.ratio.value = 6;
    compressor.attack.value = 0.004;
    compressor.release.value = 0.18;
    master.connect(compressor);
    compressor.connect(context.destination);
    return context;
  }

  async function setEnabled(nextEnabled) {
    enabled = Boolean(nextEnabled);
    if (!enabled) return false;
    const ctx = ensureContext();
    if (!ctx) {
      enabled = false;
      return false;
    }
    if (ctx.state === "suspended") await ctx.resume();
    return true;
  }

  function midiRatio(semitones) {
    return Math.pow(2, semitones / 12);
  }

  function addNoise(recipe, startAt, output) {
    if (!context || recipe.noise <= 0) return;
    const frameCount = Math.max(1, Math.floor(context.sampleRate * (recipe.duration + 0.12)));
    const buffer = context.createBuffer(1, frameCount, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let i = 0; i < frameCount; i += 1) {
      channel[i] = (Math.random() * 2 - 1) * (1 - i / frameCount);
    }

    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    filter.type = "bandpass";
    filter.frequency.value = recipe.filter * 0.48;
    filter.Q.value = 0.7;
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(recipe.gain * recipe.noise, startAt + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + recipe.duration + 0.1);
    source.connect(filter);
    filter.connect(gain);
    gain.connect(output);
    source.start(startAt);
    source.stop(startAt + recipe.duration + 0.12);
  }

  function play(id = "ui:highMid:subtle", options = {}) {
    if (!enabled) return false;
    const ctx = ensureContext();
    const recipe = catalog.get(id) || catalog.get("ui:highMid:subtle");
    if (!ctx || !master || !recipe) return false;

    const startAt = ctx.currentTime + 0.006;
    const output = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const level = Math.max(0.1, Math.min(1.5, options.level ?? 1));

    output.gain.value = level;
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(recipe.filter, startAt);
    filter.Q.value = ["scan", "data", "shimmer"].includes(recipe.family) ? 4.2 : 0.8;
    filter.connect(output);
    if (typeof context.createStereoPanner === "function") {
      const panner = context.createStereoPanner();
      panner.pan.value = Math.max(-0.9, Math.min(0.9, options.pan ?? 0));
      output.connect(panner);
      panner.connect(master);
    } else {
      output.connect(master);
    }

    recipe.intervals.forEach((interval, index) => {
      const noteAt = startAt + index * recipe.speed;
      const endAt = noteAt + recipe.duration;
      const oscillator = ctx.createOscillator();
      const envelope = ctx.createGain();
      oscillator.type = recipe.waveform;
      oscillator.frequency.setValueAtTime(recipe.base * midiRatio(interval), noteAt);

      if (["launch", "ignite", "warp", "portal", "cinematic"].includes(recipe.family)) {
        const lift = recipe.family === "cinematic" ? 7 : 12;
        oscillator.frequency.exponentialRampToValueAtTime(
          Math.max(40, recipe.base * midiRatio(interval + lift)),
          endAt,
        );
      } else if (["impact", "failure", "deny"].includes(recipe.family)) {
        oscillator.frequency.exponentialRampToValueAtTime(
          Math.max(40, recipe.base * midiRatio(interval - 7)),
          endAt,
        );
      }

      envelope.gain.setValueAtTime(0.0001, noteAt);
      envelope.gain.exponentialRampToValueAtTime(recipe.gain, noteAt + 0.012);
      envelope.gain.exponentialRampToValueAtTime(0.0001, endAt);
      oscillator.connect(envelope);
      envelope.connect(filter);
      oscillator.start(noteAt);
      oscillator.stop(endAt + 0.02);
    });

    addNoise(recipe, startAt, filter);
    return true;
  }

  function isEnabled() {
    return enabled;
  }

  global.DrufiySound = Object.freeze({
    version: "1.0.0",
    catalog,
    size: catalog.size,
    families: Object.freeze([...families]),
    pitches: Object.freeze([...pitches]),
    intensities: Object.freeze([...intensities]),
    get: (id) => catalog.get(id),
    isEnabled,
    setEnabled,
    play,
  });
})(window);
