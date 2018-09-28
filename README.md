# Discord Last.fm Script

This is a small script which streams Last.fm now playing data and displays it as a Discord status.

## First Steps

Firstly, you will need to set up a custom rich presence for Last.fm. Go [here](https://discordapp.com/developers/applications/) and create an application. The name of the application will be what is displayed on your status. Make sure to add any art assets for the application under Rich Presence -> Art Assets. These will be displayed on your status.

You will also need to get an API account on Last.fm [here](https://www.last.fm/api/account/create).

## Running the Script

You will need to create a .env file in the root directory and set the following environment variables:
DISCORD_CLIENT_ID=`Enter your Discord Application Client ID here`
LAST_FM_API_KEY=`Enter your Last.fm API key here`
LAST_FM_SECRET=`Enter your Last.fm API secret here`
LAST_FM_USERNAME=`Enter your Last.fm username here`
LARGE_IMAGE_KEY=`Enter your Discord Application Large Image Key here (optional)`
LARGE_IMAGE_TOOLTIP=`Enter your Discord Application Large Image Text here (optional)`
SMALL_IMAGE_KEY=`Enter your Discord Application Small Image Key here (optional)`
SMALL_IMAGE_TOOLTIP=`Enter your Discord Application Small Image Text here (optional)`

Now run `npm start` and Discord will display your custom rich presence status with whatever is currently scrobbling on your Last.fm account! ^_^
