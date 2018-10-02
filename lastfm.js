const request = require("request");
const { promisify } = require("util");

/**
 * Checks whether a track has a nowplaying attribute set to true.
 * @param {Object} track The track object.
 * @return {Boolean} Whether the track has a nowplaying attribute or not.
 */
const isNowPlaying = (track) => {
    return track['@attr'] && track['@attr'].nowplaying ? true : false;
}

/**
 * Compares the equality of two track objects.
 * @param {Object} track1 A track object.
 * @param {Object} track2 A track object.
 * @return {Boolean} Whether the tracks are equal or not.
 */
const isSame = (track1, track2) => {
    return (track1.artist['#text'] === track2.artist['#text'] &&
        track1.name === track2.name &&
        track1.album['#text'] === track2.album['#text']) ? true : false;
}

/**
 * Attempts to get a track object which is now playing from user's Last.fm profile.
 * @param {Object} credentials A credentials object in the form { username: String, apiKey: String }.
 * @return {Object | null} A now playing track object, or null if one was not found.
 */
exports.getNowPlaying = async({username, apiKey}) => {
    // Get the latest track from the user's profile.
    const res = await promisify(request)({
        method: "GET",
        url: `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${username}&api_key=${apiKey}&format=json&limit=1`,
        json: true
    });

    // Track could be null, default it to a blank array in that case.
    const latestTracks = res.body.recenttracks.track || [];

    // Return the most recent track only if it is now playing.
    return latestTracks.length && isNowPlaying(latestTracks[0]) ?
        latestTracks[0] :
        null;
}

/**
 * Compares two track objects and determines the event currently occuring.
 * @param {Object | null} prev The previous track object.
 * @param {Object | null} curr The latest track object.
 * @return {Object} An event object in the form { event: String, track: Object }.
 */
exports.getEvent = (prev, curr) => {
    // If there was no track found, but previously there was, emit a stoppedPlaying object.
    if (!curr && prev) {
        return { event: "stoppedPlaying", track: prev };
    // If the tracks are not equal, emit a nowPlaying object.
    } else if((curr && prev && !isSame(prev, curr)) || curr && !prev) {
        return { event: "nowPlaying", track: curr };
    // Tracks are equal, emit a noChange object.
    } else {
        return { event: "noChange", track: curr };
    }
}
