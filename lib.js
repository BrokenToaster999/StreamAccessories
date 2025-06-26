const PlaylistType = {
    NoFilter: 0,
    Wait: 1,
    Regular: 2
};

const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSozMVtO8xcvjGkDmeviNocFLEqqNAekJ8G1ijVHUuIkwrPSihUjltN-jPkw-jLl6TBjhOzeizYCuz0/pub?output=csv";

function ShuffleList(list) {
    const input = [...list]; // Clone to avoid mutating original
    const output = [];

    while (input.length > 0) {
        const index = Math.floor(Math.random() * input.length);
        const item = input.splice(index, 1)[0];
        output.push(item);
    }

    return output;
}

async function until(conditionFunction) {
  const poll = resolve => {
    if(conditionFunction()) resolve();
    else setTimeout(_ => poll(resolve), 400);
  }
  return new Promise(poll);
}

async function GetMusicList(playlistType = PlaylistType.NoFilter) {
    const songs = [];

    const res = await fetch(csvUrl);
    const csv = await res.text();
    const lines = csv.split("\n").slice(1); // skip header row

    for (const line of lines) {
        const [song, artist, url, wait, bg] = line.split(",");

        // Skip incomplete rows
        if (!artist || !song || !url) continue;

        // Playlist filtering
        if (playlistType === PlaylistType.Wait && wait.trim().toLowerCase() !== "true") continue;
        if (playlistType === PlaylistType.Regular && bg.trim().toLowerCase() !== "true") continue;

        songs.push({
            Artist: artist.trim(),
            Song: song.trim(),
            url: "http://soundcloud.com/"+url.trim()
        });
    }


    return songs;
}