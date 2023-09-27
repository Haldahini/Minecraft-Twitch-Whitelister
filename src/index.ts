import 'dotenv/config'
import tmiClient from './lib/tmiClient'
import messageHandler from './messageHandler'
import { rconClient } from '@/lib/rconClient'

Promise.all([
    tmiClient.connect(),
    new Promise<void>((resolve, reject): void => {
        rconClient.on('auth', (): void => {
            console.log('connected')
            resolve();
        })
        rconClient.connect();
    })
])
    .then((): void => {
        tmiClient.on('message', messageHandler)
    })
    .catch((e): void => {
        console.log(e)
    })

rconClient
    .on('error', function(err) {
        console.log("Error: " + err);
    })
    .on('end', function() {
        console.log("Connection closed");
        rconClient.connect()
});
