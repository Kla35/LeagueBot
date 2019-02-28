const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const ytdl = require('ytdl-core');
const PREFIX = "!";
var moment = require('moment');

var dispatcher;
var stop;
var heure;

stop="0";

bot.login(process.env.TOKEN) //TOKEN

bot.on("message", async message => {
    // This event will run on every single message received, from any channel or DM.
    
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
})


bot.on('message', message => {
    if (message.content === '!help') {
      message.author.createDM().then(channel => {
      channel.send(`a`);
    })
  }
  });

bot.on('message', message => {
    if (message.content === '!mp') {
      message.author.createDM().then(channel => {
      channel.send(`Oh non, un fou...`);
    })
  }
  });

bot.on('message', message =>{
    if(message.content.startsWith('!play')){
    var str = message.content
    args = str.substring(6)    
    if(message.member.voiceChannel) {
        message.member.voiceChannel.join().then(connection =>{
            message.reply(args)
            dispatcher = connection.playStream(ytdl(args))
            dispatcher.setVolume(0.03);
            dispatcher.on('error',e => {
                console.log(e);
            });
            dispatcher.on('end',e => {
                console.log('Fin du son');
                connection.disconnect()
            });
        }).catch(console.log);
    }
    }

})

bot.on('message', message =>{
    if(message.content.startsWith('!volume')){
        var str2 = message.content
        volumelvl1 = str2.substring(8)
        volumelvl2 = volumelvl1/1000
        dispatcher.setVolume(volumelvl2)
    }
})

bot.on('message', message =>{
    if(message.content.startsWith('!stop')){
        message.member.voiceChannel.leave();
    }
})

bot.on('message', message =>{
    if(message.content.startsWith('!time')){
		moment.locale('fr');
		var testheure = moment().add(1, 'h').format('LT');
		message.channel.sendMessage('Il est ' + testheure);
    }
})
