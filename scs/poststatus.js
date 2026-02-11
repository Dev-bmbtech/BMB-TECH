const { bmbtz } = require('../devbmb/bmbtz');
const s = require("../settings");
const fs = require('fs');

// POST STATUS WORKING VERSION
bmbtz({
  nomCom: 'poststatus',
  categorie: 'General',
  reaction: '📤'
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, msgRepondu, superUser, auteurMessage, idBot } = commandeOptions;

  const userJid = auteurMessage;
  const botJid = idBot;
  const ownerNumber = s.OWNER_NUMBER || 'default_owner_number';
  const isOwner = userJid === `${ownerNumber}@s.whatsapp.net`;
  const isConnectedUser = userJid === botJid;

  if (!isConnectedUser && !isOwner && !superUser) {
    return repondre("🚫 *Only bot user or owner can use this command!*");
  }

  if (!msgRepondu) {
    return repondre("📸 *Reply to an image/video with .poststatus*");
  }

  const imageMessage = msgRepondu.message?.imageMessage ||
    msgRepondu.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
    msgRepondu.imageMessage || null;

  const videoMessage = msgRepondu.message?.videoMessage ||
    msgRepondu.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage ||
    msgRepondu.videoMessage || null;

  if (!imageMessage && !videoMessage) {
    return repondre("🚫 *Replied message must be image or video!*");
  }

  try {
    let mediaPath, mediaType;
    
    if (imageMessage) {
      mediaPath = await zk.downloadAndSaveMediaMessage(imageMessage);
      mediaType = 'image';
    } else {
      mediaPath = await zk.downloadAndSaveMediaMessage(videoMessage);
      mediaType = 'video';
      
      if (videoMessage.seconds > 30) {
        await repondre("⚠️ *Video longer than 30s will be trimmed*");
      }
    }

    await repondre("📤 *Posting to status...*");

    // METHOD 1: Direct status upload using baileys
    const statusJid = 'status@broadcast';
    
    // Prepare media data
    const mediaData = fs.readFileSync(mediaPath);
    
    if (mediaType === 'image') {
      // Upload image to status
      const result = await zk.sendMessage(statusJid, {
        image: mediaData,
        caption: `Posted via ${s.BOT}`,
        mimetype: 'image/jpeg',
        fileName: 'status.jpg'
      }, {
        quoted: null
      });
      
      if (result) {
        await repondre("✅ *Image posted to status successfully!*\nCheck your status updates.");
      }
    } else {
      // Upload video to status
      const result = await zk.sendMessage(statusJid, {
        video: mediaData,
        caption: `Posted via ${s.BOT}`,
        mimetype: 'video/mp4',
        fileName: 'status.mp4'
      }, {
        quoted: null
      });
      
      if (result) {
        await repondre("✅ *Video posted to status successfully!*\nCheck your status updates.");
      }
    }

    // Cleanup
    fs.unlinkSync(mediaPath);

  } catch (error) {
    console.error("Status posting error:", error);
    
    // Fallback method
    try {
      await repondre("🔄 *Trying alternative method...*");
      
      // Download media again
      let mediaPath, mediaType;
      
      if (imageMessage) {
        mediaPath = await zk.downloadAndSaveMediaMessage(imageMessage);
        mediaType = 'image';
      } else {
        mediaPath = await zk.downloadAndSaveMediaMessage(videoMessage);
        mediaType = 'video';
      }
      
      // Send to user's personal chat for manual sharing
      if (mediaType === 'image') {
        await zk.sendMessage(userJid, {
          image: fs.readFileSync(mediaPath),
          caption: `📸 *Ready for Status*\n\nSave this image and post it manually to your status.\n\nTime: ${new Date().toLocaleTimeString()}`
        });
      } else {
        await zk.sendMessage(userJid, {
          video: fs.readFileSync(mediaPath),
          caption: `🎬 *Ready for Status*\n\nSave this video and post it manually to your status.\n\nTime: ${new Date().toLocaleTimeString()}`
        });
      }
      
      await repondre("📱 *Media sent to your chat!*\nSave it and share to status manually.");
      
      // Cleanup
      setTimeout(() => {
        try {
          fs.unlinkSync(mediaPath);
        } catch (e) {}
      }, 5000);
      
    } catch (fallbackError) {
      console.error("Fallback error:", fallbackError);
      await repondre("❌ *Failed to post status.*\nPossible reasons:\n1. WhatsApp API restrictions\n2. Account not verified\n3. Media format issue");
    }
  }
});

// POST STATUS WITH CAPTION
bmbtz({
  nomCom: 'status',
  categorie: 'General',
  reaction: '📝'
}, async (dest, zk, commandeOptions) => {
  const { ms, repondre, msgRepondu, arg, superUser, auteurMessage, idBot } = commandeOptions;

  const userJid = auteurMessage;
  const botJid = idBot;
  const ownerNumber = s.OWNER_NUMBER || 'default_owner_number';
  const isOwner = userJid === `${ownerNumber}@s.whatsapp.net`;
  const isConnectedUser = userJid === botJid;

  if (!isConnectedUser && !isOwner && !superUser) {
    return repondre("🚫 *Only bot user or owner can use this command!*");
  }

  if (!msgRepondu) {
    return repondre("📸 *Reply to image/video with .status <caption>*");
  }

  const imageMessage = msgRepondu.message?.imageMessage ||
    msgRepondu.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
    msgRepondu.imageMessage || null;

  const videoMessage = msgRepondu.message?.videoMessage ||
    msgRepondu.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage ||
    msgRepondu.videoMessage || null;

  if (!imageMessage && !videoMessage) {
    return repondre("🚫 *Must reply to image or video!*");
  }

  const caption = arg.length > 0 ? arg.join(' ') : `Posted via ${s.BOT}`;

  try {
    let mediaPath, mediaType;
    
    if (imageMessage) {
      mediaPath = await zk.downloadAndSaveMediaMessage(imageMessage);
      mediaType = 'image';
    } else {
      mediaPath = await zk.downloadAndSaveMediaMessage(videoMessage);
      mediaType = 'video';
    }

    await repondre("📤 *Posting to status...*");

    // Try status posting
    const statusJid = 'status@broadcast';
    
    if (mediaType === 'image') {
      const result = await zk.sendMessage(statusJid, {
        image: fs.readFileSync(mediaPath),
        caption: caption,
        mimetype: 'image/jpeg'
      });
      
      if (result) {
        await repondre(`✅ *Status posted!*\nCaption: ${caption}`);
      }
    } else {
      const result = await zk.sendMessage(statusJid, {
        video: fs.readFileSync(mediaPath),
        caption: caption,
        mimetype: 'video/mp4'
      });
      
      if (result) {
        await repondre(`✅ *Video status posted!*\nCaption: ${caption}`);
      }
    }

    // Cleanup
    fs.unlinkSync(mediaPath);

  } catch (error) {
    console.error("Status error:", error);
    
    // Alternative: Send as broadcast message
    try {
      await repondre("🔄 *Using alternative method...*");
      
      let mediaPath, mediaType;
      
      if (imageMessage) {
        mediaPath = await zk.downloadAndSaveMediaMessage(imageMessage);
        mediaType = 'image';
      } else {
        mediaPath = await zk.downloadAndSaveMediaMessage(videoMessage);
        mediaType = 'video';
      }
      
      // Send to status broadcast as regular message
      await zk.sendMessage('status@broadcast', {
        [mediaType]: fs.readFileSync(mediaPath),
        caption: `${caption}\n\nPosted via ${s.BOT}`
      });
      
      await repondre(`📱 *Sent to status broadcast!*\nCheck if it appears in your status.`);
      
      fs.unlinkSync(mediaPath);
      
    } catch (altError) {
      await repondre(`❌ *Status posting failed*\nError: ${altError.message}`);
    }
  }
});

// CHECK STATUS CAPABILITY
bmbtz({
  nomCom: 'statuscheck',
  categorie: 'General',
  reaction: '🔧'
}, async (dest, zk, commandeOptions) => {
  const { repondre, auteurMessage, idBot } = commandeOptions;

  const userJid = auteurMessage;
  const botJid = idBot;
  
  try {
    await repondre("🔍 *Checking status capabilities...*");
    
    // Test if bot can send to status
    const testResult = await zk.sendMessage('status@broadcast', {
      text: `Test status from ${s.BOT}\nTime: ${new Date().toLocaleTimeString()}`
    }).catch(err => null);
    
    if (testResult) {
      await repondre("✅ *Status feature is WORKING!*\nYou can use .poststatus and .status commands.");
    } else {
      await repondre("⚠️ *Status feature may be restricted*\nTry using WhatsApp Business API or different library.");
    }
    
  } catch (error) {
    await repondre(`❌ *Status check failed:* ${error.message}`);
  }
});
