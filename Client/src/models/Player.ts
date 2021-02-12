import { IPokerItem } from "./PokerItem";
import { isNullOrUndefined } from "util";

export enum CardSuit {
    Clubs,
    Diamonds,
    Hearts,
    Spades
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

export interface ILastVote {
    itemId: string;
    vote: string;
}

export interface IPlayer {
    id: string;
    username: string;
    active: boolean;
    vote: string;
    isAdmin: boolean;
    partyName: string;
    socketId?: string;
    voted: boolean;
    seatNumber: number;
    v5Count: number;
    v10Count: number;
    v25Count: number;
    v50Count: number;
    lastVote: ILastVote;
    voteSuit: CardSuit;
    [key: string]: any;
}

export default class Player implements IPlayer {
    public id: string;
    public username: string;
    public active: boolean;
    public vote: string;
    public isAdmin: boolean;
    public partyName: string;
    public socketId: string;
    public voted: boolean;
    public seatNumber: number;
    public v5Count: number;
    public v10Count: number;
    public v25Count: number;
    public v50Count: number;
    public lastVote: ILastVote;
    public voteSuit: CardSuit;
    [key: string]: any;

    constructor(json: IPlayer = null) {
        if (isNullOrUndefined(json)) return;
        
        this.id = json.id;
        this.username = json.username;
        this.active = json.active;
        this.vote = json.vote;
        this.voted = json.voted;
        this.isAdmin = json.isAdmin;
        this.partyName = json.partyName;
        this.socketId = json.socketId;
        this.seatNumber = json.seatNumber;
        this.v5Count = json.v5Count;
        this.v10Count = json.v10Count;
        this.v25Count = json.v25Count;
        this.v50Count = json.v50Count;
        this.voteSuit = json.voteSuit;
    }

    public clone = (): Player => {
        return new Player(this.toJson());
    }

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

    public setActive = (active: boolean) => this.active = active;
    
    public mirror = (player: IPlayer): void => {
        Object.keys(this).forEach((key: string) => {
            if (!isNullOrUndefined(player[key]) && typeof player[key] !== "function") this[key] = player[key];
        });
    }
}