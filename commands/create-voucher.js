const {SlashCommandBuilder} = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const axios = require('../axios')
const {colors, adminRoleId} = require('../config')
const {nanoid} = require('nanoid')
const errorHandler = require('../helpers/errorHandler')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('create-voucher')
        .setDescription('Create a voucher code')
        .setDefaultPermission(false) //make sure default permissions is set to false when using the permissions property
        .addIntegerOption(option => option
            .setName('credits')
            .setRequired(true)
            .setDescription('Enter amount of credits'))
        .addIntegerOption(option => option
            .setName('uses')
            .setRequired(true)
            .setDescription('Enter amount of uses'))
        .addStringOption(option => option
            .setName('memo')
            .setRequired(false)
            .setDescription('Memo'))
        .addStringOption(option => option
            .setName('code')
            .setRequired(false)
            .setDescription('Voucher code | leave empty for random code'))
        .addStringOption(option => option
            .setName('expires_at')
            .setRequired(false)
            .setDescription('d-m-Y format (example : 05-12-2022'))
        .addBooleanOption(option =>
            option.setName('private')
                .setDescription("Set to private if you don't want other users to see this")
                .setRequired(false))
    ,
    permissions: [
        {
            id: adminRoleId,
            type: 'ROLE',
            permission: true,
        },
    ],
    async execute(interaction) {
        try {
            let memo = interaction.options.getString('memo') ?? null
            let code = interaction.options.getString('code') ?? nanoid();
            let expires_at = interaction.options.getString('expires_at') ?? null
            let credits = interaction.options.getInteger('credits')
            let uses = interaction.options.getInteger('uses')

            let result = await axios.post(`/vouchers`, {
                memo,
                code,
                credits,
                uses,
                expires_at,
            })

            let voucherData = result.data

            const giveEmbed = new MessageEmbed()
                .setColor(colors.primary)
                .setTitle(`Created voucher`)
                .setFooter(`command: /create-voucher`, interaction.client.user.displayAvatarURL())
                .setDescription('Voucher information: ')
                .addFields(
                    {name: 'Memo', value: `\`${voucherData.memo ?? 'None'}\``, inline: false},
                    {name: 'Code', value: `\`${voucherData.code}\``, inline: false},
                    {name: 'Credits', value: `\`${voucherData.credits}\``, inline: true},
                    {name: 'Uses', value: `\`${voucherData.uses} / ${voucherData.used}\``, inline: true},
                    {name: 'Expires at', value: `\`${voucherData.expires_at ? new Date(voucherData.expires_at).toLocaleString() : 'No expire date'}\``, inline: false},
                )

            await interaction.reply({embeds: [giveEmbed], ephemeral: interaction.options.getBoolean('private') ?? false})

        } catch (error) {
            await errorHandler(error, interaction);
        }

    },
};
