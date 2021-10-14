const {MessageActionRow, MessageButton} = require('discord.js');
const {nanoid} = require('nanoid')

/**
 * @param {array} details (name and url)
 * @return {Promise<MessageActionRow>}
 */
module.exports = async function (details) {
    return new Promise((resolve, reject) => {
        try {
            let buttons = details.map(detail => {
                return (new MessageButton())
                    .setLabel(detail.name)
                    .setURL(detail.url)
                    .setStyle('LINK')
            })

            let messageActionRow = new MessageActionRow()
                .addComponents(buttons)

            resolve(messageActionRow);
        } catch (e) {
            reject(e)
        }
    })
}
