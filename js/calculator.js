(function () {
  const DISTANCES = {
    "10yd": { label: "10yd", longLabel: "10 yards", meters: 9.144 },
    "20yd": { label: "20yd", longLabel: "20 yards", meters: 18.288 },
    "30yd": { label: "30yd", longLabel: "30 yards", meters: 27.432 },
    "40yd": { label: "40yd", longLabel: "40 yards", meters: 36.576 },
    "60yd": { label: "60yd", longLabel: "60 yards", meters: 54.864 },
    "30m": { label: "30m", longLabel: "30 meters", meters: 30 },
    "60m": { label: "60m", longLabel: "60 meters", meters: 60 },
    "100m": { label: "100m", longLabel: "100 meters", meters: 100 },
    "200m": { label: "200m", longLabel: "200 meters", meters: 200 }
  };

  const DISPLAY_DISTANCES = ["10yd", "20yd", "30yd", "40yd", "60yd", "60m", "100m", "200m"];

  const REFERENCE_CURVES = {
    standing: { "10yd": 1.88, "20yd": 3.1, "30yd": 4.2, "40yd": 5.1, "60yd": 7.25, "30m": 4.55, "60m": 7.9, "100m": 12.8, "200m": 26.4, topSpeedMps: 8.55 },
    "three-point": { "10yd": 1.78, "20yd": 3, "30yd": 4.08, "40yd": 4.92, "60yd": 7, "30m": 4.42, "60m": 7.65, "100m": 12.45, "200m": 25.8, topSpeedMps: 8.75 },
    block: { "10yd": 1.82, "20yd": 2.95, "30yd": 4, "40yd": 4.86, "60yd": 6.92, "30m": 4.12, "60m": 7.35, "100m": 11.95, "200m": 24.9, topSpeedMps: 9.15 },
    rolling: { "10yd": 1.4, "20yd": 2.38, "30yd": 3.28, "40yd": 4.14, "60yd": 6, "30m": 3.55, "60m": 6.6, "100m": 11.25, "200m": 23.9, topSpeedMps: 9.45 },
    flying: { "10yd": 1.08, "20yd": 2.02, "30yd": 2.92, "40yd": 3.78, "60yd": 5.6, "30m": 3.1, "60m": 6.2, "100m": 10.95, "200m": 23.5, topSpeedMps: 9.8 }
  };

  const DISTANCE_PHASE_WEIGHTS = {
    "10yd": { accel: 0.75, velocity: 0.2, endurance: 0.05 },
    "20yd": { accel: 0.67, velocity: 0.26, endurance: 0.07 },
    "30yd": { accel: 0.58, velocity: 0.32, endurance: 0.1 },
    "40yd": { accel: 0.5, velocity: 0.38, endurance: 0.12 },
    "60yd": { accel: 0.36, velocity: 0.42, endurance: 0.22 },
    "30m": { accel: 0.56, velocity: 0.34, endurance: 0.1 },
    "60m": { accel: 0.33, velocity: 0.44, endurance: 0.23 },
    "100m": { accel: 0.2, velocity: 0.45, endurance: 0.35 },
    "200m": { accel: 0.13, velocity: 0.3, endurance: 0.57 }
  };

  const START_LABELS = {
    standing: "Standing start",
    "three-point": "3-point start",
    block: "Block start",
    rolling: "Rolling start",
    flying: "Flying start"
  };

  function buildOptionList(options, selectedValue) {
    return options
      .map((option) => `<option value="${option.value}"${option.value === selectedValue ? " selected" : ""}>${option.label}</option>`)
      .join("");
  }

  function buildCalculatorTemplate(defaults) {
    const distanceOptions = [
      { value: "10yd", label: "10 yards" },
      { value: "20yd", label: "20 yards" },
      { value: "30yd", label: "30 yards" },
      { value: "40yd", label: "40 yards" },
      { value: "60yd", label: "60 yards" },
      { value: "30m", label: "30 meters" },
      { value: "60m", label: "60 meters" },
      { value: "100m", label: "100 meters" },
      { value: "200m", label: "200 meters" }
    ];

    const timingOptions = [
      { value: "hand", label: "Hand timed" },
      { value: "fat", label: "Fully automatic timing / FAT" },
      { value: "laser", label: "Laser timed" },
      { value: "phone", label: "Phone video estimate" }
    ];

    const startOptions = [
      { value: "standing", label: "Standing start" },
      { value: "three-point", label: "3-point start" },
      { value: "block", label: "Block start" },
      { value: "rolling", label: "Rolling start" },
      { value: "flying", label: "Flying start" }
    ];

    const ageOptions = [
      { value: "13-14", label: "13-14" },
      { value: "15-16", label: "15-16" },
      { value: "17-18", label: "17-18" },
      { value: "college-adult", label: "college/adult" },
      { value: "not-specified", label: "not specified" }
    ];

    const sexOptions = [
      { value: "male", label: "male" },
      { value: "female", label: "female" },
      { value: "not-specified", label: "not specified" }
    ];

    const sportOptions = [
      { value: "football", label: "football" },
      { value: "baseball", label: "baseball" },
      { value: "soccer", label: "soccer" },
      { value: "track", label: "track" },
      { value: "general-athlete", label: "general athlete" }
    ];

    const positionOptions = [
      { value: "all", label: "all / not specified" },
      { value: "skill", label: "skill" },
      { value: "big-skill", label: "big skill" },
      { value: "lineman", label: "lineman" },
      { value: "outfield", label: "outfield" },
      { value: "infield", label: "infield" },
      { value: "forward-wing", label: "forward/wing" },
      { value: "midfielder", label: "midfielder" },
      { value: "defender", label: "defender" }
    ];

    return `
      <form data-calculator-form novalidate>
        <div class="form-grid">
          <div class="field-row">
            <div class="field-group">
              <label for="knownDistance">Known distance</label>
              <select id="knownDistance" name="knownDistance" aria-describedby="distance-help">
                ${buildOptionList(distanceOptions, defaults.knownDistance)}
              </select>
              <p class="help-text" id="distance-help">Choose the sprint mark you already know. Different distances stress different phases of sprinting.</p>
            </div>
            <div class="field-group">
              <label for="timeSeconds">Known time (seconds)</label>
              <input id="timeSeconds" name="timeSeconds" type="number" min="0" step="0.01" inputmode="decimal" aria-describedby="time-help">
              <p class="help-text" id="time-help">Use seconds with decimals, like 4.87 or 11.52. Zero and negative values are rejected.</p>
            </div>
          </div>

          <div class="field-row">
            <div class="field-group">
              <label for="timingMethod">Timing method</label>
              <select id="timingMethod" name="timingMethod" aria-describedby="timing-help">
                ${buildOptionList(timingOptions, defaults.timingMethod)}
              </select>
              <p class="help-text" id="timing-help">FAT means a fully automatic start and finish. Hand times usually read faster than FAT.</p>
            </div>
            <div class="field-group">
              <label for="startType">Start type</label>
              <select id="startType" name="startType" aria-describedby="start-help">
                ${buildOptionList(startOptions, defaults.startType)}
              </select>
              <p class="help-text" id="start-help">Rolling and flying starts are faster early and should not be treated as the same as standing or block starts.</p>
            </div>
          </div>

          <div class="checkbox-row">
            <input id="applyHandAdjustment" name="applyHandAdjustment" type="checkbox"${defaults.applyHandAdjustment ? " checked" : ""} aria-describedby="hand-adjustment-help">
            <div>
              <label for="applyHandAdjustment">Apply estimated hand-time adjustment</label>
              <p class="help-text" id="hand-adjustment-help">Hand times are usually faster than fully automatic times. Conversions are estimates and should not be treated as official marks. This tool uses a +0.24 second track-style adjustment when selected.</p>
            </div>
          </div>

          <fieldset>
            <legend class="legend-title">Optional top speed</legend>
            <div class="field-row">
              <div class="field-group">
                <label for="topSpeedValue">Top speed value</label>
                <input id="topSpeedValue" name="topSpeedValue" type="number" min="0" step="0.01" inputmode="decimal" aria-describedby="top-speed-help">
                <p class="help-text" id="top-speed-help">Add mph or m/s if you already have a reliable max-speed estimate. Leave blank if not.</p>
              </div>
              <div class="field-group">
                <label for="topSpeedUnit">Top speed unit</label>
                <select id="topSpeedUnit" name="topSpeedUnit">
                  <option value="mph"${defaults.topSpeedUnit === "mph" ? " selected" : ""}>mph</option>
                  <option value="mps"${defaults.topSpeedUnit === "mps" ? " selected" : ""}>m/s</option>
                </select>
              </div>
            </div>
          </fieldset>

          <fieldset>
            <legend class="legend-title">Optional split times</legend>
            <div class="field-row">
              <div class="field-group">
                <label for="split10">10 yard split</label>
                <input id="split10" name="split10" type="number" min="0" step="0.01" inputmode="decimal" aria-describedby="split-help">
              </div>
              <div class="field-group">
                <label for="split20">20 yard split</label>
                <input id="split20" name="split20" type="number" min="0" step="0.01" inputmode="decimal">
              </div>
            </div>
            <div class="field-row">
              <div class="field-group">
                <label for="flying10">Flying 10m</label>
                <input id="flying10" name="flying10" type="number" min="0" step="0.01" inputmode="decimal">
              </div>
              <div class="field-group">
                <label for="flying20">Flying 20m</label>
                <input id="flying20" name="flying20" type="number" min="0" step="0.01" inputmode="decimal">
              </div>
            </div>
            <div class="field-group">
              <label for="block30">30m block time</label>
              <input id="block30" name="block30" type="number" min="0" step="0.01" inputmode="decimal">
              <p class="help-text" id="split-help">Splits help the calculator separate acceleration from upright-speed ability, which usually improves confidence.</p>
            </div>
          </fieldset>

          <fieldset>
            <legend class="legend-title">Athlete profile</legend>
            <div class="field-row">
              <div class="field-group">
                <label for="ageGroup">Age range</label>
                <select id="ageGroup" name="ageGroup">
                  ${buildOptionList(ageOptions, defaults.ageGroup)}
                </select>
              </div>
              <div class="field-group">
                <label for="sex">Sex/category</label>
                <select id="sex" name="sex">
                  ${buildOptionList(sexOptions, defaults.sex)}
                </select>
              </div>
            </div>
            <div class="field-row">
              <div class="field-group">
                <label for="sport">Sport</label>
                <select id="sport" name="sport">
                  ${buildOptionList(sportOptions, defaults.sport)}
                </select>
              </div>
              <div class="field-group">
                <label for="position">Position</label>
                <select id="position" name="position">
                  ${buildOptionList(positionOptions, defaults.position)}
                </select>
              </div>
            </div>
          </fieldset>

          <div class="button-row">
            <button class="button button-primary" type="submit">Calculate</button>
            <button class="button button-secondary" type="reset">Reset</button>
            <button class="button button-tertiary" type="button" data-copy-results>Copy results</button>
            <button class="button button-tertiary" type="button" data-share-results>Share result</button>
          </div>
          <p class="small-note">This site provides estimated sprint conversions and general performance ranges for educational and training-reference purposes only. Results are not official marks, not exact percentiles, and should not be used as the sole basis for recruiting, scholarship, roster, medical, or training decisions.</p>
          <div data-form-status aria-live="polite" hidden></div>
        </div>
      </form>
    `;
  }

  function initCalculatorTemplate() {
    const host = document.querySelector("[data-calculator-template]");
    if (!host) {
      return;
    }

    host.innerHTML = buildCalculatorTemplate({
      knownDistance: host.dataset.defaultDistance || "40yd",
      timingMethod: host.dataset.defaultTiming || "fat",
      startType: host.dataset.defaultStart || "standing",
      topSpeedUnit: host.dataset.defaultTopUnit || "mph",
      ageGroup: host.dataset.defaultAge || "college-adult",
      sex: host.dataset.defaultSex || "male",
      sport: host.dataset.defaultSport || "football",
      position: host.dataset.defaultPosition || "all",
      applyHandAdjustment: host.dataset.defaultHandAdjustment === "true"
    });
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function roundTime(value) {
    return Math.round(value * 100) / 100;
  }

  function roundMetric(value, digits) {
    const power = 10 ** digits;
    return Math.round(value * power) / power;
  }

  function mphToMps(mph) {
    return mph * 0.44704;
  }

  function mpsToMph(mps) {
    return mps * 2.236936;
  }

  function mpsToKmh(mps) {
    return mps * 3.6;
  }

  function getAdjustedTime(formValues) {
    if (formValues.timingMethod !== "hand" || !formValues.applyHandAdjustment) {
      return formValues.timeSeconds;
    }

    return formValues.timeSeconds + 0.24;
  }

  function formToValues(form) {
    return {
      knownDistance: form.elements.knownDistance.value,
      timeSeconds: window.SprintValidation.parseNumber(form.elements.timeSeconds.value),
      timingMethod: form.elements.timingMethod.value,
      startType: form.elements.startType.value,
      applyHandAdjustment: Boolean(form.elements.applyHandAdjustment.checked),
      topSpeedValue: window.SprintValidation.parseNumber(form.elements.topSpeedValue.value),
      topSpeedUnit: form.elements.topSpeedUnit.value,
      split10: window.SprintValidation.parseNumber(form.elements.split10.value),
      split20: window.SprintValidation.parseNumber(form.elements.split20.value),
      flying10: window.SprintValidation.parseNumber(form.elements.flying10.value),
      flying20: window.SprintValidation.parseNumber(form.elements.flying20.value),
      block30: window.SprintValidation.parseNumber(form.elements.block30.value),
      ageGroup: form.elements.ageGroup.value,
      sex: form.elements.sex.value,
      sport: form.elements.sport.value,
      position: form.elements.position.value
    };
  }

  function scoreFromScale(scale) {
    return clamp(50 + (1 - scale) * 70, 20, 95);
  }

  function velocityScoreFromTopSpeed(mps) {
    return clamp(20 + ((mps - 5.5) / 5.2) * 75, 20, 97);
  }

  function deriveTopSpeedMps(values, scale) {
    if (values.topSpeedValue !== null) {
      return values.topSpeedUnit === "mph" ? mphToMps(values.topSpeedValue) : values.topSpeedValue;
    }

    if (values.flying10 !== null) {
      return 10 / values.flying10;
    }

    if (values.flying20 !== null) {
      return 20 / values.flying20;
    }

    const knownMeters = DISTANCES[values.knownDistance].meters;
    if (knownMeters >= 27.432) {
      const referenceTopSpeed = REFERENCE_CURVES[values.startType].topSpeedMps;
      return referenceTopSpeed / scale;
    }

    return null;
  }

  function derivePhaseScores(values, scale, adjustedKnownTime) {
    const baseScore = scoreFromScale(scale);
    const startBias = {
      standing: 53,
      "three-point": 59,
      block: 64,
      rolling: 46,
      flying: 42
    };

    let acceleration = clamp((baseScore + startBias[values.startType]) / 2, 20, 95);
    let maxVelocity = clamp(baseScore, 20, 95);
    let endurance = clamp(baseScore, 20, 95);

    if (values.split10 !== null) {
      const projected10 = REFERENCE_CURVES[values.startType]["10yd"] * scale;
      acceleration += clamp((projected10 - values.split10) * 35, -18, 18);
    }

    if (values.split20 !== null) {
      const projected20 = REFERENCE_CURVES[values.startType]["20yd"] * scale;
      acceleration += clamp((projected20 - values.split20) * 20, -12, 12);
    }

    if (values.block30 !== null) {
      const projected30m = REFERENCE_CURVES.block["30m"] * scale;
      acceleration += clamp((projected30m - values.block30) * 22, -14, 14);
    }

    const topSpeedMps = deriveTopSpeedMps(values, scale);
    if (topSpeedMps !== null) {
      maxVelocity = clamp((maxVelocity + velocityScoreFromTopSpeed(topSpeedMps)) / 2, 20, 97);
    }

    if (values.flying10 !== null) {
      maxVelocity += clamp((1.1 - values.flying10) * 18, -6, 10);
    }

    if (values.flying20 !== null) {
      maxVelocity += clamp((2.1 - values.flying20) * 12, -6, 8);
    }

    if (DISTANCES[values.knownDistance].meters >= 60) {
      endurance += clamp((REFERENCE_CURVES[values.startType][values.knownDistance] * scale - adjustedKnownTime) * 10, -10, 10);
    } else {
      endurance -= 4;
    }

    if (DISTANCES[values.knownDistance].meters >= 100) {
      endurance += 6;
    }

    return {
      acceleration: clamp(Math.round(acceleration), 20, 95),
      maxVelocity: clamp(Math.round(maxVelocity), 20, 97),
      endurance: clamp(Math.round(endurance), 20, 95),
      topSpeedMps
    };
  }

  function buildEstimatedTimes(values, scale, phaseScores) {
    const estimates = {};
    Object.keys(DISTANCES).forEach((distanceKey) => {
      const referenceTime = REFERENCE_CURVES[values.startType][distanceKey];
      const weights = DISTANCE_PHASE_WEIGHTS[distanceKey];
      const accelerationFactor = 1 + ((50 - phaseScores.acceleration) / 50) * 0.08 * weights.accel;
      const velocityFactor = 1 + ((50 - phaseScores.maxVelocity) / 50) * 0.08 * weights.velocity;
      const enduranceFactor = 1 + ((50 - phaseScores.endurance) / 50) * 0.08 * weights.endurance;
      estimates[distanceKey] = roundTime(referenceTime * scale * accelerationFactor * velocityFactor * enduranceFactor);
    });
    return estimates;
  }

  function buildConfidence(values) {
    let score = 0;
    let label = "Low";
    let explanation = "This estimate is built from limited information, so it should be treated as a broad training reference rather than a close prediction.";

    if (values.timingMethod === "fat" || values.timingMethod === "laser") {
      score += 2;
    } else if (values.timingMethod === "hand") {
      score += 1;
    }

    if (values.split10 !== null || values.split20 !== null || values.flying10 !== null || values.flying20 !== null || values.block30 !== null) {
      score += 2;
    }

    if (values.topSpeedValue !== null) {
      score += 1;
    }

    if (values.startType === "standing" || values.startType === "three-point" || values.startType === "block") {
      score += 1;
    }

    if (values.timingMethod === "phone") {
      score -= 1;
    }

    if (values.startType === "rolling" || values.startType === "flying") {
      score -= 1;
    }

    if (score >= 5) {
      label = "High";
      explanation = "This estimate uses a more reliable setup, with timing and extra sprint data that make the conversion more useful for training comparisons.";
    } else if (score >= 3) {
      label = "Medium";
      explanation = "This estimate has a reasonable starting point, but it still depends on assumptions about acceleration, top speed, and timing setup.";
    }

    return { label, explanation };
  }

  function buildSummary(values, result) {
    const primaryDistance = values.knownDistance;
    const confidenceLine = `${result.confidence.label} confidence because the estimate is based on ${values.timingMethod === "phone" ? "a phone-video style input" : values.timingMethod} timing, ${START_LABELS[values.startType].toLowerCase()}, and ${result.extraDataCount > 0 ? "extra sprint data" : "no extra split or top-speed data"}.`;
    const handNote = values.applyHandAdjustment && values.timingMethod === "hand"
      ? "A +0.24 second track-style hand-time adjustment was applied as an educational estimate, not an official conversion."
      : "No hand-time adjustment was applied.";

    return `You entered ${roundTime(values.timeSeconds)} seconds for ${DISTANCES[primaryDistance].longLabel}. The tool uses a non-linear sprint model so short distances stay more acceleration-heavy and longer distances lean more on max velocity and speed endurance. ${confidenceLine} ${handNote}`;
  }

  function calculate(values) {
    const adjustedKnownTime = getAdjustedTime(values);
    const referenceKnownTime = REFERENCE_CURVES[values.startType][values.knownDistance];
    const scale = adjustedKnownTime / referenceKnownTime;
    const phaseScores = derivePhaseScores(values, scale, adjustedKnownTime);
    const estimatedTimes = buildEstimatedTimes(values, scale, phaseScores);
    const knownMeters = DISTANCES[values.knownDistance].meters;
    const averageSpeedMps = knownMeters / adjustedKnownTime;
    const confidence = buildConfidence(values);
    const extraDataCount = [values.topSpeedValue, values.split10, values.split20, values.flying10, values.flying20, values.block30].filter((value) => value !== null).length;

    estimatedTimes[values.knownDistance] = roundTime(adjustedKnownTime);

    return {
      adjustedKnownTime: roundTime(adjustedKnownTime),
      averageSpeedMps: roundMetric(averageSpeedMps, 2),
      averageSpeedMph: roundMetric(mpsToMph(averageSpeedMps), 2),
      averageSpeedKmh: roundMetric(mpsToKmh(averageSpeedMps), 2),
      estimatedTopSpeedMps: phaseScores.topSpeedMps !== null ? roundMetric(phaseScores.topSpeedMps, 2) : null,
      estimatedTopSpeedMph: phaseScores.topSpeedMps !== null ? roundMetric(mpsToMph(phaseScores.topSpeedMps), 2) : null,
      accelerationScore: phaseScores.acceleration,
      maxVelocityScore: phaseScores.maxVelocity,
      speedEnduranceScore: phaseScores.endurance,
      estimatedTimes,
      confidence,
      knownDistance: values.knownDistance,
      extraDataCount,
      summary: buildSummary(values, { confidence, extraDataCount })
    };
  }

  function metricCard(title, value, description, className) {
    return `
      <article class="result-card">
        <p class="stat-label">${title}</p>
        <p class="stat-value ${className || ""}">${value}</p>
        <p class="small-note">${description}</p>
      </article>
    `;
  }

  function renderTimes(result, resultGrid, pagePrimaryDistance) {
    const distances = pagePrimaryDistance === "30m" ? ["30m"].concat(DISPLAY_DISTANCES) : DISPLAY_DISTANCES.slice();
    const uniqueDistances = distances.filter((distanceKey, index) => distances.indexOf(distanceKey) === index);

    resultGrid.innerHTML = uniqueDistances
      .map((distanceKey) => {
        const time = result.estimatedTimes[distanceKey];
        if (time === undefined) {
          return "";
        }
        return metricCard(
          `Estimated ${DISTANCES[distanceKey].label}`,
          `${time.toFixed(2)}s`,
          "Estimated sprint time using the current timing method and start context."
        );
      })
      .join("");
  }

  function confidenceClass(label) {
    if (label === "High") {
      return "pill-high";
    }
    if (label === "Medium") {
      return "pill-medium";
    }
    return "pill-low";
  }

  function renderBenchmark(panel, result, values, pagePrimaryDistance) {
    const match = window.SprintBenchmarks.findBenchmark(
      { sport: values.sport, sex: values.sex, ageGroup: values.ageGroup },
      result
    );

    if (!match) {
      panel.hidden = false;
      panel.innerHTML = `
        <div class="benchmark-box">
          <h3>Benchmark status</h3>
          <p>We do not have a verified benchmark range for this exact profile yet. Your estimated sprint conversions are still shown, but no sport/age/category benchmark is provided.</p>
        </div>
      `;
      return;
    }

    const evaluation = window.SprintBenchmarks.evaluateBenchmark(match, result);
    if (!evaluation) {
      panel.hidden = true;
      return;
    }

    const displayDistance = pagePrimaryDistance && result.estimatedTimes[pagePrimaryDistance] !== undefined
      ? pagePrimaryDistance
      : match.distance;

    panel.hidden = false;
    panel.innerHTML = `
      <div class="benchmark-box">
        <div class="button-row">
          <span class="tier-pill ${evaluation.tierClass}">${evaluation.tier}</span>
          <span class="badge">${evaluation.confidenceLabel}</span>
        </div>
        <h3>${match.distance} benchmark result</h3>
        <p>Your estimated ${displayDistance} mark for comparison is <strong>${evaluation.performanceTime.toFixed(2)}s</strong>.</p>
        <p>These are general performance ranges, not exact percentiles.</p>
        <p>Performance varies based on timing method, surface, footwear, wind, start type, and testing conditions.</p>
        <p class="small-note">${match.notes}</p>
        <p class="source-note"><strong>Source:</strong> ${match.sourceName} | <a class="source-link" href="${match.sourceUrl}" target="_blank" rel="noopener noreferrer">View source</a></p>
      </div>
    `;
  }

  function resultText(values, result) {
    const lines = [
      `Sprint Performance Calculator report`,
      `Known input: ${DISTANCES[values.knownDistance].longLabel} in ${roundTime(values.timeSeconds).toFixed(2)}s`,
      `Timing method: ${values.timingMethod}`,
      `Start type: ${START_LABELS[values.startType]}`,
      `Adjusted known time: ${result.adjustedKnownTime.toFixed(2)}s`,
      `Average speed: ${result.averageSpeedMph.toFixed(2)} mph | ${result.averageSpeedMps.toFixed(2)} m/s | ${result.averageSpeedKmh.toFixed(2)} km/h`,
      `Estimated 10yd: ${result.estimatedTimes["10yd"].toFixed(2)}s`,
      `Estimated 20yd: ${result.estimatedTimes["20yd"].toFixed(2)}s`,
      `Estimated 30yd: ${result.estimatedTimes["30yd"].toFixed(2)}s`,
      `Estimated 40yd: ${result.estimatedTimes["40yd"].toFixed(2)}s`,
      `Estimated 60yd: ${result.estimatedTimes["60yd"].toFixed(2)}s`,
      `Estimated 60m: ${result.estimatedTimes["60m"].toFixed(2)}s`,
      `Estimated 100m: ${result.estimatedTimes["100m"].toFixed(2)}s`,
      `Estimated 200m: ${result.estimatedTimes["200m"].toFixed(2)}s`,
      `Estimated top speed: ${result.estimatedTopSpeedMph !== null ? `${result.estimatedTopSpeedMph.toFixed(2)} mph` : "Not enough data"}`,
      `Acceleration score: ${result.accelerationScore}/100`,
      `Max velocity score: ${result.maxVelocityScore}/100`,
      `Speed endurance score: ${result.speedEnduranceScore}/100`,
      `Confidence: ${result.confidence.label} - ${result.confidence.explanation}`,
      `Reminder: Results are educational estimates, not official marks or exact percentiles.`
    ];
    return lines.join("\n");
  }

  function setStatus(element, type, message) {
    element.className = `${type}-box`;
    element.textContent = message;
    element.hidden = false;
  }

  function initNavigation() {
    const toggle = document.querySelector("[data-nav-toggle]");
    const nav = document.querySelector("[data-nav]");
    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("is-open");
    });
  }

  function initCalculator() {
    const form = document.querySelector("[data-calculator-form]");
    if (!form) {
      return;
    }

    const resultSection = document.querySelector("[data-results-section]");
    const resultGrid = document.querySelector("[data-results-grid]");
    const resultNarrative = document.querySelector("[data-result-summary]");
    const metricsGrid = document.querySelector("[data-metrics-grid]");
    const benchmarkPanel = document.querySelector("[data-benchmark-panel]");
    const status = document.querySelector("[data-form-status]");
    const copyButton = document.querySelector("[data-copy-results]");
    const shareButton = document.querySelector("[data-share-results]");
    const primaryDistance = document.body.dataset.primaryDistance || "";

    window.SprintShare.applyParamsToForm(form);

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const values = formToValues(form);
      const validation = window.SprintValidation.validateSprintInput(values);
      if (validation.errors.length) {
        setStatus(status, "error", validation.errors.join(" "));
        resultSection.hidden = true;
        benchmarkPanel.hidden = true;
        return;
      }

      const result = calculate(values);
      renderTimes(result, resultGrid, primaryDistance);

      metricsGrid.innerHTML = [
        metricCard("Average speed", `${result.averageSpeedMph.toFixed(2)} mph`, `${result.averageSpeedMps.toFixed(2)} m/s | ${result.averageSpeedKmh.toFixed(2)} km/h`),
        metricCard("Estimated top speed", result.estimatedTopSpeedMph !== null ? `${result.estimatedTopSpeedMph.toFixed(2)} mph` : "Not enough data", result.estimatedTopSpeedMps !== null ? `${result.estimatedTopSpeedMps.toFixed(2)} m/s based on your input profile.` : "Add top speed or flying splits to strengthen this estimate."),
        metricCard("Acceleration score", `${result.accelerationScore}/100`, "Higher scores suggest stronger early-force and first-step performance."),
        metricCard("Max velocity score", `${result.maxVelocityScore}/100`, "Higher scores suggest stronger upright speed and turnover."),
        metricCard("Speed endurance score", `${result.speedEnduranceScore}/100`, "Higher scores suggest better ability to carry speed into longer sprints.")
      ].join("");

      resultNarrative.innerHTML = `
        <div class="button-row">
          <span class="confidence-pill ${confidenceClass(result.confidence.label)}">${result.confidence.label} confidence</span>
        </div>
        <p class="report-text">${result.summary}</p>
        <p class="small-note">${result.confidence.explanation}</p>
      `;

      renderBenchmark(benchmarkPanel, result, values, primaryDistance);

      if (validation.warnings.length) {
        setStatus(status, "warning", validation.warnings.join(" "));
      } else {
        setStatus(status, "status", "Results updated. These are educational estimates, not official sprint marks.");
      }

      resultSection.hidden = false;
      resultSection.dataset.lastResultText = resultText(values, result);
    });

    form.addEventListener("reset", () => {
      window.setTimeout(() => {
        status.hidden = true;
        resultSection.hidden = true;
        benchmarkPanel.hidden = true;
      }, 0);
    });

    if (copyButton) {
      copyButton.addEventListener("click", async () => {
        const text = resultSection.dataset.lastResultText;
        if (!text) {
          setStatus(status, "warning", "Run a calculation before copying results.");
          return;
        }
        await window.SprintShare.copyText(text);
        setStatus(status, "status", "Sprint report copied to your clipboard.");
      });
    }

    if (shareButton) {
      shareButton.addEventListener("click", async () => {
        const shareUrl = window.SprintShare.buildShareUrl(form);
        await window.SprintShare.copyText(shareUrl);
        history.replaceState({}, "", shareUrl);
        setStatus(status, "status", "Share link copied with your current calculator inputs.");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    initCalculatorTemplate();
    initNavigation();
    initCalculator();
  });
})();
