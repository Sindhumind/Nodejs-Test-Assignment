// Scenario 12: HTTP/2 header processing buffer overflow
// Difficulty: Expert · Native memory
// Reference: CVE-2026-123828

import http2 from "node:http2";

export function createHttp2HeaderServer(port = 3003) {
  const server = http2.createServer();
  server.on("session", (session) => {
    session.on("error", console.error);
  });

  server.listen(port);
  return server;
}

if (require.main === module) {
  createHttp2HeaderServer();
}

