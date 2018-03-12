const Discord = require('discord.js'); // Gets The Discord.js Package
const fs = require("fs"); // Gets the fs Package
const bot = new Discord.Client(); // Our Discord Client defined as bot

var config = require('./storages/config.json'); // Config File
var guildConf = require('./storages/guildConf.json');

bot.on('ready', () => { // If the Bot went on, proceed
    console.log('I\'m Online!');
});

bot.on('guildCreate', (guild) => { // If the Bot was added on a server, proceed
    if (!guildConf[guild.id]) { // If the guild's id is not on the GUILDCONF File, proceed
	guildConf[guild.id] = {
		prefix: config.prefix
	}
    }
     fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
     	if (err) console.log(err)
	})
});


bot.on('guildDelete', (guild) => { // If the Bot was removed on a server, proceed
     delete guildConf[guild.id]; // Deletes the Guild ID and Prefix
     fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
     	if (err) console.log(err)
	})
});


bot.on('message', (message) => {
    if (message.channel.type === "dm" || message.author.bot || message.author === bot.user) return; // Checks if we're on DMs, or the Author is a Bot, or the Author is our Bot, stop.
    var args = message.content.slice(guildConf[message.guild.id].prefix.length).split(/ +/g); // We need this later
    var command = args.shift().toLowerCase(); // Replaces the Current Prefix with this

    if (command === "ping") { // If your command is <prefix>ping, proceed
	message.channel.send('pong!') // Reply pong!
    } else
    if (command === "prefix") {
	guildConf[message.guild.id].prefix = args[0];
	if (!guildConf[message.guild.id].prefix) {
		guildConf[message.guild.id].prefix = config.prefix; // If you didn't specify a Prefix, set the Prefix to the Default Prefix
	}
     fs.writeFile('./storages/guildConf.json', JSON.stringify(guildConf, null, 2), (err) => {
     	if (err) console.log(err)
	})
  }
});

bot.login(config.token);
