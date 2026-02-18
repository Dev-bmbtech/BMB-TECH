const axios = require("axios");
const { bmbtz } = require("../devbmb/bmbtz");

// VERIFIED CONTACT
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast",
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard:
        "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255767862457\nEND:VCARD",
    },
  },
};

// NEWSLETTER CONTEXT
const newsletterContext = {
  forwardingScore: 999,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: "120363382023564830@newsletter",
    newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
    serverMessageId: 1,
  },
};

// FLAG EMOJI
function getFlagEmoji(countryCode) {
  if (!countryCode) return "";
  return countryCode
    .toUpperCase()
    .split("")
    .map((letter) =>
      String.fromCodePoint(letter.charCodeAt(0) + 127397)
    )
    .join("");
}

bmbtz(
  {
    nomCom: "check",
    categorie: "Search",
    reaction: "🌍",
  },
  async (dest, zk, { arg, ms, repondre }) => {
    try {
      let code = arg[0];

      if (!code) {
        return repondre(
          "❌ Please provide a country code.\nExample: `.check 255`"
        );
      }

      // Remove + and spaces
      code = code.replace(/\+/g, "").trim();

      const API_URL = "https://bmb-countries-api.vercel.app/api";

      const response = await axios.get(API_URL, {
        timeout: 10000,
      });

      const countries = response.data;

      if (!Array.isArray(countries)) {
        return repondre("❌ Invalid API response.");
      }

      // Flexible match
      const matches = countries.filter(
        (c) =>
          c.calling_code &&
          c.calling_code.replace(/\+/g, "") === code
      );

      if (matches.length === 0) {
        return repondre(
          `❌ No country found for code +${code}`
        );
      }

      const countryList = matches
        .map(
          (c) =>
            `${getFlagEmoji(c.code)} ${c.name}`
        )
        .join("\n");

      const message = `🌍 *COUNTRY CODE CHECKER*
━━━━━━━━━━━━━━━━━━
📞 *Code:* +${code}

🌎 *Country List:*
${countryList}

_By BMB-XMD_`;

      await zk.sendMessage(
        dest,
        {
          text: message,
          contextInfo: {
            ...newsletterContext,
          },
        },
        { quoted: quotedContact }
      );
    } catch (error) {
      console.log("API ERROR:", error.message);
      repondre("❌ Failed to fetch country data. Try again later.");
    }
  }
);
