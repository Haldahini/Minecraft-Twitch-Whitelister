import 'dotenv/config'
import {rconClient} from '@/lib/rconClient'
import {whiteListManager} from '@/WhiteListManager'
import process from "process";

const now = new Date()

rconClient.on('auth', (): void => {
    console.log('connected - whitelist')
    rconClient.send(`whitelist list`)

}).on('response', (response) => {
    if (response.includes("whitelisted player(s)") === false) { return }

    const playerNames = extractPlayerNames(response);

    if (playerNames) {
        console.log("Player Names:", playerNames);
        checkPlayers(playerNames).then(() => {
            return process.exit(0)
        }).catch(e => {
            console.log(e)
            return process.exit(5)
        })
    }
})

rconClient.connect();

function extractPlayerNames(inputString: string): string[] | null {
    const match = inputString.match(/:\s*(.*?)$/);

     return match
            ? match[1].split(', ').map(name => name.trim())
            : null;
}

async function checkPlayers (playerNames: string[]) {

    const playersInWhiteList = whiteListManager.players.filter(player => playerNames.includes(player.playerName))
    console.log(playersInWhiteList)

    for (const player of playersInWhiteList) {
        const millInDay = 1000 * 60 * 60 * 24
        const accessDate = new Date(player.accessDate.toString())
        const difInDays = Math.floor((now.getTime() - accessDate.getTime()) / millInDay)
        if (difInDays > 31) {
            rconClient.send(`whitelist remove ${player.playerName}`)
            whiteListManager.unregisterPlayer(player)
            console.log(player.playerName + ' removed' )
        }
    }

    return whiteListManager.save()
}
