// Scenario 11: Brotli decompression memory corruption
// Difficulty: Expert · Streams / Security
// Reference: CVE-2026-111497

import { createBrotliDecompress } from "node:zlib";

export function runBrotliDecompression(untrustedCompressedData: Buffer) {
  const decompressor = createBrotliDecompress();
  decompressor.on("data", (chunk) => {
    console.log(chunk.toString());
  });
  decompressor.on("error", console.error);
  decompressor.end(untrustedCompressedData);
  return decompressor;
}

if (require.main === module) {
  const mockUntrusted = Buffer.from([0x1b, 0x00, 0x00, 0x00]);
  runBrotliDecompression(mockUntrusted);
}

