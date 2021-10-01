
export enum CardSuit {
    Clubs,
    Diamonds,
    Hearts,
    Spades
}

export interface ILastVote {
    itemId: string;
    vote: string;
}

export interface IPlayer {
    key: string;
    username: string;
    isActive: boolean;
    isAdmin: boolean;
    partyName: string;
    connectionId?: string;
    voted: boolean;
    vote: string;
    seatNumber: number;
    v5Count: number;
    v10Count: number;
    v25Count: number;
    v50Count: number;
    lastVote: ILastVote;
    voteSuit: CardSuit;
}

export class Player implements IPlayer {
    public key: string;
    public username: string;
    public isActive: boolean;
    public isAdmin: boolean;
    public partyName: string;
    public connectionId: string;
    public voted: boolean;
    public vote: string;
    public seatNumber: number;
    public v5Count: number;
    public v10Count: number;
    public v25Count: number;
    public v50Count: number;
    public lastVote: ILastVote;
    public voteSuit: CardSuit;

    constructor(json: IPlayer = null) {
        if (json == null) return;
        
        this.key = json.key;
        this.username = json.username;
        this.isActive = json.isActive;
        this.vote = json.vote;
        this.voted = json.voted;
        this.isAdmin = json.isAdmin;
        this.partyName = json.partyName;
        this.connectionId = json.connectionId;
        this.seatNumber = json.seatNumber;
        this.v5Count = json.v5Count;
        this.v10Count = json.v10Count;
        this.v25Count = json.v25Count;
        this.v50Count = json.v50Count;
        this.voteSuit = json.voteSuit;
    }

    public clone = (): Player => new Player(this);

    public castVote = (vote: string, v5Count: number, v10Count: number,
        v25Count: number, v50Count: number, voteSuite: number): void => {
        this.voted = true;
        this.vote = vote.toString();
        this.v5Count = v5Count;
        this.v10Count = v10Count;
        this.v25Count = v25Count;
        this.v50Count = v50Count;
        this.voteSuit = voteSuite;
    }

    public resetVote = (): void => {
        this.voted = false;
        this.vote = null;
        this.v5Count = 0;
        this.v10Count = 0;
        this.v25Count = 0;
        this.v50Count = 0;
        this.voteSuit = -1;
    }

    public setSeat = (seatNumber: number) => this.seatNumber = seatNumber;

    public setActive = (active: boolean) => this.isActive = active;
}