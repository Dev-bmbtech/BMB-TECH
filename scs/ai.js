const axios = require("axios");
const { bmbtz } = require("../devbmb/bmbtz");

bmbtz({
  'nomCom': 'ai',
  'reaction': "🤖",
  'categorie': 'AI'
}, async (client, msg, context) => {
  const {
    repondre,
    arg
  } = context;
  
  // Join the arguments to form the complete prompt
  const finalPrompt = arg.join(" ");
  
  // Check if the user actually provided a prompt
  if (!finalPrompt) {
    return repondre("Please provide a prompt for the AI...");
  }
  
  try {
    // Send the prompt to the API
    // Ensure you use backticks (`) for this string so the interpolation works!
    const response = await axios.get(`https://capilotapi.vercel.app/?q=${encodeURIComponent(finalPrompt)}`);
    
    // axios puts the entire JSON response inside 'data'
    // Your API's JSON puts the reply inside 'response'
    // So we string them together: response.data.response
    const aiReply = response.data.response;
    
    // Send the response back to the chat
    await repondre(aiReply);
    
  } catch (error) {
    console.error("Error fetching AI response:", error);
    await repondre("An error occurred while communicating with the AI. Please try again.");
  }
});
