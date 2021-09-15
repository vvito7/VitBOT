const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();
const { default: axios } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('weather')
        .setDescription('Replies with the weather info of the selected city')
        .addStringOption(option => option.setName('city').setDescription('The city').setRequired(true)),
    async execute(interaction) {
        const apiKey = process.env.apiKey;
        let string = interaction.options.getString('city');
        string = string.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${string}&appid=${apiKey}`)
            .then((res) => {
                const weatherEmbed = new MessageEmbed()
                    .setColor('f1c40f')
                    .setTitle(`Weather in ${res.data.name} :flag_${res.data.sys.country.toLowerCase()}:`)
                    .setDescription(`The temperature is ${parseFloat((res.data.main.temp - 273).toFixed(0))}°C at the moment.`)
                    .setTimestamp()
                    .setFooter(`Executed by ${interaction.user.username}`, `${interaction.user.displayAvatarURL()}`)

                interaction.reply({ embeds: [weatherEmbed] });
            })
            .catch((err) => {
                console.error(err);
            })
    }
}