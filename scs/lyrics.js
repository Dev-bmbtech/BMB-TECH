const axios = require("axios");
const { bmbtz } = require("../devbmb/bmbtz");

/* ===== API CONFIG ===== */
const LYRICS_API = "https://iamtkm.vercel.app/search/lyrics";
const API_KEY = "tkm";

/* ===== COMMAND ===== */
bmbtz(
  {
    nomCom: "lyrics",
    categorie: "Search",
    reaction: "🎵",
    alias: ["lyric", "song", "songtxt"]
  },
  async (dest, zk, context) => {
    const { arg, repondre, ms } = context;

    /* ===== HELP ===== */
    if (!arg[0] || arg[0].toLowerCase() === "help") {
      return repondre(
        "🎵 *B.M.B LYRICS*\n\n" +
        "📌 *Usage:*\n" +
        "• .lyrics song name\n" +
        "• .lyrics Blinding Lights\n" +
        "• .lyrics Bohemian Rhapsody Queen\n\n" +
        "💡 *Tip:* Enter song title + artist"
      );
    }

    const query = arg.join(" ");

    try {
      /* ===== REACT ===== */
      await zk.sendMessage(dest, {
        react: { text: "⏳", key: ms.key }
      });

      /* ===== API REQUEST ===== */
      const res = await axios.get(LYRICS_API, {
        params: {
          apikey: API_KEY,
          song: query
        },
        timeout: 35000
      });

      const data = res.data;

      /* ===== PARSE RESPONSE ===== */
      let title = "";
      let artist = "";
      let lyrics = "";

      if (data?.status && data.result) {
        title = data.result.title || data.result.song || "";
        artist = data.result.artist || "";
        lyrics = data.result.lyrics || data.result.text || "";
      } else if (data?.lyrics) {
        lyrics = data.lyrics;
        title = data.title || query;
        artist = data.artist || "";
      } else if (data?.result) {
        lyrics = typeof data.result === "string" ? data.result : JSON.stringify(data.result);
      } else {
        return repondre("❌ Lyrics not found. Try again.");
      }

      if (!lyrics) {
        return repondre("❌ Lyrics not available for: " + query);
      }

      /* ===== TRIM IF TOO LONG ===== */
      if (lyrics.length > 3000) {
        lyrics = lyrics.slice(0, 3000) + "\n\n...truncated";
      }

      /* ===== FINAL MESSAGE ===== */
      let text = "🎵 *B.M.B LYRICS*\n\n";

      if (title) text += `🎼 *Wimbo:* ${title}\n`;
      if (artist) text += `🎤 *Msanii:* ${artist}\n`;

      text +=
        "\n━━━━━━━━━━━━━━━━\n\n" +
        `${lyrics}\n\n` +
        "━━━━━━━━━━━━━━━━\n" +
        "⚡ *Powered by B.M.B TECH*";

      await zk.sendMessage(dest, { text });

    } catch (err) {
      console.error("LYRICS ERROR:", err.response?.data || err);
      repondre(
        "❌ *Lyrics Error*\n\n" +
        "• API may be down\n" +
        "• Try again later.\n" +
        "• Enter the correct song name."
      );
    }
  }
);
