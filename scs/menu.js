const { bmbtz } = require(__dirname + "/../devbmb/bmbtz");
const os = require('os');
const moment = require("moment-timezone");
const s = require(__dirname + "/../settings");
const fs = require('fs');
const path = require('path');

// Contact message for verified context
const quotedContact = {
  key: {
    fromMe: false,
    participant: `0@s.whatsapp.net`,
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B VERIFIED ✅",
      vcard: "BEGIN:VCARD\nVERSION:3.0\nFN:B.M.B VERIFIED ✅\nORG:BMB-TECH BOT;\nTEL;type=CELL;type=VOICE;waid=255767862457:+255772341432\nEND:VCARD"
    }
  }
};

bmbtz({
  nomCom: "menu",
  categorie: "Menu"
}, async (mek, sock, extra) => {

  let {
    ms,
    repondre,
    prefixe,
    nomAuteurMessage,
    mybotpic
  } = extra;

  let { cm } = require(__dirname + "/../devbmb/bmbtz");
  let categories = {};
  let mode = s.MODE.toLowerCase() !== "yes" ? "private" : "public";

  // Group commands by category
  cm.forEach(cmd => {
    if (!categories[cmd.categorie]) categories[cmd.categorie] = [];
    categories[cmd.categorie].push(cmd.nomCom);
  });

  moment.tz.setDefault("Etc/GMT");
  const date = moment().format("DD/MM/YYYY");

  // Menu layout functions (5 different styles)
  const menuLayouts = [

    // Layout 1: Vertical boxed style
    () => {
      let intro = `
╔═⧉ 𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛 𝐁𝐎𝐓 ⧉═╗
║👤 Owner: ${s.OWNER_NAME}
║⚙️ Mode: ${mode}
║📅 Date: ${date}
║💻 Platform: ${os.platform()}
║🧩 Commands: ${cm.length}
╚════════════════════╝
`;
      let body = "";
      for (const cat in categories) {
        body += `\n╔═📁 ${cat.toUpperCase()} ═══\n`;
        for (const cmdName of categories[cat]) {
          body += `║ ▣ ${prefixe}${cmdName}\n`;
        }
        body += `╚════════════════════\n`;
      }
      body += "\n📌 @Bmb Tech";
      return intro + body;
    },

    // Layout 2: Clean list with emoji
    () => {
      let intro = `*B.M.B-TECH MENU*\nOwner: ${s.OWNER_NAME}\nMode: ${mode}\nDate: ${date}\nPlatform: ${os.platform()}\nCommands: ${cm.length}\n\n`;
      let body = "";
      for (const cat in categories) {
        body += `👉 *${cat.toUpperCase()}*\n`;
        for (const cmdName of categories[cat]) {
          body += ` • ${prefixe}${cmdName}\n`;
        }
        body += `\n`;
      }
      body += `*@Bmb Tech*`;
      return intro + body;
    },

    // Layout 3: Dashboard style boxed categories
    () => {
      let intro = `
╔═══════════════╗
║🔥 𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛 𝗕𝗢𝗧 🔥
╚═══════════════╝
👑 Owner: ${s.OWNER_NAME}  
🛠 Mode: ${mode}  
💻 Platform: ${os.platform()}  
📅 Date: ${date}  
📊 Total Commands: ${cm.length}  
`;
      let body = "";
      for (const cat in categories) {
        body += `\n╔═📁 𝐌𝐄𝐍𝐔: ${cat.toUpperCase()} ═╗\n`;
        for (const cmdName of categories[cat]) {
          body += `║ ▣ ${prefixe}${cmdName}\n`;
        }
        body += `╚═════════════╝\n`;
      }
      body += `\n➤ ⚡ Powered by Bmb Tech`;
      return intro + body;
    },

    // Layout 4: Compact list with dots
    () => {
      let intro = `B.M.B-TECH MENU | Owner: ${s.OWNER_NAME} | Mode: ${mode} | Date: ${date}\n\n`;
      let body = "";
      for (const cat in categories) {
        body += `${cat.toUpperCase()}:\n`;
        for (const cmdName of categories[cat]) {
          body += ` • ${prefixe}${cmdName}\n`;
        }
        body += `\n`;
      }
      body += `Powered by Bmb Tech`;
      return intro + body;
    },

    // Layout 5: Fancy with icons and separators
    () => {
      let intro = `╔═⧉ B.M.B-TECH BOT ⧉═╗\nOwner: ${s.OWNER_NAME} | Mode: ${mode} | Date: ${date}\nPlatform: ${os.platform()}\nCommands: ${cm.length}\n╚═══════════════════╝\n`;
      let body = "";
      for (const cat in categories) {
        body += `\n╭───『 ✨ ${cat.toUpperCase()} ✨ 』───╮\n`;
        for (const cmdName of categories[cat]) {
          body += `│ • ${prefixe}${cmdName}\n`;
        }
        body += `╰────────────────────╯\n`;
      }
      body += `\nPowered by B.M.B TECH`;
      return intro + body;
    }

  ];

  // Chagua random layout
  const randomIndex = Math.floor(Math.random() * menuLayouts.length);
  const selectedMenu = menuLayouts[randomIndex]();

  try {
    // Load images from /scs folder
    const scsFolder = path.join(__dirname, "../scs");
    const images = fs.readdirSync(scsFolder).filter(f =>
      /^menu\d+\.(jpg|jpeg|png|mp4|gif)$/i.test(f)
    );

    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imagePath = path.join(scsFolder, randomImage);
    const imageBuffer = fs.readFileSync(imagePath);

    await sock.sendMessage(mek, {
      text: selectedMenu,
      contextInfo: {
        mentionedJid: [mek.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "B.M.B-TECH",
          serverMessageId: 143
        },
        thumbnail: imageBuffer
      },
      quoted: quotedContact
    });

  } catch (err) {
    console.error("Menu error: ", err);
    repondre("Menu error: " + err);
  }
});
