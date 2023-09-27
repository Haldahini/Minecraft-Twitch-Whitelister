import Rcon from "ts-rcon";
import process from "process";

var options = {
    tcp: false, // false for UDP, true for TCP (default true)
    challenge: false, // true to use the challenge protocol (default true)
};

if (process.env.HOST === undefined || process.env.RCONPORT  === undefined || process.env.PASSWORD  === undefined) {
    throw new Error('env undefined')
}
export const rconClient = new Rcon(process.env.HOST, parseInt(process.env.RCONPORT), process.env.PASSWORD, options);
