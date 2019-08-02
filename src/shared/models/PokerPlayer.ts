import { Guid, isNullOrUndefined } from "../common";
import { IPokerItem } from "./PokerItem";

type PokerItemId = string;
type PokerItemVote = string;

export interface IPokerPlayer {
    id?: string;
    username: string;
    vote: string;
    admin: boolean;
    partyName: string;
    connectionId?: string;
    voted: boolean;
    seatNumber: number;
    v5Count: number;
    v10Count: number;
    v25Count: number;
    v50Count: number;
    lastVote: [PokerItemId, PokerItemVote];
    [key: string]: any;
}

export default class PokerPlayer implements IPokerPlayer {
    id: string;
    username: string;
    vote: string;
    admin: boolean;
    partyName: string;
    connectionId: string;
    voted: boolean;
    seatNumber: number;
    v5Count: number;
    v10Count: number;
    v25Count: number;
    v50Count: number;
    lastVote: [PokerItemId, PokerItemVote];
    [key: string]: any;

    constructor(json: IPokerPlayer = null) {
        this.id = (json.id === undefined || json.id == null) ? Guid() : json.id;
        this.username = json.username;
        this.vote = json.vote;
        this.admin = json.admin;
        this.partyName = json.partyName;
        this.voted = json.voted;
        this.connectionId = json.connectionId;
        this.seatNumber = json.seatNumber;
        this.v5Count = json.v5Count;
        this.v10Count = json.v10Count;
        this.v25Count = json.v25Count;
        this.v50Count = json.v50Count;
    }

    public toJSON = (): IPokerPlayer => {
        return {
            id: this.id,
            username: this.username,
            vote: this.vote,
            admin: this.admin,
            partyName: this.partyName,
            voted: this.voted,
            seatNumber: this.seatNumber,
            v5Count: this.v5Count,
            v10Count: this.v10Count,
            v25Count: this.v25Count,
            v50Count: this.v50Count,
            lastVote: this.lastVote
        }
    }

    public static fromJSON = (json: IPokerPlayer): PokerPlayer => {
        return new PokerPlayer({
            id: json.id,
            username: json.username,
            vote: json.vote,
            admin: json.admin,
            partyName: json.partyName,
            voted: json.voted,
            seatNumber: json.seatNumber,
            v5Count: json.v5Count,
            v10Count: json.v10Count,
            v25Count: json.v25Count,
            v50Count: json.v50Count,
            lastVote: json.lastVote
        })
    }

    public clone = (): PokerPlayer => {
        return new PokerPlayer(this.toJSON());
    }

    public generateVote = (vote: string, item: IPokerItem): void => {
        this.voted = true;
        this.vote = vote.toString();
        this.lastVote = [item.id, vote];
        this.v5Count = Math.ceil(Math.random() * 9);
        this.v10Count = Math.ceil(Math.random() * 9);
        this.v25Count = Math.ceil(Math.random() * 7);
        this.v50Count = Math.ceil(Math.random() * 3);
    }

    public resetVote = (): void => {
        this.voted = false;
        this.vote = null;
    } 

    public mirror = (player: IPokerPlayer): void => {
        Object.keys(this).forEach((key: string) => {
            if (!isNullOrUndefined(player[key]) && typeof player[key] !== "function") this[key] = player[key];
        });
    }

    public deepMirror = (player: IPokerPlayer): void => {
        Object.keys(this).forEach((key: string) => {
            if (typeof player[key] !== "function") this[key] = player[key];
        });
    }

    public setSeatNumber = (seatNumber: number) => {
        this.seatNumber = seatNumber;
    }

    public static createEmpty = (): PokerPlayer => {
        return new PokerPlayer({
            id: null,
            username: null,
            vote: null,
            admin: null,
            partyName: null,
            voted: null,
            seatNumber: null,
            v5Count: null,
            v10Count: null,
            v25Count: null,
            v50Count: null,
            lastVote: [null, null]
        })
    }
}