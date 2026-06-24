const { bmbtz } = require("../devbmb/bmbtz");
const pkg = require("@whiskeysockets/baileys");
const { generateWAMessageFromContent, proto } = pkg;
const fs = require("fs-extra");
const axios = require("axios");
const FormData = require("form-data");

/* ===== BMB API CONFIG ===== */
const BMB_API = 'https://url.bmbxmd.workers.dev/api/upload';

/* ===== QUOTED CONTACT ===== */
const quotedContact = {
  key: {
    fromMe: false,
    participant: "0@s.whatsapp.net",
    remoteJid: "status@broadcast"
  },
  message: {
    contactMessage: {
      displayName: "B.M.B TECH VERIFIED ✅",
      vcard: `BEGIN:VCARD
VERSION:3.0
FN:B.M.B TECH VERIFIED ✅
ORG:BMB-TECH BOT;
TEL;type=CELL;type=VOICE;waid=255767862457:+255767862457
END:VCARD`
    }
  }
};

/* ===== GENERATE SHORT ID ===== */
function generateShortId(length = 6) {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/* ===== UPLOAD TO BMB API ===== */
async function uploadToBMB(mediaBuffer, mimeType) {
    if (!mediaBuffer) throw new Error("No media buffer provided");

    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else if (mimeType.includes('image/webp')) extension = '.webp';
    else if (mimeType.includes('image/gif')) extension = '.gif';
    else if (mimeType.includes('video/mp4')) extension = '.mp4';
    else if (mimeType.includes('video')) extension = '.mp4';
    else if (mimeType.includes('audio/mpeg')) extension = '.mp3';
    else if (mimeType.includes('audio')) extension = '.mp3';
    else if (mimeType.includes('application/pdf')) extension = '.pdf';
    else if (mimeType.includes('application')) extension = '.bin';
    else extension = '.bin';

    const shortId = generateShortId(6);
    const filename = `${shortId}${extension}`;

    const form = new FormData();
    form.append('file', mediaBuffer, {
        filename: filename,
        contentType: mimeType
    });

    const response = await axios.post(BMB_API, form, {
        headers: form.getHeaders(),
        timeout: 60000
    });

    const data = response.data;
    if (!data || !data.url) {
        throw new Error("Upload failed. BMB did not return a valid URL.");
    }

    return {
        url: data.url,
        shortId: shortId,
        filename: filename
    };
}

/* ===== COMMAND ===== */
bmbtz(
  {
    nomCom: "url",
    categorie: "General",
    reaction: "🎯"
  },
  async (from, zk, context) => {
    const { msgRepondu, ms, repondre } = context;

    const mediaMessage = msgRepondu?.imageMessage || 
                        msgRepondu?.videoMessage || 
                        msgRepondu?.audioMessage ||
                        ms.message?.imageMessage ||
                        ms.message?.videoMessage ||
                        ms.message?.audioMessage;

    if (!mediaMessage) {
      return repondre("❌ Please reply to an image, video, or audio file with .url");
    }

    let mimeType = '';
    if (mediaMessage.mimetype) {
        mimeType = mediaMessage.mimetype;
    } else if (mediaMessage.imageMessage) {
        mimeType = mediaMessage.imageMessage.mimetype || 'image/jpeg';
    } else if (mediaMessage.videoMessage) {
        mimeType = mediaMessage.videoMessage.mimetype || 'video/mp4';
    } else if (mediaMessage.audioMessage) {
        mimeType = mediaMessage.audioMessage.mimetype || 'audio/mpeg';
    }

    if (!mimeType) {
      return repondre("❌ Cannot detect media type. Please try again.");
    }

    const processingMsg = await repondre("⏳ Processing your media...");

    try {
      const mediaBuffer = await zk.downloadMediaMessage(mediaMessage);

      if (!mediaBuffer) {
        throw new Error("Failed to download media");
      }

      const fileSizeMB = mediaBuffer.length / (1024 * 1024);
      if (fileSizeMB > 100) {
        throw new Error("File size exceeds 100MB limit.");
      }

      const result = await uploadToBMB(mediaBuffer, mimeType);

      let mediaType = 'File';
      if (mimeType.includes('image')) mediaType = 'Image';
      else if (mimeType.includes('video')) mediaType = 'Video';
      else if (mimeType.includes('audio')) mediaType = 'Audio';

      const textResult = `
╭───〔 B.M.B TECH URL 〕───
│
│ 📁 TYPE   : ${mediaType}
│ 📦 SIZE   : ${fileSizeMB.toFixed(2)} MB
│ 🔑 SHORT  : ${result.shortId}
│ 🌐 LINK   :
│ ${result.url}
│
│ 📋 Click Copy Button
│
╰────────────────────────
`;

      const buttons = [
        {
          name: "cta_copy",
          buttonParamsJson: JSON.stringify({
            display_text: "📋 COPY URL",
            copy_code: result.url
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
                  text: textResult
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: "B.M.B TECH BOT 🤖 | 24/7 Active"
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                  title: "✅ Upload Successful!",
                  subtitle: "BMB URL Generated",
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

      const waMsg = generateWAMessageFromContent(
        from,
        viewOnceMessage,
        {}
      );

      await zk.relayMessage(from, waMsg.message, {
        messageId: waMsg.key.id
      });

      await zk.sendMessage(from, { delete: processingMsg.key });

    } catch (err) {
      console.error("BMB UPLOAD ERROR:", err);
      
      let errorMsg = "❌ Failed to generate media URL.";
      
      if (err.message.includes("exceeds 100MB")) {
        errorMsg = "❌ File too large! Please use file under 100MB.";
      } else if (err.message.includes("timeout")) {
        errorMsg = "⏰ Timeout! Please try again later.";
      } else if (err.message.includes("upload failed")) {
        errorMsg = "❌ Upload failed! Please try again.";
      } else {
        errorMsg = `❌ Error: ${err.message || "Unknown error occurred"}`;
      }
      
      await repondre(errorMsg);
    }
  }
);
