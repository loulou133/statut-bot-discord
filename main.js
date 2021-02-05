const Discord = require('discord.js');
const { TOKEN, PREFIX } = require('./config')
const client = new Discord.Client();
const tcpp = require('tcp-ping');
const async = require('async');


// quand le bot est en ligne
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// status
client.on("message", async message => {
    if(message.author.bot) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if (cmd === `${PREFIX}status`){
        if(!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(`Tu n'as pas la permission...`);
    const emoji = message.guild.emojis.cache.find(e => e.name === ":green_circle:")
    const loading = "🕒 Ping en cours ...";
    var nodes = {
        0: "192.168.0.0", // Ne pas modif ici
        1: "IP",
        2: "IP",
        3: "IP",
        4: "IP",
        5: "IP",
        6: "IP",
       }
// LE 1 ici corresond au 1 dans votre embed 

    var status = {
        1: loading,
        2: loading,
        3: loading,
        4: loading,
        5: loading,
        6: loading,
// ne pas modif ici sauf si vous rajoutez des choses
        }


    function createembed() {
        var botIcon = client.user.displayAvatarURL;
        return embed = new Discord.MessageEmbed()
            .setColor("#46a7f2")
            .setTitle("Status")
            .setFooter("", botIcon)
            .setThumbnail(botIcon)
            .addField("Sites" ,`Site WEB : ${status[1]}  [Lien](LIEN DE VOTRE SITE)`)
            .addField("Nodes", `Node dédiée : ${status[2]} \nNode VPS : ${status[3]} \nNode revendeur plesk : ${status[4]}`)
            .setTimestamp()
    }


    message.guild.channels.cache.get('ID DE VOTRE SALON').send({
        embed: createembed()

    }).then(function(m) {
        setInterval(() => {
            
      status[0] = emoji; // Ne pas modif ici
 
 
        m.edit({
            embed: createembed()
        })

        async.forEachOf(nodes, (value, key, callback) => {
            tcpp.ping({
                address: value,
                port: 80, // Port qui ping
                timeout: 10000 // Le temps qui feras dire au status qu'un service seras hors ligne. Ici 10 sec
            }, function(err, data) {
                if (data.max == undefined) {
                    status[key] = "🔴 Hors Ligne -1 ms"; // Si c'est hors ligne
                } else  {
                    let ping = data.avg.toFixed(0)
                    status[key] = ":green_circle: En Ligne " + `(${ping}ms)`; // Si c'est en ligne
                }
                m.edit({
                    embed: createembed()
                })
 
            });
        });
        }, 30000); // Ici 30 000 correspond à 30sec. Il faut exprimer en MS
    })
}
}
);



client.login(TOKEN);