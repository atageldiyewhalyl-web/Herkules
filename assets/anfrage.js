/* Umzugsanfrage in four steps: service and date, both addresses, photos and message, contact.
   Renders into every form.anfrage, keeps a draft in sessionStorage and posts everything,
   photos included, as multipart to the Supabase function "anfrage". */
(function () {
  const ENDPOINT = "https://srnynewvauzymnljqskj.supabase.co/functions/v1/anfrage";
  const DRAFT_KEY = "herkules-anfrage";
  const PHONE_HREF = "tel:+496218995969";
  const PHONE_LABEL = "0621 899 59 69";
  const PHOTOS = { maxCount: 8, maxEdge: 1600, maxTotalBytes: 6 * 1024 * 1024 };

  const SERVICES = [
    { value: "Privatumzüge", label: "Privatumzug", hint: "Wohnung oder Haus", img: "privatumzuege" },
    { value: "Büroumzüge", label: "Büroumzug", hint: "Firma und Praxis", img: "bueroumzuege" },
    { value: "Seniorenumzüge", label: "Seniorenumzug", hint: "In Ruhe begleitet", img: "seniorenumzuege" },
    { value: "Auslandsumzüge", label: "Auslandsumzug", hint: "Europa und weiter", img: "auslandsumzuege" },
    { value: "Halteverbotszone", label: "Halteverbotszone", hint: "Parkraum sichern", img: "halteverbotszone", oneAddress: true },
    { value: "Aussenaufzug", label: "Außenaufzug", hint: "Möbel über das Fenster", img: "aussenaufzug" },
    { value: "Umzugskartons & Verpackungsmaterial", label: "Umzugskartons", hint: "Material und Lieferung", img: "umzugskartons", oneAddress: true },
  ];
  const FLOORS = ["Souterrain", "EG", "1. OG", "2. OG", "3. OG", "4. OG", "5. OG", "6. OG", "7. OG oder höher", "DG"];
  const SOURCES = ["Google Suche", "Empfehlung", "Flyer", "Social Media", "Sonstiges"];
  const STEPS = ["Leistung", "Adressen", "Fotos", "Kontakt"];

  const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[c]);
  const norm = (value) => String(value || "").trim().replace(/\s+/g, " ");
  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };

  /* The same plausibility checks the server runs, so visitors see problems before sending */
  function looksRandom(value) {
    const text = norm(value);
    const letters = text.replace(/[^a-zäöüß]/gi, "");
    const vowels = (letters.match(/[aeiouäöü]/gi) || []).length;
    return /^(.)\1{2,}$|^[a-z]{8,}$/i.test(text) || (letters.length >= 7 && vowels === 0)
      || text.split(" ").some((word) => word.length >= 14 && !/[aeiouäöü]/i.test(word));
  }
  const isName = (value) => {
    const text = norm(value);
    const parts = text.split(/[\s-]+/).filter(Boolean);
    return text.length >= 5 && text.length <= 80 && !looksRandom(text) && parts.length >= 2
      && parts.every((part) => /^[A-Za-zÀ-ÖØ-öø-ÿ.'-]{2,}$/.test(part));
  };
  const isPhone = (value) => {
    const text = norm(value);
    const digits = text.replace(/\D/g, "").length;
    return digits >= 7 && digits <= 16 && /^[+()0-9\s/-]+$/.test(text);
  };
  const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(norm(value));
  const isDate = (value) => {
    if (!value) return false;
    const picked = new Date(`${value}T00:00:00`);
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setFullYear(start.getFullYear() + 2);
    return picked >= start && picked <= end;
  };
  const isStreet = (value) => /[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(value) && /\d/.test(value) && !looksRandom(value);
  const isZip = (value) => /^(?=.*\d)[A-Za-z0-9 -]{4,10}$/.test(norm(value));
  // Town names are often one long word ("Ludwigshafen"), so only catch repeated or vowel-less input
  const isTown = (value) => {
    const letters = norm(value).replace(/[^a-zäöüß]/gi, "");
    return letters.length >= 2 && !/^(.)\1{2,}$/.test(norm(value)) && (letters.length < 7 || /[aeiouäöüy]/i.test(letters));
  };

  /* A JPEG no larger than PHOTOS.maxEdge; the original if the browser cannot decode it */
  async function shrink(file) {
    try {
      const bitmap = await createImageBitmap(file);
      const scale = Math.min(1, PHOTOS.maxEdge / Math.max(bitmap.width, bitmap.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);
      canvas.getContext("2d").drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));
      return blob ? new File([blob], `${file.name.replace(/\.[^.]+$/, "") || "foto"}.jpg`, { type: "image/jpeg" }) : file;
    } catch (error) {
      return file;
    }
  }

  const field = (name, label, input, extra = "") =>
    `<label class="af-field ${extra}"><span class="af-label">${label}</span>${input}<span class="af-error" data-error="${name}" role="alert"></span></label>`;
  const text = (name, attrs = "") => `<input type="text" name="${name}" ${attrs} />`;
  const choice = (name, values) =>
    `<div class="af-choice" role="radiogroup">${values.map((value) =>
      `<label><input type="radio" name="${name}" value="${esc(value)}" /><span>${esc(value)}</span></label>`).join("")}</div>`;
  const floorSelect = (name) =>
    `<select name="${name}"><option value="">Etage wählen</option>${FLOORS.map((f) => `<option>${esc(f)}</option>`).join("")}</select>`;
  const address = (prefix, title, floorName, note = "") => `
    <fieldset class="af-address" data-address="${prefix}">
      <legend>${title}${note}</legend>
      <div class="af-grid af-grid--address">
        ${field(`${prefix}-street`, "Straße und Hausnummer", text(`${prefix}-street`, 'autocomplete="address-line1"'), "af-wide")}
        ${field(`${prefix}-zip`, "PLZ", text(`${prefix}-zip`, 'inputmode="numeric" autocomplete="postal-code" maxlength="10"'))}
        ${field(`${prefix}-town`, "Ort", text(`${prefix}-town`, 'autocomplete="address-level2"'))}
        ${field(floorName, "Etage", floorSelect(floorName))}
      </div>
    </fieldset>`;

  function markup() {
    return `
      <div class="af-head">
        <p class="af-title">Ihre Umzugsanfrage</p>
        <p class="af-count" aria-live="polite"></p>
      </div>
      <ol class="af-steps" aria-label="Fortschritt">${STEPS.map((label, i) =>
        `<li data-step-dot="${i}"><span class="af-dot">${i + 1}</span><span>${label}</span></li>`).join("")}</ol>
      <div class="af-trap" aria-hidden="true"><label>Website<input type="text" name="website" tabindex="-1" autocomplete="off" /></label></div>

      <fieldset class="af-panel" data-step="0">
        <legend><span class="af-h" tabindex="-1">Was planen Sie?</span></legend>
        <div class="af-services" role="radiogroup" aria-label="Leistung">${SERVICES.map((s) => `
          <label class="af-service">
            <input type="radio" name="service" value="${esc(s.value)}" />
            <img src="/assets/anfrage/${s.img}.webp" alt="" width="360" height="240" loading="lazy" decoding="async" />
            <span class="af-service__text"><b>${s.label}</b><small>${s.hint}</small></span>
          </label>`).join("")}
        </div>
        <span class="af-error" data-error="service" role="alert"></span>
        <div class="af-grid">
          ${field("moving-date", "Umzugsdatum", `<input type="date" name="moving-date" min="${today()}" />`)}
        </div>
      </fieldset>

      <fieldset class="af-panel" data-step="1" hidden>
        <legend><span class="af-h" tabindex="-1">Von wo nach wo?</span></legend>
        ${address("loading", "Beladestelle", "apartment-floor")}
        ${address("unloading", "Entladestelle", "destination-floor", ' <small class="af-optional">(falls vorhanden)</small>')}
        <div class="af-grid">
          ${field("has-elevator", "Aufzug vorhanden?", choice("has-elevator", ["Ja", "Nein"]))}
          ${field("parking-available", "Parkplatz verfügbar?", choice("parking-available", ["Ja", "Nein", "Unklar"]))}
        </div>
      </fieldset>

      <fieldset class="af-panel" data-step="2" hidden>
        <legend><span class="af-h" tabindex="-1">Fotos und Details</span></legend>
        <div class="af-photos">
          <p class="af-label">Fotos <small>(optional, bis zu ${PHOTOS.maxCount})</small></p>
          <p class="af-hint">Fotos von Zimmern, großen Möbeln und dem Treppenhaus helfen uns, Ihren Festpreis genau zu kalkulieren.</p>
          <ul class="af-photo-list"></ul>
          <span class="af-error" data-error="photos" role="alert"></span>
        </div>
        ${field("message", "Ihre Nachricht <small>(optional)</small>", '<textarea name="message" rows="4" maxlength="2000" placeholder="Wohnungsgröße, besondere Möbel wie Klavier oder Schrankwand, Packservice gewünscht …"></textarea>')}
      </fieldset>

      <fieldset class="af-panel" data-step="3" hidden>
        <legend><span class="af-h" tabindex="-1">Wie erreichen wir Sie?</span></legend>
        <div class="af-grid">
          ${field("name", "Vorname Nachname", text("name", 'autocomplete="name"'), "af-wide")}
          ${field("phone", "Telefonnummer", '<input type="tel" name="phone" autocomplete="tel" inputmode="tel" />')}
          ${field("email", "E-Mail", '<input type="email" name="email" autocomplete="email" inputmode="email" />')}
          ${field("lead-source", "Wie haben Sie uns gefunden?", `<select name="lead-source"><option value="">Bitte wählen</option>${SOURCES.map((s) => `<option>${s}</option>`).join("")}</select>`, "af-wide")}
        </div>
        <p class="af-privacy">Ihre Angaben und Fotos nutzen wir nur zur Bearbeitung Ihrer Anfrage. Mehr in der <a href="/datenschutz/" target="_blank" rel="noopener">Datenschutzerklärung</a>.</p>
      </fieldset>

      <p class="af-form-error" role="alert" hidden></p>
      <div class="af-nav">
        <button class="af-btn af-btn--back" type="button" data-back hidden>Zurück</button>
        <button class="af-btn af-btn--go" type="submit" data-next>Weiter</button>
      </div>`;
  }

  function setup(form) {
    form.noValidate = true;
    form.innerHTML = markup();
    const endpoint = form.dataset.endpoint || ENDPOINT;
    const preset = form.dataset.service || "";
    const panels = [...form.querySelectorAll("[data-step]")];
    const dots = [...form.querySelectorAll("[data-step-dot]")];
    const next = form.querySelector("[data-next]");
    const back = form.querySelector("[data-back]");
    const count = form.querySelector(".af-count");
    const formError = form.querySelector(".af-form-error");
    const photoList = form.querySelector(".af-photo-list");
    let step = 0;
    let photos = [];
    let busy = false;

    const value = (name) => {
      const el = form.elements[name];
      return el ? norm(el.value) : "";
    };
    const service = () => SERVICES.find((s) => s.value === value("service"));

    function showError(name, message) {
      const slot = form.querySelector(`[data-error="${name}"]`);
      if (slot) slot.textContent = message || "";
      const input = form.elements[name];
      const target = input && input.length && !input.tagName ? input[0] : input;
      if (target) target.closest(".af-field, .af-services")?.classList.toggle("has-error", !!message);
      if (name === "service") form.querySelector(".af-services").classList.toggle("has-error", !!message);
    }
    function clearErrors() {
      form.querySelectorAll("[data-error]").forEach((slot) => { slot.textContent = ""; });
      form.querySelectorAll(".has-error").forEach((el) => el.classList.remove("has-error"));
      formError.hidden = true;
    }

    function checkAddress(prefix, floorName, required) {
      const parts = ["street", "zip", "town"].map((p) => value(`${prefix}-${p}`));
      if (!required && !parts.some(Boolean) && !value(floorName)) return {};
      const found = {};
      if (!isStreet(parts[0])) found[`${prefix}-street`] = "Bitte Straße und Hausnummer angeben.";
      if (!isZip(parts[1])) found[`${prefix}-zip`] = "Bitte eine gültige PLZ angeben.";
      if (!isTown(parts[2])) found[`${prefix}-town`] = "Bitte den Ort angeben.";
      if (!value(floorName)) found[floorName] = "Bitte die Etage wählen.";
      return found;
    }

    function validate(index) {
      const found = {};
      if (index === 0) {
        if (!service()) found.service = "Bitte wählen Sie eine Leistung.";
        if (!isDate(value("moving-date"))) found["moving-date"] = "Bitte wählen Sie ein Datum ab heute.";
      }
      if (index === 1) {
        Object.assign(found, checkAddress("loading", "apartment-floor", true));
        Object.assign(found, checkAddress("unloading", "destination-floor", !service()?.oneAddress));
        if (!value("has-elevator")) found["has-elevator"] = "Bitte auswählen.";
        if (!value("parking-available")) found["parking-available"] = "Bitte auswählen.";
      }
      if (index === 3) {
        if (!isName(value("name"))) found.name = "Bitte Vor- und Nachnamen angeben.";
        if (!isPhone(value("phone"))) found.phone = "Bitte eine erreichbare Telefonnummer angeben.";
        if (!isEmail(value("email"))) found.email = "Bitte eine gültige E-Mail-Adresse angeben.";
        if (!value("lead-source")) found["lead-source"] = "Bitte auswählen.";
      }
      return found;
    }

    function render(focus) {
      panels.forEach((panel, i) => { panel.hidden = i !== step; });
      dots.forEach((dot, i) => {
        dot.classList.toggle("is-current", i === step);
        dot.classList.toggle("is-done", i < step);
        if (i === step) dot.setAttribute("aria-current", "step"); else dot.removeAttribute("aria-current");
      });
      count.textContent = `Schritt ${step + 1} von ${STEPS.length}`;
      back.hidden = step === 0;
      next.textContent = step === STEPS.length - 1 ? "Anfrage verschicken" : "Weiter";
      const optional = service()?.oneAddress;
      form.querySelector('[data-address="unloading"] .af-optional').hidden = !optional;
      if (focus) {
        panels[step].querySelector(".af-h").focus({ preventScroll: true });
        if (form.getBoundingClientRect().top < 80) form.scrollIntoView({ block: "start", behavior: "smooth" });
      }
    }

    /* Draft: everything but the photos survives a reload within the tab */
    function save() {
      try {
        const data = {};
        for (const el of form.elements) {
          if (!el.name || el.type === "file" || el.name === "website") continue;
          if ((el.type === "radio" || el.type === "checkbox") && !el.checked) continue;
          data[el.name] = el.value;
        }
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ data, step }));
      } catch (error) { /* storage unavailable */ }
    }
    function restore() {
      let draft = null;
      try { draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null"); } catch (error) { draft = null; }
      const data = (draft && draft.data) || {};
      if (preset && !data.service) data.service = preset;
      for (const [name, val] of Object.entries(data)) {
        const el = form.elements[name];
        if (!el) continue;
        if (el.length && !el.tagName) [...el].forEach((radio) => { radio.checked = radio.value === val; });
        else el.value = val;
      }
      step = Math.min(Math.max(Number(draft && draft.step) || 0, 0), 2);
    }

    function renderPhotos() {
      photoList.innerHTML = photos.map((p, i) =>
        `<li><img src="${p.url}" alt="${esc(p.file.name)}" /><button type="button" data-remove="${i}" aria-label="Foto ${esc(p.file.name)} entfernen">×</button></li>`).join("")
        + (photos.length < PHOTOS.maxCount
          ? `<li><label class="af-add${busy ? " is-busy" : ""}"><input type="file" accept="image/*" multiple ${busy ? "disabled" : ""} /><span class="af-add__icon" aria-hidden="true"></span><span>${busy ? "Wird vorbereitet …" : "Fotos hinzufügen"}</span></label></li>`
          : "");
    }

    async function addPhotos(input) {
      const picked = [...input.files];
      if (!picked.length) return;
      busy = true; renderPhotos();
      const room = PHOTOS.maxCount - photos.length;
      let total = photos.reduce((sum, p) => sum + p.file.size, 0);
      let problem = picked.length > room ? `Sie können bis zu ${PHOTOS.maxCount} Fotos hochladen.` : "";
      for (const original of picked.slice(0, room)) {
        if (!original.type.startsWith("image/")) { problem = "Bitte nur Bilddateien hochladen."; continue; }
        const file = await shrink(original);
        if (total + file.size > PHOTOS.maxTotalBytes) { problem = "Die Fotos sind zusammen zu groß. Bitte weniger Fotos wählen."; break; }
        total += file.size;
        photos.push({ file, url: URL.createObjectURL(file) });
      }
      busy = false; renderPhotos();
      showError("photos", problem);
    }

    photoList.addEventListener("change", (event) => {
      if (event.target.type === "file") addPhotos(event.target);
    });
    photoList.addEventListener("click", (event) => {
      const button = event.target.closest("[data-remove]");
      if (!button) return;
      const [removed] = photos.splice(Number(button.dataset.remove), 1);
      URL.revokeObjectURL(removed.url);
      renderPhotos();
      showError("photos", "");
    });

    form.addEventListener("input", (event) => {
      if (event.target.name) showError(event.target.name, "");
      save();
    });
    form.addEventListener("change", (event) => {
      if (event.target.name && event.target.type !== "file") showError(event.target.name, "");
      if (event.target.name === "service") render(false);
      save();
    });

    back.addEventListener("click", () => {
      clearErrors();
      step = Math.max(0, step - 1);
      save(); render(true);
    });

    function join(prefix) {
      const street = value(`${prefix}-street`);
      return street ? `${street}, ${value(`${prefix}-zip`)} ${value(`${prefix}-town`)}` : "";
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (busy) return;
      clearErrors();
      const found = validate(step);
      if (Object.keys(found).length) {
        Object.entries(found).forEach(([name, message]) => showError(name, message));
        const first = form.querySelector(".has-error input, .has-error select, .has-error textarea, .af-services.has-error input");
        first?.focus();
        return;
      }
      if (step < STEPS.length - 1) {
        step += 1; save(); render(true);
        return;
      }

      const body = new FormData();
      ["service", "moving-date", "apartment-floor", "destination-floor", "has-elevator", "parking-available",
        "message", "name", "phone", "email", "lead-source", "website"].forEach((name) => body.set(name, value(name)));
      body.set("loading-address", join("loading"));
      body.set("unloading-address", join("unloading"));
      body.set("page", window.location.href);
      photos.forEach((p) => body.append("photos", p.file, p.file.name));

      busy = true;
      next.disabled = back.disabled = true;
      next.textContent = photos.length ? "Wird gesendet … (Fotos werden hochgeladen)" : "Wird gesendet …";
      try {
        const response = await fetch(endpoint, { method: "POST", body });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.error || "failed");
        try { sessionStorage.removeItem(DRAFT_KEY); } catch (error) { /* storage unavailable */ }
        photos.forEach((p) => URL.revokeObjectURL(p.url));
        const first = value("name").split(" ")[0];
        form.innerHTML = `
          <div class="af-done" role="status">
            <span class="af-done__icon" aria-hidden="true"></span>
            <p class="af-h" tabindex="-1">Danke${first ? `, ${esc(first)}` : ""}! Ihre Anfrage ist da.</p>
            <p>Wir melden uns schnellstmöglich mit Ihrem Angebot. Eine Bestätigung haben wir an Ihre E-Mail-Adresse geschickt.</p>
            <p class="af-hint">Eilig? Rufen Sie uns an: <a href="${PHONE_HREF}">${PHONE_LABEL}</a></p>
          </div>`;
        form.querySelector(".af-h").focus();
        window.dispatchEvent(new CustomEvent("herkules:form-submit", { detail: { page: window.location.href } }));
      } catch (error) {
        busy = false;
        next.disabled = back.disabled = false;
        next.textContent = "Anfrage verschicken";
        // A TypeError means the request never got an answer (Safari: "Load failed"); only show server messages
        formError.textContent = !(error instanceof TypeError) && error.message && error.message !== "failed"
          ? error.message
          : `Die Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut oder rufen Sie uns an: ${PHONE_LABEL}.`;
        formError.hidden = false;
      }
    });

    restore();
    renderPhotos();
    render(false);
  }

  document.querySelectorAll("form.anfrage").forEach(setup);
})();
