const {twitch_client_id, twitch_client_secret} = require('./variables.js')
const {supabase} = require('./supabase.js')


async function getToken() {
  const twitchToken = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${twitch_client_id}&client_secret=${twitch_client_secret}&grant_type=client_credentials`,
    {
      method: "POST",
    }
  );
  const token = await twitchToken.json()
  return token
}

async function uploadGames(offset) {
  const { access_token } = await getToken();
  const gameRequest = await fetch("https://api.igdb.com/v4/games", {
    method: "POST",
    headers: {
      "Client-ID": twitch_client_id,
      Authorization: `Bearer ${access_token}`,
    },
    body: `fields *, id, name, category, involved_companies.company, platforms, websites, cover.url, cover.height, cover.width, parent_game, genres.name, first_release_date, websites.url, themes.name, platforms.name; where version_parent=null; sort id asc;  limit 1; offset ${offset};`,
  })
  const res = await gameRequest.json()
  console.log(res)
}



uploadGames(0)