import { GuildMember, User } from "discord.js";
require("dotenv").config()


export default class UserPermissions{

    static isDev(member: User|GuildMember|null){
        if(!member){
            return false;
        }
        let devIDs = process.env.DEV_IDS?.split(",") ?? []
        return devIDs.filter(id => member.id == id).length > 0
    }



}