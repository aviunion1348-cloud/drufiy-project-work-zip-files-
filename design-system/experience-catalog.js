/*
 * DrufiyAI experience-idea catalog
 * 16 human intents × 8 interface surfaces × 8 cognitive modes = 1,024 executable ideas.
 */

(function bootstrapExperienceCatalog(global) {
  "use strict";

  const intents = [
    "orient", "reveal", "inspect", "correlate", "compare", "approve", "verify", "warn",
    "recover", "handoff", "navigate", "focus", "expand", "compress", "resolve", "celebrate",
  ];
  const surfaces = ["canvas", "glass", "terminal", "node", "rail", "film", "card", "field"];
  const modes = ["subtle", "precise", "cinematic", "ambient", "urgent", "calm", "local", "orbital"];

  const intentPurpose = {
    orient: "establish position before asking for attention",
    reveal: "introduce new evidence without breaking continuity",
    inspect: "invite close reading while keeping context visible",
    correlate: "show how separate signals become one explanation",
    compare: "make differences legible without visual noise",
    approve: "place human control at the consequential boundary",
    verify: "confirm the outcome with observable evidence",
    warn: "surface risk early without creating panic",
    recover: "guide the eye from failure back to a safe path",
    handoff: "move context between people or models without loss",
    navigate: "communicate direction and destination before motion",
    focus: "reduce competing signals around the current task",
    expand: "open deeper context while preserving the source",
    compress: "summarize dense state without hiding uncertainty",
    resolve: "close the loop with proof rather than celebration alone",
    celebrate: "reward completion with a restrained high-confidence cue",
  };

  const surfaceRole = {
    canvas: "an ambient spatial canvas",
    glass: "a layered glass instrument",
    terminal: "a traceable terminal sequence",
    node: "a connected signal node",
    rail: "a directional navigation rail",
    film: "a cinematic live-film surface",
    card: "a focused information card",
    field: "a full-viewport systems field",
  };

  const modeTreatment = {
    subtle: { depth: "near", tempo: "swift", intensity: "subtle", gain: 0.18 },
    precise: { depth: "mid", tempo: "instant", intensity: "soft", gain: 0.28 },
    cinematic: { depth: "deep", tempo: "steady", intensity: "firm", gain: 0.48 },
    ambient: { depth: "far", tempo: "steady", intensity: "subtle", gain: 0.16 },
    urgent: { depth: "mid", tempo: "swift", intensity: "firm", gain: 0.5 },
    calm: { depth: "near", tempo: "steady", intensity: "soft", gain: 0.24 },
    local: { depth: "mid", tempo: "swift", intensity: "subtle", gain: 0.2 },
    orbital: { depth: "orbital", tempo: "steady", intensity: "peak", gain: 0.56 },
  };

  const intentMotion = {
    orient: "focus", reveal: "reveal", inspect: "parallax", correlate: "scan",
    compare: "drift", approve: "magnetic", verify: "signal", warn: "glitch",
    recover: "reveal", handoff: "orbit", navigate: "cinematic", focus: "focus",
    expand: "cinematic", compress: "magnetic", resolve: "signal", celebrate: "orbit",
  };

  const intentSound = {
    orient: "ui", reveal: "open", inspect: "hover", correlate: "scan",
    compare: "select", approve: "confirm", verify: "resolve", warn: "caution",
    recover: "pulse", handoff: "transmit", navigate: "navigation", focus: "select",
    expand: "open", compress: "close", resolve: "resolve", celebrate: "confirm",
  };

  const directions = ["up", "right", "forward", "in", "left", "down", "out", "backward"];
  const pitchBySurface = {
    canvas: "low", glass: "lowMid", terminal: "highMid", node: "high",
    rail: "highMid", film: "low", card: "lowMid", field: "low",
  };

  const catalog = new Map();
  intents.forEach((intent, intentIndex) => {
    surfaces.forEach((surface, surfaceIndex) => {
      modes.forEach((mode, modeIndex) => {
        const treatment = modeTreatment[mode];
        const direction = directions[(intentIndex + surfaceIndex + modeIndex) % directions.length];
        const id = `${intent}:${surface}:${mode}`;
        catalog.set(id, Object.freeze({
          id,
          intent,
          surface,
          mode,
          rationale: `${mode} treatment for ${surfaceRole[surface]} to ${intentPurpose[intent]}.`,
          motion: `${intentMotion[intent]}:${direction}:${treatment.depth}:${treatment.tempo}`,
          sound: `${intentSound[intent]}:${pitchBySurface[surface]}:${treatment.intensity}`,
          soundLevel: treatment.gain,
          variables: Object.freeze({
            "--cue-depth": String(surfaceIndex + 1),
            "--cue-energy": ((modeIndex + 1) / modes.length).toFixed(3),
            "--cue-intent": String(intentIndex + 1),
          }),
          execute(element, options) {
            return apply(element, id, options);
          },
        }));
      });
    });
  });

  function get(id) {
    return catalog.get(id);
  }

  function apply(element, id, options = {}) {
    if (!(element instanceof Element)) return null;
    const recipe = get(id);
    if (!recipe) return null;
    element.dataset.experienceCue = recipe.id;
    Object.entries(recipe.variables).forEach(([name, value]) => element.style.setProperty(name, value));
    const animation = global.DrufiyMotion?.run(element, recipe.motion, options.motion);
    if (options.sound !== false) global.DrufiySound?.play(recipe.sound, { level: recipe.soundLevel });
    return { recipe, animation };
  }

  function find({ intent, surface, mode } = {}) {
    return [...catalog.values()].filter((recipe) =>
      (!intent || recipe.intent === intent) &&
      (!surface || recipe.surface === surface) &&
      (!mode || recipe.mode === mode),
    );
  }

  global.DrufiyExperience = Object.freeze({
    version: "1.0.0",
    catalog,
    size: catalog.size,
    intents: Object.freeze([...intents]),
    surfaces: Object.freeze([...surfaces]),
    modes: Object.freeze([...modes]),
    get,
    find,
    apply,
  });
})(window);
