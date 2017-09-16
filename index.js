const Discord = require("discord.js");
const fs = require("fs");
const http = require("http");
const TOKEN = "MzQzNDcyOTg2ODA5OTU4NDIw.DJ7EuA.UOCrkzKxu7kp3LvGPDu6uC1O49s";//"MzQzNDcyOTg2ODA5OTU4NDIw.DGerqw.9uJIKEjNy0MnFeLVatRaLv658BQ";
const PREFIX = "."

var bot = new Discord.Client();
var gyms;
var canadd = ['1169'];

bot.on("ready", function(){
    //var url = "http://www.inu-papa.com/game/gyms.txt";
    var data = '';
    /*http.get(url, function (res) {
        console.log(res.statusCode);

        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            gyms = data.split("`");
        });
    }).on('error', (e) => {
        console.log('Got error: ' + e.message);
    });*/
    

    var readStream = fs.createReadStream('gyms.txt', 'utf8');

    readStream.on('data', function(chunk) {  
        data += chunk;
    }).on('end', function() {
        gyms = data.split("`");
    });
});

bot.on("message", function(message){
    if(message.author.equals(bot.user)) return;
    if(!message.content.startsWith(PREFIX)) return;

    var args = message.content.substring(PREFIX.length).split(" ");
    
    switch(args[0])
    {
        case "ping":
            message.channel.send("Pong!");
            break;
        case "whereiscount":
            message.channel.send("I currently have " + gyms.length + " gyms in my database.");
            break;
        case "whereishelp":
            message.channel.send("Type '.whereis [gym name]' to return a map leading to the specified gym.");
            message.channel.send("Queries are case-insensitive, ignore punctuation, and do not require the full name of the gym");
            message.channel.send("For example, '.whereis st joseph c' will match 'St. Joseph Catholic Church.");
            message.channel.send("Gym names are exactly as they are given in-game, including any spelling errors originally present.");
            message.channel.send("Exceptions are made for gyms with exactly the same name, which are modified to specify the city where they are found to differentiate them.");
        case "whereis":
            var queryname = '';
            var found = false;
            for(var i = 1; i < args.length; i++){
                queryname += args[i].replace(/\W/g, '').toLowerCase();
            }
            if(queryname.length > 0 && args.length > 1){
                for(var j = 0; j < gyms.length; j++){
                    if(gyms[j].replace(/\W/g, '').toLowerCase().startsWith(queryname)){
                        console.log(gyms[j]);
                        var gymargs = gyms[j].split(";");
                        var location = gymargs[0] + ": " + "https://www.google.com/maps/dir/Current+Location/" + gymargs[1];
                        message.channel.send(location);
                        found = true;
                    }
                }
                if(!found){
                message.channel.send("No matching gym found.  If this gym needs to be added, please request a moderator add it.");
                }
            }            
            break;
        case "whereisadd":
            //Only usable if gyms.txt is in a writable location
            console.log(message.author.discriminator);
            var add = false;
            for(var k = 0; k < canadd.length; k++){
                if(message.author.discriminator == canadd[k]) {add = true;}
            }
            if(add){
                if(args[args.length-1].indexOf(',') > 0){
                    var gymname = '';
                    for(var i = 1; i < args.length-1; i++){
                        gymname += args[i];
                        if(i < args.length-2){ gymname += " ";}
                    }
                    var match = false;
                    for(var h = 0; h < gyms.length; h++){
                        if(gyms[h].replace(/\W/g, '').toLowerCase().startsWith(gymname.replace(/\W/g, '').toLowerCase())) {
                            match = true;
                            message.channel.send("Gym with name " + gymname + " already found.");
                        }
                    }
                    if(!match){
                        gyms.push(gymname + ";" + args[args.length-1]);
                        message.channel.send("Successfully added " + gymname + " at " + args[args.length-1]);
                        fs.appendFileSync('gyms.txt', "`" + gymname + ";" + args[args.length-1]);
                        console.log(gyms);      
                    }          
                }
                else{
                    message.channel.send("Coordinates not in recognizable format.  Please use [lat,long] (no spaces) ex: .whereisadd St. Joseph Pier 42.1149,-86.488151");
                }         
            }
            else{
                message.channel.send("You do not have permission to add gyms.  Please ask a moderator to add this gym.");
            }       
            break;
        default:
            break;
    }
});

bot.login(TOKEN);