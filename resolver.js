const Player = require('./player');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require("path");
const config = require('./config');

async function initOrUpdateDb(){
    console.log("start main method = " + new Date())
    const squads = config.squads;
    for(squad of squads){
        await timeout(1000);
        console.log("exec: " + squad.name + " at: " + new Date());
        const playersRetrieved = await getPlayersFromSquad(squad);
        for(toSave of playersRetrieved){
          await savePlayerOnDb(toSave);
        }
    }
    console.log("end main method = " + new Date())
    return config;
}

async function getPlayersFromSquad(squadIn){
    let players = [];
    const url = squadIn.url;
    const squadId = path.basename(url)
    console.log("url called: " + url)
    await axios(url)
    .then(response => {
        const returnedPlayers = buildPlayersFromResponse(response, squadId);
        returnedPlayers.forEach((retPlayer) => players.push(retPlayer));
    })
    .catch(err => console.log(err));
    return players;
}

async function savePlayerOnDb(toSave){
    await Player.findOneAndUpdate({_id: toSave._id}, toSave, {upsert:true})
          .then(result => {
            if(result === null ){
              console.log("insert new player: " + player)
            }else{
              console.log("update player: " + result);
            }
          })
          .catch(err => console.log(err))
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function buildPlayersFromResponse(response, squadId){
  const players = []
  const $ = cheerio.load(response.data)
  const playersTable = $('.items > tbody > tr');
      const squad = $('h1 > span').text();
      const league = $('.hauptpunkt > a').text().trim();
      
      playersTable.each(function () {
        const number = $(this).find('.rn_nummer').text();
        const marketValue = $(this).find('.rechts').text();
        const roleDetailed = $(this).find('.posrela > table > tbody > tr:eq(1)').text();
        const role = $(this).find('.rueckennummer').attr('title')
        const playerName = $(this).find('.hide').text();
        const nationalitys = $(this).find('.zentriert > img');
        const nationality = [];
        nationalitys.each(function() {
          nationality.push($(this).attr('title'))
        })
        const id = $(this).find('.spielprofil_tooltip:eq(0)').attr('id');              

        const player = new Player({
          _id: id,
          name: playerName,
          squad: squad,
          role: role,
          roleDetailed: roleDetailed,
          league: league,
          squad_id: squadId,
          number: number,
          nationality: nationality,
          marketValue: marketValue
      })
      players.push(player);
      });
  console.log("exit from squad " + squad + " with players n: " + players.length)
  return players;
}

module.exports = { initOrUpdateDb };