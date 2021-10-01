import { Guid } from "../utilitites/common";
import { Player, IPlayer } from "../models/Player";
import WorkItem, { IWorkItem } from "./WorkItem";
import { isNothing } from "../utilitites/isNothing";

export interface IParty {
    key: string;
    name: string;
    members: IPlayer[];
    workItem: IWorkItem;
    voting: boolean;
    flipped: boolean;
}

export class Party implements IParty {
    public key: string = Guid();
    public name: string;
    public members: Player[] = [];
    public workItem: WorkItem = null;
    public voting: boolean = false;
    public flipped: boolean = false;

    constructor(json: IParty = null) {
        if (isNothing(json)) return;

        this.key = json.key ?? "";
        this.name = json.name ?? "";
        this.voting = json.voting ?? false;
        this.flipped = json.flipped ?? false;
        this.workItem = new WorkItem(json?.workItem);

        if (json.members instanceof Array) this.members = json.members.map(x => new Player(x));
    }

    public join = (player: Player): boolean => {
        if (this.members.some(x => x.key == player.key)) return false;

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

    public setItem = (item: WorkItem): boolean => {
        if (isNothing(item)) return false;
        this.workItem = item;
        return true;
    }
}