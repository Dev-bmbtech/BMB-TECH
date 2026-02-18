const { bmbtz } = require("../devbmb/bmbtz");
const config = require("../settings");

// VERIFIED CONTACT
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=254769529791:+254769529791\nEND:VCARD"
    }
  }
};

bmbtz({
  pattern: "owner",
  react: "✅",
  desc: "Get owner number",
  category: "main",
  filename: __filename
},
async (conn, mek, m, { from, reply }) => {
  try {

    const ownerNumber = config.OWNER_NUMBER;
    const ownerName = config.OWNER_NAME;

    const cleanNumber = ownerNumber.replace("+", "");

    const vcard =
      "BEGIN:VCARD\n" +
      "VERSION:3.0\n" +
      `FN:${ownerName}\n` +
      `ORG:BMB-TECH BOT;\n` +
      `TEL;type=CELL;type=VOICE;waid=${cleanNumber}:${ownerNumber}\n` +
      "END:VCARD";

    // Send Contact
    await conn.sendMessage(from, {
      contacts: {
        displayName: ownerName,
        contacts: [{ vcard }]
      }
    }, { quoted: quotedContact });

    // Caption
    const caption = `🚀 *Bmb-Tech Owner Info* 🚀
━━━━━━━━━━━━━━━━━━━━━━
📛 Name   : Bmb Tech
📞 Number : +254769529791
⚙️ Role   : Developer & Founder
📦 Version: 2.0.0 Bmb Bot Edition
⚡ Powered by Bmb Tech ⚡`;

    // Send Text With Mention + Newsletter
    await conn.sendMessage(from, {
      text: caption,
      contextInfo: {
        mentionedJid: [`${cleanNumber}@s.whatsapp.net`],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "Bmb-Tech Updates",
          serverMessageId: 143
        }
      }
    }, { quoted: quotedContact });

  } catch (error) {
    console.log(error);
    reply(`❌ Error: ${error.message}`);
  }
});
