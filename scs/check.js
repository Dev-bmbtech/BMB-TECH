const axios = require("axios");
const { bmbtz } = require("../devbmb/bmbtz");

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
const newsletterContext = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363382023564830@newsletter",
    newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
    serverMessageId: 1
  }
};

// Convert alpha2 country code to emoji flag
function getFlagEmoji(countryCode) {
  if (!countryCode) return "";
  return countryCode
    .toUpperCase()
    .split("")
    .map(letter => String.fromCodePoint(letter.charCodeAt(0) + 127397))
    .join("");
}

bmbtz({
  nomCom: "check",
  categorie: "Search",
  reaction: "🌍"
}, async (dest, zk, { arg, ms, repondre }) => {
  try {
    let code = arg[0];
    if (!code) return repondre("❌ Please provide a country code. Example: `.check 255`");
    code = code.replace(/\+/g, '');

    const url = "https://bmb-countries-api.vercel.app/api";
    const { data } = await axios.get(url);

    const matches = data.filter(c => c.calling_code === code);

    if (matches.length > 0) {
      const list = matches
        .map(c => `${getFlagEmoji(c.code)} ${c.name}`)
        .join("\n");

      const response = `✅ *Country Code:* +${code}\n🌍 *Countries:*\n${list}\n\n_By 𝙱.𝙼.𝙱-𝚃𝙴𝙲𝙷_`;

      await zk.sendMessage(dest, {
        text: response,
        contextInfo: {
          ...newsletterContext
        }
      }, { quoted: quotedContact });
    } else {
      repondre(`❌ No country found for the code ${code}.`);
    }
  } catch (error) {
    console.error(error);
    repondre("❌ An error occurred while checking the country code.");
  }
});
  
