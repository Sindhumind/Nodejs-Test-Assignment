// Scenario 9: TLS session cache crosses security policies
// Difficulty: Expert · TLS
// Reference: CVE-2026-123877

import https from "node:https";

export const agent = new https.Agent({ keepAlive: true });

export function runTlsSessionReuse(targetUrl = "https://example.com") {
  https.get(targetUrl, { agent }, (response) => {
    console.log(response.statusCode);
  });
}

if (require.main === module) {
  runTlsSessionReuse();
}

