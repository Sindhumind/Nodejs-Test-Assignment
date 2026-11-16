import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import {
  createInventory,
  getInventoryById,
  getInventoryDetails,
  updateInventory,
} from "./controllers";
import { triggerStarvation } from "./services/reconcileTask";
import { createUnboundedStreamServer } from "./servers/unboundedStreamServer";

dotenv.config();

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).send("UP");
});

// routes
app.get("/inventorys/reconcile", (_req, res) => {
  triggerStarvation();
  res.json({ status: "Reconciling" });
});
app.get("/inventorys/:id", getInventoryById);
app.put("/inventorys/:id", updateInventory);
app.post("/inventorys", createInventory);
app.get("/inventorys/:id/details", getInventoryDetails);
//404
app.use((_req, res) => {
  res.status(404).send("Not Found");
});

//error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

const port = process.env.PORT || 4002;
const serviceName = process.env.SERVICE_NAME || "INVENTORY SERVICE";

app.listen(port, () => {
  console.log(`${serviceName} listening on port ${port}`);

  // Bug: Memory leak through unbounded HTTP connections (CVE-2026-123868)
  try {
    createUnboundedStreamServer(4022);
  } catch (_e) {}
});
