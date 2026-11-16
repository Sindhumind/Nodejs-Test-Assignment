// Scenario 15: File watcher permission bypass
// Difficulty: Expert · Filesystem / Security
// Reference: CVE-2026-123829

import { watch } from "node:fs";

export function setupRecursiveWatcher(targetDir = "./uploads") {
  const watcher = watch(
    targetDir,
    { recursive: true },
    (eventType, filename) => {
      console.log(filename);
    }
  );
  return watcher;
}

if (require.main === module) {
  setupRecursiveWatcher();
}

