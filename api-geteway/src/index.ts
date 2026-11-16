import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { configureRoutes } from "./utils";
import { incrementLater } from "./midlwares";
import { createSecureServer } from "./servers/secureServer";
import { fetchWithSharedAgent } from "./services/tlsAgentClient";
import { createTlsSniServer } from "./servers/tlsDestroyedSocket";

dotenv.config();

const app = express();

// Bug: Closure and stale state in asynchronous callbacks triggered on incoming requests
app.use((_req, _res, next) => {
  incrementLater();
  next();
});

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 min
  max: 100,
  handler: (_req, res) => {
    res.status(429).json({ error: "Too many requests" });
  },
});

app.use("/api", rateLimiter);

// Requiest logger
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

//Health
app.get("/health", (_req, res) => {
  res.status(200).json({ message: "Api Geteway is Running" });
});

//Routes
configureRoutes(app);

//404
app.use((_req, res) => {
  res.status(404).json({ error: "Not Found" });
});

//error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  console.log(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);

  // Bug: HTTP request body parser re-entrancy server (CVE-2026-123864)
  try {
    createSecureServer(8443);
  } catch (_e) {}

  // Bug: TLS session cache crosses security policies client execution (CVE-2026-123877)
  try {
    fetchWithSharedAgent();
  } catch (_e) {}

  // Bug: TLS callback executes after socket destruction server (CVE-2026-126051)
  try {
    const tlsServer = createTlsSniServer();
    tlsServer.listen(8444);
  } catch (_e) {}
});
