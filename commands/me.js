const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('../axios')
const {primaryColor, adminRoleId} = require('../config')
const {ExecutingUserNotLinkedError} = require('../embeds/notLinkedErrors')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('me')
        .setDescription('Fetch your information from controlpanel')
        .setDefaultPermission(true) //make sure default permissions is set to true when not using the permissions property
        .addBooleanOption(option =>
            option.setName('private')
                .setDescription("Set to private if you don't want other users to see this")
                .setRequired(false))
    ,
    async execute(interaction) {
        try {
            let userResult = await axios.get(`/users/${interaction.user.id}`)
            let userData = userResult.data

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

            await interaction.reply({embeds: [userEmbed] , ephemeral: interaction.options.getBoolean('private') ?? false })

        } catch (error) {
            if (error.response.status === 404) interaction.reply({embeds : [ExecutingUserNotLinkedError], ephemeral : true})
            else interaction.reply({content : 'error', ephemeral : true})
        }
    },
};
