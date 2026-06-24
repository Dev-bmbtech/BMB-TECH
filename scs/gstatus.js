const { bmbtz } = require("../devbmb/bmbtz");
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const path = require("path");
const moment = require("moment-timezone");

bmbtz({
  nomCom: "gstatus",
  categorie: "Group",
  reaction: "📡",
  desc: "Upload status to group feed (reply to media or text)"
}, async (dest, zk, commandeOptions) => {
  const { repondre, msgRepondu, ms, arg } = commandeOptions;

  try {
    // Check if in group
    if (!dest.endsWith('@g.us')) {
      return repondre("❌ This command is for groups only.");
    }

    // Send initial reaction
    await zk.sendMessage(dest, {
      react: { text: "⏳", key: ms.key }
    });

    // Get quoted message
    const quotedMsg = msgRepondu || ms.message;
    
    // Get caption/text
    const text = arg.join(" ").trim();
    
    // Determine media type
    const imageMsg = quotedMsg?.imageMessage;
    const videoMsg = quotedMsg?.videoMessage;
    const audioMsg = quotedMsg?.audioMessage;
    const textMsg = quotedMsg?.conversation || quotedMsg?.extendedTextMessage?.text;

    let mediaBuffer = null;
    let mimeType = '';
    let mediaType = '';

    // Download function
    const downloadMedia = async (message, type) => {
      try {
        const stream = await downloadContentFromMessage(message, type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
      } catch (error) {
        console.error("Download error:", error);
        return null;
      }
    };

    // Check for image
    if (imageMsg) {
      mimeType = imageMsg.mimetype || 'image/jpeg';
      mediaType = 'image';
      mediaBuffer = await downloadMedia(imageMsg, 'image');
    }
    // Check for video
    else if (videoMsg) {
      mimeType = videoMsg.mimetype || 'video/mp4';
      mediaType = 'video';
      mediaBuffer = await downloadMedia(videoMsg, 'video');
    }
    // Check for audio
    else if (audioMsg) {
      mimeType = audioMsg.mimetype || 'audio/mp4';
      mediaType = 'audio';
      mediaBuffer = await downloadMedia(audioMsg, 'audio');
    }

    // Get current time
    moment.tz.setDefault("Africa/Nairobi");
    const currentTime = moment().format("HH:mm:ss");
    const currentDate = moment().format("DD/MM/YYYY");

    // If there's media, upload as group status
    if (mediaBuffer && mediaType) {
      const caption = text || `⚡ *Group Status Uploaded* ⚡\n_Via BMB-TECH`;

      // Send as group status
      if (mediaType === 'image') {
        await zk.sendMessage(dest, {
          groupStatusMessage: {
            image: mediaBuffer,
            caption: caption
          }
        });
      } else if (mediaType === 'video') {
        await zk.sendMessage(dest, {
          groupStatusMessage: {
            video: mediaBuffer,
            caption: caption
          }
        });
      } else if (mediaType === 'audio') {
        await zk.sendMessage(dest, {
          groupStatusMessage: {
            audio: mediaBuffer,
            mimetype: 'audio/mp4'
          }
        });
      }

      // Build success message
      const successText = `📡 *BMB-TECH STATUS UPLOAD*
━━━━━━━━━━━━━━━━
⚡ *Type:* ${mediaType.toUpperCase()}
✅ *Upload:* SUCCESSFUL
📅 *Date:* ${currentDate}
🕐 *Time:* ${currentTime} (EAT)
━━━━━━━━━━━━━━━━
© B.M.B-TECH`;

      await repondre(successText);

    } 
    // If no media but has text, upload as text status
    else if (text) {
      await zk.sendMessage(dest, {
        groupStatusMessage: {
          text: text
        }
      });

      const successText = `📡 *BMB-TECH STATUS UPLOAD*
━━━━━━━━━━━━━━━━
⚡ *Type:* TEXT
✅ *Upload:* SUCCESSFUL
📅 *Date:* ${currentDate}
🕐 *Time:* ${currentTime} (EAT)
━━━━━━━━━━━━━━━━
© B.M.B-TECH`;

      await repondre(successText);
    }
    // No media and no text
    else {
      await repondre("❌ Reply to media or add text to post a status.\n\nExample: .gstatus (reply to image/video/audio)\nOr: .gstatus Hello world");
    }

    // React with success
    await zk.sendMessage(dest, {
      react: { text: "✅", key: ms.key }
    });

  } catch (error) {
    console.error("GStatus Error:", error);
    await repondre(`❌ Error: ${error.message}`);
  }
});
