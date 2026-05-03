const axios = require("axios");
const { bmbtz } = require("../devbmb/bmbtz");

/* ===== API CONFIG ===== */
const API_URL = "https://iamtkm.vercel.app/ai/gpt5";
const API_KEY = "tkm";

/* ===== COMMAND ===== */
bmbtz(
  {
    nomCom: "gpt",
    categorie: "AI",
    reaction: "🤖",
    alias: ["gpt5", "ai5", "askgpt", "wolfai"]
  },
  async (dest, zk, context) => {
    const { arg, repondre, ms } = context;

    /* ===== HELP ===== */
    if (!arg[0] || arg[0].toLowerCase() === "help") {
      return repondre(
        "🤖 *B.M.B GPT-5*\n\n" +
        "📌 *Usage:*\n" +
        "• .gpt hello\n" +
        "• .gpt code javascript function\n" +
        "• .gpt creative short story\n" +
        "• .gpt explain async await\n"
      );
    }

    /* ===== MODES ===== */
    const specialCommands = {
      code: "code",
      program: "code",
      coding: "code",
      creative: "creative",
      write: "creative",
      story: "creative",
      explain: "explain",
      whatis: "explain",
      define: "explain"
    };

    let query = arg.join(" ");
    let mode = "general";
    let enhancedPrompt = query;

    const firstWord = arg[0].toLowerCase();
    if (specialCommands[firstWord]) {
      mode = specialCommands[firstWord];
      query = arg.slice(1).join(" ");

      if (!query) return repondre("❌ Please provide your question.");

      if (mode === "code") {
        enhancedPrompt =
          `You are an expert programmer. Provide clean and efficient code with explanation.\nQuestion: ${query}`;
      } else if (mode === "creative") {
        enhancedPrompt =
          `You are a creative writer. Be imaginative and engaging.\nWrite: ${query}`;
      } else if (mode === "explain") {
        enhancedPrompt =
          `You are a teacher. Explain clearly with examples.\nTopic: ${query}`;
      }
    }

    try {
      /* ===== REACT ===== */
      await zk.sendMessage(dest, {
        react: { text: "⏳", key: ms.key }
      });

      /* ===== API REQUEST ===== */
      const res = await axios.get(API_URL, {
        params: {
          apikey: API_KEY,
          text: enhancedPrompt
        },
        timeout: 35000
      });

      const data = res.data;
      let aiResponse = "";

      if (data?.status && data.result) {
        aiResponse = data.result;
      } else if (data?.response) {
        aiResponse = data.response;
      } else if (data?.answer) {
        aiResponse = data.answer;
      } else {
        aiResponse = JSON.stringify(data, null, 2).slice(0, 1500);
      }

      aiResponse = formatResponse(aiResponse, mode);

      if (aiResponse.length > 3000) {
        aiResponse = aiResponse.slice(0, 3000) + "\n\n...truncated";
      }

      /* ===== FINAL MESSAGE ===== */
      let text =
        "🤖 *B.M.B GPT-5*\n\n";

      if (mode !== "general") {
        const icons = {
          code: "👨‍💻",
          creative: "🎨",
          explain: "📘"
        };
        text += `${icons[mode]} *Mode:* ${mode.toUpperCase()}\n\n`;
      }

      text +=
        `🎯 *Question:*\n${query.slice(0, 100)}\n\n` +
        `✨ *Response:*\n${aiResponse}\n\n` +
        "⚡ *Powered by B.M.B TECH*";

      await zk.sendMessage(dest, { text });

    } catch (err) {
      console.error("GPT ERROR:", err.response?.data || err);
      repondre(
        "❌ *GPT-5 Error*\n\n" +
        "• API may be down\n" +
        "• Try again later\n" +
        "• Use shorter questions"
      );
    }
  }
);

/* ===== HELPERS ===== */

function formatResponse(text, mode) {
  if (!text) return "";

  if (mode === "code" && !text.includes("```")) {
    return "```" + "\n" + text + "\n```";
  }

  if (mode === "creative") {
    return text.replace(/\n\s*\n/g, "\n\n");
  }

  return text;
}
