# Comprehensive Bug and Defect Catalog

This document details the known issues and defects across the system, divided into two distinct sections:
1. **Section 1: Microservice Codebase Defects (Issues #1 – #25)** — Defects identified and verified directly within the repository services.
2. **Section 2: Advanced JavaScript, TypeScript & Node.js Production Defects (Bugs #26 – #40)** — High-complexity runtime, concurrency, memory management, and security defects based on real-world production failure patterns.

All descriptions outline the defect mechanisms, observed failure patterns, and operational impacts without file paths, line references, or code-level fix hints.

---

# Section 1: Microservice Codebase Defects

### Issue #96: [Feature]: Add Swagger Docs
- **Type:** Enhancement / Documentation
- **Description:**  
  The application currently lacks an interactive API documentation interface. There is no centralized OpenAPI specification or interactive API explorer available to test and document the endpoints exposed by the gateway and underlying microservices. Adding Swagger/OpenAPI documentation will provide an accessible catalog of available routes, expected request schemas, headers, response types, and status codes.

---

### Issue #46: [Bug]: Order Confirmation Email References Wrong Order ID Field
- **Type:** Bug
- **Description:**  
  When an order is successfully placed and the order confirmation email is generated, the message template incorrectly substitutes the customer's user identifier where the unique order identifier should be placed. Customers receive an email stating their order ID is identical to their account ID rather than the identifier of the newly created order.

---

### Issue #44: [Bug]: Inventory Update Logic Has Reversed IN/OUT Operations
- **Type:** Bug
- **Description:**  
  The logic for updating inventory balances processes stock movement types in reverse. Inbound stock transactions ("IN"), which should increase the available inventory balance, decrement the quantity instead. Outbound stock transactions ("OUT"), which represent stock deductions or sales, increment the inventory balance instead. This causes warehouse and catalog stock counts to diverge in reverse order from actual physical stock movements.

---

### Issue #42: [Bug]: Inventory history quantity values are incorrect and reversed
- **Type:** Bug
- **Description:**  
  The historical ledger tracking inventory quantity adjustments records inverted and incorrect baseline values. When an initial inventory entry is recorded, the current balance is logged as the previous balance while the new balance is set to zero. Subsequent inventory adjustment events propagate these corrupted quantity states, leading to an inaccurate and inconsistent historical audit trail for stock changes.

---

### Issue #39: [Bug]: Product update uses inventory.quantity instead of inventory.id for inventoryId
- **Type:** Bug
- **Description:**  
  During the product creation process, after the corresponding inventory entry is provisioned, the product record is updated with the inventory's numerical quantity value instead of the inventory record's unique identifier. As a consequence, the product's inventory reference stores an integer quantity rather than a valid identifier, breaking future lookups that attempt to fetch inventory details using the stored reference.

---

### Issue #36: [Bug]: Missing return after unverified user response
- **Type:** Bug
- **Description:**  
  During the login process, when a user account is determined to be unverified, the system issues an error response notifying the client of the unverified status. However, control flow does not exit immediately after sending the response. The execution continues into subsequent steps, including token generation and attempting to send a second HTTP response, resulting in internal server errors regarding headers already being sent.

---

### Issue #35: [Bug]: JWT payload has swapped email and name fields
- **Type:** Bug
- **Description:**  
  When generating authentication access tokens upon successful user credentials validation, the claims in the token payload are transposed. The user's email address is mapped to the name claim, while the user's name is mapped to the email claim. Downstream services and consumers parsing the authentication token receive swapped profile data for authenticated users.

---

### Issue #33: [Feature]: Implement formatting in the codebase
- **Type:** Enhancement
- **Description:**  
  The codebase lacks automated, unified code formatting tooling and configuration. Code styling, indentation, quote conventions, spacing, and trailing commas vary significantly across packages and services. Introducing standardized code formatting and automated checks will ensure consistency, readability, and clean version control diffs across all modules.

---

### Issue #32: [Bug]: Inverted middleware order for cors() and rateLimiter
- **Type:** Bug
- **Description:**  
  The rate limiting middleware is mounted before the CORS middleware on the API gateway routes. When an incoming request triggers the rate limit threshold, or during preflight requests evaluated by the rate limiter, the rejection response is dispatched without necessary CORS headers. Client browsers block the response due to cross-origin policy violations, masking the actual rate limit status from the client.

---

### Issue #31: [Bug]: Typo errors across the application
- **Type:** Bug
- **Description:**  
  Numerous typographical and spelling mistakes are present throughout the project. These typos appear in folder and module naming, internal variables, database schema enums and column names, payload property keys, and client-facing response messages, which degrades consistency and leads to mismatch errors across integrated components.

---

### Issue #15: [Bug]: DB Setup Issues while accessing model with Prisma Client
- **Type:** Bug
- **Description:**  
  In the multi-service architecture, database configuration and ORM client setup result in runtime issues when accessing models. Individual services target distinct database names that are not initialized automatically on environment startup. Furthermore, client generation configurations without isolated targets cause model definitions across services to clash or overwrite one another, leading to missing model access errors during execution.

---

### Issue #14: [Bug]: Product Stock Status Shows "Out of Stock" When Items Are Available
- **Type:** Bug
- **Description:**  
  When fetching product details, the evaluation determining stock availability is inverted. If an item has an inventory quantity greater than zero, the returned stock status text is marked as "Out of Stock". Conversely, if the stock quantity is zero or exhausted, the status is marked as "In Stock". As a result, available products are falsely displayed to customers as unavailable.

---

### Issue #13: [Bug]: User Lookup By authUserId Returns Wrong User / Not Found
- **Type:** Bug
- **Description:**  
  The user retrieval logic that queries users by their authentication user identifier has inverted filter conditions. When a caller requests a user lookup specifically filtered by authUserId, the system queries against the primary user record identifier instead. When the query parameter is not authUserId, it queries against authUserId. This causes valid lookup requests to fail with user not found errors or return incorrect records.

---

### Issue #12: [Bug]: Expired Verification Codes Are Accepted, Valid Ones Are Rejected
- **Type:** Bug
- **Description:**  
  The validation logic that checks whether an email verification code has expired uses an inverted timestamp comparison. Codes whose expiration timestamp is still in the future are flagged as expired and rejected. Conversely, codes whose expiration timestamp has already passed are treated as valid and accepted. Legitimate users with newly issued codes cannot verify their accounts, while expired codes remain usable.

---

### Issue #11: [Bug]: Email Verification Code Expires Almost Immediately After Registration
- **Type:** Bug
- **Description:**  
  Upon user registration, the expiration time window assigned to the email verification code is set to approximately 24 seconds instead of 24 hours due to an incomplete calculation. Users are given an unreasonably brief window to receive the email and enter the code before it is considered expired.

---

### Issue #10: [Bug]: User Login Always Fails With Valid Credentials
- **Type:** Bug
- **Description:**  
  During user authentication, the password verification comparison receives its arguments in reverse order, passing the stored hash where the plaintext candidate password is expected, and the plaintext candidate password where the stored hash is expected. Consequently, the cryptographic comparison fails unconditionally, preventing all users from logging in even when supplying correct credentials.

---

### Issue #9: [Bug]: Token Verification Fails For All Authenticated Users
- **Type:** Bug
- **Description:**  
  During authentication token validation, the user lookup query searches the user database using the email value extracted from the token against the primary user identifier column. Because the primary user identifier format never matches the email string, the query consistently yields no matching user record, causing token verification to fail with an unauthorized error for all valid requests.

---

### Issue #8: [Bug]: Cart Items Return Swapped productId and inventoryId
- **Type:** Bug
- **Description:**  
  When querying the items stored in an active shopping cart session, the product identifier and inventory identifier attributes are mapped in reverse order. The property intended to represent the product ID contains the inventory ID, while the property intended to represent the inventory ID contains the product ID. This corrupts downstream cart validation, price calculation, and order placement.

---

### Issue #7: [Bug]: Clear Cart Only Removes Session But Leaves Cart Data
- **Type:** Bug
- **Description:**  
  When triggering the clear cart action, the system deletes only the session key from the cache store while leaving the underlying cart item hash data untouched. The actual cart items persist in storage as orphaned entries rather than being completely cleared.

---

### Issue #6: [Bug]: Order Subtotal Ignores Item Quantities (Uses Unit Price Instead of Line Total)
- **Type:** Bug
- **Description:**  
  During checkout calculations, the order subtotal is computed by summing the unit prices of individual line items rather than multiplying each item's unit price by its selected quantity. When customers purchase multiples of any product, the subtotal ignores the additional quantities and charges only the single-item unit price.

---

### Issue #5: [Bug]: Order Details Endpoint Never Returns Order Items
- **Type:** Bug
- **Description:**  
  When retrieving order details for a specific order identifier, the query fetches only the top-level order record and fails to include the associated line items relation. The resulting response contains order metadata but lacks the list of purchased products, quantities, and pricing breakdown.

---

### Issue #4: [Bug]: Get Orders Only Returns Completed Orders, Hides All Other Statuses
- **Type:** Bug
- **Description:**  
  The endpoint responsible for listing orders applies a hardcoded filter that restricts queries strictly to orders with a "COMPLETED" status. Orders in any other state (such as pending, processing, or cancelled) are excluded from the retrieved results, making it impossible to review orders with non-completed statuses.

---

### Issue #3: [Bug]: Email Send Fails When No Sender Is Provided
- **Type:** Bug
- **Description:**  
  When dispatching an email notification where the optional sender address is not provided in the request payload, the service fails to apply the configured default sender address. It attempts to transmit the email with an undefined sender address, causing the mail transport engine to reject the delivery.

---

### Issue #2: [Bug]: Email Records Store Sender and Recipient in Wrong Fields
- **Type:** Bug
- **Description:**  
  When saving dispatched email records into the database for auditing and history tracking, the recipient email address is saved into the sender field, and the sender address is saved into the recipient field. This inverts the sender and recipient attributes in the email audit logs.

---

### Issue #1: [Bug]: API Gateway Auth Middleware Sends Wrong Token Field Name
- **Type:** Bug
- **Description:**  
  When the API gateway intercepts an authenticated request and forwards the bearer token to the authentication verification endpoint, it sends the token under a property name that does not match the schema expected by the authentication service. The verification request fails input validation, causing authenticated requests across the gateway to be rejected as unauthorized.

---

# Section 2: Advanced JavaScript, TypeScript & Node.js Production Defects

### Bug #26: Async Race Condition — Stale API Response Overwrite
- **Difficulty:** 8/10
- **Category:** Concurrency / State Synchronization
- **Description:**  
  In high-frequency UI interactions or concurrent client fetches, multiple asynchronous network requests are triggered in rapid succession for updating shared state. Because network latency and server response times vary independently of request dispatch order, an earlier, slower request can resolve after a newer, faster request has already settled and rendered. Without request cancellation or sequence tracking, the stale response writes over the fresher data, leaving the client in an inconsistent or out-of-sync state that represents outdated data.

---

### Bug #27: Closure and Stale Shared State in Asynchronous Callbacks
- **Difficulty:** 8/10
- **Category:** Scope / Closures / Shared State Mutation
- **Description:**  
  When shared or module-level variables are accessed and mutated within asynchronous timer callbacks, microtask queues, or event handlers, operations that appear continuous in synchronous code become interleaved across event loop turns. Concurrent invocations capture shared references across overlapping ticks, leading to lost updates, torn reads, and non-deterministic state corruption. The lack of operational atomicity across asynchronous task yields causes values to diverge under load while passing sequential unit tests.

---

### Bug #28: Promise.all Fail-Fast Partial Operation Inconsistency
- **Difficulty:** 8.5/10
- **Category:** Asynchronous Flow Control / Distributed Consistency
- **Description:**  
  When aggregating multiple independent external network operations using standard fail-fast promise combinators, the failure of any single operation triggers an immediate rejection of the entire aggregated promise. However, the remaining concurrent promises continue running in the background until completion without cancellation. This creates orphaned background operations that consume downstream resources, generate untracked side effects, or leave distributed datastores in partially modified, unrecoverable states without the caller knowing which steps succeeded or failed.

---

### Bug #29: Runtime Type Eradication and Type Assertion Blind Spots
- **Difficulty:** 8/10
- **Category:** Type System / Runtime Contracts
- **Description:**  
  Static type assertions apply compile-time type assumptions without enforcing runtime structural validation on dynamically ingested data (such as JSON payloads from external microservices or third-party APIs). Because TypeScript types are completely erased upon compilation to JavaScript, malformed or mismatched fields (such as numeric values formatted as strings, or null/undefined values where strings were declared) bypass compilation checks cleanly. Downstream invocation of native methods on assumed types then triggers fatal runtime type errors in production environments.

---

### Bug #30: Event Loop Starvation via Synchronous Compute Blocking
- **Difficulty:** 8.5/10
- **Category:** Event Loop / Execution Scheduling
- **Description:**  
  Because Node.js executes application logic on a single main thread, intensive synchronous tasks—such as CPU-bound loops, unbounded synchronous cryptographic hashing, complex regular expression evaluations (ReDoS), or continuous microtask scheduling—monopolize the call stack. When execution remains tied up in synchronous processing, the event loop cannot transition through its phases. Scheduled timer callbacks, I/O polling, and incoming network requests are starved, causing external API timeouts, dropped connections, and failed orchestrator health checks despite normal memory and database availability.

---

### Bug #31: HTTP Request Body Parser Re-entrancy
- **Difficulty:** 9.5/10
- **Category:** Runtime Internals / Protocol Parsing
- **Description:**  
  During secure HTTPS stream handling, flushing response headers prematurely while simultaneously binding data stream listeners creates race conditions between TLS record decryption and HTTP parsing frames. If underlying data chunks trigger callbacks that invoke parser state changes or emit zero-length buffer writes during active parsing routines, the native parser enters a re-entrant execution state. This unexpected nesting disrupts internal state machines, risking heap corruption, out-of-bounds reads, or sudden process aborts under specific payload chunk alignments.

---

### Bug #32: HTTP/2 Stream Lifecycle Teardown and Use-After-Free
- **Difficulty:** 10/10
- **Category:** Memory Management / Protocol Lifecycle
- **Description:**  
  Under heavy client concurrency, HTTP/2 clients frequently cancel or reset streams (via RST_STREAM frames) while the server is concurrently buffering or writing outgoing response frames. If the server runtime initiates stream destruction while native I/O queues still hold active write operations for that stream, the native stream handle can be deallocated before write operations are fully retired. When deferred completion routines subsequently reference the released memory structure, a use-after-free fault occurs, causing immediate native segmentation faults and container termination.

---

### Bug #33: Hostname Validation Bypass via Null-Byte Truncation
- **Difficulty:** 9/10
- **Category:** Security / DNS Resolution & Canonicalization
- **Description:**  
  When security policies enforce domain allowlists or suffix checks on incoming host strings, high-level string validation treats the full string as a continuous sequence. However, if an input string contains an embedded null character (`\0`), native system resolution routines implemented in C/C++ interpret the null byte as an end-of-string terminator. Consequently, high-level security checks validate against the intended suffix trailing the null character, but the underlying system resolver resolves only the prefix preceding the null byte. This disconnect allows malicious actors to bypass domain restrictions, leading to server-side request forgery (SSRF) and DNS rebinding attacks.

---

### Bug #34: TLS Session Cache Cross-Security Policy Resumption
- **Difficulty:** 9/10
- **Category:** TLS / Connection Pooling & Resumption
- **Description:**  
  When an HTTPS agent maintains persistent connections and caches TLS session tickets across multiple outbound destinations or requests, cached sessions can inadvertently be reused across requests with different security profiles. If the TLS session cache is not strictly partitioned by custom certificate authorities, server validation flags, and mutual TLS (mTLS) credentials, a connection originally negotiated under relaxed verification can be resumed for a request requiring strict policy enforcement. This cross-policy resumption bypasses required identity verifications, invalidating certificate boundary protections.

---

### Bug #35: Memory Leak via Unbounded HTTP/2 Streams and Missing Backpressure
- **Difficulty:** 9/10
- **Category:** Performance / Stream Backpressure / Memory Accounting
- **Description:**  
  When handling incoming multiplexed HTTP/2 streams, data chunks arrive continuously across open streams. If an application fails to attach proper data handlers, neglects flow control pausing, or detaches consumption logic, incoming frame buffers accumulate in internal queues. When inbound data escapes native session-level memory limits, memory consumption grows linearly with traffic volume. Even if requests eventually finish, memory remains retained in stream queues, ultimately resulting in out-of-memory (OOM) heap exhaustion under production concurrency.

---

### Bug #36: Brotli Decompression Native Memory Corruption and Resource Bomb
- **Difficulty:** 9.5/10
- **Category:** Native Streams / Compression & Security
- **Description:**  
  Applications accepting streaming compressed payloads via native Brotli decompression are susceptible to decoder failures when handling crafted or truncated byte sequences. Malformed compressed chunks can exploit native decompression boundary logic, resulting in out-of-bounds memory writes or decoder loop exceptions. Additionally, without explicit limits on decompressed stream length, miniature payloads can expand by orders of magnitude (decompression bombs), filling native buffer limits and exhausting available system memory before request handling can intervene.

---

### Bug #37: HTTP/2 Header Processing Buffer Overflow
- **Difficulty:** 9.5/10
- **Category:** Native Memory / HPACK & Header Parsing
- **Description:**  
  In multiplexed HTTP/2 communication, headers are compressed using HPACK and decoded by native protocol parsers. When an incoming frame delivers abnormally long authority, path, or alternative service pseudo-headers, the native decoding layer must dynamically allocate buffer space. If the decoded length exceeds allocated native buffer boundaries due to off-by-one or size-calculation defects, memory adjacent to the allocated heap buffer is overwritten. This causes memory corruption, erratic protocol crashes, and potential security vulnerabilities during header decompression.

---

### Bug #38: Deferred TLS Callback Invocation Against Destroyed Sockets
- **Difficulty:** 9/10
- **Category:** Asynchronous Lifecycle / Network State
- **Description:**  
  During secure connection handshakes, asynchronous hooks (such as custom SNI resolution or certificate lookups) schedule asynchronous tasks to evaluate encryption contexts. If the client disconnects or aborts the connection during this asynchronous evaluation, the underlying socket is immediately marked as destroyed and its native handles are closed. When the deferred callback subsequently resolves on a later event loop tick and attempts to resume the TLS handshake on the already-destroyed socket, an unhandled exception or native null-pointer dereference is thrown.

---

### Bug #39: Credential and Secret Leakage Through Unsanitized Exception Contexts
- **Difficulty:** 8/10
- **Category:** Security / Error Propagation & Logging
- **Description:**  
  When initializing outbound HTTP proxies, database connections, or downstream client wrappers with connection strings that embed credentials, initialization errors frequently include the full connection URI within the error message text. When these exceptions are caught and passed to centralized logging services, monitoring tools, or external telemetry pipelines without automated redaction, plain-text credentials and private access keys are written directly into persistent log stores.

---

### Bug #40: Filesystem Watcher Recursive Permission Boundary Bypass
- **Difficulty:** 9/10
- **Category:** Filesystem / Permission Boundaries
- **Description:**  
  When executing inside restricted runtime environments (such as sandboxed worker processes or permission-constrained runtimes), processes may be granted access only to specific root directory paths while access to nested subdirectories is denied. However, configuring recursive filesystem watchers on the allowed root path causes the underlying operating system event subsystem to monitor all nested descendents. File creation, modification, or deletion events within restricted subdirectories are reported back to the watcher callback, leaking directory structures and filenames across security boundaries.
