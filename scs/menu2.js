const { bmbtz } = require("../devbmb/bmbtz");
const util = require("util");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const moment = require("moment-timezone");
const { format } = require(__dirname + "/../devbmb/mesfonctions");
const { bmbtz: bmbtzMain } = require(__dirname + "/../devbmb/bmbtz");
const s = require(__dirname + "/../settings");

// ====== CONTEXT INFO ======
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

// ====== MAIN COMMAND ======
bmbtz({
  nomCom: "menu",
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

  // ====== GET CATEGORIES LIST ======
  const categories = Object.keys(coms);
  const totalCommands = cm.length;

  // ====== BUILD OPTIONS TEXT ======
  let optionsText = `📑 *BMB TOOL MENU*\n\n`;
  optionsText += `Reply with category number:\n\n`;
  
  categories.forEach((cat, index) => {
    optionsText += `${index + 1} ➠ ${cat.toUpperCase()}\n`;
  });
  
  optionsText += `\n*Send number (1-${categories.length})*`;

  // ====== SEND OPTIONS WITH REACTION ======
  const sentMessage = await zk.sendMessage(dest, {
    text: optionsText,
    contextInfo,
  }, { quoted: ms });

  // ====== REACTION TO MENU MESSAGE ======
  await zk.sendMessage(dest, {
    react: {
      text: "✅",
      key: sentMessage.key
    }
  });

  // ====== LISTENER FOR REPLY ======
  const listener = async (update) => {
    const message = update.messages[0];
    if (!message.message || !message.message.extendedTextMessage) return;
    if (message.key.fromMe) return;

    const replyContext = message.message.extendedTextMessage.contextInfo;
    if (replyContext?.stanzaId !== sentMessage.key.id) return;

    const responseText = message.message.extendedTextMessage.text.trim();
    const categoryIndex = parseInt(responseText) - 1;

    // ====== VALIDATE NUMBER ======
    if (isNaN(categoryIndex) || categoryIndex < 0 || categoryIndex >= categories.length) {
      // ====== REACTION YA ERROR KWA USER ======
      await zk.sendMessage(message.key.remoteJid, {
        react: {
          text: "❌",
          key: message.key
        }
      });
      await repondre(`❌ *Invalid number!* Send number between 1-${categories.length}.`);
      return;
    }

    try {
      // ====== REACTION YA PROCESSING KWA USER ======
      await zk.sendMessage(message.key.remoteJid, {
        react: {
          text: "⏳",
          key: message.key
        }
      });

      const selectedCategory = categories[categoryIndex];
      const commands = coms[selectedCategory];

      // ====== BUILD CATEGORY MENU ======
      let menuText = `📂 *${selectedCategory.toUpperCase()}*\n\n`;
      commands.forEach((cmd) => {
        menuText += `🔹 *${prefixe}${cmd}\n`;
      });

      // ====== ADD BOT INFO ======
      const infoText = getBotInfo(mode, totalCommands);
      const finalText = infoText + menuText;

      // ====== SEND MENU ======
      await zk.sendMessage(dest, {
        text: finalText,
        contextInfo,
      }, { quoted: ms });

      // ====== REACTION YA SUCCESS KWA USER ======
      await zk.sendMessage(message.key.remoteJid, {
        react: {
          text: "✅",
          key: message.key
        }
      });

      // ====== REMOVE LISTENER ======
      zk.ev.off('messages.upsert', listener);

    } catch (err) {
      console.error(err);
      await repondre(`❌ Error: ${err.message}`);
      zk.ev.off('messages.upsert', listener);
    }
  };

  // ====== START LISTENER ======
  zk.ev.on('messages.upsert', listener);

  // ====== TIMEOUT ======
  setTimeout(() => {
    zk.ev.off('messages.upsert', listener);
  }, 60000);
});
