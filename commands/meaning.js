const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { default: axios } = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('meaning')
        .setDescription('Replies with the meaning of the chosen word')
        .addStringOption(option => option.setName('word').setDescription('The word').setRequired(true)),
    async execute(interaction) {
        const word = interaction.options.getString('word');

        axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
            .then((res) => {
                const word = res.data[0].word
                const meaning = res.data[0].meanings[0].definitions[0].definition
                const example = res.data[0].meanings[0].definitions[0].example

                const meaningEmbed = new MessageEmbed()
                    .setColor('349cdc')
                    .setTitle(`${word[0].toUpperCase() + word.substr(1)} (${res.data[0].meanings[0].partOfSpeech})`)
                    .setDescription(`${meaning[0].toUpperCase() + meaning.substr(1)}\n**Example:** ${example[0].toUpperCase() + example.substr(1)}`)

                interaction.reply({ embeds: [meaningEmbed], ephemeral: true })
            })
            .catch((err) => {
                console.error(err);
                interaction.reply({ content: 'Word not found. <:redTick:312314733816709120>', ephemeral: true });
            })
    }
}