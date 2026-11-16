// Bug: DNS validation bypass using null bytes (CVE-2026-105482)
import dns from "node:dns/promises";

export const hostname = "trusted.example";

export async function validateAndResolve(input: string = "attacker.example\0.trusted.example") {
  if (input.endsWith(".example")) {
    return dns.resolve4(input);
  }
}

