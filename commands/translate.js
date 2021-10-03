const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const translate = require('@vitalets/google-translate-api');
const lang = require('@vitalets/google-translate-api/languages');
const langs = Object.values(lang);

module.exports = {
    data: new SlashCommandBuilder()
        .setName('translate')
        .setDescription('Translate the written text')
        .addStringOption(option => option.setName('text').setDescription('The text to translate').setRequired(true))
        .addStringOption(option => option.setName('from').setDescription('Initial language').setRequired(true)
            .addChoices([['Portuguese', 'Portuguese'], ['English', 'English'], ['Spanish', 'Spanish'], ['Japanese', 'Japanese'], ['Hindi', 'Hindi']])
        )
        .addStringOption(option => option.setName('to').setDescription('Output language').setRequired(true)
            .addChoices([['Portuguese', 'Portuguese'], ['English', 'English'], ['Spanish', 'Spanish'], ['Japanese', 'Japanese'], ['Hindi', 'Hindi']])
        ),
    async execute(interaction){
        const text = interaction.options.getString('text');
        const initialLang = interaction.options.getString('from');
        const outputLang = interaction.options.getString('to');

        translate(`${text}`, {from: `${initialLang}`, to: `${outputLang}`})
            .then((res) => {
                const translateEmbed = new MessageEmbed()
                    .setColor('349cdc')
                    .setTitle(`:books: ${initialLang} to ${outputLang}`)
                    .setDescription(`${res.text}`)
                    .setFooter('This may contain errors')
                interaction.reply({ embeds: [translateEmbed] });
            })
            .catch((err) => {
                console.error(err);
                interaction.reply({ content: '<:redTick:312314733816709120> There was an error while executing this command!', ephemeral: true });
            })
    }
}