const { bmbtz } = require('../devbmb/bmbtz');
const { addOrUpdateDataInAlive, getDataFromAlive } = require('../lib/alive');
const moment = require("moment-timezone");
const s = require(__dirname + "/../settings");
const path = require("path");
const fs = require("fs");

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

// Function to send random image from /scs folder
async function sendAliveImage(zk, dest, caption, repondre) {
    const scsFolder = path.join(__dirname, "../scs");
    const images = fs.readdirSync(scsFolder).filter(f => /^menu\d+\.jpg$/i.test(f));
    if (images.length === 0) return repondre("📁 No images found in /scs folder.");

    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imagePath = path.join(scsFolder, randomImage);

    await zk.sendMessage(dest, {
        image: { url: imagePath },
        caption: caption,
        ...newsletterContext
    }, { quoted: quotedContact });
}

bmbtz(
    {
        nomCom: 'alive',
        categorie: 'General',
        reaction: "🟢"
    },
    async (dest, zk, { ms, arg, repondre, superUser }) => {
        const data = await getDataFromAlive();
        const time = moment().tz('Etc/GMT').format('HH:mm:ss');
        const date = moment().format('DD/MM/YYYY');

        if (!arg || !arg[0]) {
            const aliveMsg = `┏━━━━━━━━━━━━━━━━━━━━━━━┓
┃     𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛 𝗔𝗟𝗜𝗩𝗘      ┃
┣━━━━━━━━━━━━━━━━━━━━━━━┫
┃ 📅 Date    : ${date}      
┃ 🕒 Time    : ${time}      
┃ 👑 Owner   : ${s.OWNER_NAME}   
┃ 🔵 Platform : *VPS*  
┗━━━━━━━━━━━━━━━━━━━━━━━┛`;

            try {
                if (data && data.lien) {
                    const lien = data.lien;
                    if (lien.match(/\.(mp4|gif)$/i)) {
                        await zk.sendMessage(dest, {
                            video: { url: lien },
                            caption: aliveMsg,
                            ...newsletterContext
                        }, { quoted: quotedContact });
                    } else if (lien.match(/\.(jpeg|png|jpg)$/i)) {
                        await zk.sendMessage(dest, {
                            image: { url: lien },
                            caption: aliveMsg,
                            ...newsletterContext
                        }, { quoted: quotedContact });
                    } else {
                        await sendAliveImage(zk, dest, aliveMsg, repondre);
                    }
                } else {
                    await sendAliveImage(zk, dest, aliveMsg, repondre);
                }
            } catch (e) {
                console.error("Error:", e);
                repondre(`❌ Failed to show Alive Message: ${e.message}`);
            }
        } else {
            if (!superUser) {
                repondre("❌ Only the owner can update Alive message.");
                return;
            }

            const [texte, tlien] = arg.join(' ').split(';');
            await addOrUpdateDataInAlive(texte, tlien);
            repondre(`✅ Alive message updated successfully!`);
        }
    }
);
