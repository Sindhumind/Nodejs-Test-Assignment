// Scenario 7: HTTP/2 stream lifecycle and use-after-free
// Difficulty: Expert · Memory management
// Reference: CVE-2026-123866

import http2 from "node:http2";

export function createHttp2LifecycleServer(port = 3001) {
  const server = http2.createServer();
  server.on("stream", (stream) => {
    stream.respond({ ":status": 200 });
    stream.end("Hello");
  });

  server.listen(port);
  return server;
}

if (require.main === module) {
  createHttp2LifecycleServer();
}

