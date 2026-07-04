const axios = require("axios");
const pkg = require("@whiskeysockets/baileys");
const { generateWAMessageFromContent, proto } = pkg;
const { bmbtz } = require("../devbmb/bmbtz");

/* ===== API CONFIG ===== */
const LYRICS_API_V2 = "https://api.gifted.co.ke/api/search/lyricsv2";
const LYRICS_API_V1 = "https://api.gifted.co.ke/api/search/lyrics";
const API_KEY = "gifted";

/* ===== HELPER: Clean Lyrics Formatting ===== */
function cleanLyrics(text) {
  return text
    .replace(/\r\n/g, "\n")          // normalize line endings
    .replace(/\n{3,}/g, "\n\n")      // max 1 blank line between verses
    .replace(/[ \t]+\n/g, "\n")      // remove trailing spaces before newline
    .replace(/\n[ \t]+/g, "\n")      // remove leading spaces after newline
    .trim();
}

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
      let title = data.result.title || query;
      let artist = data.result.artist || "Unknown";
      let album = data.result.album || title;
      let lyrics = data.result.lyrics || "";

      if (!lyrics) {
        return repondre("❌ Lyrics not available for: " + query);
      }

      /* ===== CLEAN FORMATTING ===== */
      lyrics = cleanLyrics(lyrics);

      /* ===== TRIM IF TOO LONG (for display) ===== */
      let displayLyrics = lyrics;
      if (displayLyrics.length > 3000) {
        displayLyrics = displayLyrics.slice(0, 3000) + "\n\n...truncated";
      }

      /* ===== FINAL MESSAGE (Song Details Box) ===== */
      const textMessage =
        "「 *LYRICS FINDER* 」\n\n" +
        "╭──⦿「 *Song Details* 」\n" +
        `├─≫ 🎵 *Title* : ${title}\n` +
        `├─≫ 👤 *Artist* : ${artist}\n` +
        `├─≫ 💿 *Album* : ${album}\n` +
        "╰──────────────⦿\n\n" +
        `${displayLyrics}\n\n` +
        "⚡ *Powered by bmb tech*";

      /* ===== COPY BUTTON ===== */
      const buttons = [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "📋 COPY LYRICS",
            copy_code: lyrics
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
                  text: textMessage
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: "© BMB-TECH"
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

      const waMsg = generateWAMessageFromContent(dest, viewOnceMessage, {});

      await zk.relayMessage(dest, waMsg.message, {
        messageId: waMsg.key.id
      });

      await zk.sendMessage(dest, {
        react: { text: "✅", key: ms.key }
      });

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
