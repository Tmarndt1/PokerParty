import {Guid, isNullOrUndefined} from "../../shared/common";
import PokerPlayer, { IPokerPlayer } from "../../shared/models/PokerPlayer";
import PokerItem, { IPokerItem } from "./PokerItem";

export interface IParty {
    id: string;
    name: string;
    password: string;
    admin: PokerPlayer;
    members: Array<PokerPlayer>;
    pokerItem: PokerItem;
    itemHistory?: Array<PokerItem>;
}

export interface IPartyJSON {
    id: string;
    name: string;
    members: Array<IPokerPlayer>;
    memberCount: number;
    pokerItem: IPokerItem;
}

export default class Party implements IParty {
    id: string;
    name: string;
    password: string;
    admin: PokerPlayer;
    members: Array<PokerPlayer>;
    pokerItem: PokerItem;
    itemHistory: Array<PokerItem>;

    constructor(admin: PokerPlayer, password: string) {
        this.id = Guid();
        this.name = admin.partyName;
        this.password = password;
        this.members = [];
        this.members.push(admin);
        this.admin = admin;
        this.pokerItem = null;
        this.itemHistory = [];
    }

    public join = (PokerPlayer: PokerPlayer): boolean => {
        for (let i = 0; i < this.members.length; i++) {
            if (this.members[i].id === PokerPlayer.id) return false;
        }

        this.members.push(PokerPlayer);

        return true;
    }

    public toJSON = (): IPartyJSON => {
        return {
            id: this.id,
            name: this.name,
            members: this.members.map((member: PokerPlayer) => {return member.toJSON()}),
            memberCount: this.members.length,
            pokerItem: isNullOrUndefined(this.pokerItem) ? null : this.pokerItem.toJSON()
        }
    }

    public setItem = (item: PokerItem): boolean => {
        if (isNullOrUndefined(item)) return false;
        this.itemHistory.push(item);
        this.pokerItem = item;
        return true;
    }
}