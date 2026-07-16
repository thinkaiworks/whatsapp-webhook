const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Meta Verify Token
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || "AI_WA_AGENT";

// n8n Webhook URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

// Health Check
app.get("/", (req, res) => {
  res.send("WhatsApp Webhook Server Running ✅");
});

// Meta Verification
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook Verified");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Receive Messages
app.post("/webhook", async (req, res) => {
  try {
    console.log("Incoming WhatsApp Webhook");

    if (N8N_WEBHOOK_URL) {
      await axios.post(N8N_WEBHOOK_URL, req.body);
    }

    return res.sendStatus(200);
  } catch (error) {
    console.error(error.message);
    return res.sendStatus(500);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
