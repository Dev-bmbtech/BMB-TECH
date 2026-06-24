const { bmbtz } = require("../devbmb/bmbtz");
const util = require("util");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const moment = require("moment-timezone");
const { format } = require(__dirname + "/../devbmb/mesfonctions");
const s = require(__dirname + "/../settings");

// ====== CONTACT QUOTE ======
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard:
        "BEGIN:VCARD\n" +
        "VERSION:3.0\n" +
        "FN:B.M.B VERIFIED ✅\n" +
        "ORG:BMB-TECH BOT;\n" +
        "TEL;type=CELL;type=VOICE;waid=255767862457:+255767862457\n" +
        "END:VCARD"
    }
  }
};

// ====== CONTEXT INFO (KWA BOT INFO TU) ======
const contextInfo = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363382023564830@newsletter",
    newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
    serverMessageId: 1
  },
  externalAdReply: {
    title: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
    body: "Powered by B.M.B TECH",
    thumbnailUrl: "https://files.catbox.moe/g2brwg.jpg",
    sourceUrl: "https://whatsapp.com/channel/0029VawO6hgF6sn7k3SuVU3z",
    mediaType: 1,
    renderLargerThumbnail: true
  }
};

// ====== BOT INFO ======
function getBotInfo(mode, totalCommands) {
  moment.tz.setDefault("EAT");
  const currentTime = moment().format("HH:mm:ss");
  const currentDate = moment().format("DD/MM/YYYY");
  const usedRAM = format(os.totalmem() - os.freemem());
  const totalRAM = format(os.totalmem());

  return `╭───「 *B.M.B-TECH* 」─────⊛
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
╰━━━━━━━━━━━━━━━━━━━━⊛`;
}

// ====== MAIN COMMAND ======
bmbtz({
  nomCom: "cmd",
  categorie: "General",
  reaction: "🌚",
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, prefixe } = commandeOptions;
  const { cm } = require(__dirname + "/../devbmb/bmbtz");

  // ====== GROUP COMMANDS BY CATEGORY ======
  let coms = {};
  let mode = s.MODE.toLowerCase() !== "yes" ? "private" : "public";

  for (const com of cm) {
    if (!coms[com.categorie]) coms[com.categorie] = [];
    coms[com.categorie].push(com.nomCom);
  }

  const categories = Object.keys(coms);
  const totalCommands = cm.length;

  // ====== BOT INFO ======
  const botInfo = getBotInfo(mode, totalCommands);

  // ====== SEND BOT INFO (NA CONTEXTINFO) ======
  await zk.sendMessage(dest, {
    text: botInfo,
    contextInfo, // ← HII INA VIEW CHANNEL
  }, { quoted: quotedContact });

  // ====== BUILD MENU OPTIONS ======
  let optionsText = `📑 *BMB TOOL MENU*\n\n`;
  optionsText += `Reply with category number:\n\n`;
  
  categories.forEach((cat, index) => {
    optionsText += `${index + 1} ➠ ${cat.toUpperCase()}\n`;
  });
  
  optionsText += `\n*Send number (1-${categories.length})*`;

  // ====== SEND MENU OPTIONS (BILA CONTEXTINFO) ======
  const sentMessage = await zk.sendMessage(dest, {
    text: optionsText,
    // contextInfo imeondolewa! ← HAKUNA VIEW CHANNEL
  }, { quoted: quotedContact });

  // ====== LISTENER ======
  zk.ev.on('messages.upsert', async (update) => {
    const message = update.messages[0];
    if (!message.message || !message.message.extendedTextMessage) return;
    if (message.key.fromMe) return;

    if (message.message.extendedTextMessage.contextInfo?.stanzaId !== sentMessage.key.id) return;

    const responseText = message.message.extendedTextMessage.text.trim();
    const categoryIndex = parseInt(responseText) - 1;

    if (isNaN(categoryIndex) || categoryIndex < 0 || categoryIndex >= categories.length) {
      await repondre(`❌ Invalid number! Send 1-${categories.length}`);
      return;
    }

    try {
      await zk.sendMessage(message.key.remoteJid, {
        react: { text: "⏳", key: message.key }
      });

      const selectedCategory = categories[categoryIndex];
      const commands = coms[selectedCategory];

      let menuText = `📂 *${selectedCategory.toUpperCase()}*\n\n`;
      commands.forEach((cmd) => {
        menuText += `🔹 *${prefixe}${cmd}\n`;
      });

      await zk.sendMessage(dest, {
        text: menuText,
        // contextInfo imeondolewa! ← HAKUNA VIEW CHANNEL
      }, { quoted: ms });

      await zk.sendMessage(message.key.remoteJid, {
        react: { text: "✅", key: message.key }
      });

    } catch (error) {
      console.error(error);
      await repondre(`❌ Error: ${error.message}`);
    }
  });
});
