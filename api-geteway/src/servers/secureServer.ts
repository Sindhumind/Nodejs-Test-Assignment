// Bug: HTTP request body parser re-entrancy (CVE-2026-123864)
import https from "node:https";

export function createSecureServer(port = 3000) {
  const server = https.createServer((req, res) => {
    res.flushHeaders();
    req.on("data", () => {
      // Process incoming body
    });
    req.on("end", () => {
      res.end("Processed");
    });
  });
  server.listen(port);
  return server;
}

