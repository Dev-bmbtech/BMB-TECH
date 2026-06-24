const { bmbtz } = require("../devbmb/bmbtz");
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");
const os = require("os");
const { exec } = require("child_process");
const util = require("util");
const execPromise = util.promisify(exec);

// Function to get last commit date
async function getLastCommitDate() {
  try {
    const { stdout } = await execPromise('git log -1 --format=%cd --date=iso');
    return stdout.trim();
  } catch (error) {
    return "Unknown";
  }
}

// Function to get last commit message
async function getLastCommitMessage() {
  try {
    const { stdout } = await execPromise('git log -1 --format=%s');
    return stdout.trim();
  } catch (error) {
    return "No updates";
  }
}

// Function to get current branch
async function getCurrentBranch() {
  try {
    const { stdout } = await execPromise('git rev-parse --abbrev-ref HEAD');
    return stdout.trim();
  } catch (error) {
    return "main";
  }
}

// Function to get repo URL
async function getRepoURL() {
  try {
    const { stdout } = await execPromise('git config --get remote.origin.url');
    return stdout.trim().replace('.git', '');
  } catch (error) {
    return "https://github.com/Dev-bmbtech/BMB-TECH";
  }
}

// Function to get commit count
async function getCommitCount() {
  try {
    const { stdout } = await execPromise('git rev-list --count HEAD');
    return stdout.trim();
  } catch (error) {
    return "Unknown";
  }
}

bmbtz(
  {
    nomCom: 'uptime',
    desc: 'Check bot runtime and system status',
    categorie: 'General',
    reaction: '⌚'
  },
  async (dest, zk, commandeOptions) => {
    const { repondre, ms } = commandeOptions;

    try {
      await zk.sendMessage(dest, {
        react: { text: "⏳", key: ms.key }
      });

      // Get system info
      const runtime = process.uptime();
      const days = Math.floor(runtime / 86400);
      const hours = Math.floor((runtime % 86400) / 3600);
      const minutes = Math.floor((runtime % 3600) / 60);
      const seconds = Math.floor(runtime % 60);
      
      const formattedRuntime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      
      // Get memory info
      const totalMemory = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
      const freeMemory = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
      const usedMemory = (totalMemory - freeMemory).toFixed(2);
      const memoryPercent = ((usedMemory / totalMemory) * 100).toFixed(1);
      
      // Get CPU info
      const cpuCores = os.cpus().length;
      const cpuModel = os.cpus()[0]?.model || "Unknown";
      const loadAvg = os.loadavg();
      
      // Get time
      moment.tz.setDefault("Africa/Nairobi");
      const currentTime = moment().format("HH:mm:ss");
      const currentDate = moment().format("DD/MM/YYYY");
      
      // Get repo info
      const branch = await getCurrentBranch();
      const lastCommitDate = await getLastCommitDate();
      const lastCommitMsg = await getLastCommitMessage();
      const repoUrl = await getRepoURL();
      const commitCount = await getCommitCount();
      
      // Get platform
      const platform = os.platform();
      const hostname = os.hostname();

      // Build message
      const message = `⌚ *BMB-TECH SYSTEM STATUS*

📅 *Date:* ${currentDate}
🕐 *Time:* ${currentTime} (EAT)
⏱️ *Uptime:* ${formattedRuntime}

💻 *System Info*
├─ 🖥️ *OS:* ${platform} (${hostname})
├─ 🔧 *CPU:* ${cpuModel} (${cpuCores} cores)
├─ 📊 *Load:* ${loadAvg[0].toFixed(2)} / ${loadAvg[1].toFixed(2)} / ${loadAvg[2].toFixed(2)}
└─ 🧠 *RAM:* ${usedMemory}GB / ${totalMemory}GB (${memoryPercent}% used)

📦 *Repository Info*
├─ 🌿 *Branch:* ${branch}
├─ 🔗 *Repo:* ${repoUrl}
├─ 📊 *Commits:* ${commitCount}
├─ 📝 *Last Update:* ${lastCommitDate}
└─ 💬 *Commit:* ${lastCommitMsg}

🔧 *Bot Status*
├─ ✅ *Status:* ONLINE
├─ 📦 *Commands:* ${Object.keys(require("../devbmb/bmbtz").cm || {}).length || 'Loading...'}
└─ 👑 *Developer:* Bmb Tech

━━━━━━━━━━━━━━━━
© B.M.B-TECH`;

      // Send message
      await zk.sendMessage(dest, {
        text: message,
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

      await zk.sendMessage(dest, {
        react: { text: "✅", key: ms.key }
      });

    } catch (error) {
      console.error("Uptime Error:", error);
      await repondre(`❌ Error: ${error.message}`);
    }
  }
);
