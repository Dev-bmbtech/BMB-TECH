const axios = require("axios");
const { bmbtz } = require("../devbmb/bmbtz");

// VCard Contact (B.M.B VERIFIED ✅)
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

// Newsletter context
const newsletterContext = {
  contextInfo: {
    forwardingScore: 999,
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363382023564830@newsletter",
      newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
      serverMessageId: 1
    }
  }
};

bmbtz({
  nomCom: "xx",
  categorie: "Search",
  reaction: "🔍"
}, async (dest, zk, commandeOptions) => {
  const { arg, repondre, ms } = commandeOptions;

  if (!arg[0]) return repondre("❌ Please provide a query to search.");

  try {
    const q = arg.join(" ");
    await zk.sendMessage(dest, { react: { text: "⏳", key: ms.key } });

    const apiUrl = `https://api.gifted.co.ke/api/search/xvideossearch?apikey=gifted&query=${encodeURIComponent(q)}`;
    const response = await axios.get(apiUrl);
    const data = response.data;

    if (!data || data.success !== true || !data.results || data.results.length === 0) {
      return repondre("⚠️ No results found for the given search query.");
    }

    const video = data.results[0];

    const caption = `┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃ 🎬 Title: ${video.title}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ ⏳ Duration: ${video.duration || "Unknown"}
┣━━━━━━━━━━━━━━━━━━━━━━━
┃ 📺 Quality: ${video.quality || "Standard"}
┗━━━━━━━━━━━━━━━━━━━━━━━
🔗 Powered by 𝐛𝐦𝐛 𝐭𝐞𝐜𝐡`;

    if (video.thumb) {
      await zk.sendMessage(dest, {
        image: { url: video.thumb },
        caption,
        ...newsletterContext
      }, { quoted: quotedContact });
    } else {
      await zk.sendMessage(dest, {
        text: caption,
        ...newsletterContext
      }, { quoted: quotedContact });
    }

  } catch (error) {
    console.error("XVideo Search Error:", error);
    repondre("❌ An error occurred while searching for the video.");
  }
});
