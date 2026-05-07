(function () {
  const googleAdsId = "AW-16491597405";
  const conversionLabels = {
    phone: "evzqCLrP36AZEN2c57c9",
    email: "acJ2COKC9KgcEN2c57c9",
    form: "XW9XCOyV36AZEN2c57c9",
  };

  let loaded = false;
  const pendingConversions = [];

  function hasConsent(category) {
    return window.herkulesCookieConsent?.has(category) === true;
  }

  function loadGoogleTag() {
    if (loaded || !hasConsent("marketing")) return;
    loaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    window.gtag("js", new Date());
    window.gtag("config", googleAdsId, {
      anonymize_ip: true,
      allow_ad_personalization_signals: false,
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${googleAdsId}`;
    document.head.append(script);

    while (pendingConversions.length) {
      sendConversion(pendingConversions.shift());
    }
  }

  function sendConversion(type) {
    if (!conversionLabels[type]) return;
    if (!loaded) {
      pendingConversions.push(type);
      loadGoogleTag();
      return;
    }

    window.gtag("event", "conversion", {
      send_to: `${googleAdsId}/${conversionLabels[type]}`,
    });
  }

  function trackConversion(type) {
    if (!hasConsent("marketing")) return;
    sendConversion(type);
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    if (href.startsWith("tel:")) {
      trackConversion("phone");
    } else if (href.startsWith("mailto:")) {
      trackConversion("email");
    }
  });

  window.addEventListener("herkules:form-submit", () => {
    trackConversion("form");
  });

  window.addEventListener("herkules:cookie-consent", loadGoogleTag);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadGoogleTag);
  } else {
    loadGoogleTag();
  }
})();
