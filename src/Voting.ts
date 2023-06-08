import Game from "./Game"
import Player from "./Player"

export class VotingGroup{

    votes: PlayerVotes[];

    constructor(players: Player[]){
        this.votes = players.map(player => new PlayerVotes(player));
    }
    
    startVoting(game: Game){
        game.handler?.start_voting(this.votes.length);

    }

    addVote(idx: number){
        this.votes[idx].addVote();
    }

    bestPlayer(){
        let sorted: PlayerVotes[] = this.votes.sort((a,b)=>b.votes - a.votes);
        return sorted[0].player



    }

    assignPoints(){
        let sorted: PlayerVotes[] = this.votes.sort((a,b)=>b.votes - a.votes);
        sorted[0].player.score += 100;
        sorted[1].player.score += 70;
        sorted[2].player.score += 30;
        sorted[3].player.score += 10;

    }


}

export class PlayerVotes{

    player: Player;
    votes: number;

    constructor(player: Player){
        this.player = player;
        this.votes = 0;
    }

    addVote(){
        this.votes++;
    }

}