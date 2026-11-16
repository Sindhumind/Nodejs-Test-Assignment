// Bug: Sensitive information leaked through error messages (CVE-2026-123871)
export function initProxy() {
  const proxyUrl = "http://admin:secret123@proxy.example.com";
  try {
    // Initialize proxy configuration
    throw new Error(`Invalid proxy: ${proxyUrl}`);
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

