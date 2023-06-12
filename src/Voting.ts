import Game from "./Game"
import Player from "./Player"

export class VotingGroup {

    votes = new Map<Player, number>()

    constructor(players: Player[]) {
        players.forEach(player => this.votes.set(player, 0))
    }

    startVoting(game: Game) {
        game.handler?.start_voting(this.votes.size);
    }

    addVote(player: Player) {
        let oldVotes = this.votes.get(player)
        if (typeof oldVotes === "undefined") {
            oldVotes = 0
        }
        this.votes.set(player, oldVotes + 1)
    }

    bestPlayer() {
        const rankedPlayers = this.rankPlayers()
        const highestPoints = Array.from(rankedPlayers.entries()).reduce((a, b) => a[0] > b[0] ? a : b)[0]
        return rankedPlayers.get(highestPoints)
    }

    assignPoints() {
        const pointsForRank = [100, 70, 30, 10]

        const rankedPlayers = this.rankPlayers()
        const sortedRanks = Array.from(rankedPlayers.entries()).sort((a, b) => b[0] - a[0])

        for (let i = 0; i < sortedRanks.length; i++) {
            if (i > pointsForRank.length)
                break

            const rank = sortedRanks[i]
            if (typeof rank === "undefined") {
                break
            }

            rank[1].forEach((player: Player) => player.score += pointsForRank[i])
        }
    }

    /**
     * Ranks the players based on their votes and returns a Map object containing
     * the rank and an array of players who received that rank.
     *
     * @return {Map<number, Player[]>} A Map object containing the rank and an array 
     * of players who received that rank.
     */
    rankPlayers() {
        const ranks = new Map<number, Player[]>()
        this.votes.forEach((votes, player) => {
            const rank = ranks.get(votes)
            if (typeof rank === "undefined") {
                ranks.set(votes, [player])
                return
            }
            rank.push(player)
        })
        return ranks
    }

}
