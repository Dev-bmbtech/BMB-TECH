const { bmbtz } = require("../devbmb/bmbtz");
const conf = require(__dirname + "/../settings");

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

// PROFILE COMMAND
bmbtz({
  nomCom: "profile",
  aliases: ["pp", "whois"],
  desc: "to generate profile picture",
  categorie: "Fun"
}, async (dest, zk, commandeOptions) => {
  const { repondre, auteurMessage, nomAuteurMessage, msgRepondu, auteurMsgRepondu } = commandeOptions;

  let jid = msgRepondu ? auteurMsgRepondu : auteurMessage;
  let nom = msgRepondu ? "@" + auteurMsgRepondu.split("@")[0] : nomAuteurMessage;

  let ppUrl = conf.URL;
  try {
    ppUrl = await zk.profilePictureUrl(jid, 'image');
  } catch (error) {
    console.error("PP Error:", error);
  }

  let status = "About not accessible due to user privacy";
  try {
    const s = await zk.fetchStatus(jid);
    if (s && s.status) status = s.status;
  } catch {}

  const caption = `┏━━━━━━━━━━━━━━━━━━
┃ 👤 *Name:* ${nom}
┃ 📝 *About:* ${status}
┗━━━━━━━━━━━━━━━━━`;

  await zk.sendMessage(dest, {
    image: { url: ppUrl },
    caption,
    mentions: msgRepondu ? [auteurMsgRepondu] : [],
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      mentionedJid: msgRepondu ? [auteurMsgRepondu] : [],
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363382023564830@newsletter",
        newsletterName: "𝙽𝙾𝚅𝙰-𝚇𝙼𝙳",
        serverMessageId: 1
      }
    }
  }, { quoted: quotedContact });
});

// PROFILE2 COMMAND (BUSINESS)
bmbtz({
  nomCom: "profile2",
  aliases: ["pp2", "whois2"],
  desc: "to generate business profile picture",
  categorie: "Fun"
}, async (dest, zk, commandeOptions) => {
  const { repondre, auteurMessage, nomAuteurMessage, msgRepondu, auteurMsgRepondu } = commandeOptions;

  let jid = msgRepondu ? auteurMsgRepondu : auteurMessage;
  let nom = msgRepondu ? "@" + auteurMsgRepondu.split("@")[0] : nomAuteurMessage;

  let ppUrl = conf.URL;
  try {
    ppUrl = await zk.profilePictureUrl(jid, 'image');
  } catch (error) {
    console.error("PP Error:", error);
  }

  let status = "About not accessible due to user privacy";
  try {
    const s = await zk.fetchStatus(jid);
    if (s && s.status) status = s.status;
  } catch {}

  let business = { description: "No business profile available", category: "Unknown" };
  try {
    const b = await zk.getBusinessProfile(jid);
    if (b) business = b;
  } catch {}

  const caption = `┏━━━━━━━━━━━━━━━━━━
┃ 👤 *Name:* ${nom}
┃ 📝 *About:* ${status}
┃ 🏢 *Biz Desc:* ${business.description}
┃ 🏷️ *Biz Category:* ${business.category}
┗━━━━━━━━━━━━━━━━━`;

  await zk.sendMessage(dest, {
    image: { url: ppUrl },
    caption,
    mentions: msgRepondu ? [auteurMsgRepondu] : [],
    contextInfo: {
      forwardingScore: 999,
      isForwarded: true,
      mentionedJid: msgRepondu ? [auteurMsgRepondu] : [],
      forwardedNewsletterMessageInfo: {
        newsletterJid: "120363382023564830@newsletter",
        newsletterName: "𝙽𝙾𝚅𝙰-𝚇𝙼𝙳",
        serverMessageId: 1
      }
    }
  }, { quoted: quotedContact });
});
