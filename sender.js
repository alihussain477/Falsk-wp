import {
  makeWASocket,
  useMultiFileAuthState,
  delay,
  DisconnectReason
} from "@whiskeysockets/baileys";
import fs from "fs";
import pino from "pino";

const mode = process.argv[2];                  // pair | send
const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

async function startSocket() {
  return makeWASocket({
    logger: pino({ level: "silent" }),
    auth: state
  });
}

if (mode === "pair") {
  // ---------- Generate pairing code ----------
  const phone = process.argv[3];
  const sock  = await startSocket();

  if (!sock.authState.creds.registered) {
    const code = await sock.requestPairingCode(phone);
    console.log("\n⭐ Pairing Code: " + code + " ⭐\n");
  } else {
    console.log("पहले-से लॉग-इन है; pairing code ज़रूरत नहीं।");
  }

  sock.ev.on("connection.update", ({ connection }) => {
    if (connection === "open") {
      console.log("✅ WhatsApp Connected! अब इस टर्मिनल को बंद कर सकते हैं।");
      process.exit(0);
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

else if (mode === "send") {
  // ---------- Send messages ----------
  const target = process.argv[3];            // 91xxxxxxxxxx
  const header = process.argv[4];
  const delaySec = parseInt(process.argv[5]);
  const file = process.argv[6];
  const lines = fs.readFileSync(file, "utf-8").split("\n").filter(Boolean);

  const sock = await startSocket();
  sock.ev.on("connection.update", async ({ connection }) => {
    if (connection === "open") {
      console.log("🚀 Sending messages ...");
      while (true) {
        for (const line of lines) {
          try {
            const msg = `${header} ${line}`;
            await sock.sendMessage(target + "@c.us", { text: msg });
            console.log(`[Sent] ${msg}`);
            await delay(delaySec * 1000);
          } catch (e) {
            console.log("❌ Error:", e.message);
            await delay(5000);
          }
        }
      }
    }
  });
  sock.ev.on("creds.update", saveCreds);
}

else {
  console.log("Usage:\n  node sender.js pair <your-number>\n  node sender.js send <target> <header> <delay> <file>");
}
