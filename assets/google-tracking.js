(function () {
  const ga4Id = "G-GZCDZCCMVH";
  const gtmId = "GTM-NFX2W3T8";
  const googleAdsId = "AW-16491597405";
  const conversionLabels = {
    phone: "evzqCLrP36AZEN2c57c9",
    email: "acJ2COKC9KgcEN2c57c9",
    form: "XW9XCOyV36AZEN2c57c9",
  };

  let gtagLoaded = false;
  let ga4Configured = false;
  let adsConfigured = false;
  let gtmLoaded = false;
  const pendingConversions = [];
  const pendingGa4Events = [];

  function hasConsent(category) {
    return window.herkulesCookieConsent?.has(category) === true;
  }

  function ensureDataLayer() {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag() {
        window.dataLayer.push(arguments);
      };
  }

  function loadGoogleTagScript() {
    if (gtagLoaded) return;
    gtagLoaded = true;

    ensureDataLayer();

    window.gtag("js", new Date());

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ga4Id}`;
    document.head.append(script);
  }

  function configureGa4() {
    if (ga4Configured || !hasConsent("analytics")) return;
    ga4Configured = true;

    loadGoogleTagScript();
    window.gtag("config", ga4Id, {
      anonymize_ip: true,
      send_page_view: true,
    });

    while (pendingGa4Events.length) {
      sendGa4Event(pendingGa4Events.shift());
    }
  }

  function configureAds() {
    if (adsConfigured || !hasConsent("marketing")) return;
    adsConfigured = true;

    loadGoogleTagScript();
    window.gtag("config", googleAdsId, {
      anonymize_ip: true,
      allow_ad_personalization_signals: false,
    });

    while (pendingConversions.length) {
      sendConversion(pendingConversions.shift());
    }
  }

  function loadGoogleTagManager() {
    if (gtmLoaded || (!hasConsent("analytics") && !hasConsent("marketing"))) return;
    gtmLoaded = true;

    ensureDataLayer();
    window.dataLayer.push({
      "gtm.start": new Date().getTime(),
      event: "gtm.js",
    });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    document.head.append(script);
  }

  function loadGoogleTools() {
    configureGa4();
    configureAds();
    loadGoogleTagManager();
  }

  function sendConversion(type) {
    if (!conversionLabels[type]) return;
    if (!adsConfigured) {
      pendingConversions.push(type);
      configureAds();
      return;
    }

    window.gtag("event", "conversion", {
      send_to: `${googleAdsId}/${conversionLabels[type]}`,
      transport_type: "beacon",
    });
  }

  function trackConversion(type) {
    if (!hasConsent("marketing")) return;
    sendConversion(type);
  }

  function sendGa4Event(event) {
    if (!event?.name) return;
    if (!ga4Configured) {
      pendingGa4Events.push(event);
      configureGa4();
      return;
    }

    window.gtag("event", event.name, {
      send_to: ga4Id,
      page_location: window.location.href,
      transport_type: "beacon",
      ...event.params,
    });
  }

  function trackGa4Event(name, params) {
    if (!hasConsent("analytics")) return;
    sendGa4Event({ name, params });
  }

  document.addEventListener("click", (event) => {
    const link = event.target.closest("a[href]");
    if (!link) return;

    const href = link.getAttribute("href") || "";
    const isPrimaryClick = event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
    if (href.startsWith("tel:")) {
      if (isPrimaryClick) event.preventDefault();
      trackGa4Event("phone_click", {
        link_url: href,
        link_text: link.textContent.trim(),
      });
      trackConversion("phone");
      if (isPrimaryClick) {
        window.setTimeout(() => {
          window.location.href = href;
        }, 250);
      }
    } else if (href.startsWith("mailto:")) {
      if (isPrimaryClick) event.preventDefault();
      trackGa4Event("email_click", {
        link_url: href,
        link_text: link.textContent.trim(),
      });
      trackConversion("email");
      if (isPrimaryClick) {
        window.setTimeout(() => {
          window.location.href = href;
        }, 250);
      }
    }
  });

  window.addEventListener("herkules:form-submit", (event) => {
    trackGa4Event("anfrage_submit", {
      form_name: "Umzugsanfrage",
      form_location: event.detail?.page || window.location.href,
    });
    trackConversion("form");
  });

  window.addEventListener("herkules:cookie-consent", loadGoogleTools);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadGoogleTools);
  } else {
    loadGoogleTools();
  }
})();
