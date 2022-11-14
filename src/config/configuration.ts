import "dotenv/config";

export function getConfig(env: string = process.env.NODE_ENV) {
  const defaultConfig: Record<string, any> = {
    token: process.env.DISCORD_TOKEN,
  };

  const config = new Map<string, typeof defaultConfig>();

  config.set("development", {
    ...defaultConfig,
    clientId: process.env.CLIENT_ID,
    guildId: process.env.GUILD_ID,
  });

  config.set("production", {
    ...defaultConfig,
  });

  return config.get(env || "development");
}
