const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('../axios')
const {primaryColor} = require('../config')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('me')
        .setDescription('Fetch your information from controlpanel')
        .addBooleanOption(option =>
            option.setName('private')
                .setDescription('Only you can see this information')
                .setRequired(false))
    ,
    async execute(interaction) {
        try {
            let userResult = await axios.get(`/users/${interaction.user.id}`)
            let userData = userResult.data

            console.log(interaction.options.getBoolean('private'))

            const userEmbed = new MessageEmbed()
                .setColor(primaryColor)
                .setTitle(`Information: ${userData.name} (${interaction.user.username})`)
                .addFields(
                    {name: 'Name', value: `\`${userData.name}\``, inline: true},
                    {name: 'Role', value: `\`${userData.role}\``, inline: true},
                    { name: '\u200B', value: '\u200B' },
                    {name: 'Credits', value: `\`${(Math.round(userData.credits * 100) / 100).toString()}\``, inline: true},
                    {name: 'Server Limit', value: `\`${userData.server_limit.toString()}\``, inline: true},
                    { name: '\u200B', value: '\u200B' },
                    {name: 'Email Verified', value: `\`${userData.email_verified_at ? 'yes' : 'no'}\``, inline: true},
                    {name: 'Discord Verified', value: `\`${userData.discord_verified_at ? 'yes' : 'no'}\``, inline: true},
                )
                .setThumbnail(interaction.member.user.displayAvatarURL())
                .setFooter(`${userResult.cached ? 'cached |' : ''} command: /me`, interaction.client.user.displayAvatarURL() );

            await interaction.reply({embeds: [userEmbed]})

        } catch (error) {
            console.log(error)
            interaction.reply('error')
        }

    },
};
