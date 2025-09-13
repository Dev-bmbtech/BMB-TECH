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
    session: process.env.SESSION_ID || 'B.M.B-TECH;;;;eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQUxKbFFFNUlySDlOUCtrbkFhcENoV2Y0SXpyREVLL3N2bHVZOXhOdjVXbz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV3hiNDlSdElXckdNazVyVktKOUhQcWhQK1Ryd2hUNTAxTHdmdVNmL1FHVT0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJFRnNxdndiY0J0bS81NFNuODdrOG1OQ1pOQ3hLdGUxQVRvajJkLzZxazAwPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI4R2FNSFFxaUc2bGdGOHRNL1JmY2RPa3RDdGV5Z2lHTTkvMUxRclpjOHhJPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjROeE9vS05na2lZN2VSalJRWk5BSVJQR3VhRHA2YjlZWUZLQ3lFaGJWM0E9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlV0clEzSzdTUWh4N1dYYnFZWllQUUo0dXNuZEdOeXBBUFJnQnlGYksxakE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieUNLM0RlOFYzblI2NFNQM1RLRjFEQzhOSnVxVzBVbkZTL0dqVFFOcE4yOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiUjZlV1ViUUF6RS9rVFZ6Nko1aXc3NVltbjNaVXV5UDViY3lNZUlQNXlYTT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjhDd1pDKzZrRVp4ckZ6YlJTemo3bnpobm5HL2FybTRJejZ6dDcwdDhZUVNFSUdOb0tCOGdBMU5TWS83dmY4TkxQN1I1WWdJb2VWQ0kycHpsU0N0M2d3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjUsImFkdlNlY3JldEtleSI6IitSRW55TkVBR1NCOFFKNy9iSDh0YUI1S0pscktEZUt6YXViUG1VcnVLM2M9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiMjM0ODEyMjYxODc4N0BzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiIzQUJFRDYyRkU5NUUxQ0U5NUYzRSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzU3MTA2NjI4fSx7ImtleSI6eyJyZW1vdGVKaWQiOiIyMzQ4MTIyNjE4Nzg3QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IjNBOUMwNDBDNTE0RkE2NzJDREQ0In0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NTcxMDY2MzB9LHsia2V5Ijp7InJlbW90ZUppZCI6IjIzNDgxMjI2MTg3ODdAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiM0E5MjQxOUQ1RjExMERCMjc1OUEifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc1NzEwNjYzNn1dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjpmYWxzZX0sInJlZ2lzdGVyZWQiOnRydWUsInBhaXJpbmdDb2RlIjoiNzVCNEFXUDkiLCJtZSI6eyJpZCI6IjIzNDgxMjI2MTg3ODc6NDZAcy53aGF0c2FwcC5uZXQiLCJsaWQiOiIzMDYwMjI2Mjc4MTk4MDo0NkBsaWQiLCJuYW1lIjoi44CA4oGf44CA4oGf4oGf77iPICJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDTzJVMTZZT0VMU2o3Y1VHR0FFZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiQVhJakxYSllnYVhERkpOalVySXVCVzlpMmpuTTBuOGh5dEFENEFoRzNETT0iLCJhY2NvdW50U2lnbmF0dXJlIjoiTFhPbmRNcmdjTW1OYS9SRTRvVFRqQnQ1WGQ4Y2xpa2RBWTlhbmVkNDRvQ1dzTnRZR0J5TEZNYlVmZVBqUDEwV0ZudWxjVkFLbHpvejNVY2t3VStmaXc9PSIsImRldmljZVNpZ25hdHVyZSI6ImdKQUJFWllJcXR1KzYzZ2tYa0did0d0YXgwOVdaYStUVGV2OU02UUFQbWlrUGFxQzRZdGlYMk9veVV6Q1EwSllSWUorcnBlVzNwTU0xZUNwR1VydWlnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjM0ODEyMjYxODc4Nzo0NkBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJRRnlJeTF5V0lHbHd4U1RZMUt5TGdWdll0bzV6TkovSWNyUUErQUlSdHd6In19XSwicGxhdGZvcm0iOiJpcGhvbmUiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBVUlBZz09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1NzEwNjYyNSwibGFzdFByb3BIYXNoIjoibm0zQmIiLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUQwayJ9',
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
