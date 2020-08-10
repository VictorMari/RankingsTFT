const axios = require("axios")

const players = require("../data/summoners.json")
const apiQueries = require("../data/requests.json") 
require('dotenv').config({path: "./.env"})

const TierOrder = {
    "IRON": -1,
    "BRONZE": 0,
    "SILVER": 1,
    "GOLD": 2,
    "PLATINUM": 3,
    "DIAMOND": 4,
    "MASTER": 5
}

const RankOrder = {
    "I": 1,
    "II": 2,
    "III": 3,
    "IV": 4,
}

const addAuthentication = request => {
    request.params = {
        api_key: process.env.apikey
    }
}

const getPlayerRanking = async playerObject => {
    let playerLeagueQuery = {}
    Object.assign(playerLeagueQuery, apiQueries["TFT"]["Leagues"])
    playerLeagueQuery.url = playerLeagueQuery.url.replace(":id", playerObject.id)
    addAuthentication(playerLeagueQuery)
    try{
        let league = await axios(playerLeagueQuery)
        return league.data
    }
    catch(error){
        console.log(error)
        return []
    }
}

const sortByPlayerRanking = (playerRankings1,playerRankings2) => {
    let rankedTFT1 = playerRankings1.filter(rank => rank.queueType === "RANKED_TFT")
    let rankedTFT2 = playerRankings2.filter(rank => rank.queueType === "RANKED_TFT")

    let player1Tier = rankedTFT1["tier"]
    let player2Tier = rankedTFT2["tier"]

    let player1Rank = rankedTFT1["rank"]
    let player2Rank = rankedTFT2["rank"]

    if (TierOrder[player1Tier] == TierOrder[player2Tier]){
        return RankOrder[player1Rank] >= RankOrder[player2Rank] ? -1: 1
    }
    else{
        return TierOrder[player1Tier] > TierOrder[player2Tier] ? -1: 1
    }

}

const crawlPlayerRankings = async () => {
    let playerRankingQueries =  players.map(playerObject => getPlayerRanking(playerObject))
    try{
        let ranks = await Promise.all(playerRankingQueries)
        return ranks.sort(sortByPlayerRanking)
    }
    catch(error){
        console.log(error)
    }
}

module.exports.getRankings = crawlPlayerRankings

/*
crawlPlayerRankings()
    .then(e => console.log(JSON.stringify(e, null, 2)))
    .catch(e => console.log(e))
*/
    /*
getPlayerRanking(players[2])
    .then(e => console.log(e))
    .catch(e => console.log(e))
    */