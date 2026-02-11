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

// Menu cache to save resources
let menuCache = {
  lastUpdate: 0,
  layouts: [],
  currentIndex: 0
};

// Function to create various menu layouts
function generateMenuLayouts() {
  const now = Date.now();
  // Regenerate menus every 5 minutes to avoid being monotonous
  if (now - menuCache.lastUpdate > 300000) { // 5 minutes
    const layouts = [];

    // Layout 1: Vertical boxed style (Helvetica style)
    layouts.push(() => {
      let intro = `
╔═⧉ 𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛 𝐁𝐎𝐓 ⧉═╗
║👤 Owner: ${s.OWNER_NAME}
║⚙️ Mode: ${s.MODE.toLowerCase() !== "yes" ? "private" : "public"}
║📅 Date: ${moment().tz("Etc/GMT").format("DD/MM/YYYY")}
║💻 Platform: ${os.platform()}
║🧩 Commands: ${menuCache.commandCount || 0}
║🎨 Style: Boxed Classic
╚════════════════════╝
`;
      let body = "";
      for (const cat in menuCache.categories) {
        body += `\n╔═📁 ${cat.toUpperCase()} ═══\n`;
        for (const cmdName of menuCache.categories[cat]) {
          body += `║ ▣ ${menuCache.prefix}${cmdName}\n`;
        }
        body += `╚════════════════════\n`;
      }
      body += "\n📌 @Bmb Tech | Style 1/7";
      return intro + body;
    });

    // Layout 2: Clean list (Roboto style)
    layouts.push(() => {
      let intro = `*B.M.B-TECH MENU*\n━━━━━━━━━━━━━━━━\nOwner: ${s.OWNER_NAME}\nMode: ${s.MODE.toLowerCase() !== "yes" ? "private" : "public"}\nDate: ${moment().tz("Etc/GMT").format("DD/MM/YYYY")}\nPlatform: ${os.platform()}\nCommands: ${menuCache.commandCount || 0}\nStyle: Clean Modern\n━━━━━━━━━━━━━━━━\n\n`;
      let body = "";
      for (const cat in menuCache.categories) {
        body += `📌 *${cat.toUpperCase()}*\n`;
        for (const cmdName of menuCache.categories[cat]) {
          body += `  └─ ${menuCache.prefix}${cmdName}\n`;
        }
        body += `\n`;
      }
      body += `*@Bmb Tech* | Style 2/7`;
      return intro + body;
    });

    // Layout 3: Dashboard style (Futura style)
    layouts.push(() => {
      let intro = `
┌─────────────────┐
│ 𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛 𝗕𝗢𝗧 │
└─────────────────┘
👑 Owner: ${s.OWNER_NAME}  
🛠 Mode: ${s.MODE.toLowerCase() !== "yes" ? "private" : "public"}  
💻 Platform: ${os.platform()}  
📅 Date: ${moment().tz("Etc/GMT").format("DD/MM/YYYY")}  
📊 Total Commands: ${menuCache.commandCount || 0}  
🎨 Style: Geometric  
`;
      let body = "";
      for (const cat in menuCache.categories) {
        body += `\n┌───📂 ${cat.toUpperCase()} ───┐\n`;
        for (const cmdName of menuCache.categories[cat]) {
          body += `│ ⚫ ${menuCache.prefix}${cmdName}\n`;
        }
        body += `└────────────────────┘\n`;
      }
      body += `\n➤ ⚡ Powered by Bmb Tech | Style 3/7`;
      return intro + body;
    });

    // Layout 4: Minimalist (Garamond style)
    layouts.push(() => {
      let intro = `╔══════════════════════════╗\n║   B.M.B-TECH BOT MENU    ║\n╚══════════════════════════╝\n\nOwner: ${s.OWNER_NAME}\nMode: ${s.MODE.toLowerCase() !== "yes" ? "private" : "public"}\nDate: ${moment().tz("Etc/GMT").format("DD/MM/YYYY")}\nCommands: ${menuCache.commandCount || 0}\nStyle: Classic Elegant\n`;
      let body = "\n";
      for (const cat in menuCache.categories) {
        body += `【${cat.toUpperCase()}】\n`;
        for (const cmdName of menuCache.categories[cat]) {
          body += `  › ${menuCache.prefix}${cmdName}\n`;
        }
        body += `\n`;
      }
      body += `─────\nPowered by Bmb Tech | Style 4/7`;
      return intro + body;
    });

    // Layout 5: Modern social (Times New Roman style)
    layouts.push(() => {
      let intro = `◤━━━━━━━━━━━━━━━━━━━━◥\n     B.M.B-TECH BOT\n◣━━━━━━━━━━━━━━━━━━━━◤\n\n• Owner: ${s.OWNER_NAME}\n• Mode: ${s.MODE.toLowerCase() !== "yes" ? "private" : "public"}\n• Date: ${moment().tz("Etc/GMT").format("DD/MM/YYYY")}\n• Platform: ${os.platform()}\n• Commands: ${menuCache.commandCount || 0}\n• Style: Professional\n`;
      let body = "\n";
      for (const cat in menuCache.categories) {
        body += `▬▬▬▬ ${cat.toUpperCase()} ▬▬▬▬\n`;
        for (const cmdName of menuCache.categories[cat]) {
          body += `▸ ${menuCache.prefix}${cmdName}\n`;
        }
        body += `\n`;
      }
      body += `────────────────────\n© Bmb Tech | Style 5/7`;
      return intro + body;
    });

    // Layout 6: Neon Glow style
    layouts.push(() => {
      let intro = `✦•······················•✦\n      𝗕.𝗠.𝗕-𝗧𝗘𝗖𝗛 𝗕𝗢𝗧\n✦•······················•✦\n\n╭─❖ Owner: ${s.OWNER_NAME}\n├─❖ Mode: ${s.MODE.toLowerCase() !== "yes" ? "private" : "public"}\n├─❖ Date: ${moment().tz("Etc/GMT").format("DD/MM/YYYY")}\n├─❖ Platform: ${os.platform()}\n╰─❖ Commands: ${menuCache.commandCount || 0}\n`;
      let body = "\n";
      for (const cat in menuCache.categories) {
        body += `╔═✦ ${cat.toUpperCase()} ✦═╗\n`;
        for (const cmdName of menuCache.categories[cat]) {
          body += `╠➥ ${menuCache.prefix}${cmdName}\n`;
        }
        body += `╚═══════════════════╝\n`;
      }
      body += `\n✦────────────✦\nStyle: Neon Glow\n✦────────────✦`;
      return intro + body;
    });

    // Layout 7: Cyberpunk style
    layouts.push(() => {
      let intro = `[̲̅B̲̅].[̲̅M̲̅].[̲̅B̲̅]-[̲̅T̲̅E̲̅C̲̅H̲̅]\n═══════════════════\nUSER: ${s.OWNER_NAME}\nSTATUS: ${s.MODE.toLowerCase() !== "yes" ? "private" : "public"}\nDATE: ${moment().tz("Etc/GMT").format("DD/MM/YYYY")}\nSYSTEM: ${os.platform()}\nCOMMANDS: ${menuCache.commandCount || 0}\n═══════════════════\n`;
      let body = "";
      for (const cat in menuCache.categories) {
        body += `\n[ ${cat.toUpperCase()} MODULE ]\n`;
        for (const cmdName of menuCache.categories[cat]) {
          body += `┣ ${menuCache.prefix}${cmdName}\n`;
        }
        body += `┗━━━━━━━━━━━━━━━━━━━━┛\n`;
      }
      body += `\n≫ SYSTEM: BMB-TECH v2.0\n≫ STYLE: CYBERPUNK`;
      return intro + body;
    });

    menuCache.layouts = layouts;
    menuCache.lastUpdate = now;
  }

  return menuCache.layouts;
}

// Function to get random image
function getRandomImage() {
  try {
    const scsFolder = path.join(__dirname, "../scs");
    if (!fs.existsSync(scsFolder)) {
      console.log("scs folder not found, creating...");
      fs.mkdirSync(scsFolder, { recursive: true });
      return null;
    }

    const images = fs.readdirSync(scsFolder).filter(f =>
      /^menu\d+\.(jpg|jpeg|png|mp4|gif)$/i.test(f)
    );

    if (images.length === 0) {
      console.log("No menu images found in scs folder");
      return null;
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];
    const imagePath = path.join(scsFolder, randomImage);
    return fs.readFileSync(imagePath);
  } catch (err) {
    console.error("Error loading image:", err);
    return null;
  }
}

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

  // Update cache
  menuCache.categories = categories;
  menuCache.commandCount = cm.length;
  menuCache.prefix = prefixe;

  // Generate or get cached layouts
  const layouts = generateMenuLayouts();
  
  // Choose random layout OR rotate for each use
  menuCache.currentIndex = (menuCache.currentIndex + 1) % layouts.length;
  const selectedMenu = layouts[menuCache.currentIndex]();

  // Option: If you want random instead of rotate, use this:
  // const randomIndex = Math.floor(Math.random() * layouts.length);
  // const selectedMenu = layouts[randomIndex]();

  try {
    const imageBuffer = getRandomImage();

    const messageOptions = {
      text: selectedMenu,
      contextInfo: {
        mentionedJid: [mek.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "B.M.B-TECH",
          serverMessageId: 143
        }
      },
      quoted: quotedContact
    };

    // Add thumbnail if image exists
    if (imageBuffer) {
      messageOptions.contextInfo.thumbnail = imageBuffer;
    }

    await sock.sendMessage(mek, messageOptions);

  } catch (err) {
    console.error("Menu error: ", err);
    repondre("Menu error: " + err);
  }
});

// Optional: Command to see specific style
bmbtz({
  nomCom: "menustyle",
  categorie: "Menu"
}, async (mek, sock, extra) => {
  let { repondre, arg, prefixe } = extra;
  
  if (!arg || isNaN(arg) || parseInt(arg) < 1 || parseInt(arg) > menuCache.layouts.length) {
    return repondre(`Usage: ${prefixe}menustyle <1-${menuCache.layouts.length}>\nExample: ${prefixe}menustyle 3`);
  }
  
  const styleIndex = parseInt(arg) - 1;
  menuCache.currentIndex = styleIndex;
  
  const layouts = generateMenuLayouts();
  const selectedMenu = layouts[styleIndex]();
  
  try {
    const imageBuffer = getRandomImage();
    const messageOptions = {
      text: selectedMenu,
      contextInfo: {
        mentionedJid: [mek.sender]
      },
      quoted: quotedContact
    };

    if (imageBuffer) {
      messageOptions.contextInfo.thumbnail = imageBuffer;
    }

    await sock.sendMessage(mek, messageOptions);
  } catch (err) {
    repondre("Error: " + err);
  }
});
