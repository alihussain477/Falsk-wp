import {
  makeWASocket,
  useMultiFileAuthState,
  delay,
  DisconnectReason
} from "@whiskeysockets/baileys";
import fs from 'fs';
import pino from "pino";

const targetNumber = process.argv[2];
const header = process.argv[3];
const delaySeconds = parseInt(process.argv[4]);
const messageFile = process.argv[5];

const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

async function sendMessages(sock) {
  const lines = fs.readFileSync(messageFile, "utf-8").split("\n").filter(Boolean);
  while (true) {
    for (const line of lines) {
      try {
        const message = header + " " + line;
        await sock.sendMessage(targetNumber + "@c.us", { text: message });
        console.log(`[Sent to] => ${targetNumber}`);
        console.log(`[Time] => ${new Date().toLocaleTimeString()}`);
        console.log(`[Message] => ${message}`);
        await delay(delaySeconds * 1000);
      } catch (err) {
        console.log("Error:", err.message);
        await delay(5000);
      }
    }
  }
}

const sock = makeWASocket({
  logger: pino({ level: "silent" }),
  auth: state
});

sock.ev.on("connection.update", async ({ connection }) => {
  if (connection === "open") {
    console.log("[✓] WhatsApp Connected");
    await sendMessages(sock);
  }
});
