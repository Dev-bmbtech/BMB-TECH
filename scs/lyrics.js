const axios = require("axios");
const { bmbtz } = require("../devbmb/bmbtz");

/* ===== API CONFIG ===== */
const LYRICS_API_V2 = "https://api.gifted.co.ke/api/search/lyricsv2";
const LYRICS_API_V1 = "https://api.gifted.co.ke/api/search/lyrics";
const API_KEY = "gifted";

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

      /* ===== API REQUEST (try v2 first, then v1) ===== */
      let data;

      try {
        const res = await axios.get(LYRICS_API_V2, {
          params: { apikey: API_KEY, query },
          timeout: 35000
        });
        if (res.data?.success && res.data?.result?.lyrics) {
          data = res.data;
        }
      } catch (e) {
        console.error("lyricsv2 failed:", e.message);
      }

      if (!data) {
        try {
          const res = await axios.get(LYRICS_API_V1, {
            params: { apikey: API_KEY, query },
            timeout: 35000
          });
          if (res.data?.success && res.data?.result?.lyrics) {
            data = res.data;
          }
        } catch (e) {
          console.error("lyrics v1 failed:", e.message);
        }
      }

      if (!data) {
        return repondre("❌ Lyrics not found. Try again.");
      }

      /* ===== PARSE RESPONSE ===== */
      let title = data.result.title || "";
      let artist = data.result.artist || "";
      let lyrics = data.result.lyrics || "";

      if (!lyrics) {
        return repondre("❌ Lyrics not available for: " + query);
      }

      /* ===== TRIM IF TOO LONG ===== */
      if (lyrics.length > 3000) {
        lyrics = lyrics.slice(0, 3000) + "\n\n...truncated";
      }

      /* ===== FINAL MESSAGE ===== */
      let text = "🎵 *B.M.B LYRICS*\n\n";

      if (title) text += `🎼 *Song:* ${title}\n`;
      if (artist) text += `🎤 *Artist:* ${artist}\n`;

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
