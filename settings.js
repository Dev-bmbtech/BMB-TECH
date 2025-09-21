const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('settings.env'))
    require('dotenv').config({ path: __dirname + '/settings.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;

module.exports = {
    session: process.env.SESSION_ID || 'B.M.B-TECH;;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0Z6U285M2xPRVl2R09nZTg3WHdvajNadmU4YU9wY1lMZlpCV09YZmhIZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK1YzQjFtWDhCWSs3d1QyZkJta2hqTkhHdWZaVmFWV1JPSnhQdFFMMElHcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJjRnRzNEhGTlZCNTA5YzZqUnU5anFuL1hDV3o1VWhCTVBBNmxadkRPaVhZPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJqeDV6ZVFJc2ZlbE80NlZLWmZQYS8wd1NXcnlhYUp2a2loSzFlM3Zna1NjPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImFBUlpieGFFUU9rWmFtS291dnRmbGhaLzJvZ2xGTVphcFZaOTdSZ1FGVWs9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjFxL1BJN2FwNk1STzc0NlB3UURtQ0kvQUJMQWhidWlFVC9iYlg4V0ZYU3c9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOEdzUWhYdGtDMmZBeHZ0eXljdEs0bW9yU2swVEFlclFvN1VTamlvV1ExRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoidUxZTWdzdDlPV2x1a2F6dkZEVmFkWHYyeXo0U0J5UXBmU0FvNWRiVlV3cz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkN6aTQyd2pPby9tczAyRHY0VVpycWprMkd5Rng4SWhTUTBSVjZGMUFVWkdBdWRDalgyald4WkZ0THFWNTNKR042QUhaaHJVUDQvdG00U25TdU9DZ0NnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjQsImFkdlNlY3JldEtleSI6InBjOVV3Y21FaXdBSERyQXJrekEyamgzOElWNFcyMCtzZDRZeTRSV1Y5VTA9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IkEyVk1LUE45IiwibWUiOnsiaWQiOiI5NDc3NTY4ODY3MzoyM0BzLndoYXRzYXBwLm5ldCIsImxpZCI6IjI3NDg5OTk4NTgwNTMzMToyM0BsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0xqUDhyUUZFSkhxdnNZR0dBc2dBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IjdvNU4yRjdrZWs1RHpHR3FqdzRlSkNoTEc1WjNocnYyNzVzMTJvL3ROQ0U9IiwiYWNjb3VudFNpZ25hdHVyZSI6Im80ZlppUER0NHZsSGtTSWtIWDVaZ21nc1ZES1dvMFJPMGhUU0tQWVl6OTEzVGtCK2hxMTFNTXVOWlk1c1dCRDI2cUJYSHlrR2p2Q0piSGxreFJaaUNRPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJYWEQ0SUZ1aEhnSHpCNzVDd1o3cVIvOHpsbEFtRktMbVVNc1IxU1RGOVZydHFBRi9XeCtPY1NSWHVpenkrc1dOaEV2SXZ3bVdiWnU5anRqNC81YjZBUT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6Ijk0Nzc1Njg4NjczOjIzQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmU2T1RkaGU1SHBPUTh4aHFvOE9IaVFvU3h1V2Q0YTc5dStiTmRxUDdUUWgifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBMElFZz09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1ODQ0Mjc4MywibGFzdFByb3BIYXNoIjoiMlY3N3FVIiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFQaWcifQ==',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "B.M.B-TECH",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "25576786×××××",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'B.M.B-TECH',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/8qq3l4.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_API_KEY : process.env.HEROKU_API_KEY, 
    WARN_COUNT : process.env.WARN_COUNT || '3',
    ETAT : process.env.PRESENCE || '',
    ANTICALL : process.env.ANTICALL || 'yes',   
    AUTO_BIO : process.env.AUTO_BIO || 'yes',               
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTIDELETE1 : process.env.ANTI_DELETE_MESSAGE || 'no',
    AUTO_REACT : process.env.AUTO_REACT || 'no',
    AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_READ : process.env.AUTO_READ || 'yes',
    CHAT_BOT: process.env.CHAT_BOT || 'yes',
    AUDIO_REPLY: process.env.AUDIO_REPLY || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway"
        : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
};

let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});
