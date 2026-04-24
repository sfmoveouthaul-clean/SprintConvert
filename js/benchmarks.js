(function () {
  function matchesAgeGroup(benchmarkAgeGroup, selectedAgeGroup) {
    const map = {
      "13-14": "younger",
      "15-16": "teen",
      "17-18": "teen",
      "college-adult": "adult"
    };

    if (!benchmarkAgeGroup || selectedAgeGroup === "not-specified") {
      return true;
    }

    if (benchmarkAgeGroup === "high school / college") {
      return selectedAgeGroup === "15-16" || selectedAgeGroup === "17-18" || selectedAgeGroup === "college-adult";
    }

    if (benchmarkAgeGroup === "teen / adult") {
      return map[selectedAgeGroup] === "teen" || map[selectedAgeGroup] === "adult";
    }

    return true;
  }

  function matchesSex(benchmarkSex, selectedSex) {
    return selectedSex === "not-specified" || benchmarkSex === selectedSex;
  }

  function distanceTimeForBenchmark(benchmark, result) {
    if (result.estimatedTimes[benchmark.distance] !== undefined) {
      return result.estimatedTimes[benchmark.distance];
    }

    if (result.knownDistance === benchmark.distance) {
      return result.adjustedKnownTime;
    }

    return null;
  }

  function findBenchmark(profile, result) {
    if (!Array.isArray(window.SPRINT_BENCHMARK_DATA)) {
      return null;
    }

    return window.SPRINT_BENCHMARK_DATA.find((entry) => {
      if (entry.confidence === "placeholder") {
        return false;
      }

      if (entry.sport !== profile.sport) {
        return false;
      }

      if (!matchesSex(entry.sex, profile.sex)) {
        return false;
      }

      if (!matchesAgeGroup(entry.ageGroup, profile.ageGroup)) {
        return false;
      }

      return distanceTimeForBenchmark(entry, result) !== null;
    }) || null;
  }

  function evaluateBenchmark(entry, result) {
    if (!entry) {
      return null;
    }

    const performanceTime = distanceTimeForBenchmark(entry, result);
    if (performanceTime === null) {
      return null;
    }

    let tier = "Below listed range";
    let tierClass = "tier-below";

    if (performanceTime <= entry.elite) {
      tier = "Elite";
      tierClass = "tier-elite";
    } else if (performanceTime <= entry.advanced) {
      tier = "Advanced";
      tierClass = "tier-advanced";
    } else if (performanceTime <= entry.competitive) {
      tier = "Competitive";
      tierClass = "tier-competitive";
    } else if (performanceTime <= entry.developing) {
      tier = "Developing";
      tierClass = "tier-developing";
    }

    return {
      performanceTime,
      tier,
      tierClass,
      confidenceLabel: entry.confidence === "verified" ? "Verified source benchmark" : "General benchmark range"
    };
  }

  window.SprintBenchmarks = {
    evaluateBenchmark,
    findBenchmark
  };
})();
