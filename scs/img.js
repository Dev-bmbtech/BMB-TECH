const { bmbtz } = require("../devbmb/bmbtz");
const axios = require("axios");

const BASE_URL = "https://noobs-api.top";
const BOT = "B.M.B-TECH";
const NEWSLETTER_JID = "120363382023564830@newsletter";
const NEWSLETTER_NAME = "Bmb Tech Info";

/* ===================== CONTEXT ===================== */
const getContextInfo = (query = "") => ({
  forwardingScore: 1,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: NEWSLETTER_JID,
    newsletterName: NEWSLETTER_NAME,
    serverMessageId: -1
  },
  body: query ? `Requested: ${query}` : undefined,
  title: BOT
});

/* ===================== GOOGLE IMAGE SEARCH (5 IMAGES) ===================== */
bmbtz(
  { nomCom: "img", categorie: "Search", reaction: "🔍" },
  async (origineMessage, zk, commandeOptions) => {
    const { ms, arg, repondre } = commandeOptions;
    const query = arg.join(" ");
    
    if (!query)
      return zk.sendMessage(
        origineMessage,
        { text: "Please provide an image name.\nExample: .img luxury cars", contextInfo: getContextInfo() },
        { quoted: ms }
      );

    try {
      repondre(`⏳ Searching for images of "${query}"... Please wait.`);

      // Fetching images from noobs-api.top
      const apiURL = `${BASE_URL}/dipto/googleImage?text=${encodeURIComponent(query)}`;
      const { data } = await axios.get(apiURL);

      // Check if data exists and contains the results array
      if (!data || !data.result || data.result.length === 0) {
        return zk.sendMessage(
          origineMessage,
          { text: "❌ Sorry, no results found for that search.", contextInfo: getContextInfo() },
          { quoted: ms }
        );
      }

      // Limit results to a maximum of 5 images
      const maxImages = Math.min(data.result.length, 5);

      for (let i = 0; i < maxImages; i++) {
        const imageUrl = data.result[i];

        // Send each image to WhatsApp
        await zk.sendMessage(
          origineMessage,
          {
            image: { url: imageUrl },
            caption: `🖼️ *Image ${i + 1} of:* ${query}\n\n> Powered by 𝙱.𝙼.𝙱-𝚃𝙴𝙲𝙷 🤖`,
            contextInfo: getContextInfo(query)
          },
          { quoted: ms }
        );
      }

    } catch (e) {
      console.error("[IMAGE SEARCH ERROR]", e);
      zk.sendMessage(
        origineMessage,
        { text: "❌ An error occurred while searching for the image.", contextInfo: getContextInfo() },
        { quoted: ms }
      );
    }
  }
);
