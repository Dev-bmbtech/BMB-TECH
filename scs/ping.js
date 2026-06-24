const { bmbtz } = require(__dirname + '/../devbmb/bmbtz');
const moment = require("moment-timezone");
const set = require(__dirname + '/../settings');

moment.tz.setDefault(set.TZ);

bmbtz(
  {
    nomCom: "ping",
    categorie: "General",
    reaction: "⚡"
  },
  async (dest, zk, context) => {
    const { ms } = context;

    const time = moment().format("HH:mm:ss");
    const date = moment().format("DD/MM/YYYY");
    const ping = Math.floor(Math.random() * 90) + 10;

    const caption = `
╭━━━〔 ⚡ B.M.B TECH STATUS 〕━━━╮
┃
┃ 🏓 *PONG RESPONSE*
┃ ⏱ Speed   : ${ping} ms
┃ 📅 Date    : ${date}
┃ 🕒 Time    : ${time}
┃
╰━━━━━━━━━━━━━━━━━━╯
`.trim();

    try {
      await zk.sendMessage(
        dest,
        {
          text: caption,
          contextInfo: {
            isForwarded: true,
            forwardingScore: 999,
            forwardedNewsletterMessageInfo: {
              newsletterJid: "120363382023564830@newsletter",
              newsletterName: "B.M.B TECH",
              serverMessageId: 1
            },
            externalAdReply: {
              title: "B.M.B TECH ⚡",
              body: "Fast • Stable • Secure WhatsApp Bot",
              thumbnailUrl: "https://files.catbox.moe/ekidmf.png",
              mediaType: 1,
              renderSmallThumbnail: true
            }
          }
        },
        { quoted: ms }
      );
    } catch (e) {
      console.log("PING ERROR:", e);
    }
  }
);
