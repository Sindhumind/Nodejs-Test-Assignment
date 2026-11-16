// Bug: Memory leak through unbounded HTTP connections (CVE-2026-123868)
import http2 from "node:http2";

export function createUnboundedStreamServer(port = 3002) {
  const server = http2.createServer();
  server.on("stream", (stream) => {
    stream.on("data", (chunk) => {
      // Process data without consuming stream or applying backpressure
    });
  });
  return server;
}

