#!/usr/bin/env node
/** Dependency-free local server with a development contact endpoint. */

import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const argumentsList = process.argv.slice(2);
const portIndex = argumentsList.indexOf("--port");
const port = Number(portIndex >= 0 ? argumentsList[portIndex + 1] : process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".zip": "application/zip",
  ".svg": "image/svg+xml",
};

function json(response, statusCode, body) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(body));
}

async function readJson(request) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 32 * 1024) throw new Error("Payload too large");
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

async function handleContact(request, response) {
  try {
    const body = await readJson(request);
    const name = String(body.name || "").trim();
    const email = String(body.email || "").trim();
    const message = String(body.message || "").trim();
    if (!name || !email || !message) return json(response, 400, { error: "All fields are required" });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(response, 400, { error: "Invalid email address" });
    // Development endpoint: validates the complete client flow without persisting PII.
    console.log(`[contact] validated message (${message.length} chars); no development data persisted`);
    return json(response, 200, { success: true, message: "Message received" });
  } catch (error) {
    return json(response, error.message === "Payload too large" ? 413 : 400, { error: error.message });
  }
}

function safeFilePath(urlPath) {
  const decoded = decodeURIComponent(urlPath.split("?")[0]);
  const requestPath = decoded === "/" ? "/index.html" : decoded;
  const relativePath = normalize(requestPath).replace(/^([/\\])+/, "");
  const absolute = resolve(root, relativePath);
  return absolute === root || absolute.startsWith(`${root}${sep}`) ? absolute : null;
}

const server = createServer(async (request, response) => {
  if (request.method === "POST" && request.url?.split("?")[0] === "/api/contact") {
    await handleContact(request, response);
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    response.writeHead(405, { Allow: "GET, HEAD, POST" });
    response.end("Method not allowed");
    return;
  }

  const absolute = safeFilePath(request.url || "/");
  if (!absolute || !existsSync(absolute) || !statSync(absolute).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("DrufiyAI route not found");
    return;
  }

  const stats = statSync(absolute);
  response.writeHead(200, {
    "Content-Type": mimeTypes[extname(absolute).toLowerCase()] || "application/octet-stream",
    "Content-Length": stats.size,
    "Cache-Control": "no-cache",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
  if (request.method === "HEAD") response.end();
  else createReadStream(absolute).pipe(response);
});

server.listen(port, host, () => {
  console.log(`DrufiyAI immersive experience running at http://${host}:${port}`);
  console.log("Routes: /, /lear.html, /prash.html, /method.html, /principles.html, /signal-map.html");
});
