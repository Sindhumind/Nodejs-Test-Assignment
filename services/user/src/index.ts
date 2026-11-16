import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { createUser, getUserById } from "./controller";
import { loadUser, getCurrentUser } from "./services/userProfile";
import { processUsers } from "./services/batchUsers";
import { parseAndFormatExternalUser } from "./services/externalUser";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.status(200).send("UP");
});

//routes
app.post("/users", createUser);
app.get("/users/sync-external", (_req, res) => {
  try {
    const user = parseAndFormatExternalUser();
    res.json({ user });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/users/batch-process", async (_req, res) => {
  try {
    const results = await processUsers();
    res.json({ results });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/users/profile/:id", async (req, res) => {
  try {
    const loaded = await loadUser(req.params.id);
    res.json({ user: loaded, currentUser: getCurrentUser() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});
app.get("/users/:id", getUserById);

//404
app.use((_req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

//error handler
app.use((err: any, _req: any, res: any, _next: any) => {
  res.status(err.status || 500).json({ error: err.message });
});

const port = process.env.PORT || 4004;
const SERVICE_NAME = process.env.SERVICE_NAME || "USER SERVICE";

app.listen(port, () => {
  console.log(`${SERVICE_NAME} listening on port ${port}`);
});
