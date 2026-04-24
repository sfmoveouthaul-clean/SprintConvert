(function () {
  const realisticRanges = {
    "10yd": [1, 3.2],
    "20yd": [1.9, 4.8],
    "30yd": [2.9, 6.5],
    "40yd": [4, 8],
    "60yd": [6, 10.5],
    "30m": [3.2, 6.4],
    "60m": [6.5, 12.5],
    "100m": [9.5, 20],
    "200m": [20, 45]
  };

  function parseNumber(value) {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function rangeText(distanceKey) {
    const range = realisticRanges[distanceKey];
    if (!range) {
      return "";
    }
    return `${range[0].toFixed(1)} to ${range[1].toFixed(1)} seconds`;
  }

  function validateSprintInput(formValues) {
    const errors = [];
    const warnings = [];
    const timeRange = realisticRanges[formValues.knownDistance];
    const splitValues = [
      ["10-yard split", formValues.split10],
      ["20-yard split", formValues.split20],
      ["Flying 10m", formValues.flying10],
      ["Flying 20m", formValues.flying20],
      ["30m block time", formValues.block30]
    ];

    if (!formValues.knownDistance) {
      errors.push("Choose a known distance before calculating.");
    }

    if (formValues.timeSeconds === null) {
      errors.push("Enter a sprint time in seconds.");
    } else if (formValues.timeSeconds <= 0) {
      errors.push("Sprint time must be greater than zero.");
    } else if (timeRange && (formValues.timeSeconds < timeRange[0] || formValues.timeSeconds > timeRange[1])) {
      warnings.push(`The time you entered is outside our usual range for ${formValues.knownDistance}. Double-check the input and timing method.`);
    }

    splitValues.forEach(([label, value]) => {
      if (value !== null && value <= 0) {
        errors.push(`${label} must be greater than zero if entered.`);
      }
      if (value !== null && formValues.timeSeconds !== null && value >= formValues.timeSeconds) {
        errors.push(`${label} should be lower than the total known time.`);
      }
    });

    if (formValues.split10 !== null && formValues.split20 !== null && formValues.split10 >= formValues.split20) {
      errors.push("The 10-yard split should be lower than the 20-yard split.");
    }

    if (formValues.flying10 !== null && formValues.flying20 !== null && formValues.flying10 > formValues.flying20) {
      warnings.push("Your flying 10m is faster than your flying 20m, which can happen, but it is worth double-checking the numbers.");
    }

    if (formValues.topSpeedValue !== null) {
      if (formValues.topSpeedUnit === "mph" && (formValues.topSpeedValue < 5 || formValues.topSpeedValue > 30)) {
        warnings.push("The top speed value is outside the range most athletes enter. Double-check the unit and number.");
      }
      if (formValues.topSpeedUnit === "mps" && (formValues.topSpeedValue < 2.2 || formValues.topSpeedValue > 13.5)) {
        warnings.push("The top speed value is outside the range most athletes enter. Double-check the unit and number.");
      }
    }

    if (formValues.startType === "rolling" || formValues.startType === "flying") {
      warnings.push("Rolling and flying starts are not directly equivalent to standing, 3-point, or block starts. Treat standing-start estimates as broad approximations.");
    }

    if (formValues.timingMethod === "phone") {
      warnings.push("Phone-video estimates can be useful, but frame rate, camera angle, and start/finish judgment reduce confidence.");
    }

    if (formValues.timingMethod === "hand" && !formValues.applyHandAdjustment) {
      warnings.push("Hand-timed marks are usually faster than FAT. Consider the adjustment checkbox if you want a track-style estimate.");
    }

    return { errors, warnings };
  }

  window.SprintValidation = {
    parseNumber,
    rangeText,
    validateSprintInput
  };
})();
