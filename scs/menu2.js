const { bmbtz } = require("../devbmb/bmbtz");
const util = require("util");
const fs = require("fs-extra");
const path = require("path");
const os = require("os");
const moment = require("moment-timezone");
const { format } = require(__dirname + "/../devbmb/mesfonctions");
const s = require(__dirname + "/../settings");

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
  nomCom: "cmd",
  categorie: "General",
  reaction: "🌚",
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, prefixe, arg } = commandeOptions;
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

  // ====== SEND OPTIONS ======
  const sentMessage = await zk.sendMessage(dest, {
    text: optionsText,
  }, { quoted: ms });

  // ====== SIMPLE LISTENER ======
  const listener = async (update) => {
    try {
      const message = update.messages[0];
      if (!message.message) return;
      if (message.key.fromMe) return;
      
      // Check if replying to menu
      const replyContext = message.message.extendedTextMessage?.contextInfo;
      if (!replyContext || replyContext.stanzaId !== sentMessage.key.id) return;

      const responseText = message.message.extendedTextMessage.text.trim();
      const categoryIndex = parseInt(responseText) - 1;

      // ====== VALIDATE ======
      if (isNaN(categoryIndex) || categoryIndex < 0 || categoryIndex >= categories.length) {
        await repondre(`❌ Invalid number! Send 1-${categories.length}`);
        return;
      }

      // ====== REACT TO USER ======
      await zk.sendMessage(message.key.remoteJid, {
        react: { text: "⏳", key: message.key }
      });

      const selectedCategory = categories[categoryIndex];
      const commands = coms[selectedCategory];

      // ====== BUILD MENU ======
      let menuText = `📂 *${selectedCategory.toUpperCase()}*\n\n`;
      commands.forEach((cmd) => {
        menuText += `🔹 *${prefixe}${cmd}\n`;
      });

      const infoText = getBotInfo(mode, totalCommands);
      const finalText = infoText + menuText;

      // ====== SEND MENU ======
      await zk.sendMessage(dest, {
        text: finalText,
      }, { quoted: ms });

      // ====== REACT SUCCESS ======
      await zk.sendMessage(message.key.remoteJid, {
        react: { text: "✅", key: message.key }
      });

      // ====== REMOVE LISTENER ======
      zk.ev.off('messages.upsert', listener);

    } catch (err) {
      console.error('Listener error:', err);
    }
  };

  // ====== START LISTENER ======
  zk.ev.on('messages.upsert', listener);

  // ====== TIMEOUT ======
  setTimeout(() => {
    zk.ev.off('messages.upsert', listener);
  }, 60000);
});
