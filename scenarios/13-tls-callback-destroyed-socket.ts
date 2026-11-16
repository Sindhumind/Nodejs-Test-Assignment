// Scenario 13: TLS callback executes after socket destruction
// Difficulty: Expert · Async lifecycle
// Reference: CVE-2026-126051

import tls from "node:tls";

export function createTlsSniCallbackServer(secureContext?: tls.SecureContext) {
  const server = tls.createServer({
    SNICallback(servername, callback) {
      setImmediate(() => {
        callback(null, secureContext!);
      });
    },
  });

  return server;
}

if (require.main === module) {
  createTlsSniCallbackServer().listen(3443);
}

