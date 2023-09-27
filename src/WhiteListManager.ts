import fs from "fs";
import {Player} from "@/types/player";

class WhiteListManager {

    players: Array<Player> = []

    constructor() {
        this.players = JSON.parse(fs.readFileSync('/var/www/html/McWhiteLister/src/data/players.json', { encoding: 'utf-8'})) as Player[]
    }

    save () {
        return fs.promises.writeFile('/var/www/html/McWhiteLister/src/data/players.json', JSON.stringify(this.players))
    }

    registerPlayer (playerName: string, twitchName: string, type = '10kReward'): Player {
        let player = this.findPlayerByName(playerName)

        if (player === undefined) {
            player = {
                playerName: playerName,
                twitchName: twitchName,
                accessDate: new Date(),
                accessType: type
            }
            this.players.push(player)
        }

        return player
    }

    unregisterPlayer (player: Player) {
        this.players = this.players.filter(p => p.twitchName !== player.twitchName)
    }

    findPlayerByName (name: string): Player | undefined {
        return this.players.find(p => p.playerName === name)
    }

    findPlayerByTwitchName (name: string): Player | undefined {
        return this.players.find(p => p.twitchName === name)
    }

    isPlayerWithTwitchName (name: string): boolean {
        return this.players.some((p: Player) => p.twitchName === name)
    }

    getPlayers (): Player[] {
        return this.players
    }
}

export const whiteListManager = new WhiteListManager()
