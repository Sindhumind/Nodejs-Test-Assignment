// Bug: TLS callback executes after socket destruction (CVE-2026-126051)
import tls from "node:tls";

export function createTlsSniServer(secureContext?: tls.SecureContext) {
  const server = tls.createServer({
    SNICallback(servername, callback) {
      setImmediate(() => {
        callback(null, secureContext!);
      });
    },
  });
  return server;
}

