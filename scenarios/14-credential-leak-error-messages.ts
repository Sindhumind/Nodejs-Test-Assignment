// Scenario 14: Sensitive information leaked through error messages
// Difficulty: Hard · Production security
// Reference: CVE-2026-123871

export function initializeProxy(proxyUrl = "http://admin:secret123@proxy.example.com") {
  try {
    // Initialize proxy configuration
    throw new Error(`Invalid proxy: ${proxyUrl}`);
  } catch (error: any) {
    console.error(error.message);
    throw error;
  }
}

if (require.main === module) {
  try {
    initializeProxy();
  } catch (_e) {
    // Caught for test run
  }
}

