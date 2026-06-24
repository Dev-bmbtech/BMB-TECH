const { bmbtz } = require("../devbmb/bmbtz");
const pkg = require("@whiskeysockets/baileys");
const { generateWAMessageFromContent, proto } = pkg;
const fs = require("fs-extra");
const path = require("path");

bmbtz({
  nomCom: "getcmd",
  categorie: "download",
  reaction: "📂",
  desc: "Get command file information and code"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  if (!arg || arg.length === 0) {
    return repondre(`❌ *Usage:* .getcmd <command-name>\n\n*Example:* .getcmd npm`);
  }

  const cmdName = arg[0].toLowerCase().trim();
  const commandsFolder = path.join(__dirname, "../scs");

  try {
    await zk.sendMessage(dest, {
      react: { text: "⏳", key: ms.key }
    });

    const files = fs.readdirSync(commandsFolder);
    let foundFile = null;
    let filePath = null;
    let fullContent = "";

    for (const file of files) {
      if (file.endsWith('.js')) {
        const fileContent = fs.readFileSync(path.join(commandsFolder, file), 'utf8');
        
        if (fileContent.includes(`nomCom: "${cmdName}"`) || 
            fileContent.includes(`nomCom: '${cmdName}'`) ||
            fileContent.includes(`name: "${cmdName}"`) ||
            fileContent.includes(`name: '${cmdName}'`)) {
          foundFile = file;
          filePath = path.join(commandsFolder, file);
          fullContent = fileContent;
          break;
        }
      }
    }

    if (!foundFile) {
      await repondre(`❌ Command *"${cmdName}"* not found!`);
      return;
    }

    const stats = fs.statSync(filePath);
    const fileSize = stats.size;
    const fileSizeKB = (stats.size / 1024).toFixed(1);
    const fileLines = fullContent.split('\n').length;

    let category = "Unknown";
    const categoryMatch = fullContent.match(/categorie:\s*["']([^"']+)["']/i) || 
                         fullContent.match(/category:\s*["']([^"']+)["']/i);
    if (categoryMatch) {
      category = categoryMatch[1];
    }

    // ===== SEND FILE AS DOCUMENT =====
    await zk.sendMessage(dest, {
      document: fs.readFileSync(filePath),
      mimetype: 'application/javascript',
      fileName: foundFile,
      caption: `${foundFile}\n${fileSizeKB} kB • JS`
    }, { quoted: ms });

    // ===== BUILD RESPONSE TEXT KAMA SCREENSHOT =====
    const responseText = `📂 *COMMAND FILE*
│
├─ 📄 *File:* ${foundFile}
├─ 📂 *Category:* ${category}
├─ 📊 *Size:* ${fileSize} chars
│
└─ *© Powered By B.M.B-TECH*

💻 *Javascript code*
\`\`\`javascript
${fullContent}
\`\`\``;

    const buttons = [
      {
        name: "cta_copy",
        buttonParamsJson: JSON.stringify({
          display_text: "📋 COPY CODE",
          copy_code: fullContent
        })
      }
    ];

    const viewOnceMessage = {
      viewOnceMessage: {
        message: {
          messageContextInfo: {
            deviceListMetadata: {},
            deviceListMetadataVersion: 2
          },
          interactiveMessage:
            proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: responseText
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "© B.M.B-TECH"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "",
                subtitle: "",
                hasMediaAttachment: false
              }),
              nativeFlowMessage:
                proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons
                })
            })
        }
      }
    };

    const waMsg = generateWAMessageFromContent(
      dest,
      viewOnceMessage,
      {}
    );

    await zk.relayMessage(dest, waMsg.message, {
      messageId: waMsg.key.id
    });

    // ===== SEND SECOND FILE INFO KAMA SCREENSHOT =====
    const secondMessage = `📂 *GETCMD*
${foundFile}
├─ 📂 Category: ${category}
├─ 📊 Size: ${fileSize} chars
│
└─ *© Powered By B.M.B-TECH*`;

    await zk.sendMessage(dest, {
      text: secondMessage
    }, { quoted: ms });

    await zk.sendMessage(dest, {
      react: { text: "✅", key: ms.key }
    });

  } catch (error) {
    console.error("GetCmd Error:", error);
    await repondre(`❌ Error: ${error.message}`);
  }
});
