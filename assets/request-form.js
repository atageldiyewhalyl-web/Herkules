(function () {
  const forms = document.querySelectorAll(".request-form");
  const genericTextPattern = /^(.)\1{2,}$|^[a-z]{8,}$/i;
  const floorPattern = /\b(eg|erdgeschoss|kg|souterrain|hochparterre|dachgeschoss|dg|[0-9]{1,2}\.?\s*(og|stock|etage)?)\b/i;

  function getStatus(form) {
    let status = form.querySelector(".request-form__status");
    if (!status) {
      status = document.createElement("p");
      status.className = "request-form__status";
      status.setAttribute("role", "status");
      form.append(status);
    }
    return status;
  }

  function setStatus(form, type, message) {
    const status = getStatus(form);
    status.textContent = message;
    status.dataset.type = type;
  }

  function serialize(form) {
    const data = Object.fromEntries(new FormData(form).entries());
    data.page = window.location.href;
    return data;
  }

  function normalize(value) {
    return String(value || "").trim().replace(/\s+/g, " ");
  }

  function getField(form, name) {
    return form.elements[name] || null;
  }

  function setFieldError(field, message) {
    if (!field) {
      return;
    }
    field.setCustomValidity(message);
  }

  function clearFieldErrors(form) {
    Array.from(form.elements).forEach((field) => {
      if (typeof field.setCustomValidity === "function") {
        field.setCustomValidity("");
      }
    });
  }

  function hasRandomText(value) {
    const text = normalize(value);
    if (!text) {
      return false;
    }

    const lettersOnly = text.replace(/[^a-zäöüß]/gi, "");
    const vowelCount = (lettersOnly.match(/[aeiouäöü]/gi) || []).length;
    const words = text.split(/\s+/).filter(Boolean);

    return (
      genericTextPattern.test(text) ||
      (lettersOnly.length >= 7 && vowelCount === 0) ||
      words.some((word) => word.length >= 14 && !/[aeiouäöü]/i.test(word))
    );
  }

  function isValidName(value) {
    const text = normalize(value);
    if (text.length < 5 || text.length > 80 || hasRandomText(text)) {
      return false;
    }

    const parts = text.split(/[\s-]+/).filter(Boolean);
    return parts.length >= 2 && parts.every((part) => /^[A-Za-zÀ-ÖØ-öø-ÿ.'-]{2,}$/.test(part));
  }

  function isValidPhone(value) {
    const text = normalize(value);
    const digits = text.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 16 && /^[+()0-9\s/-]+$/.test(text);
  }

  function isValidMovingDate(value) {
    if (!value) {
      return false;
    }
    const selected = new Date(`${value}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const twoYearsFromNow = new Date(today);
    twoYearsFromNow.setFullYear(today.getFullYear() + 2);

    return selected >= today && selected <= twoYearsFromNow;
  }

  function isValidAddress(value) {
    const text = normalize(value);
    const hasStreetNumber = /\b\d+[a-z]?\b/i.test(text);
    const hasPostalCode = /\b(?=[A-Z0-9 -]{4,10}\b)(?=[A-Z0-9 -]*\d)[A-Z0-9][A-Z0-9 -]{2,8}[A-Z0-9]\b/i.test(text);
    const hasLetters = /[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(text);

    return text.length >= 12 && !hasRandomText(text) && hasStreetNumber && hasPostalCode && hasLetters;
  }

  function isValidFloor(value) {
    const text = normalize(value);
    return text.length <= 40 && floorPattern.test(text);
  }

  function isLikelyLegitInquiry(form) {
    clearFieldErrors(form);

    const checks = [
      {
        field: getField(form, "name"),
        valid: isValidName(getField(form, "name")?.value),
        message: "Bitte geben Sie Vor- und Nachnamen an.",
      },
      {
        field: getField(form, "phone"),
        valid: isValidPhone(getField(form, "phone")?.value),
        message: "Bitte geben Sie eine erreichbare Telefonnummer an.",
      },
      {
        field: getField(form, "moving-date"),
        valid: isValidMovingDate(getField(form, "moving-date")?.value),
        message: "Bitte wählen Sie ein realistisches Umzugsdatum in der Zukunft.",
      },
      {
        field: getField(form, "loading-address"),
        valid: isValidAddress(getField(form, "loading-address")?.value),
        message: "Bitte geben Sie Straße, Hausnummer, PLZ und Ort an.",
      },
    ];

    const unloadingAddress = getField(form, "unloading-address");
    if (unloadingAddress) {
      checks.push({
        field: unloadingAddress,
        valid: isValidAddress(unloadingAddress.value),
        message: "Bitte geben Sie Straße, Hausnummer, PLZ und Ort an.",
      });
    }

    ["apartment-floor", "destination-floor"].forEach((name) => {
      const field = getField(form, name);
      if (field) {
        checks.push({
          field,
          valid: isValidFloor(field.value),
          message: "Bitte geben Sie eine Etage wie EG, 2. OG oder DG an.",
        });
      }
    });

    const failedCheck = checks.find((check) => check.field && !check.valid);
    if (failedCheck) {
      setFieldError(failedCheck.field, failedCheck.message);
      failedCheck.field.reportValidity();
      return false;
    }

    return true;
  }

  forms.forEach((form) => {
    if (!getField(form, "website")) {
      const honeypot = document.createElement("input");
      honeypot.type = "text";
      honeypot.name = "website";
      honeypot.tabIndex = -1;
      honeypot.autocomplete = "off";
      honeypot.setAttribute("aria-hidden", "true");
      honeypot.style.position = "absolute";
      honeypot.style.left = "-9999px";
      form.prepend(honeypot);
    }

    form.addEventListener("input", () => clearFieldErrors(form));

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!form.reportValidity() || !isLikelyLegitInquiry(form)) {
        setStatus(
          form,
          "error",
          "Bitte prüfen Sie Ihre Angaben. Für ein Angebot benötigen wir vollständige, realistische Kontaktdaten und Adressen."
        );
        return;
      }

      const button = form.querySelector(".request-form__submit");
      const originalText = button?.textContent;

      if (button) {
        button.disabled = true;
        button.textContent = "Wird gesendet...";
      }

      setStatus(form, "pending", "Ihre Anfrage wird gesendet.");

      try {
        const response = await fetch(
          "https://srnynewvauzymnljqskj.supabase.co/functions/v1/anfrage",
          {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(serialize(form)),
          }
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }

        form.reset();
        setStatus(
          form,
          "success",
          "Vielen Dank. Ihre Anfrage wurde verschickt und Sie erhalten eine Bestätigung per E-Mail."
        );
        window.dispatchEvent(
          new CustomEvent("herkules:form-submit", {
            detail: {
              page: window.location.href,
            },
          })
        );
      } catch (error) {
        setStatus(
          form,
          "error",
          "Die Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt per E-Mail."
        );
      } finally {
        if (button) {
          button.disabled = false;
          button.textContent = originalText;
        }
      }
    });
  });
})();
