(function () {
  const formFieldNames = [
    "knownDistance",
    "timeSeconds",
    "timingMethod",
    "startType",
    "topSpeedValue",
    "topSpeedUnit",
    "split10",
    "split20",
    "flying10",
    "flying20",
    "block30",
    "ageGroup",
    "sex",
    "sport",
    "position"
  ];

  function applyParamsToForm(form) {
    const params = new URLSearchParams(window.location.search);
    formFieldNames.forEach((name) => {
      const field = form.elements[name];
      const value = params.get(name);
      if (field && value !== null) {
        field.value = value;
      }
    });

    if (form.elements.applyHandAdjustment && params.get("applyHandAdjustment") === "1") {
      form.elements.applyHandAdjustment.checked = true;
    }
  }

  function buildShareUrl(form) {
    const params = new URLSearchParams();
    formFieldNames.forEach((name) => {
      const field = form.elements[name];
      if (!field || !field.value) {
        return;
      }
      params.set(name, field.value);
    });

    if (form.elements.applyHandAdjustment && form.elements.applyHandAdjustment.checked) {
      params.set("applyHandAdjustment", "1");
    }

    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const query = params.toString();
    return query ? `${baseUrl}?${query}` : baseUrl;
  }

  async function copyText(value) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }

    const temp = document.createElement("textarea");
    temp.value = value;
    document.body.appendChild(temp);
    temp.select();
    const copied = document.execCommand("copy");
    temp.remove();
    return copied;
  }

  window.SprintShare = {
    applyParamsToForm,
    buildShareUrl,
    copyText
  };
})();
