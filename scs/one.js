const { bmbtz } = require("../devbmb/bmbtz");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

// VCard Contact kwa quoting
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255767862457\nEND:VCARD"
    }
  }
};

bmbtz(
  { nomCom: "vv", aliases: ["send", "keep"], categorie: "View Once" },
  async (dest, zk, commandeOptions) => {
    const { repondre, msgRepondu } = commandeOptions;

    if (!msgRepondu) {
      return repondre("📥 Reply to the message you want to save.");
    }

    try {
      const contextInfo = {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
          serverMessageId: 1
        }
      };

      let msg;
      if (msgRepondu.imageMessage) {
        const media = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        msg = {
          image: { url: media },
          caption: msgRepondu.imageMessage.caption || "",
          contextInfo
        };
      } else if (msgRepondu.videoMessage) {
        const media = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
        msg = {
          video: { url: media },
          caption: msgRepondu.videoMessage.caption || "",
          gifPlayback: true,
          contextInfo
        };
      } else if (msgRepondu.audioMessage) {
        const media = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
        msg = {
          audio: { url: media },
          mimetype: 'audio/mp4',
          contextInfo
        };
      } else if (msgRepondu.stickerMessage) {
        const media = await zk.downloadAndSaveMediaMessage(msgRepondu.stickerMessage);
        const stickerMess = new Sticker(media, {
          pack: 'B.M.B-TECH',
          type: StickerTypes.CROPPED,
          categories: ["🤩", "🎉"],
          id: "12345",
          quality: 70,
          background: "transparent"
        });
        const stickerBuffer = await stickerMess.toBuffer();
        msg = { sticker: stickerBuffer };
      } else {
        msg = {
          text: msgRepondu.conversation || "📝 Message copied.",
          contextInfo
        };
      }

      await zk.sendMessage(dest, msg, { quoted: quotedContact });
    } catch (error) {
      console.error("Error processing the message:", error);
      repondre("❌ Failed to process the message.");
    }
  }
);
