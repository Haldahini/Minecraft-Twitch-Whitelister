import tmiClient, { type ChatUserstate } from './lib/tmiClient'
import { rconClient } from '@/lib/rconClient'
import { whiteListManager } from '@/WhiteListManager'

export default (target: string, context: ChatUserstate, msg: string, self: boolean): void => {
    if (self) { return }
    (async () => {

        const rewardID = "100b7d14-a704-4a33-96d7-912ac6c00c55"
        const [, command, variable] = msg.match(/^(!\w+)(?:\s+(\S+))?/) || []
        const twitchUsername = context.username
        const playerMsgName = msg.match(/[a-zA-Z0-9_]+/)?.[0] || ''
        const playerVarName = variable?.match(/[a-zA-Z0-9_]+/)?.[0] || ''

        if (
            command !== undefined &&
            twitchUsername !== undefined &&
            command === '!whitelist' &&
            playerVarName !== '' &&
            context.subscriber === true &&
            !whiteListManager.isPlayerWithTwitchName(target)
        ) {
            const player = whiteListManager.registerPlayer(playerVarName, twitchUsername, 'Subscriber')
            await whiteListManager.save()

            rconClient.send(`whitelist add ${player.playerName}`)
        }

        if (
            command !== undefined &&
            command === '!mcabo' &&
            playerVarName !== ''
        ) {
            const player = whiteListManager.findPlayerByName(playerVarName)
            if (player) {
                const now = new Date()
                const millInDay = 1000 * 60 * 60 * 24
                const accessDate = new Date(player.accessDate.toString())
                const difInDays = Math.floor((now.getTime() - accessDate.getTime()) / millInDay)

                await tmiClient.say(target, `Il reste ${31 - difInDays} jour(s) à ${playerVarName}`)
            } else {
                await tmiClient.say(target, `${playerVarName} n'a pas acces au serveur minecraft !`)
            }
        }

        if (
            context["custom-reward-id"] !== undefined &&
            twitchUsername !== undefined &&
            playerMsgName !== '' &&
            context["custom-reward-id"] === rewardID
        ) {

            const player = whiteListManager.registerPlayer(playerMsgName, twitchUsername)
            await whiteListManager.save()

            rconClient.send(`whitelist add ${player.playerName}`)
        }

    })().catch((e) => {
        console.log(e)
    })
}
