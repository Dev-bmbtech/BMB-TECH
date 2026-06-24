const { bmbtz } = require("../devbmb/bmbtz");
const fs = require("fs-extra");
const path = require("path");

bmbtz({
  nomCom: "getcmd",
  categorie: "Developer",
  reaction: "📂",
  desc: "Get command file information and code"
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;

  // Check if command name is provided
  if (!arg || arg.length === 0) {
    return repondre(`❌ *Usage:* .getcmd <command-name>\n\n*Example:* .getcmd npm`);
  }

  const cmdName = arg[0].toLowerCase().trim();
  const commandsFolder = path.join(__dirname, "../scs");

  try {
    // Send initial reaction
    await zk.sendMessage(dest, {
      react: { text: "⏳", key: ms.key }
    });

    // Search for command file
    const files = fs.readdirSync(commandsFolder);
    let foundFile = null;
    let filePath = null;

    for (const file of files) {
      if (file.endsWith('.js')) {
        const fileContent = fs.readFileSync(path.join(commandsFolder, file), 'utf8');
        
        // Check if file contains the command name
        if (fileContent.includes(`nomCom: "${cmdName}"`) || 
            fileContent.includes(`nomCom: '${cmdName}'`) ||
            fileContent.includes(`name: "${cmdName}"`) ||
            fileContent.includes(`name: '${cmdName}'`)) {
          foundFile = file;
          filePath = path.join(commandsFolder, file);
          break;
        }
      }
    }

    if (!foundFile) {
      await repondre(`❌ Command *"${cmdName}"* not found!\n\nAvailable commands: Use .listcmd to see all commands.`);
      return;
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const fileSize = (stats.size / 1024).toFixed(1);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    // Try to get category from file content
    let category = "Unknown";
    const categoryMatch = fileContent.match(/categorie:\s*["']([^"']+)["']/i) || 
                         fileContent.match(/category:\s*["']([^"']+)["']/i);
    if (categoryMatch) {
      category = categoryMatch[1];
    }

    // Build response
    const responseText = `
📂 *COMMAND FILE*
│
├─ 📄 *File:* ${foundFile}
├─ 📂 *Category:* ${category}
├─ 📊 *Size:* ${fileSize} KB
├─ 📝 *Lines:* ${fileContent.split('\n').length}
│
└─ *© Powered By B.M.B-TECH*

💻 *Code:*
\`\`\`javascript
${fileContent.slice(0, 1500)}${fileContent.length > 1500 ? '\n\n... (truncated)' : ''}
\`\`\`
    `;

    // Send the response
    await zk.sendMessage(dest, { 
      text: responseText,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363382023564830@newsletter",
          newsletterName: "𝙱.𝙼.𝙱-𝚇𝙼𝙳",
          serverMessageId: 1
        }
      }
    }, { quoted: ms });

    // React with success
    await zk.sendMessage(dest, {
      react: { text: "✅", key: ms.key }
    });

  } catch (error) {
    console.error("GetCmd Error:", error);
    await repondre(`❌ Error: ${error.message}`);
  }
});
