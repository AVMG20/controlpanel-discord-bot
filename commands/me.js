const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('../axios')
const {primaryColor, adminRoleId} = require('../config')
const errorHandler = require('../helpers/errorHandler')

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
            let userResult = await axios.get(`/users/${interaction.user.id}?include=serversCount,vouchersCount`)
            let userData = userResult.data
            console.log(userData)

            const userEmbed = new MessageEmbed()
                .setColor(primaryColor)
                .setTitle(`Information: ${userData.name} (${interaction.user.username})`)
                .addFields(
                    {name: 'Name', value: `\`${userData.name}\``, inline: true},
                    {name: 'Role', value: `\`${userData.role}\``, inline: true},
                    {name: '\u200B', value: '\u200B'},
                    {name: 'Credits', value: `\`$${(Math.round(userData.credits * 100) / 100).toString()}\``, inline: true},
                    {name: 'Servers', value: ` \`${userData.servers_count} Out of ${userData.server_limit}\``, inline: true},
                    {name: '\u200B', value: '\u200B'},
                    {name: 'Vouchers', value: `\`Claimed ${userData.vouchers_count}\``, inline: true},
                    {name: 'Verified', value: `\`${userData.email_verified_at ? 'Email' : ''}${userData.discord_verified_at ? ', Discord' : ''}\``, inline: true},
                    {name: '\u200B', value: '\u200B'},

                )
                .setThumbnail(interaction.member.user.displayAvatarURL())
                .setFooter(`${userResult.cached ? 'cached |' : ''} command: /me`, interaction.client.user.displayAvatarURL());

            await interaction.reply({embeds: [userEmbed], ephemeral: interaction.options.getBoolean('private') ?? false})

        } catch (error) {
            await errorHandler(error, interaction);
        }
    },
};
