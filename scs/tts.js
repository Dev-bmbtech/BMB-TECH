const googleTTS = require('google-tts-api');
const {bmbtz} = require("../devbmb/bmbtz");


bmbtz( {
  nomCom : "dit",
 categorie : "User",
  reaction : "👄" },
      async(dest,zk, commandeOptions)=> {
 
const {ms,arg,repondre} = commandeOptions;
      if (!arg[0]) {repondre("Insert a word");return} ;
 const mots = arg.join(" ")

const url = googleTTS.getAudioUrl( mots, {
  lang: 'fr',
  slow: false,
  host: 'https://translate.google.com',
});
console.log(url); 
             zk.sendMessage(dest, { audio: { url:url},mimetype:'audio/mp4' }, { quoted: ms,ptt: true });


        
}
) ;

bmbtz( {
  nomCom : "itta",
 categorie : "User",
  reaction : "👄" },
      async(dest,zk, commandeOptions)=> {
 
const {ms,arg,repondre} = commandeOptions;
      if (!arg[0]) {repondre("Insert a word");return} ;
 const mots = arg.join(" ")

const url = googleTTS.getAudioUrl( mots, {
  lang: 'ja',
  slow: false,
  host: 'https://translate.google.com',
});
console.log(url); 
             zk.sendMessage(dest, { audio: { url:url},mimetype:'audio/mp4' }, { quoted: ms,ptt: true });


        
}
) ;

bmbtz( {
  nomCom : "say",
 categorie : "User",
  reaction : "👄" },
      async(dest,zk, commandeOptions)=> {
 
const {ms,arg,repondre} = commandeOptions;
      if (!arg[0]) {repondre("Insert a word");return} ;
 const mots = arg.join(" ")

const url = googleTTS.getAudioUrl( mots, {
  lang: 'en',
  slow: false,
  host: 'https://translate.google.com',
});
console.log(url); 
             zk.sendMessage(dest, { audio: { url:url},mimetype:'audio/mp4' }, { quoted: ms,ptt: true });


        
}
) ;

  
