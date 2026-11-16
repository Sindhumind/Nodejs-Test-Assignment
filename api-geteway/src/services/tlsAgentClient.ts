// Bug: TLS session cache crosses security policies (CVE-2026-123877)
import https from "node:https";

const agent = new https.Agent({ keepAlive: true });

export function fetchWithSharedAgent(url = "https://example.com") {
  https.get(url, { agent }, (response) => {
    console.log(response.statusCode);
  });
}

