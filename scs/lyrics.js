const { bmbtz } = require("../devbmb/bmbtz");
const axios = require("axios");

bmbtz({
  nomCom: "lyrics",
  reaction: '🎵',
  categorie: "Search",
  aliases: ["lyric", "mistari"]
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const songName = arg.join(" ").trim();

  if (!songName) {
    return repondre("❌ Please provide a song name.\nExample: *lyrics Kau masih kekasihku*");
  }

  try {
    // Using the working API from the screenshot
    const apiUrl = `https://api.deline.web.id/tools/lyrics?title=${encodeURIComponent(songName)}`;
    const response = await axios.get(apiUrl);
    
    // Check if we have valid data
    if (!response.data || !response.data.title) {
      return repondre(`❌ Couldn't find lyrics for *${songName}*`);
    }

    const { title, artist, lyrics, thumb } = response.data;
    
    // Create formatted message
    let message = `🎵 *LYRICS FOUND* 🎵\n`;
    message += `◈━━━━━━━━━━━━━━◈\n`;
    message += `│❒ *Title:* ${title}\n`;
    message += `│❒ *Artist:* ${artist || 'Unknown'}\n`;
    message += `◈━━━━━━━━━━━━━━◈\n\n`;
    
    // Limit lyrics to prevent message overload (WhatsApp max ~4096 chars)
    const maxLength = 3500;
    const lyricsText = lyrics.length > maxLength 
      ? lyrics.substring(0, maxLength) + '\n\n... [truncated]' 
      : lyrics;
    
    message += lyricsText;

    // Try to send with image if available
    if (thumb) {
      try {
        const imageResponse = await axios.get(thumb, { responseType: "arraybuffer" });
        await zk.sendMessage(dest, {
          image: Buffer.from(imageResponse.data),
          caption: message,
          contextInfo: {
            mentionedJid: [dest.sender || ""],
            forwardingScore: 999,
            isForwarded: true,
          }
        }, { quoted: ms });
      } catch (imgError) {
        // If image fails, send text only
        await zk.sendMessage(dest, {
          text: message,
          contextInfo: {
            mentionedJid: [dest.sender || ""],
            forwardingScore: 999,
            isForwarded: true,
          }
        }, { quoted: ms });
      }
    } else {
      // No image available, send text only
      await zk.sendMessage(dest, {
        text: message,
        contextInfo: {
          mentionedJid: [dest.sender || ""],
          forwardingScore: 999,
          isForwarded: true,
        }
      }, { quoted: ms });
    }

  } catch (error) {
    console.error("Lyrics API Error:", error.message);
    
    // Handle specific error cases
    if (error.response && error.response.status === 404) {
      return repondre(`❌ Song "*${songName}*" not found. Please check the title and try again.`);
    }
    
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return repondre(`⏱️ Request timed out. Please try again later.`);
    }
    
    return repondre(`❌ Error fetching lyrics: ${error.message}`);
  }
});
