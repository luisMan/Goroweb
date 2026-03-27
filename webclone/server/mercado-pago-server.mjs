import { createServer } from "node:http";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const protectedEnvKeys = new Set(Object.keys(process.env));

loadEnvFile(path.join(projectRoot, ".env"));
loadEnvFile(path.join(projectRoot, ".env.local"), true);

const port = Number.parseInt(process.env.MERCADO_PAGO_SERVER_PORT ?? "8787", 10);
const apiBaseUrl = process.env.MERCADO_PAGO_API_BASE_URL ?? "https://api.mercadopago.com";
const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN ?? "";
const frontendOrigin = normalizeHttpUrl(process.env.MERCADO_PAGO_FRONTEND_ORIGIN ?? "");
const defaultStatementDescriptor = (process.env.MERCADO_PAGO_STATEMENT_DESCRIPTOR ?? "").trim();
const notificationUrl = normalizeHttpUrl(process.env.MERCADO_PAGO_NOTIFICATION_URL ?? "");
const explicitBackUrls = {
  approved: normalizeHttpUrl(process.env.MERCADO_PAGO_SUCCESS_URL ?? ""),
  failure: normalizeHttpUrl(process.env.MERCADO_PAGO_FAILURE_URL ?? ""),
  pending: normalizeHttpUrl(process.env.MERCADO_PAGO_PENDING_URL ?? "")
};

const server = createServer(async (request, response) => {
  const origin = normalizeHttpUrl(request.headers.origin ?? "") || frontendOrigin;
  setCorsHeaders(response, origin);

  if (request.method === "OPTIONS") {
    response.writeHead(204);
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/health") {
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ ok: true }));
    return;
  }

  if (request.method === "POST" && request.url === "/api/mercado-pago/preferences") {
    await handleCreatePreference(request, response, origin);
    return;
  }

  response.writeHead(404, { "Content-Type": "application/json" });
  response.end(JSON.stringify({ error: "Not found." }));
});

server.listen(port, () => {
  console.log(`Mercado Pago server listening on http://localhost:${port}`);
});

async function handleCreatePreference(request, response, requestOrigin) {
  if (!accessToken) {
    writeJson(response, 500, {
      error: "Missing Mercado Pago access token. Set MERCADO_PAGO_ACCESS_TOKEN in your environment."
    });
    return;
  }

  try {
    const body = await readJsonBody(request);
    const items = normalizeItems(body?.items);

    if (!items.length) {
      writeJson(response, 400, { error: "At least one valid cart item is required." });
      return;
    }

    const baseReturnUrl = normalizeHttpUrl(body?.origin) || requestOrigin || frontendOrigin;
    if (!baseReturnUrl) {
      writeJson(response, 400, {
        error: "Missing application origin. Set MERCADO_PAGO_FRONTEND_ORIGIN or send an origin value."
      });
      return;
    }

    const mercadoPagoResponse = await fetch(`${apiBaseUrl}/checkout/preferences`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        "X-Idempotency-Key": randomUUID()
      },
      body: JSON.stringify({
        items: items.map((item) => ({
          id: item.id,
          title: item.title,
          quantity: item.quantity,
          currency_id: item.currencyCode,
          unit_price: item.unitPrice,
          picture_url: item.pictureUrl
        })),
        back_urls: buildBackUrls(baseReturnUrl),
        auto_return: "approved",
        notification_url: notificationUrl || undefined,
        statement_descriptor: defaultStatementDescriptor || undefined,
        external_reference: randomUUID()
      })
    });

    const payload = await mercadoPagoResponse.json().catch(() => null);

    if (!mercadoPagoResponse.ok) {
      writeJson(response, mercadoPagoResponse.status, {
        error: extractMercadoPagoError(payload) || "Mercado Pago rejected the preference request."
      });
      return;
    }

    if (!payload?.id || !payload?.init_point) {
      writeJson(response, 502, {
        error: "Mercado Pago returned an incomplete preference response."
      });
      return;
    }

    writeJson(response, 200, {
      preferenceId: payload.id,
      initPoint: payload.init_point,
      sandboxInitPoint: payload.sandbox_init_point || undefined
    });
  } catch (error) {
    writeJson(response, 500, {
      error: error instanceof Error ? error.message : "Unexpected Mercado Pago server error."
    });
  }
}

function buildBackUrls(baseReturnUrl) {
  return {
    success: explicitBackUrls.approved || `${baseReturnUrl}/cart?checkout_status=approved`,
    failure: explicitBackUrls.failure || `${baseReturnUrl}/cart?checkout_status=failure`,
    pending: explicitBackUrls.pending || `${baseReturnUrl}/cart?checkout_status=pending`
  };
}

function normalizeItems(input) {
  if (!Array.isArray(input)) return [];

  return input
    .map((item) => ({
      id: String(item?.id ?? "").trim(),
      title: String(item?.title ?? "").trim(),
      quantity: Number(item?.quantity ?? 0),
      unitPrice: Number(item?.unitPrice ?? 0),
      currencyCode: String(item?.currencyCode ?? "MXN").trim().toUpperCase(),
      pictureUrl: String(item?.pictureUrl ?? "").trim()
    }))
    .filter(
      (item) =>
        item.id &&
        item.title &&
        Number.isFinite(item.quantity) &&
        item.quantity > 0 &&
        Number.isFinite(item.unitPrice) &&
        item.unitPrice > 0 &&
        item.currencyCode
    );
}

async function readJsonBody(request) {
  const chunks = [];

  for await (const chunk of request) {
    chunks.push(chunk);
  }

  const rawBody = Buffer.concat(chunks).toString("utf8").trim();
  if (!rawBody) return {};

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

function extractMercadoPagoError(payload) {
  if (!payload || typeof payload !== "object") return "";
  if (typeof payload.message === "string" && payload.message) return payload.message;
  if (typeof payload.error === "string" && payload.error) return payload.error;
  if (Array.isArray(payload.cause) && payload.cause.length) {
    const detail = payload.cause
      .map((entry) => entry?.description || entry?.code || "")
      .filter(Boolean)
      .join("; ");
    if (detail) return detail;
  }

  return "";
}

function setCorsHeaders(response, origin) {
  if (origin) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }

  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
}

function writeJson(response, statusCode, payload) {
  response.writeHead(statusCode, { "Content-Type": "application/json" });
  response.end(JSON.stringify(payload));
}

function normalizeHttpUrl(value) {
  const trimmed = String(value ?? "").trim();
  if (!trimmed) return "";

  try {
    const parsed = new URL(trimmed);
    return parsed.origin + parsed.pathname.replace(/\/$/, "");
  } catch {
    return "";
  }
}

function loadEnvFile(filePath, overrideExisting = false) {
  const envContents = tryReadFile(filePath);
  if (!envContents) return;

  envContents.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    const value = stripWrappingQuotes(rawValue);

    if (protectedEnvKeys.has(key)) {
      return;
    }

    if (overrideExisting || !(key in process.env)) {
      process.env[key] = value;
    }
  });
}

function stripWrappingQuotes(value) {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}

function tryReadFile(filePath) {
  try {
    return readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}
