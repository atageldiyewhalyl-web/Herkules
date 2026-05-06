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
  "loading-address",
  "unloading-address",
];

const maxFieldLength = 2000;

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
  const missing = requiredFields.filter((key) => !fields[key]);

  if (missing.length || !isEmail(fields.email)) {
    return jsonResponse(400, { error: "Bitte prüfen Sie die Pflichtfelder." });
  }

  let anfrage: { id: string } | null = null;

  try {
    anfrage = await insertAnfrage(fields, req);
  } catch (error) {
    console.error(error);
    return jsonResponse(502, { error: "Die Anfrage konnte nicht gespeichert werden." });
  }

  const adminEmail = Deno.env.get("ADMIN_EMAIL") || "atageldiyewhalyl@gmail.com";
  const from = Deno.env.get("MAIL_FROM") || "Herkules Umzüge <onboarding@resend.dev>";
  const ownerMessage = buildOwnerEmail(fields);

  try {
    await sendEmail({
      from,
      to: adminEmail,
      reply_to: fields.email,
      subject: ownerMessage.subject,
      text: ownerMessage.text,
      html: ownerMessage.html,
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
