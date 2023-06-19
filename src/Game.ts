import Player from "./Player"
import Host from "./Host"
import { WebSocket } from "ws"
import GPT4FreeRequester from "./GPT4FreeRequester"
import MessageHandler from "./MessageHandler"
import LogTypes from "./LogTypes"
import VotingGroup from "./VotingGroup"

export default class Game {

    players: Player[] = []
    gpt: GPT4FreeRequester
    host: Host | null
    handler: MessageHandler | null
    stage: string;
    log: Function;
    curGroup: VotingGroup | null;

    constructor(log: Function) {
        this.log = log;
        this.gpt = new GPT4FreeRequester()
        this.host = null;
        this.handler = null;
        this.stage = "wait_players";
        this.curGroup = null;
    }

    getPlayerFromClient(client: WebSocket) {
        for (const player of this.players) {
            if (player.client === client)
                return player
        }
        return null
    }

    setHandler(handler: MessageHandler) {
        this.handler = handler
    }

    async askAndSendGPT(prompt: string, player: Player) {
        player.client.send(await this.gpt.getResponse(prompt))
    }

    playerJoin(player: Player) {
        this.players.push(player);
        if (this.stage == "wait_players") {
            this.handler?.players_update()
        }

    }

    playerLeave(client: WebSocket) {
        let player: Player = this.players.filter(player => { return player.client === client })[0]
        this.players = this.players.filter(player => { return player.client !== client })
        this.handler?.players_update()
    }

    start() {
        this.stage = "wait_prompts"
        let words = ["Where", "What", "Why", "How"]
        this.handler?.start_game(words[Math.floor((words.length - 1) * Math.random()) + 1]);
        this.log("Game started, waiting for prompts...", LogTypes.gameProgress)
    }

    sendBackNewPrompts() {
        this.log("Prompts and GPT responses received, sending...", LogTypes.gameProgress)

        let prompts = this.players.map((player) => player.origPrompt);
        let promptIndexes = this.players.map((player, idx) => idx)
        let by = Math.floor((promptIndexes.length - 1) * Math.random()) + 1
        promptIndexes = this.cycle(promptIndexes, by)

        let responses = this.players.map((player) => player.origResponse);
        let responseIndexes = this.players.map((player, idx) => idx)
        responseIndexes = this.cycle(responseIndexes, by - 1)

        this.players.forEach((player, idx) => {
            player.newPrompt = prompts[promptIndexes[idx]] ?? `no submission`
            player.newResponse = responses[responseIndexes[idx]] ?? `no submission`
            this.handler?.new_prompt(player, player.newPrompt, player.newResponse)
        })
        this.log("Sent!", LogTypes.gameProgress)
    }

    async tryPrompt(player: Player, prompt: string) {

        this.log(`${player.name} submitted their prompt!`, LogTypes.gameProgress)
        if (this.stage != "wait_prompts")
            return

        let response = await this.gpt.getResponse(`Reply to the following prompt in at least 30 words, using funny vocabulary; immediately answer the question without confirming beforehand or saying "Here's an." Prompt: ${prompt}`)
        if (response == "Unable to fetch the response, Please try again.") {
            setTimeout(() => {
                this.tryPrompt(player, prompt)
            }, 1000)
            return
        }

        player.origResponse = response
        player.origPrompt = prompt
        let completeCount = this.players.filter((player) => { return !!player.origPrompt }).length;

        if (completeCount == this.players.length) {
            this.sendBackNewPrompts()
            this.stage = "wait_responses"
        }
    }

    submitResponse(player: Player, response: string) {
        if (this.stage != "wait_responses")
            return

        player.rearrangedResponse = response
        this.log(`${player.name} submitted their response!`, LogTypes.gameProgress)

        let completeCount = this.players.filter((player) => { return !!player.rearrangedResponse }).length;

        if (completeCount == this.players.length) {
            this.startSlideshow()
            this.stage = "start_slideshow"
        }
    }

    async startSlideshow() {
        let group = await this.processVoteGroups(this.players);
        group.assignPoints();
        this.log("Done all voting, points given")
        this.handler?.end_voting(group.players, group.rankPlayers(), group.pointsGained, [...this.players].sort((a, b) => b.score - a.score));
    }

    async processVoteGroups(p: Player[]): Promise<VotingGroup> {
        if (p.length > 36) {
            let newp: Player[] = [];
            const chunkSize = Math.floor(p.length / 3);
            for (let i = 0; i < p.length; i += chunkSize) {
                const chunk = p.slice(i, i + chunkSize);
                let group: VotingGroup = await this.processVoteGroups(chunk)
                group.bestPlayer()?.forEach((player) => {
                    newp.push(player);
                })

            }
            return await this.processVoteGroups(newp);
        }

        else if (p.length > 6) {
            let maxgroups = 0;
            let max_each = 0;

            for (let i = 2; i < 7; i++) {
                let num_each = Math.floor(p.length / i);
                if (p.length % i != 0) {
                    num_each++;
                }
                if (num_each > 6)
                    continue;
                if (num_each > max_each) {
                    max_each = num_each;
                    maxgroups = i;

                }
            }
            let newp: Player[] = [];
            const chunkSize = max_each;
            for (let i = 0; i < p.length; i += chunkSize) {
                const chunk = p.slice(i, i + chunkSize);
                let group: VotingGroup = await this.processVoteGroups(chunk)

                group.bestPlayer()?.forEach((player) => {
                    newp.push(player);
                })

            }
            return await this.processVoteGroups(newp);


        } else {
            this.curGroup = new VotingGroup(p);
            this.curGroup.startVoting(this);
            this.log("Waiting for votes")
            await this.curGroup.getResults();
            this.log("All votes received")
            return this.curGroup;
        }
    }

    submitVote(player: Player, vote: number) {
        this.curGroup?.addVote(this.curGroup.players[vote - 1]);
        player.voted = true;
        if (this.players.every(p => p.voted)) {
            this.curGroup?.triggerResolve();
            this.players.forEach(p => { p.voted = false });
        }
    }

    cycle(array: any[], by: number) {
        for (let i = 0; i < by; i++) {
            let k = array.shift()
            array.push(k)
        }
        return array
    }

    async eval(code: string) {
        try {
            return await eval(code);

        } catch (error) {
            return error;
        }
    }

}
