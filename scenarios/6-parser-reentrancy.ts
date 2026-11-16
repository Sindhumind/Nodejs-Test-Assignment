// Scenario 6: HTTP request body parser re-entrancy
// Difficulty: Expert · Runtime internals
// Reference: CVE-2026-123864

import https from "node:https";

export function createReentrantParserServer(port = 3000) {
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

if (require.main === module) {
  createReentrantParserServer();
}

