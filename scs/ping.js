const { bmbtz } = require("../devbmb/bmbtz");
const os = require("os");

/**
 * Formats uptime seconds into a human-readable string
 */
function runtime(seconds) {
    seconds = Number(seconds);
    var d = Math.floor(seconds / (3600 * 24));
    var h = Math.floor(seconds % (3600 * 24) / 3600);
    var m = Math.floor(seconds % 3600 / 60);
    var s = Math.floor(seconds % 60);
    var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    var hDisplay = h > 0 ? h + (h == 1 ? " hr, " : " hrs, ") : "";
    var mDisplay = m > 0 ? m + (m == 1 ? " min, " : " mins, ") : "";
    var sDisplay = s > 0 ? s + (s == 1 ? " sec" : " secs") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;
}

bmbtz({
  nomCom: "ping",
  desc: "Check bot speed with channel view.",
  categorie: "General",
  reaction: "⚡"
}, async (dest, zk, reponse) => {
  const { ms } = reponse;
  const start = new Date().getTime();
  
  // --- CONFIGURATION ---
  const channelJid = "120363382023564830@newsletter"; 
  const imageUrl = "https://url.bmbxmd.workers.dev/D8VN6W.jpg"; 
  // ---------------------

  try {
    const end = new Date().getTime();
    const ping = end - start;
    const uptime = runtime(process.uptime());
    
    // Memory Calculation (GB)
    const totalRam = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeRam = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const usedRam = (totalRam - freeRam).toFixed(2);

    const statusMsg = `*🚀 BMB-TECH PING 🚀*

╭─────────────━┈⊷• 
│⚡ *Latency:* ${ping} ms
│⏱️ *Uptime:* ${uptime}
│📊 *RAM:* ${usedRam}GB / ${totalRam}GB
╰─────────────━┈⊷• 

📢 *Click "View Channel" to join us for more!*

> Bmb-Tech`;

    // Send Image with Status & View Channel Button (Context)
    await zk.sendMessage(dest, {
      image: { url: imageUrl },
      caption: statusMsg,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: channelJid,
          newsletterName: "bmb tech bot", // You can change this name
          serverMessageId: 143
        }
      }
    }, { quoted: ms });

  } catch (error) {
    console.error("Speed Command Error:", error);
    await zk.sendMessage(dest, { text: "An error occurred while executing the command." }, { quoted: ms });
  }
});
