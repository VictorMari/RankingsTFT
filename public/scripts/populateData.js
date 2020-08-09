/**
 * $.ajax({
    url: "file://../../data/summoners.js",
    method: "GET",
    error: e => console.log(e)
}).then(e => console.log(e))
 */

let generateHtmlTable = rankings => {
    let rankingListElement = document.createElement("ol")
    let rankingsTFT = rankings
        .map(playerRankings => {
            return playerRankings.filter(ranking => ranking.queueType === "RANKED_TFT")[0]
        })
        .filter(ranking => ranking)
        .map(playerRanking => {
            let li = document.createElement("li")
            let playerNameContainer = document.createElement("mark")
            let playerLevelContainer = document.createElement("small")

            playerNameContainer.innerText = playerRanking.summonerName
            playerLevelContainer.innerText = `${playerRanking.tier} ${playerRanking.rank}`

            li.appendChild(playerLevelContainer)
            li.appendChild(playerNameContainer)
            return li
        })
    rankingsTFT.forEach(ranking => rankingListElement.appendChild(ranking))
    return rankingListElement
}

let generateRanking = async () => {
    let rankingData = await (await fetch("../../data/rankings.json")).json()
    //console.log(rankingData)
    let table = generateHtmlTable(rankingData)
    let tableElement = document.getElementById("Ranking")
    tableElement.appendChild(table)
    console.log(table)
}

 generateRanking()
    .then(e => console.log("Ranking generated successfully"))
    .catch(e => console.log(e))