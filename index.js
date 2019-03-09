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
	  => !lol maitrise [Invocateur] : Affiche les 5 plus grosses maîtrises de l'invocateur`);
    })
  }
  });

bot.on('message', message => {
    if (message.content === '!mp') {
      message.author.createDM().then(channel => {
      channel.send(`Ouverture des MP :`);
    })
  }
  });
 
 bot.on('message', message =>{
    if(message.content.startsWith('!test')){
		console.log(bot.user.fetchProfile());
    }
})
 
 
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
				var tabnumchampion = new Array(5);
				var nbperso = response.length;
				if (nbperso > 4) {
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
							tabnumchampion[i] = champion[j]['icon'];
						}
						i=i+1;
					}
				var z;
				for (z=0;z<5;z++){
				const embed = {
				  "description": "=> **" + tabchampion[z] + ", maîtrise " + maitrise[z]['championLevel'] + "**"+ "```Points de maîtrise : " + maitrise[z]['championPoints'] + "```",
				  "thumbnail": {
					"url": tabnumchampion[z]
				  }
				};
				message.channel.sendMessage({ embed });;
				}
				} else {
					message.channel.sendMessage("Erreur : " + str + " possède moins de 5 maitrises");
				}
				
			});
		})
		.catch(err => {
			'use strict';
			message.channel.sendMessage("Erreur : " + str + " n'existe pas sur le serveur EUW");
			console.log(err);
		});
		
  }
  });
  
  bot.on('message', message => {
    if (message.content.startsWith('!lol profil')) {
		var str = message.content;
		var accountID;
		id = message.content;
		str = str.substring(12);
		leagueJs.Summoner
		.gettingByName(str)
		.then(data => {
			'use strict';
			accountID = data['accountId'];
			id = data['id'];
			getJSON('https://euw1.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/'+id+'?api_key='+LEAGUE_API_KEY, function(error, response){
				var maitrise = response;
				//Test Mains
				var i = 0;
				var checkChampion;
				var j = 0;
				var tabchampion = new Array(5);
				var tabnumchampion = new Array(5);
				var nbperso = response.length;
				if (nbperso > 3) {
					while (i<3) {
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
							tabnumchampion[i] = champion[j]['icon'];
						}
						i=i+1;
					}
				} else {
						while (i<nbperso) {
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
							tabnumchampion[i] = champion[j]['icon'];
						}
						i=i+1;
					}
					while (i<3){
						tabchampion[i] = "Vide";
						i=i+1;
					}
				}
				getJSON('https://euw1.api.riotgames.com/lol/league/v4/positions/by-summoner/'+id+'?api_key='+LEAGUE_API_KEY, function(error, response){
					var ranked = response;
					getJSON('https://euw1.api.riotgames.com/lol/match/v4/matchlists/by-account/'+accountID, function(error, response){
						var match = response;
						
						var y = -1;
						var stop = 0;
						//Test Ranked
						if (ranked.length > 0) {
							while ((y<ranked.length) && (stop === 0)){
							y=y+1;
							if (ranked[y].queueType === "RANKED_SOLO_5x5"){
								stop = 1;
							}
						}
						//Test Winrate
						var winrate = (ranked[y].wins / (ranked[y].wins + ranked[y].losses))*100;
						winrate = winrate.toFixed(2)
						//Search pic url rank
						var urlRank = "https://outilnumj.000webhostapp.com/images/"+ ranked[y].tier +".png"
						console.log(urlRank);
						//Message
						const embed = {
						  "title": "**" + str +" - Niveau "+ data.summonerLevel + "**",
						  "description": "SoloQ : " + ranked[y].tier + " " + ranked[y].rank + " - " + ranked[y].leaguePoints + "LP ```\n Winrate : " + winrate + "% \n(" + ranked[y].wins + "W | " + ranked[y].losses + "L )"+"``````"+"\n Mains : "+ tabchampion[0] + "," + tabchampion[1] + ","+tabchampion[2]+"```",
						  "thumbnail": {
							"url": urlRank
						  }
						};
						message.channel.sendMessage({ embed });;
						} else {
							const embed = {
						  "title": "**" + str +" - Niveau "+ data.summonerLevel + "**",
						  "description": "Non ranked ```\n Winrate : " + winrate + "% \n Mains : "+ tabchampion[0] + "," + tabchampion[1] + ","+tabchampion[2]+"```",
						  "thumbnail": {
							"url": "https://cdn.discordapp.com/embed/avatars/0.png"
						  }
							};
							message.channel.sendMessage({ embed });;
						}
					});
				});
			});
		})
		.catch(err => {
			'use strict';
			message.channel.sendMessage("Erreur : " + str + " n'existe pas sur le serveur EUW");
			console.log(err);
		});
		
  }
  });

/*
const embed = {
  "title": "**${summoner} - Niveau {lvl}**",
  "description": "**--------------------------------------**",
  "thumbnail": {
    "url": "https://cdn.discordapp.com/embed/avatars/0.png"
  },
  "fields": [
    {
      "name": "Tier : {league} {lvl} - {nblp} LP",
      "value": "-------------------------------------"
    },
    {
      "name": "Winrate : {%}% - {nb} LP",
      "value": "-------------------------------------"
    },
    {
      "name": "Mains :",
      "value": "-------------------------------------"
    }
  ]
};
channel.send({ embed }); */
	
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
