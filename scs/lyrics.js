const axios = require("axios");
const pkg = require("@whiskeysockets/baileys");
const { generateWAMessageFromContent, proto } = pkg;
const { bmbtz } = require("../devbmb/bmbtz");

/* ===== API CONFIG ===== */
const LYRICS_API = "https://api.deline.web.id/tools/lyrics";

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
      const { data } = await axios.get(LYRICS_API, {
        params: { title: query },
        timeout: 35000
      });

      if (!data?.status || !data?.result || data.result.length === 0) {
        await zk.sendMessage(dest, { react: { text: "❌", key: ms.key } });
        return repondre("❌ Lyrics not found for: " + query);
      }

      const song = data.result[0];
      const title = song.name || query;
      const artist = song.artistName || "Unknown";
      const album = song.albumName || "N/A";
      const lyrics = song.plainLyrics || "";

      if (!lyrics) {
        await zk.sendMessage(dest, { react: { text: "❌", key: ms.key } });
        return repondre("❌ Lyrics not available for: " + query);
      }

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
        "⚡ *Powered by B.M.B TECH*";

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

      const waMsg = generateWAMessageFromContent(dest, viewOnceMessage, {});

      await zk.relayMessage(dest, waMsg.message, {
        messageId: waMsg.key.id
      });

      await zk.sendMessage(dest, {
        react: { text: "✅", key: ms.key }
      });

    } catch (err) {
      console.error("LYRICS ERROR:", err.response?.data || err);
      await zk.sendMessage(dest, { react: { text: "❌", key: ms.key } });
      repondre(
        "❌ *Lyrics Error*\n\n" +
        "• API may be down\n" +
        "• Try again later.\n" +
        "• Enter the correct song name."
      );
    }
  }
);
