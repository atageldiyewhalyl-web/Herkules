const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const fieldLabels: Record<string, string> = {
  name: "Name",
  phone: "Telefon",
  email: "E-Mail",
  service: "Service",
  "moving-date": "Umzugsdatum",
  "apartment-floor": "Etage der Wohnung",
  "destination-floor": "Etage der Zielwohnung",
  "has-elevator": "Aufzug vorhanden",
  "parking-available": "Parkplatz verfügbar",
  "lead-source": "Gefunden über",
  "loading-address": "Beladestelle",
  "unloading-address": "Entladestelle",
  message: "Nachricht",
  page: "Seite",
};

const requiredFields = [
  "name",
  "phone",
  "email",
  "service",
  "moving-date",
  "lead-source",
  "loading-address",
];

const maxFieldLength = 2000;
const randomTextPattern = /^(.)\1{2,}$|^[a-z]{8,}$/i;
const floorPattern = /\b(eg|erdgeschoss|kg|souterrain|hochparterre|dachgeschoss|dg|[0-9]{1,2}\.?\s*(og|stock|etage)?)\b/i;

function jsonResponse(status: number, payload: Record<string, unknown>) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}

function sanitize(value: unknown) {
  return String(value || "")
    .replace(/\r/g, "")
    .trim()
    .slice(0, maxFieldLength);
}

function escapeHtml(value: unknown) {
  return sanitize(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalize(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function hasRandomText(value: string) {
  const text = normalize(value);
  if (!text) {
    return false;
  }

  const lettersOnly = text.replace(/[^a-zäöüß]/gi, "");
  const vowelCount = (lettersOnly.match(/[aeiouäöü]/gi) || []).length;
  const words = text.split(/\s+/).filter(Boolean);

  return (
    randomTextPattern.test(text) ||
    (lettersOnly.length >= 7 && vowelCount === 0) ||
    words.some((word) => word.length >= 14 && !/[aeiouäöü]/i.test(word))
  );
}

function isValidName(value: string) {
  const text = normalize(value);
  if (text.length < 5 || text.length > 80 || hasRandomText(text)) {
    return false;
  }

  const parts = text.split(/[\s-]+/).filter(Boolean);
  return parts.length >= 2 && parts.every((part) => /^[A-Za-zÀ-ÖØ-öø-ÿ.'-]{2,}$/.test(part));
}

function isValidPhone(value: string) {
  const text = normalize(value);
  const digits = text.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 16 && /^[+()0-9\s/-]+$/.test(text);
}

function isValidMovingDate(value: string) {
  if (!value) {
    return false;
  }

  const selected = new Date(`${value}T00:00:00`);
  if (Number.isNaN(selected.getTime())) {
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const twoYearsFromNow = new Date(today);
  twoYearsFromNow.setFullYear(today.getFullYear() + 2);

  return selected >= today && selected <= twoYearsFromNow;
}

function isValidAddress(value: string) {
  const text = normalize(value);
  const hasStreetNumber = /\b\d+[a-z]?\b/i.test(text);
  const hasPostalCode = /\b(?=[A-Z0-9 -]{4,10}\b)(?=[A-Z0-9 -]*\d)[A-Z0-9][A-Z0-9 -]{2,8}[A-Z0-9]\b/i.test(text);
  const hasLetters = /[A-Za-zÀ-ÖØ-öø-ÿ]{3,}/.test(text);

  return text.length >= 12 && !hasRandomText(text) && hasStreetNumber && hasPostalCode && hasLetters;
}

function isValidFloor(value: string) {
  const text = normalize(value);
  return text.length <= 40 && floorPattern.test(text);
}

function validateInquiry(fields: Record<string, string>, body: Record<string, unknown>) {
  if (sanitize(body.website)) {
    return "Bitte prüfen Sie die Pflichtfelder.";
  }

  const missing = requiredFields.filter((key) => !fields[key]);
  if (missing.length || !isEmail(fields.email)) {
    return "Bitte prüfen Sie die Pflichtfelder.";
  }

  if (!isValidName(fields.name)) {
    return "Bitte geben Sie Vor- und Nachnamen an.";
  }

  if (!isValidPhone(fields.phone)) {
    return "Bitte geben Sie eine erreichbare Telefonnummer an.";
  }

  if (!isValidMovingDate(fields["moving-date"])) {
    return "Bitte wählen Sie ein realistisches Umzugsdatum in der Zukunft.";
  }

  if (!isValidAddress(fields["loading-address"])) {
    return "Bitte geben Sie die Beladestelle mit Straße, Hausnummer, PLZ und Ort an.";
  }

  if (fields["unloading-address"] && !isValidAddress(fields["unloading-address"])) {
    return "Bitte geben Sie die Entladestelle mit Straße, Hausnummer, PLZ und Ort an.";
  }

  if (fields["apartment-floor"] && !isValidFloor(fields["apartment-floor"])) {
    return "Bitte geben Sie eine realistische Etage an.";
  }

  if (fields["destination-floor"] && !isValidFloor(fields["destination-floor"])) {
    return "Bitte geben Sie eine realistische Zieletage an.";
  }

  return "";
}

function parseRecipients(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function collectFields(body: Record<string, unknown>) {
  const fields: Record<string, string> = {};
  for (const key of Object.keys(fieldLabels)) {
    fields[key] = sanitize(body[key]);
  }
  return fields;
}

function buildOwnerEmail(fields: Record<string, string>) {
  const rows = Object.entries(fieldLabels)
    .map(([key, label]) => {
      const value = fields[key] || "-";
      return `<tr><th align="left" style="padding:8px 12px;border-bottom:1px solid #e6e8ee;">${escapeHtml(label)}</th><td style="padding:8px 12px;border-bottom:1px solid #e6e8ee;">${escapeHtml(value).replace(/\n/g, "<br>")}</td></tr>`;
    })
    .join("");

  const text = Object.entries(fieldLabels)
    .map(([key, label]) => `${label}: ${fields[key] || "-"}`)
    .join("\n");

  return {
    subject: `Neue Anfrage: ${fields.service || "Umzug"} - ${fields.name}`,
    text,
    html: `
      <div style="font-family:Arial,sans-serif;color:#172033;line-height:1.5;">
        <h1 style="font-size:22px;margin:0 0 16px;">Neue Anfrage über die Website</h1>
        <table cellspacing="0" cellpadding="0" style="border-collapse:collapse;width:100%;max-width:720px;border:1px solid #e6e8ee;">
          ${rows}
        </table>
      </div>
    `,
  };
}

function buildClientEmail(fields: Record<string, string>) {
  return {
    subject: "Ihre Anfrage bei Herkules Umzüge ist eingegangen",
    text: [
      `Hallo ${fields.name},`,
      "",
      "vielen Dank für Ihre Anfrage. Wir haben Ihre Angaben erhalten und melden uns zeitnah bei Ihnen.",
      "",
      "Ihre Angaben:",
      `Service: ${fields.service}`,
      `Umzugsdatum: ${fields["moving-date"]}`,
      `Etage der Wohnung: ${fields["apartment-floor"]}`,
      `Etage der Zielwohnung: ${fields["destination-floor"]}`,
      `Aufzug vorhanden: ${fields["has-elevator"]}`,
      `Parkplatz verfügbar: ${fields["parking-available"]}`,
      `Gefunden über: ${fields["lead-source"]}`,
      `Beladestelle: ${fields["loading-address"]}`,
      `Entladestelle: ${fields["unloading-address"]}`,
      fields.message ? `Nachricht: ${fields.message}` : "",
      "",
      "Herkules Umzüge & Transporte e.K.",
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <div style="font-family:Arial,sans-serif;color:#172033;line-height:1.6;">
        <h1 style="font-size:22px;margin:0 0 16px;">Vielen Dank für Ihre Anfrage</h1>
        <p>Hallo ${escapeHtml(fields.name)},</p>
        <p>wir haben Ihre Angaben erhalten und melden uns zeitnah bei Ihnen.</p>
        <p><strong>Service:</strong> ${escapeHtml(fields.service)}<br>
        <strong>Umzugsdatum:</strong> ${escapeHtml(fields["moving-date"])}<br>
        <strong>Etage der Wohnung:</strong> ${escapeHtml(fields["apartment-floor"])}<br>
        <strong>Etage der Zielwohnung:</strong> ${escapeHtml(fields["destination-floor"])}<br>
        <strong>Aufzug vorhanden:</strong> ${escapeHtml(fields["has-elevator"])}<br>
        <strong>Parkplatz verfügbar:</strong> ${escapeHtml(fields["parking-available"])}<br>
        <strong>Gefunden über:</strong> ${escapeHtml(fields["lead-source"])}<br>
        <strong>Beladestelle:</strong> ${escapeHtml(fields["loading-address"])}<br>
        <strong>Entladestelle:</strong> ${escapeHtml(fields["unloading-address"])}</p>
        <p>Herkules Umzüge &amp; Transporte e.K.</p>
      </div>
    `,
  };
}

async function insertAnfrage(fields: Record<string, string>, req: Request) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase insert is not configured");
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/anfragen`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
    body: JSON.stringify({
      name: fields.name,
      phone: fields.phone,
      email: fields.email,
      service: fields.service,
      moving_date: fields["moving-date"],
      loading_address: fields["loading-address"],
      unloading_address: fields["unloading-address"],
      message: fields.message || null,
      page: fields.page || null,
      metadata: {
        apartmentFloor: fields["apartment-floor"] || null,
        destinationFloor: fields["destination-floor"] || null,
        hasElevator: fields["has-elevator"] || null,
        parkingAvailable: fields["parking-available"] || null,
        leadSource: fields["lead-source"] || null,
        userAgent: req.headers.get("user-agent"),
        referer: req.headers.get("referer"),
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Supabase insert failed: ${response.status} ${await response.text()}`);
  }

  const rows = await response.json();
  return rows[0] as { id: string };
}

async function updateEmailStatus(id: string, updates: Record<string, unknown>) {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    return;
  }

  const response = await fetch(
    `${supabaseUrl.replace(/\/$/, "")}/rest/v1/anfragen?id=eq.${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    },
  );

  if (!response.ok) {
    console.error(`Supabase update failed: ${response.status} ${await response.text()}`);
  }
}

async function sendEmail(payload: Record<string, unknown>) {
  const resendApiKey = Deno.env.get("RESEND_API_KEY");

  if (!resendApiKey) {
    throw new Error("Resend is not configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Resend rejected email: ${response.status} ${await response.text()}`);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch (_error) {
    return jsonResponse(400, { error: "Invalid JSON" });
  }

  const fields = collectFields(body);
  const validationError = validateInquiry(fields, body);

  if (validationError) {
    return jsonResponse(400, { error: validationError });
  }

  let anfrage: { id: string } | null = null;

  try {
    anfrage = await insertAnfrage(fields, req);
  } catch (error) {
    console.error(error);
    return jsonResponse(502, { error: "Die Anfrage konnte nicht gespeichert werden." });
  }

  const adminEmail = parseRecipients(
    Deno.env.get("ADMIN_EMAIL") ||
      "info@herkules-umzuege24.de,atageldiyewhalyl@gmail.com,halyl@xn--nll-hoa.com",
  );
  const from = Deno.env.get("MAIL_FROM") || "Herkules Umzüge <onboarding@resend.dev>";
  const replyTo = adminEmail[0] || "info@herkules-umzuege24.de";
  const ownerMessage = buildOwnerEmail(fields);
  const clientMessage = buildClientEmail(fields);

  try {
    for (const recipient of adminEmail) {
      await sendEmail({
        from,
        to: recipient,
        reply_to: fields.email,
        subject: ownerMessage.subject,
        text: ownerMessage.text,
        html: ownerMessage.html,
      });
    }

    await sendEmail({
      from,
      to: fields.email,
      reply_to: replyTo,
      subject: clientMessage.subject,
      text: clientMessage.text,
      html: clientMessage.html,
    });

    await updateEmailStatus(anfrage.id, {
      email_sent: true,
      email_error: null,
    });
  } catch (error) {
    console.error(error);
    await updateEmailStatus(anfrage.id, {
      email_sent: false,
      email_error: sanitize(error instanceof Error ? error.message : String(error)),
    });
    return jsonResponse(502, { error: "Die Anfrage wurde gespeichert, aber die E-Mail konnte nicht gesendet werden." });
  }

  return jsonResponse(200, { ok: true });
});
