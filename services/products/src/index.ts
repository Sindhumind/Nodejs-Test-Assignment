import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { createProduct, getProductDetails, getProducts } from "./controllers";
import { createHttp2Server } from "./servers/http2ProductServer";
import { decompressUntrustedData } from "./services/brotliDecompressor";
import { watchUploads } from "./services/uploadWatcher";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).send("UP");
});

//routes
app.get("/products", getProducts);
app.get("/products/:id", getProductDetails);
app.post("/products", createProduct);

// Bug: Brotli decompression memory corruption endpoint
app.post("/products/import-brotli", express.raw({ type: "*/*" }), (req, res) => {
  try {
    const decompressor = decompressUntrustedData(req.body);
    res.json({ message: "Decompression started" });
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

const port = process.env.PORT || 4001;
const SERVICE_NAME = process.env.SERVICE_NAME || "PRODUCTS SERVICE";

app.listen(port, () => {
  console.log(`${SERVICE_NAME} listening on port ${port}`);

  // Bug: HTTP/2 stream lifecycle and use-after-free server (CVE-2026-123866)
  try {
    createHttp2Server(4011);
  } catch (_e) {}

  // Bug: File watcher permission bypass (CVE-2026-123829)
  try {
    watchUploads("./uploads");
  } catch (_e) {}
});
