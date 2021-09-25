const {MessageEmbed} = require('discord.js');
const {colors , controlpanel_url} = require('../config')

module.exports = {
    ExecutingUserNotLinkedError : new MessageEmbed()
        .setColor(colors.danger)
        .setTitle(`You can only execute this command if you have linked your Dashboard and Discord accounts`)
        .setDescription(`You can link your Dashboard and Discord accounts by going to [dashboard profile](${controlpanel_url}/profile)\n and clicking the 'Link Discord' button`),

    SearchedUserNotLinked : new MessageEmbed()
        .setColor(colors.danger)
        .setTitle(`User not linked`)
        .setDescription(`This user has not linked there Dashboard and Discord account.`),
}



