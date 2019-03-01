//Modifier API KEY si marche plus (erreur 401)

const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');
const ytdl = require('ytdl-core');
var getJSON = require('get-json')
var champion = require("./champion2.json");
const LeagueJS = require('./node_modules/leaguejs/lib/LeagueJS.js');
const PREFIX = "!";
var moment = require('moment');
var LEAGUE_API_KEY = process.env.LEAGUE_API_KEY;
var TOKEN = process.env.TOKEN;
 //
 
const leagueJs = new LeagueJS(LEAGUE_API_KEY, {
        useV4: true, // enables apiVersion overrides
        // these values override default values in Config.js
        // values omitted will use defaults from Config.js!
        apiVersionOverrides: {
            'Champion': 'v3',
            'ChampionMastery': 'v4',
            'League': 'v4',
            'LolStatus': 'v3',
            'Match': 'v4',
            'Spectator': 'v4',
            'Summoner': 'v4',
            'ThirdPartyCode': 'v4',
            // 'TournamentStub': 'v3',
            // 'Tournament': 'v3'
        }
    } )
	
var dispatcher;
var stop;
var heure;

stop="0";

bot.login(TOKEN) //

bot.on("message", async message => {
    // This event will run on every single message received, from any channel or DM.
    
    // It's good practice to ignore other bots. This also makes your bot ignore itself
    // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
})


bot.on('message', message => {
    if (message.content === '!help') {
      message.author.createDM().then(channel => {
      channel.send(`Commande du bot :
	  => !lol maitrise [Invocateur] : Affiche les 5 plus grosses maîtrises`);
    })
  }
  });

bot.on('message', message => {
    if (message.content === '!mp') {
      message.author.createDM().then(channel => {
      channel.send(`Oh non, un fou..`);
    })
  }
  });
 
 bot.on('message', message => {
    if (message.content.startsWith('!lol maitrise')) {
		var str = message.content;
		id = message.content;
		str = str.substring(14)
		leagueJs.Summoner
		.gettingByName(str)
		.then(data => {
			'use strict';
			console.log(data['id']);
			id = data['id'];
			getJSON('https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/'+id+'?api_key='+LEAGUE_API_KEY, function(error, response){
				var maitrise;
				var i = 0;
				var checkChampion;
				var j = 0;
				maitrise = response;
				var tabchampion = new Array(5);
				while (i<5) {
					j = 0;
					checkChampion = response[i].championId.toString();
					var returnChampion;
					while ((checkChampion != returnChampion)){
						j=j+1;
						returnChampion = champion[j].key;
					}
					if (checkChampion === champion[j]['key']) {
						console.log(champion[j]['key']);
						tabchampion[i] = champion[j]['name'];
					}
					i=i+1;
				}
				message.channel.sendMessage(`Voici les champions les plus maitrisés par ` + str + `
=> ` + tabchampion[0] + `, maîtrise ` + maitrise[0]['championLevel'] + ` avec ` + maitrise[0]['championPoints'] + ` points
=> ` + tabchampion[1] + `, maîtrise ` + maitrise[1]['championLevel'] + ` avec ` + maitrise[1]['championPoints'] + ` points
=> ` + tabchampion[2] + `, maîtrise ` + maitrise[2]['championLevel'] + ` avec ` + maitrise[2]['championPoints'] + ` points
=> ` + tabchampion[3] + `, maîtrise ` + maitrise[3]['championLevel'] + ` avec ` + maitrise[3]['championPoints'] + ` points
=> ` + tabchampion[4] + `, maîtrise ` + maitrise[4]['championLevel'] + ` avec ` + maitrise[4]['championPoints'] + ` points`);
			});
		})
		.catch(err => {
			'use strict';
			console.log(err);
		});
		
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
