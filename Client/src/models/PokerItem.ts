import { isNothing } from "../utilitites/isNothing";


export interface IPokerItem {
    id: string;
    title: string;
    body: string;
    partyName: string;
}

export interface IPokerItemSubset {
    title: string;
    body: string;
    partyName: string;
}

export default class PokerItem {
    public id: string;
    public title: string;
    public body: string;
    public partyName: string;

    constructor(json: IPokerItem = null) {
        if (isNothing(json) === true) return;
        
        this.id = json.id;
        this.title = json.title;
        this.body = json.body;
        this.partyName = json.partyName;
    }

    public static fromJson = (json: IPokerItem): PokerItem => {
        return new PokerItem({
            id: json.id,
            title: json.title,
            body: json.body,
            partyName: json.partyName
        });
    }
}