const { bmbtz } = require("../devbmb/bmbtz");
const axios = require("axios");

// Contact quote object
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

// Context info with newsletterJid
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

bmbtz({ nomCom: "videologo", categorie: "Download", reaction: "✋" }, async (dest, zk, commandeOptions) => {
  const { ms, repondre, arg } = commandeOptions;
  const text = arg.join(" ");

  if (!text) {
    repondre("❌ Please enter text to generate a logo.");
    return;
  }

  try {
    // Message content
    const messageText = `Reply with a number below to generate a logo for *${text}*:

1 ➠ sweet love 💕😘
2 ➠ lightning pubg
3 ➠ intro video 📷
4 ➠ tiger 🐯 video logo

*Enjoy 😂*`;

    // Send menu options to user
    const sentMessage = await zk.sendMessage(dest, {
      text: messageText,
      contextInfo,
    }, { quoted: quotedContact });

    // Listen for user's reply
    zk.ev.on('messages.upsert', async (update) => {
      const message = update.messages[0];
      if (!message.message || !message.message.extendedTextMessage) return;

      // Ensure the reply is for the above options
      if (message.message.extendedTextMessage.contextInfo?.stanzaId !== sentMessage.key.id) return;

      const responseText = message.message.extendedTextMessage.text.trim();

      let logoUrl;
      switch (responseText) {
        case '1':
          logoUrl = await fetchLogoUrl("https://en.ephoto360.com/create-sweet-love-video-cards-online-734.html", text);
          break;
        case '2':
          logoUrl = await fetchLogoUrl("https://en.ephoto360.com/lightning-pubg-video-logo-maker-online-615.html", text);
          break;
        case '3':
          logoUrl = await fetchLogoUrl("https://en.ephoto360.com/free-logo-intro-video-maker-online-558.html", text);
          break;
        case '4':
          logoUrl = await fetchLogoUrl("https://en.ephoto360.com/create-digital-tiger-logo-video-effect-723.html", text);
          break;
        default:
          repondre("*Invalid number, please try again.*");
          return;
      }

      if (logoUrl) {
        await zk.sendMessage(dest, {
          video: { url: logoUrl },
          mimetype: "video/mp4",
          caption: `*Downloaded by 𝙱.𝙼.𝙱-𝚇𝙼𝙳*`,
          contextInfo,
        }, { quoted: ms });
      } else {
        repondre("❌ Failed to fetch the logo. Please try again later.");
      }
    });

  } catch (error) {
    console.error(error);
    repondre(`❌ An error occurred: ${error.message || error}`);
  }
});

// Function to get logo URL from API
async function fetchLogoUrl(url, name) {
  try {
    const response = await axios.get("https://api-pink-venom.vercel.app/api/logo", {
      params: { url, name }
    });
    return response.data.result.download_url;
  } catch (error) {
    console.error("Error fetching logo:", error);
    return null;
  }
}
