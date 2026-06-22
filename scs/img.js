const axios = require("axios");
const { bmbtz } = require("../devbmb/bmbtz");

// Vitambulisho vyako ulivyotengeneza Google
const GOOGLE_API_KEY = "AIzaSyB1d0LW_MI5UIoVgsN8Xi8lESl1crwbVLI";
const GOOGLE_CX = "f1048cb92b82842c8";

bmbtz({
  nomCom: "img",
  categorie: "Search",
  reaction: "🔍"
}, async (jid, sock, { arg, ms, repondre }) => {
  try {
    // Kuunganisha maneno anayotafuta mtumiaji (mfano: .img simba)
    const query = arg.join(" ");
    if (!query) return repondre("❌ Tafadhali weka jina la picha unayotafuta.\nMfano: .img magari ya kifahari");

    repondre(`⏳ Inatafuta picha za "${query}"... Tafadhali subiri.`);

    // Link ya Google Custom Search API ikitafuta picha tu (searchType=image)
    const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(query)}&searchType=image`;

    const response = await axios.get(apiUrl);
    const items = response.data.items;

    // Kama hakuna picha zilizopatikana kabisa
    if (!items || items.length === 0) {
      return repondre("❌ Samahani, hakuna picha zilizopatikana kwa utafutaji huo.");
    }

    // Kuchukua picha 5 tu za mwanzo
    const maxImages = Math.min(items.length, 5);

    for (let i = 0; i < maxImages; i++) {
      const imageUrl = items[i].link; // Link ya picha kutoka Google

      // Tuma picha kwenda WhatsApp
      await sock.sendMessage(jid, {
        image: { url: imageUrl },
        caption: `🖼️ *Picha ya ${i + 1} ya:* ${query}\n\n> Powered by 𝙱.𝙼.𝙱-𝚃𝙴𝙲𝙷 🤖`
      }, { quoted: ms });
    }

  } catch (error) {
    console.error("Google Image Search Error:", error);
    repondre("❌ Hitilafu imetokea wakati wa kutafuta picha. Jaribu tena baadae.");
  }
});
