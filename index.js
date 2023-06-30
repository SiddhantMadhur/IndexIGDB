// global vars

let waitingTime = 10000;
let interval = 0;
let limit = 500;

// packages
const { twitch_client_id, twitch_client_secret } = require("./variables.js");
const { supabase } = require("./supabase.js");

async function getToken() {
  const twitchToken = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${twitch_client_id}&client_secret=${twitch_client_secret}&grant_type=client_credentials`,
    {
      method: "POST",
    }
  );
  const token = await twitchToken.json();
  return token;
}

async function getGames(offset) {
  const { access_token } = await getToken();
  const gameRequest = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": twitch_client_id,
      Authorization: `Bearer ${access_token}`,
    },
    body: `fields id, name, slug, cover.url, cover.width, cover.height; where version_parent=null; sort id asci;  limit ${limit}; offset ${offset};`,
  });
  const res = await gameRequest.json();
  return res;
}

async function uploadGames(gameData) {
  if (gameData.length > 0) {
    gameData.forEach(async (game) => {
      const { error } = await supabase
        .from("games_index")
        .upsert({
          id: game.id,
          name: game.name,
          slug: game.slug,
          cover_width: game.cover?.width,
          cover_height: game.cover?.height,
          cover_url: "https:" + game.cover?.url.replace("thumb", "cover_big"),
        })
        .eq("id", game.id);
      if (error !== null) {
        console.log(error.message);
      } else {
        console.log("Uploaded '" + game.name + "' (id:" + game.id + ")");
      }
    });
  } else {
    waitingTime = 6 * 60 * 60 * 1000;
    limit = 5;
  }
}

async function getGameAndUpload(offset) {
  const allGames = await getGames(offset);
  await uploadGames(allGames);
}

setInterval(() => {
  getGameAndUpload(interval);
  interval = interval + 500;
}, waitingTime);
