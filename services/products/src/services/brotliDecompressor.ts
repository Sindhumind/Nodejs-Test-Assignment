// Bug: Brotli decompression memory corruption (CVE-2026-111497)
import { createBrotliDecompress } from "node:zlib";

export function decompressUntrustedData(untrustedCompressedData: Buffer) {
  const decompressor = createBrotliDecompress();
  decompressor.on("data", (chunk) => {
    console.log(chunk.toString());
  });
  decompressor.on("error", console.error);
  decompressor.end(untrustedCompressedData);
  return decompressor;
}

