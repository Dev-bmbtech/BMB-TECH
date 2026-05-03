const { bmbtz } = require('../devbmb/bmbtz');
var gis = require('g-i-s');

// VCard Contact
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
const contextInfo = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363382023564830@newsletter",
    newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
    serverMessageId: 1
  }
};

bmbtz({
  nomCom: "img",
  categorie: "Search",
  reaction: "📷"
}, async (dest, zk, commandeOptions) => {
  const { repondre, ms, arg } = commandeOptions;

  if (!arg[0]) {
    return repondre('❌ Please specify an image search term!');
  }

  const searchTerm = arg.join(" ");

  gis(searchTerm, async (err, results) => {
    if (err) {
      return repondre('❌ An error occurred while searching for images.');
    }
    if (!results || results.length === 0) {
      return repondre('❌ No images found for your query.');
    }
    // Send up to 5 images
    const sendCount = Math.min(results.length, 5);
    for (let i = 0; i < sendCount; i++) {
      await zk.sendMessage(dest, {
        image: { url: results[i].url },
        contextInfo
      }, { quoted: ms });
    }
  });
});
