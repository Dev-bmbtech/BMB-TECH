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
    session: process.env.SESSION_ID || 'B.M.B-TECH;;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNk1hK013Q2o3aFl5LzRCc2NDREx6NkptQm14WCtBK2g3Rklia3dnN2kyTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiSjFNWTFhRlpON2tzbExOSDJlOTZCRmE4N0FnNWc0Y3NiYzlLZ1NNcGtGRT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI0Q04yT0ttWTlZZGJXWjdxSGRLaE1hUUt5K0FaNVYza0lTZU5YZ0pGUTBFPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ6c3R2M1dqZDRRNytlNFErQjF2S1YyQ1NUSmszaE5aWnNVU2xYOE1qc0E4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVCTy91QzhNY3dlL3l3TklDemFuKzZ4Z1hsa3o4Q1ZISlRaOE15eDZiWDg9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndyeUFqRlBDVEs1OHVUYXhxRmNxZHJsSG8vSUIwMkJJakVaWVM4eTJOem89In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicUEvVjgxaCtCblNZUWJIMlhGZE5pNTBaaEtiSzgxR1Vvc1hRSWhJN2ozZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiM3JKOXFqem1ZWFRKTUl4cmxObWRGaG1iRXUxcmZocC9aQk5pQ1liTXNEND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlhKWG40UDZBMHhoL2J2bFlZNUlhK1BJZ0Qra2IxNTcwYXdZakYwWXVSY0hRd2JCMHJObGw1Z09adE54REdKYXBSVUh5V1J1dG1wejdpb1lvTHRIVmlBPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTUyLCJhZHZTZWNyZXRLZXkiOiJTeGhXWm9kcEJhbVRVUVkyZld5RURGeG02bHpGOHFuVHlPemJJWTk1blVBPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiJNWVFMRjdNWCIsIm1lIjp7ImlkIjoiMjYzNzczMTY5NTM2OjJAcy53aGF0c2FwcC5uZXQiLCJuYW1lIjoiV2l6YXJkIG5pbmphIiwibGlkIjoiMTg4OTQxMTQ4MDc4Njg6MkBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0w3anNiUUhFS2kydXNZR0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6InlhcTJzOW01NHJRWEp0MUorQ1R6RTAyakRKYzVqZnQzTDBnaFRNOUhpQ0U9IiwiYWNjb3VudFNpZ25hdHVyZSI6InFuMks5cVYvRE9IYjdkZkR5MWtiRDBub2tjYkJHWE5hK2RSdkxNcGpTbmZQR1NYWTlocCtVajNOeUlobkxYVldlTS8vWGhTNkRWK1BMU3kxS3BWWUN3PT0iLCJkZXZpY2VTaWduYXR1cmUiOiIyWVA3OVV3OXAzM1pjSWtqUVFUOHl5WkxjcE9MZUVNMU5pZnNOaVdhRlh4K0FyTW9kbzZ3QStmMEFYa0w3eGlvMTNaUkVyTndsMUlhRzhLWTBIcmpnQT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjI2Mzc3MzE2OTUzNjoyQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmNtcXRyUFp1ZUswRnliZFNmZ2s4eE5Ob3d5WE9ZMzdkeTlJSVV6UFI0Z2gifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBMElDQT09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1ODM3MDYxMywibGFzdFByb3BIYXNoIjoibm0zQmIiLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUFNdCJ9',
    PREFIXE: process.env.PREFIX || "+",
    OWNER_NAME: process.env.OWNER_NAME || "Fradrick Musakatiza",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "263773169536",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'STENA-XMD',
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
