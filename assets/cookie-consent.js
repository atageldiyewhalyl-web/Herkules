(function () {
  const storageKey = "herkules_cookie_consent_v1";
  const consentEvent = "herkules:cookie-consent";
  const settingsEvent = "herkules:open-cookie-settings";

  const categories = [
    {
      id: "analytics",
      title: "Analytics",
      description:
        "Hilft uns zu verstehen, wie die Website genutzt wird, damit wir Inhalte verbessern können.",
    },
    {
      id: "marketing",
      title: "Marketing",
      description:
        "Erlaubt Kampagnenmessung oder Remarketing, falls solche Dienste eingebunden werden.",
    },
    {
      id: "externalMedia",
      title: "Externe Medien",
      description:
        "Erlaubt Inhalte und Dienste von Drittanbietern wie Karten, Videos oder Buchungstools.",
    },
  ];

  function defaultConsent() {
    return {
      necessary: true,
      analytics: false,
      marketing: false,
      externalMedia: false,
      updatedAt: "",
    };
  }

  function isConsent(value) {
    return (
      value &&
      value.necessary === true &&
      typeof value.analytics === "boolean" &&
      typeof value.marketing === "boolean" &&
      typeof value.externalMedia === "boolean"
    );
  }

  function getStoredConsent() {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (!stored) return null;
      const parsed = JSON.parse(stored);
      return isConsent(parsed) ? parsed : null;
    } catch (error) {
      return null;
    }
  }

  function publishConsent(consent) {
    window.dispatchEvent(new CustomEvent(consentEvent, { detail: consent }));
  }

  function storeConsent(choices) {
    const consent = {
      necessary: true,
      analytics: Boolean(choices.analytics),
      marketing: Boolean(choices.marketing),
      externalMedia: Boolean(choices.externalMedia),
      updatedAt: new Date().toISOString(),
    };

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(consent));
    } catch (error) {
      // Consent still applies for this page view even when storage is blocked.
    }

    publishConsent(consent);
    return consent;
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function createToggle(category, choices) {
    const row = createElement("label", "cookie-consent__choice");
    const copy = createElement("span", "cookie-consent__choice-copy");
    const title = createElement("strong", "", category.title);
    const description = createElement("span", "", category.description);
    const input = document.createElement("input");
    const visual = createElement("span", "cookie-consent__switch");

    input.type = "checkbox";
    input.name = category.id;
    input.checked = choices[category.id];
    input.setAttribute("aria-label", `${category.title} ein- oder ausschalten`);

    copy.append(title, description);
    row.append(copy, input, visual);

    return row;
  }

  function renderBanner() {
    const stored = getStoredConsent();
    if (stored) {
      publishConsent(stored);
      return;
    }

    showBanner(false, defaultConsent());
  }

  function showBanner(showSettings, consent) {
    const existing = document.querySelector(".cookie-consent");
    if (existing) existing.remove();

    const choices = {
      analytics: consent.analytics,
      marketing: consent.marketing,
      externalMedia: consent.externalMedia,
    };

    const shell = createElement("section", "cookie-consent");
    shell.setAttribute("aria-labelledby", "cookie-consent-title");

    const panel = createElement("div", "cookie-consent__panel");
    const intro = createElement("div", "cookie-consent__intro");
    const badge = createElement("span", "cookie-consent__badge", "DSGVO");
    const content = createElement("div", "cookie-consent__content");
    const title = createElement("h2", "", "Cookie-Einstellungen");
    const text = createElement(
      "p",
      "",
      "Wir verwenden notwendige Technologien für den Betrieb der Website. Optionale Dienste für Analyse, Marketing oder externe Medien nutzen wir nur mit Ihrer Einwilligung."
    );
    const note = createElement("p", "cookie-consent__note", "Sie können Ihre Auswahl jederzeit ändern.");

    title.id = "cookie-consent-title";
    content.append(title, text, note);
    intro.append(badge, content);
    panel.append(intro);

    let settings = null;

    if (showSettings) {
      settings = createElement("div", "cookie-consent__settings");

      const necessary = createElement("div", "cookie-consent__choice cookie-consent__choice--locked");
      const necessaryCopy = createElement("span", "cookie-consent__choice-copy");
      necessaryCopy.append(
        createElement("strong", "", "Notwendige Cookies"),
        createElement(
          "span",
          "",
          "Erforderlich für Sicherheit, Formularfunktionen und die Speicherung Ihrer Cookie-Auswahl."
        )
      );
      necessary.append(necessaryCopy, createElement("span", "cookie-consent__locked", "Immer aktiv"));
      settings.append(necessary);

      categories.forEach((category) => {
        settings.append(createToggle(category, choices));
      });

      panel.append(settings);
    }

    const actions = createElement("div", "cookie-consent__actions");
    const settingsButton = createElement("button", "cookie-consent__link", "Einstellungen");
    const rejectButton = createElement("button", "button button--secondary cookie-consent__button", "Ablehnen");
    const saveButton = createElement("button", "button button--secondary cookie-consent__button", "Auswahl speichern");
    const acceptButton = createElement("button", "button button--primary cookie-consent__button", "Alle akzeptieren");

    settingsButton.type = "button";
    rejectButton.type = "button";
    saveButton.type = "button";
    acceptButton.type = "button";

    settingsButton.addEventListener("click", () => showBanner(!showSettings, { necessary: true, ...choices }));
    rejectButton.addEventListener("click", () => {
      storeConsent({ analytics: false, marketing: false, externalMedia: false });
      shell.remove();
    });
    saveButton.addEventListener("click", () => {
      const formChoices = { ...choices };
      shell.querySelectorAll(".cookie-consent__choice input").forEach((input) => {
        formChoices[input.name] = input.checked;
      });
      storeConsent(formChoices);
      shell.remove();
    });
    acceptButton.addEventListener("click", () => {
      storeConsent({ analytics: true, marketing: true, externalMedia: true });
      shell.remove();
    });

    const buttonGroup = createElement("div", "cookie-consent__button-group");
    if (showSettings) buttonGroup.append(saveButton);
    buttonGroup.append(rejectButton, acceptButton);
    actions.append(settingsButton, buttonGroup);
    panel.append(actions);
    shell.append(panel);
    document.body.append(shell);
  }

  window.herkulesCookieConsent = {
    get: getStoredConsent,
    has(category) {
      return getStoredConsent()?.[category] === true;
    },
    openSettings() {
      showBanner(true, getStoredConsent() || defaultConsent());
    },
    run(category, callback) {
      if (this.has(category)) {
        callback();
        return;
      }

      const handler = (event) => {
        if (event.detail?.[category]) {
          callback();
          window.removeEventListener(consentEvent, handler);
        }
      };

      window.addEventListener(consentEvent, handler);
    },
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-cookie-settings]");
    if (!trigger) return;
    event.preventDefault();
    window.dispatchEvent(new Event(settingsEvent));
  });

  window.addEventListener(settingsEvent, () => {
    showBanner(true, getStoredConsent() || defaultConsent());
  });

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderBanner);
  } else {
    renderBanner();
  }
})();
