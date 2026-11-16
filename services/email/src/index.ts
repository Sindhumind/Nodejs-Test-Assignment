import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { getEmails, sentEmail } from "./controller";
import { validateAndResolve } from "./services/dnsValidator";
import { initProxy } from "./services/proxyConfig";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).send("UP");
});

//routes

app.post("/email/send", sentEmail);
app.get("/emails", getEmails);

// Bug: DNS validation bypass using null bytes (CVE-2026-105482)
app.post("/email/validate-domain", async (req, res) => {
  try {
    const input = req.body?.domain || "attacker.example\0.trusted.example";
    const addresses = await validateAndResolve(input);
    res.json({ addresses });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Bug: Sensitive information leaked through error messages (CVE-2026-123871)
app.get("/email/proxy-init", (_req, res) => {
  try {
    initProxy();
    res.json({ status: "Initialized" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

//404
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

//error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(err.status || 500).json({ error: err.message });
});

const port = process.env.PORT || 4005;
const SERVICE_NAME = process.env.SERVICE_NAME || "Email SERVICE";

app.listen(port, () => {
  console.log(`${SERVICE_NAME} listening on port ${port}`);
});
