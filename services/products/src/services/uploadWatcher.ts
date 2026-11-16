// Bug: File watcher permission bypass (CVE-2026-123829)
import { watch } from "node:fs";

export function watchUploads(dir = "./uploads") {
  const watcher = watch(dir, { recursive: true }, (eventType, filename) => {
    console.log(filename);
  });
  return watcher;
}

