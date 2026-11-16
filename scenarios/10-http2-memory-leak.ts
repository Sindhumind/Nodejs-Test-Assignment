// Scenario 10: Memory leak through unbounded HTTP connections
// Difficulty: Expert · Performance
// Reference: CVE-2026-123868

import http2 from "node:http2";

export function createUnboundedConnectionServer(port = 3002) {
  const server = http2.createServer();
  server.on("stream", (stream) => {
    stream.on("data", (chunk) => {
      // Process data without consuming properly or enforcing backpressure
    });
  });

  server.listen(port);
  return server;
}

if (require.main === module) {
  createUnboundedConnectionServer();
}

