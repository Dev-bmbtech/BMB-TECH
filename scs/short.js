const { bmbtz } = require("../devbmb/bmbtz");
const axios = require("axios");

// VCard Contact (B.M.B VERIFIED ✅)
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:B.M.B VERIFIED ✅
ORG:BMB-TECH BOT;
TEL;type=CELL;type=VOICE;waid=255767862457:+255767862457
END:VCARD`
    }
  }
};

// Newsletter context
const newsletterContext = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363382023564830@newsletter",
    newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
    serverMessageId: 1
  }
};

bmbtz(
  {
    nomCom: "short",
    alias: ["tiny", "shorturl"],
    categorie: "Sticker",
    reaction: "General"
  },
  async (from, conn, context) => {

    const { arg, repondre } = context;

    if (!arg[0]) {
      return repondre("*🏷️ Please provide a link.*");
    }

    try {
      const link = arg[0];

      const response = await axios.get(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(link)}`
      );

      const shortenedUrl = response.data;

      // Box style caption
      const caption = `┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🛡️ *URL Shortener*
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 🔗 Original:
┃ ${link}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ ✂️ Shortened:
┃ ${shortenedUrl}
┗━━━━━━━━━━━━━━━━━━━━━━━
🔗 Powered by B.M.B XMD`;

      await conn.sendMessage(
        from,
        {
          text: caption,
          contextInfo: newsletterContext
        },
        { quoted: quotedContact }
      );

    } catch (error) {
      console.error("TINY ERROR:", error);
      repondre("❌ An error occurred while shortening the URL. Please try again.");
    }
  }
);
