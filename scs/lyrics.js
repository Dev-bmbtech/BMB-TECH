const { bmbtz } = require("../devbmb/bmbtz");
const axios = require("axios");

bmbtz({
  nomCom: "lyrics",
  reaction: '🎵', // Changed reaction to match music theme
  categorie: "Search",
  aliases: ["lyric", "mistari"] // Added aliases
}, async (dest, zk, commandeOptions) => {
  const { repondre, arg, ms } = commandeOptions;
  const songName = arg.join(" ").trim();

  if (!songName) {
    return repondre("Please provide a song name. Example: *" + s.PREFIXE + "lyrics Shape of You*");
  }

  // API endpoints (same as original)
  const apis = [
    `https://api.dreaded.site/api/lyrics?title=${encodeURIComponent(songName)}`,
    `https://some-random-api.com/others/lyrics?title=${encodeURIComponent(songName)}`,
    `https://api.davidcyriltech.my.id/lyrics?title=${encodeURIComponent(songName)}`
  ];

  let lyricsData;
  for (const api of apis) {
    try {
      const response = await axios.get(api);
      if (response.data?.result?.lyrics) {
        lyricsData = response.data;
        break;
      }
    } catch (error) {
      console.error(`API ${api} failed:`, error.message);
    }
  }

  if (!lyricsData?.result) {
    return repondre("❌ Couldn't find lyrics for *" + songName + "*");
  }

  const { title, artist, thumb, lyrics } = lyricsData.result;
  const imageUrl = thumb || "https://files.catbox.moe/rpea5k.jpg"; // Fallback image

  try {
    // Download album art
    const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
    
    await zk.sendMessage(dest, {
      image: Buffer.from(imageResponse.data),
      caption: `🎶 *${title}* - ${artist}\n\n${lyrics}\n\n*Powered by B.M.B-TECH*`,
      contextInfo: {
        externalAdReply: {
          title: "B.M.B-TECH Lyrics Finder",
          body: "Get any song lyrics instantly",
          thumbnail: await (await axios.get(imageUrl, { responseType: "arraybuffer" })).data,
          mediaType: 1,
          mediaUrl: "",
          sourceUrl: ""
        }
      }
    }, { quoted: ms });

  } catch (error) {
    console.error("Error sending lyrics:", error);
    // Fallback to text-only
    repondre(`🎶 *${title}* - ${artist}\n\n${lyrics.substring(0, 2000)}...\n\n*[Truncated - image failed to load]*`);
  }
});
      
