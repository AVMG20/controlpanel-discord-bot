const {MessageEmbed} = require('discord.js');
const {colors , controlpanel_url} = require('../config')

module.exports = {
    ExecutingUserNotLinkedError : new MessageEmbed()
        .setColor(colors.danger)
        .setTitle(`Command can only be executed with linked users`)
        .setDescription(`You can link your Dashboard and Discord accounts by going to [dashboard profile](${controlpanel_url}/profile)\n and clicking the 'Link Discord' button`),
}



