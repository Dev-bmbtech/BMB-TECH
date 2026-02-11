const util = require("util");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const moment = require("moment-timezone");
const { format } = require(__dirname + "/../devbmb/mesfonctions");
const { bmbtz } = require(__dirname + "/../devbmb/bmbtz");
const s = require(__dirname + "/../settings");

// ====== BUILD MENU FUNCTION WITH RANDOM STYLES ======
function buildMenu(coms, prefixe) {
  const styles = [

    // Boxed Style
    (coms, prefixe) => {
      let out = `📋 *B.M.B MENU*\n`;
      for (const cat in coms) {
        out += `\n╔═══════ ${cat.toUpperCase()} ═══════╗\n`;
        coms[cat].forEach((cmd) => {
          out += `║ ⚙️ ${prefixe}${cmd}\n`;
        });
        out += `╚════════════════════════╝\n`;
      }
      return out;
    },

    // Minimal Clean
    (coms, prefixe) => {
      let out = `🧾 *COMMANDS OVERVIEW*\n\n`;
      for (const cat in coms) {
        out += `📂 ${cat}\n`;
        coms[cat].forEach((cmd) => {
          out += `➤ ${prefixe}${cmd}\n`;
        });
        out += `-----------------------\n`;
      }
      return out;
    },

    // Zebra Layout
    (coms, prefixe) => {
      let out = `📑 *BMB TOOL MENU*\n\n`;
      let i = 0;
      for (const cat in coms) {
        const bar = i % 2 === 0 ? "▰▰▰" : "▱▱▱";
        out += `${bar} ${cat.toUpperCase()} ${bar}\n`;
        coms[cat].forEach((cmd) => {
          out += `🔹 ${prefixe}${cmd}\n`;
        });
        out += `\n`;
        i++;
      }
      return out;
    },

    // Command Center
    (coms, prefixe) => {
      let out = `🌟 *B.M.B COMMAND CENTER* 🌟\n\n`;
      for (const cat in coms) {
        out += `✨✨ ${cat} ✨✨\n`;
        coms[cat].forEach((cmd) => {
          out += `⭐ ${prefixe}${cmd}\n`;
        });
        out += `------------------\n`;
      }
      return out;
    },

    // Framed Header
    (coms, prefixe) => {
      let out = `========================\n     🔧 BMB MENU 🔧\n========================\n`;
      for (const cat in coms) {
        out += `\n[${cat.toUpperCase()}]\n`;
        coms[cat].forEach((cmd) => {
          out += `-> ${prefixe}${cmd}\n`;
        });
      }
      return out;
    }
  ];

  // Chagua random style
  const randomStyle = styles[Math.floor(Math.random() * styles.length)];
  return randomStyle(coms, prefixe);
}

// ====== BOT INFO ======
function getBotInfo(mode, totalCommands) {
  moment.tz.setDefault("EAT");
  const currentTime = moment().format("HH:mm:ss");
  const currentDate = moment().format("DD/MM/YYYY");
  const usedRAM = format(os.totalmem() - os.freemem());
  const totalRAM = format(os.totalmem());

  return `
╭───「 *B.M.B-TECH* 」─────⊛
┃⊛╭───────────────⊛
┃⊛│☢️ *Mode*: ${mode.toUpperCase()}
┃⊛│📅 *Date*: ${currentDate}
┃⊛│⌚ *Time*: ${currentTime} (EAT)
┃⊛│🖥️ *RAM*: ${usedRAM} / ${totalRAM}
┃⊛│📦 *Commands*: ${totalCommands}
┃⊛│✅ *Status*: ONLINE
┃⊛│👑 *Creator* : Bmb Tech
┃⊛│🌐 *website* : bmbtech.online
┃⊛╰━━━━━━━━━━━━━━⊛
╰━━━━━━━━━━━━━━━━━━━━⊛
`;
}

// ====== SEND MENU MEDIA ======
async function sendMenuMedia(zk, dest, ms, mediaUrl, caption, mentions) {
  const contextInfo = {
    forwardingScore: 999,
    isForwarded: true,
    mentionedJid: mentions,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363382023564830@newsletter",
      newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
      serverMessageId: 143,
    },
  };

  if (mediaUrl.match(/\.(mp4|gif)$/i)) {
    await zk.sendMessage(dest, {
      video: { url: mediaUrl },
      caption,
      footer: "⚡ BMB-XBOT ⚡",
      mentions,
      gifPlayback: true,
      contextInfo,
    }, { quoted: ms });
  } else if (mediaUrl.match(/\.(jpeg|jpg|png)$/i)) {
    await zk.sendMessage(dest, {
      image: { url: mediaUrl },
      caption,
      footer: "⚡ BMB-XBOT ⚡",
      mentions,
      contextInfo,
    }, { quoted: ms });
  } else {
    await zk.sendMessage(dest, {
      text: caption,
      mentions,
      contextInfo,
    }, { quoted: ms });
  }
}

// ====== MAIN COMMAND (menu) ======
bmbtz({
  nomCom: "menu",
  categorie: "General",
  reaction: "🌚",
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, prefixe } = commandeOptions;
  const { cm } = require(__dirname + "/../devbmb/bmbtz");

  let coms = {};
  let mode = s.MODE.toLowerCase() !== "yes" ? "private" : "public";

  for (const com of cm) {
    if (!coms[com.categorie]) coms[com.categorie] = [];
    coms[com.categorie].push(com.nomCom);
  }

  try {
    const totalCommands = cm.length;
    const infoText = getBotInfo(mode, totalCommands);
    const menuText = buildMenu(coms, prefixe);
    const finalText = infoText + menuText;
    const sender = ms.key.participant || ms.key.remoteJid;

    // Load all matching images from /scs folder
    const scsFolder = path.join(__dirname, "../scs");
    const images = fs.readdirSync(scsFolder).filter(f =>
      /^menu\d+\.(jpg|jpeg|png|mp4|gif)$/i.test(f)
    );

    if (images.length === 0) return repondre("❌ No menu images found in /scs folder.");

    // Choose random image for this menu
    const randomImage = images[Math.floor(Math.random() * images.length)];
    const mediaUrl = path.join(scsFolder, randomImage);

    await sendMenuMedia(zk, dest, ms, mediaUrl, finalText, [sender]);
  } catch (err) {
    console.error(`[DEBUG menu error]: ${err}`);
    repondre(`❌ Failed to load menu:\n${err.message}`);
  }
});
