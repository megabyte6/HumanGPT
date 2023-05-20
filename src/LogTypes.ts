import chalk = require("chalk")

export default class LogTypes{

    static warning: LogType = {
        chalkColor: chalk.redBright,
        embedColor: 0xff0000
    }

    static join: LogType = {
        chalkColor: chalk.greenBright,
        embedColor: 0x00ff22
    }

    static leave: LogType = {
        chalkColor: chalk.yellow,
        embedColor: 0xffff00
    }

    static gameProgress: LogType = {
        chalkColor: (msg:string)=>msg,
        embedColor: 0x2a9df4
    }
    
}

export interface LogType{
    chalkColor: Function
    embedColor: number
}