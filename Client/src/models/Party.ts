import { Guid } from "../utilitites/common";
import { Player, IPlayer } from "../models/Player";
import PokerItem, { IPokerItem } from "./PokerItem";
import { isNothing } from "../utilitites/isNothing";

let _password: string = null;
let _admin: Player = null;

export interface IParty {
    id: string;
    name: string;
    members: IPlayer[];
    pokerItem: IPokerItem;
    itemHistory: IPokerItem[];
    voting: boolean;
}

export class Party implements IParty {
    public id: string = Guid();
    public name: string;
    public members: Player[] = [];
    public pokerItem: PokerItem = null;
    public itemHistory: PokerItem[] = [];
    public voting: boolean = false;

    constructor(json: IParty = null) {
        if (isNothing(json)) return;

        this.id = json.id;
        this.name = json.name;
        this.voting = json.voting;
        
        this.pokerItem = !isNothing(json.pokerItem) ? new PokerItem(json.pokerItem) : null;

        if (json.members instanceof Array)
            this.members = json.members.map(x => new Player(x));

        if (json.itemHistory instanceof Array)
            this.itemHistory = json.itemHistory.map(x => new PokerItem(x));
    }

    public join = (player: Player): boolean => {
        if (this.members.some(x => x.id == player.id)) return false;

        for (let i = 0; i < 8; i++) {
            if (this.members[i].isActive == true) continue;
            player.partyName = this.name;
            player.isActive = true;
            player.seatNumber = i + 1;
            this.members[i] = player;
            return true;
        }

        return false;
    }

    public resetVoting = (voting: boolean): void => {
        this.voting = voting;
        this.members.forEach(player => player.resetVote());
    }

    public setVoting = (voting: boolean) => this.voting = voting;

    public setItem = (item: PokerItem): boolean => {
        if (isNothing(item)) return false;
        this.itemHistory.push(item);
        this.pokerItem = item;
        return true;
    }
}