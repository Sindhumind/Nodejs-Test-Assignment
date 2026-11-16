// Scenario 8: DNS validation bypass using null bytes
// Difficulty: Expert · Security
// Reference: CVE-2026-105482

import dns from "node:dns/promises";

export const hostname = "trusted.example";

export async function validateAndResolve(input: string) {
  if (input.endsWith(".example")) {
    return dns.resolve4(input);
  }
}

if (require.main === module) {
  validateAndResolve("attacker.example\0.trusted.example").catch(console.error);
}

