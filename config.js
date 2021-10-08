require('dotenv').config()

module.exports = {
    token: process.env.BOT_TOKEN,
    clientId: process.env.CLIENT_ID,

    guildId: process.env.GUILD_ID,
    adminRoleId: process.env.ADMIN_ROLE_ID,

    controlpanel_url: process.env.CONTROLPANEL_URL,
    controlpanel_api_key: process.env.CONTROLPANEL_API_KEY,
    controlpanel_api_location : 'api',

    bot : { // https://discordjs.guide/popular-topics/faq.html#how-do-i-check-if-a-guild-member-has-a-specific-role
        activity : 'LISTENING',
        activity_message : 'Slash commands',
        activity_status : 'online',
    },

    //cache results from get request to the api
    requestCacheDuration : 60 * 30, //30 mins

    colors : {
        primary : '#575fcf',
        danger : '#ff3f34',
    },

}
