const { bmbtz } = require("../devbmb/bmbtz");
const { getAllSudoNumbers, isSudoTableNotEmpty } = require("../lib/sudo");
const conf = require("../settings");

bmbtz(
  { 
    nomCom: "owner", 
    categorie: "General", 
    reaction: "🔁" 
  }, 
  async (dest, zk, commandeOptions) => {
    const { ms, mybotpic } = commandeOptions;
    const hasSudoUsers = await isSudoTableNotEmpty();
    const ownerJid = `${conf.NUMERO_OWNER.replace(/[^0-9]/g, '')}@s.whatsapp.net`;

    if (hasSudoUsers) {
      let message = `*My Super-User*\n\n*Owner Number*\n: - 🌚 @${conf.NUMERO_OWNER}\n\n------ *Other Sudo Users* -----\n`;

      const sudoNumbers = await getAllSudoNumbers();
      const mentionedJids = [ownerJid];

      for (const sudo of sudoNumbers) {
        if (sudo) { // Strict check to exclude empty or undefined values
          const sanitizedSudo = sudo.replace(/[^0-9]/g, '');
          message += `- 💼 @${sanitizedSudo}\n`;
          mentionedJids.push(`${sanitizedSudo}@s.whatsapp.net`);
        }
      }

      zk.sendMessage(dest, {
        image: { url: mybotpic() },
        caption: message,
        mentions: mentionedJids,
      });
    } else {
      const vcard = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${conf.OWNER_NAME}`,
        'ORG:;',
        `TEL;type=CELL;type=VOICE;waid=${conf.NUMERO_OWNER}:+${conf.NUMERO_OWNER}`,
        'END:VCARD',
      ].join('\n');

      const buttonMessage = {
        contacts: { 
          displayName: conf.OWNER_NAME, 
          contacts: [{ vcard }] 
        },
        contextInfo: {
          externalAdReply: {
            title: conf.NUMERO_OWNER,
            body: 'Touch here.',
            renderLargerThumbnail: true,
            thumbnail: { url: mybotpic() },
            mediaType: 1,
            sourceUrl: `https://wa.me/+${conf.NUMERO_OWNER}?text=Hii+bro,I+need+BELTAH+MD+Bot`,
          },
        },
      };

      return zk.sendMessage(dest, buttonMessage, { quoted: ms });
    }
  }
);

// Remove commented-out legacy or test code for cleanliness
          
