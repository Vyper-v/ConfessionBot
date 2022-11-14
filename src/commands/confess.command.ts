import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  Client,
  ChannelType,
  TextChannel,
} from "discord.js";

export = {
  data: new SlashCommandBuilder()
    .setName("confezar")
    .setDescription("Confeza algo que te de vergüenza")
    .addStringOption((opt) =>
      opt
        .setName("confesion")
        .setDescription("Escribe aqui tu confesion")
        .setRequired(true)
    )
    .addChannelOption((opt) =>
      opt
        .setName("canal")
        .setDescription("El canal donde quieres que se envie la confesion")
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(true)
    ),
  execute(interaction: ChatInputCommandInteraction) {
    const confesion = interaction.options.getString("confesion", true);
    const canal = interaction.options.getChannel("canal", true) as TextChannel;

    return Promise.all([
      canal.send({
        content: confesion,
      }),
      interaction.reply({ content: "Confesion enviada", ephemeral: true }),
    ]);
  },
};
