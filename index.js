require("dotenv").config();
const RPC = require("discord-rpc");
const { LastFmNode } = require("lastfm");
const client = new RPC.Client({ transport: "ipc" });

if (!process.env.DISCORD_CLIENT_ID || !process.env.LAST_FM_API_KEY || !process.env.LAST_FM_SECRET || !process.env.LAST_FM_USERNAME) {
    throw new Error("You must specify a DISCORD_CLIENT_ID, LAST_FM_API_KEY, LAST_FM_SECRET and a LAST_FM_USERNAME environment variable.");
}

const clientId = process.env.DISCORD_CLIENT_ID;

RPC.register(clientId);

const LastFM = new LastFmNode({
    api_key: process.env.LAST_FM_API_KEY,
    secret: process.env.LAST_FM_SECRET,
});

const LastFMStream = LastFM.stream(process.env.LAST_FM_USERNAME);

client.on("ready", () => {
    LastFMStream.on("stoppedPlaying", async() => {
        try {
            await client.clearActivity().catch(console.error);
            console.log("Stopped listening.");
        } catch (err) {
            console.error(err);
        }
    });
    LastFMStream.on("nowPlaying", async(track) => {
        if (track['@attr'] && track['@attr'].nowplaying) {
            const artist = track.artist['#text'];
            const song = track.name;
            const startTimestamp = new Date();
            try {
                await client.setActivity({
                    details: song,
                    state: `by ${artist}`,
                    startTimestamp,
                    largeImageKey: process.env.LARGE_IMAGE_KEY,
                    largeImageText: process.env.LARGE_IMAGE_TOOLTIP,
                    smallImageKey: process.env.SMALL_IMAGE_KEY,
                    smallImageText: process.env.SMALL_IMAGE_TOOLTIP,
                    instance: false,
                });
                console.log(`Now listening to ${song} by ${artist}.`);
            } catch (err) {
                console.error(err);
            }
        }
    });
    LastFMStream.on("error", console.error);
    LastFMStream.start();
});

client.login({ clientId }).catch(console.error);
