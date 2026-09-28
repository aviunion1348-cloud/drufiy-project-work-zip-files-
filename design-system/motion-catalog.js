/*
 * DrufiyAI U-01 motion catalog
 * 5 families × 8 directions × 4 depth levels × 2 tempos = 320 deterministic recipes.
 * Recipes use the Web Animations API and honor prefers-reduced-motion.
 */

(function bootstrapMotionCatalog(global) {
  "use strict";

  const families = ["reveal", "drift", "signal", "focus", "cinematic"];
  const directions = ["up", "down", "left", "right", "forward", "backward", "in", "out"];
  const depths = ["near", "mid", "far", "deep"];
  const tempos = ["swift", "steady"];

  const depthValue = {
    near: { distance: 10, scale: 0.018, blur: 1 },
    mid: { distance: 22, scale: 0.035, blur: 3 },
    far: { distance: 38, scale: 0.06, blur: 6 },
    deep: { distance: 58, scale: 0.09, blur: 10 },
  };

  const tempoValue = {
    swift: { duration: 280, easing: "cubic-bezier(0.16, 1, 0.3, 1)" },
    steady: { duration: 640, easing: "cubic-bezier(0.22, 1, 0.36, 1)" },
  };

  const familyValue = {
    reveal: { opacity: true, multiplier: 1, overshoot: 0 },
    drift: { opacity: false, multiplier: 0.65, overshoot: 0.05 },
    signal: { opacity: true, multiplier: 0.38, overshoot: 0.12 },
    focus: { opacity: false, multiplier: 0.22, overshoot: 0.035 },
    cinematic: { opacity: true, multiplier: 1.4, overshoot: 0.08 },
  };

  function directionVector(direction) {
    return {
      up: [0, 1, 0],
      down: [0, -1, 0],
      left: [1, 0, 0],
      right: [-1, 0, 0],
      forward: [0, 0, -1],
      backward: [0, 0, 1],
      in: [0, 0, -1],
      out: [0, 0, 1],
    }[direction];
  }

  function makeRecipe(family, direction, depth, tempo) {
    const d = depthValue[depth];
    const t = tempoValue[tempo];
    const f = familyValue[family];
    const [vx, vy, vz] = directionVector(direction);
    const distance = d.distance * f.multiplier;
    const directionalScale = direction === "in" || direction === "forward" ? -1 : 1;
    const startScale = 1 + d.scale * directionalScale;
    const startTransform = `perspective(900px) translate3d(${vx * distance}px, ${vy * distance}px, ${vz * distance}px) scale(${startScale})`;
    const overshootScale = 1 + f.overshoot;

    return Object.freeze({
      id: `${family}:${direction}:${depth}:${tempo}`,
      family,
      direction,
      depth,
      tempo,
      duration: family === "cinematic" ? t.duration * 1.65 : t.duration,
      easing: t.easing,
      keyframes: [
        {
          opacity: f.opacity ? 0 : 1,
          transform: startTransform,
          filter: d.blur ? `blur(${d.blur}px)` : "none",
        },
        {
          opacity: 1,
          transform: `perspective(900px) translate3d(0, 0, 0) scale(${overshootScale})`,
          filter: "blur(0px)",
          offset: 0.78,
        },
        {
          opacity: 1,
          transform: "perspective(900px) translate3d(0, 0, 0) scale(1)",
          filter: "blur(0px)",
        },
      ],
    });
  }

  const catalog = new Map();
  for (const family of families) {
    for (const direction of directions) {
      for (const depth of depths) {
        for (const tempo of tempos) {
          const recipe = makeRecipe(family, direction, depth, tempo);
          catalog.set(recipe.id, recipe);
        }
      }
    }
  }

  function reducedMotionRequested() {
    return global.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  }

  function run(element, id, options = {}) {
    if (!(element instanceof Element)) return null;
    const recipe = catalog.get(id) || catalog.get("reveal:up:near:swift");

    if (reducedMotionRequested() || typeof element.animate !== "function") {
      element.style.opacity = "1";
      element.style.transform = "none";
      element.style.filter = "none";
      return null;
    }

    return element.animate(recipe.keyframes, {
      duration: options.duration ?? recipe.duration,
      easing: options.easing ?? recipe.easing,
      delay: options.delay ?? 0,
      iterations: options.iterations ?? 1,
      direction: options.direction ?? "normal",
      fill: options.fill ?? "both",
    });
  }

  global.DrufiyMotion = Object.freeze({
    version: "1.0.0",
    catalog,
    size: catalog.size,
    families: Object.freeze([...families]),
    directions: Object.freeze([...directions]),
    depths: Object.freeze([...depths]),
    tempos: Object.freeze([...tempos]),
    get: (id) => catalog.get(id),
    run,
  });
})(window);
